#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import joblib
import numpy as np
from sklearn.neighbors import KDTree

# ─── 1) Load emotion distribution from a “_emotion.txt” file ────────────────
def load_emotion_dist(path):
    dist = {}
    with open(path, encoding="utf-8") as f:
        for line in f:
            if ":" in line:
                lbl, pct = line.split(":", 1)
                key = lbl.strip().lower()
                try:
                    value = float(pct.strip().rstrip("%")) / 100.0
                except:
                    continue
                dist[key] = value
    return dist

# ─── 2) Mapping discrete labels → (Valence, Arousal) ───────────────────────
EMOTION_VA = {
    "excitement": [ 0.610,  0.40 ],
    "melancholy": [-0.555, -0.452],
    "romance":    [ 0.503,  0.227],
    "sadness":    [-0.748, -0.602],
    "fear":       [-0.820,  0.35 ],
    "tension":    [-0.558,  0.35 ],
    "surprise":   [ 0.210,  0.40 ],
    "neutral":    [ 0.000,  0.00 ],
    "loneliness": [-0.622, -0.553],
    "joy":        [ 0.835,  0.35 ],
    "anger":      [-0.671,  0.40 ],
    "disgust":    [-0.495,  0.40 ],
}

# ─── 3) Compute the weighted [V,A] from the top-3 emotions ──────────────────
def compute_target_va_top3(dist):
    # pick top-3 by raw weight
    items = sorted(dist.items(), key=lambda x: x[1], reverse=True)[:3]
    emotions, weights = zip(*items) if items else ([], [])
    total = sum(weights) or 1.0
    normed = [w / total for w in weights]

    v_sum = a_sum = 0.0
    for emo, w in zip(emotions, normed):
        if emo in EMOTION_VA:
            v, a = EMOTION_VA[emo]
            v_sum += w * v
            a_sum += w * a

    # clamp into [-1,1]
    return [
        max(-1.0, min(1.0, v_sum)),
        max(-1.0, min(1.0, a_sum))
    ]

# ─── 4) Lazy-load your KDTree index + path list ─────────────────────────────
_TREE  = None
_PATHS = None
def _load_index():
    global _TREE, _PATHS
    if _TREE is None or _PATHS is None:
        # this script lives in backend/scripts/, index is under backend/music/Index
        script_dir = os.path.dirname(__file__)
        idx_dir    = os.path.join(script_dir, "music", "Index")

        _TREE  = joblib.load(os.path.join(idx_dir, "va_tree.joblib"))
        _PATHS = joblib.load(os.path.join(idx_dir, "wav_paths.joblib"))

# ─── 5) Query for nearest tracks ─────────────────────────────────────────────
def find_nearest_tracks(target_va, k=50, top_n=10):
    _load_index()
    dists, idxs = _TREE.query([target_va], k=k)
    cand = []
    for dist_val, idx in zip(dists[0], idxs[0]):
        # convert the memoryviewslice into a Python list of floats
        va_slice = _TREE.data[idx]
        va_pt = [float(v) for v in va_slice]
        fn    = _PATHS[idx]
        cand.append((dist_val, fn, va_pt))
    cand.sort(key=lambda x: x[0])
    return cand[:top_n]

# ─── 6) Main: read arg, compute, print JSON ─────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: python book2Music.py <path/to/chapter_emotion.txt>\n")
        sys.exit(1)

    emo_file = sys.argv[1]
    if not os.path.exists(emo_file):
        sys.stderr.write(f"Error: '{emo_file}' not found\n")
        sys.exit(1)

    # 1) load discrete distribution
    dist = load_emotion_dist(emo_file)
    # 2) compute target VA
    target_va = compute_target_va_top3(dist)
    # 3) query KDTree
    recs = find_nearest_tracks(target_va, k=50, top_n=10)

    # 4) emit JSON (cast numpy types to native Python)
    out = []
    for distance, file_name, va in recs:
        out.append({
            "distance": float(distance),
            "va": va,
            "file": file_name
        })
    sys.stdout.write(json.dumps(out, ensure_ascii=False))
    sys.exit(0)
