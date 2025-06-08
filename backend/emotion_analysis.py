import os
import re
import sys
import json
import torch
from transformers import pipeline, AutoTokenizer

# ─── CUDA BENCHMARK VE BELLEK AYARLARI ─────────────────────────────────────────────
torch.backends.cudnn.benchmark = True
torch.backends.cudnn.deterministic = False

# ─── AYARLAR ────────────────────────────────────────────────────────────────────────
#burdaki tokeni aktive edip calistirin

BASE_MODEL_NAME = "j-hartmann/emotion-english-roberta-large"
ZERO_MODEL_NAME = "MoritzLaurer/deberta-v3-large-zeroshot-v1.1-all-33"
BATCH_SIZE = 8

BASE_EMOTIONS = ["neutral", "anger", "disgust", "fear", "joy", "sadness", "surprise"]
EXTRA_EMOTIONS_DESC = [
    "tension: an impending sense of dread or literary suspense",
    "romance: a subtle, heartfelt feeling of love or gentle longing between characters",
    "excitement: an uplifting thrill or burst of energetic enthusiasm often preceding a turning point",
    "melancholy: a pensive sadness that quietly pervades, evoking reflection rather than despair",
    "loneliness: a profound sense of isolation or emotional abandonment, even if others are nearby"
]
EXTRA_EMOTIONS = [lbl_full.split(":")[0] for lbl_full in EXTRA_EMOTIONS_DESC]
ALL_EMOTIONS = BASE_EMOTIONS + EXTRA_EMOTIONS

# ─── “CHUNK” HELPER FONKSİYONLARI ──────────────────────────────────────────────────

