#!/usr/bin/env python3
"""
split_pdf_chapters.py

– Reads entire PDF into lines
– Finds ALL headings via regex (CHAPTER, PART, SECTION, LETTER or standalone Roman)
– Keeps only the *last* instance of each title to drop any TOC-echoes
– Skips any chapter under ~200 characters
– Writes:
     chapters/00_Table_of_Contents.txt  (with modified display titles)
     chapters/01_CHAPTER_I_Down_the_Rabbit_Hole.txt
     …

Modifications:
- In 00_Table_of_Contents.txt, for any "CHAPTER X" title, we:
    • Limit the subtitle portion to at most 10 words; if more, append "..."
    • Maintain a single PART counter that only increments when encountering "CHAPTER I" (or "CHAPTER 1"). 
      All chapters (I, II, III, etc.) following that "CHAPTER I" use the same PART number, until the next "CHAPTER I" appears.
- After all chapter files are written, if the final chapter’s text contains the marker 
  "*** END OF THE PROJECT GUTENBERG EBOOK" (exact match), truncate everything from that marker onward.
- Other headings (e.g., EPILOGUE) remain unchanged in TOC except for their numbering.
"""
import os
import re
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Please install PyMuPDF: pip install pymupdf")

HEADING_PATTERNS = [
    r"^(?:Chapter|CHAPTER)\s+(?:[IVXLCDM]+|\d+)\.?$",
    r"^(?:Part|PART)\s+(?:[IVXLCDM]+|\d+)\.?$",
    r"^(?:Section|SECTION)\s+\d+\.?$",
    r"^(?:Letter|LETTER)\s+(?:[IVXLCDM]+|\d+)\.?$",
    r"^[IVXLCDM]+\.?$",
    r"^(?:Epilogue|EPILOGUE)(?:\s*:\s*.*)?$"
]
heading_re = re.compile("|".join(HEADING_PATTERNS), flags=re.MULTILINE)
chapter_extract_re = re.compile(r"(?i)\bCHAPTER\s+([IVXLCDM]+|\d+)\b")

def sanitize(name: str) -> str:
    clean = re.sub(r"[^\w\-\ ]+", "", name)
    return clean.strip().replace(" ", "_")[:60]

def split_pdf_into_chapters(pdf_path, out_dir="chapters"):
    doc = fitz.open(pdf_path)
    pages = [p.get_text("text") for p in doc]
    lines = "\n".join(pages).splitlines()

    raw = []
    for i, line in enumerate(lines):
        if heading_re.match(line.strip()):
            title = line.strip()
            for j in range(i + 1, min(i + 5, len(lines))):
                sub = lines[j].strip()
                if sub:
                    title = f"{title} {sub}"
                    break
            raw.append((i, title))

    if not raw:
        raw = [(0, "Full_Book")]

    seen = set()
    unique = []
    for idx, title in reversed(raw):
        if title not in seen:
            seen.add(title)
            unique.append((idx, title))
    unique.reverse()

    segments = []
    for n, (start, title) in enumerate(unique):
        end = unique[n + 1][0] if n + 1 < len(unique) else len(lines)
        text = "\n".join(lines[start:end]).strip()
        if len(text) < 500:
            continue
        segments.append((title, start, end, text))

    os.makedirs(out_dir, exist_ok=True)
    toc_path = os.path.join(out_dir, "00_Table_of_Contents.txt")
    part_counter = 0

    with open(toc_path, "w", encoding="utf-8") as toc:
        toc.write("Table of Contents\n\n")
        for i, (title, *_rest) in enumerate(segments, 1):
            m = chapter_extract_re.search(title)
            if m:
                chap_num = m.group(1).upper()
                if chap_num in {"I", "1"}:
                    part_counter += 1
                subtitle_full = title[m.end():].strip()
                if subtitle_full:
                    words = subtitle_full.split()
                    if len(words) > 10:
                        words = words[:10] + ["..."]
                    subtitle_preview = " ".join(words)
                    display_title = f"PART {part_counter} CHAPTER {chap_num} {subtitle_preview}"
                else:
                    display_title = f"PART {part_counter} CHAPTER {chap_num}"
            else:
                display_title = title
            toc.write(f"{i:02d}. {display_title}\n")

    print("TOC written to:", toc_path)

    written_files = []

    for i, (title, _s, _e, body) in enumerate(segments, 1):
        fn = f"{i:02d}_{sanitize(title)}.txt"
        outp = os.path.join(out_dir, fn)
        with open(outp, "w", encoding="utf-8") as f:
            f.write(body)
        written_files.append(fn)
        print(f"Wrote {outp} ({len(body)} chars)")

    if segments:
        last_index = len(segments)
        last_title = segments[-1][0]
        last_fn = f"{last_index:02d}_{sanitize(last_title)}.txt"
        last_path = os.path.join(out_dir, last_fn)
        try:
            with open(last_path, "r", encoding="utf-8") as f:
                content = f.read()
            marker = "*** END OF THE PROJECT GUTENBERG EBOOK"
            idx = content.find(marker)
            if idx != -1:
                new_content = content[:idx].rstrip()
                with open(last_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Truncated last chapter at Gutenberg marker: {last_path}")
        except FileNotFoundError:
            pass

    if not segments or len(written_files) == 0:
        full_text = "\n".join(lines).strip()
        if len(full_text) > 0:
            fallback_path = os.path.join(out_dir, "01_Full_Book.txt")
            with open(fallback_path, "w", encoding="utf-8") as f:
                f.write(full_text)
            print(f"Fallback written to: {fallback_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python split_pdf_chapters.py path/to/book.pdf path/to/output_dir")
        sys.exit(1)
    split_pdf_into_chapters(sys.argv[1], sys.argv[2])