def split_with_context(text, window_size=4, overlap=2):
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks = []
    for start in range(0, len(sentences), window_size - overlap):
        end = min(start + window_size, len(sentences))
        chunk = " ".join(sentences[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(sentences):
            break
    return chunks

def contextualize_chunks(chunks):
    contexts = []
    for i, chunk in enumerate(chunks):
        parts = []
        if i > 0:
            parts.append(chunks[i-1])
        parts.append(chunk)
        if i < len(chunks)-1:
            parts.append(chunks[i+1])
        contexts.append(" ".join(parts))
    return contexts

# ─── EMOTION PIPELINE KURULUMU ──────────────────────────────────────────────────

def setup_pipelines():
    """
    GPU varsa device=0, yoksa device=-1 (CPU) kullanacak şekilde pipeline kurar.
    model ve analiz mantığı aynen korunmuştur.
    """
    device_id = 0 if torch.cuda.is_available() else -1

    base_tokenizer = AutoTokenizer.from_pretrained(
        BASE_MODEL_NAME,
        use_fast=True,
        token=HF_TOKEN
    )
    base_clf = pipeline(
        "text-classification",
        model=BASE_MODEL_NAME,
        tokenizer=base_tokenizer,
        return_all_scores=True,
        top_k=None,
        device=device_id,           # GPU yoksa -1 ile CPU’ya düşer
        torch_dtype="float16" if device_id >= 0 else None,
        batch_size=BATCH_SIZE
    )
    # Warm-up
    _ = base_clf("Warm-up", truncation=True, max_length=1)

    zero_tokenizer = AutoTokenizer.from_pretrained(
        ZERO_MODEL_NAME,
        use_fast=True,
        token=HF_TOKEN
    )
    zero_clf = pipeline(
        "zero-shot-classification",
        model=ZERO_MODEL_NAME,
        tokenizer=zero_tokenizer,
        multi_label=True,
        device=device_id,           # GPU yoksa -1 → CPU
        torch_dtype="float16" if device_id >= 0 else None,
        batch_size=BATCH_SIZE
    )
    # Warm-up
    _ = zero_clf("Warm-up", candidate_labels=EXTRA_EMOTIONS_DESC, multi_label=True, truncation=True, max_length=1)

    return base_clf, zero_clf

# ─── EMOTION ANALİZ FONKSİYONU ──────────────────────────────────────────────────

def analyze_text(text, base_clf, zero_clf):
    raw_chunks = split_with_context(text, window_size=4, overlap=2)
    chunks = contextualize_chunks(raw_chunks)

    MIN_BASE_SCORE = 0.02
    MIN_ZS_SCORE   = 0.03

    weighted_accum = {lbl: 0.0 for lbl in ALL_EMOTIONS}
    total_weight = 0.0

    for chunk in chunks:
        # 1) Base model
        base_out = base_clf(chunk, truncation=True, max_length=256)[0]
        base_scores = {}
        sum_base_scores = 0.0
        for item in base_out:
            lbl = item["label"].lower()
            s = item["score"]
            if s < MIN_BASE_SCORE:
                s = 0.0
            base_scores[lbl] = s
            sum_base_scores += s

        # 2) Zero-shot model
        zs_out = zero_clf(
            chunk,
            candidate_labels=EXTRA_EMOTIONS_DESC,
            multi_label=True,
            truncation=True,
            max_length=256
        )
        extra_scores = {}
        sum_extra_scores = 0.0
        for lbl_full, score in zip(zs_out["labels"], zs_out["scores"]):
            key = lbl_full.split(":")[0].lower()
            if score < MIN_ZS_SCORE:
                score = 0.0
            extra_scores[key] = score
            sum_extra_scores += score

        # 3) Chunk ağırlığı
        chunk_len = len(chunk)
        chunk_score_sum = sum_base_scores + sum_extra_scores
        if chunk_score_sum <= 0.0:
            continue
        chunk_weight = chunk_len * chunk_score_sum

        # 4) Birikim
        for lbl in BASE_EMOTIONS:
            weighted_accum[lbl] += chunk_weight * base_scores.get(lbl, 0.0)
        for lbl in EXTRA_EMOTIONS:
            weighted_accum[lbl] += chunk_weight * extra_scores.get(lbl, 0.0)

        total_weight += chunk_weight

    # 5) Fallback nötr
    if total_weight <= 0:
        return {lbl: (1.0 if lbl == "neutral" else 0.0) for lbl in ALL_EMOTIONS}

    # 6) Normalize
    raw_dist = {lbl: (weighted_accum[lbl] / total_weight) for lbl in ALL_EMOTIONS}
    sum_raw = sum(raw_dist.values())
    if sum_raw > 0:
        final_dist = {lbl: raw_dist[lbl] / sum_raw for lbl in ALL_EMOTIONS}
    else:
        final_dist = {lbl: (1.0 if lbl == "neutral" else 0.0) for lbl in ALL_EMOTIONS}

    sorted_dist = dict(sorted(final_dist.items(), key=lambda x: x[1], reverse=True))
    return sorted_dist

# ─── TÜM BÖLÜMLER İÇİN ANALİZİ ÇALIŞTIRAN FUNKSİYON ──────────────────────────────

def run_emotion_analysis_for_book(book_id):
    base_dir = os.path.join(os.path.dirname(__file__), "chapters", book_id)
    if not os.path.isdir(base_dir):
        print(f"[!] Book ID folder not found: {base_dir}")
        return

    analysis_dir = os.path.join(base_dir, "ANALYSIS")
    os.makedirs(analysis_dir, exist_ok=True)

    print("Loading emotion pipelines… (yaklaşık 30s sürebilir)")
    base_clf, zero_clf = setup_pipelines()
    print("Pipelines loaded. Analiz başlıyor…\n")

    all_files = sorted(f for f in os.listdir(base_dir) if f.lower().endswith(".txt"))
    chapters = [f for f in all_files if not f.startswith("00_")]

    for fn in chapters:
        chapter_path = os.path.join(base_dir, fn)
        base_name    = fn.rsplit(".", 1)[0]
        out_name     = f"{base_name}_emotion.txt"
        out_path     = os.path.join(analysis_dir, out_name)

        if os.path.isfile(out_path):
            print(f"✔ Skipping (zaten var): {fn}")
            continue
        print(f"→ Analyzing: {fn} …")

        try:
            with open(chapter_path, "r", encoding="utf-8") as f:
                chapter_text = f.read()
        except Exception as e:
            print(f"  [!] {chapter_path} okunamadı: {e}")
            continue

        try:
            dist = analyze_text(chapter_text, base_clf, zero_clf)
        except Exception as e:
            print(f"  [!] {fn} analizde hata: {e}")
            continue

        try:
            with open(out_path, "w", encoding="utf-8") as outf:
                outf.write(f"Emotion distribution for '{fn}'\n\n")
                for lbl, score in dist.items():
                    outf.write(f"{lbl.capitalize():<12}: {score*100:>5.1f}%\n")
            print(f"  ✔ Yazıldı: {out_path}\n")
        except Exception as e:
            print(f"  [!] {out_path} yazılamadı: {e}")

    print("──── Tüm bölümler analiz edildi. ────\n")

# ─── MAIN GİRİŞ NOKTASI ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python emotion_analysis.py <book_id>")
        print("  Örnek: python emotion_analysis.py 683c78d270ef89e11343a78e")
        sys.exit(1)

    run_emotion_analysis_for_book(sys.argv[1])
