import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

SUMMARY_MODEL = "facebook/bart-large-cnn"
EMBED_MODEL = "all-MiniLM-L6-v2"
CHAPTERS_JSON = "chapters_content.json"
CHUNK_SIZE = 500
TOP_K = 5
MMR_THRESHOLD = 0.7  # Benzerlik eşiği

# 1. Metni kelime bazlı chunk'lara böl
def chunk_text(text, max_words=CHUNK_SIZE):
    words = text.split()
    return [" ".join(words[i:i + max_words]) for i in range(0, len(words), max_words)]

# 2. FAISS index oluştur (embedding ile arama için)
def build_faiss_index(chunks, embed_model):
    embeddings = embed_model.encode(chunks)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))
    return index, embeddings

# 3. Cross-Encoder ile Reranking
def rerank_chunks(query, chunks, embed_model):
    query_embedding = embed_model.encode([query])
    embeddings = embed_model.encode(chunks)
    similarities = np.dot(embeddings, query_embedding.T).flatten()
    ranked_indices = similarities.argsort()[::-1]
    return ranked_indices

# 4. MMR ile Parça Seçimini Geliştirme
def select_diverse_chunks(ranked_indices, chunks, embed_model, top_k=TOP_K):
    selected_chunks = []
    selected_set = set()
    
    for idx in ranked_indices[:top_k]:
        if len(selected_chunks) == 0:
            selected_chunks.append(chunks[idx])
            selected_set.add(idx)
        else:
            for selected_idx in selected_set:
                # Burada embed_model'i doğru şekilde kullanıyoruz
                similarity = np.dot(embed_model.encode([chunks[selected_idx]]), embed_model.encode([chunks[idx]]).T)
                if similarity < MMR_THRESHOLD:
                    selected_chunks.append(chunks[idx])
                    selected_set.add(idx)
                    break
    return selected_chunks


# 5. Özetleme
def summarize_text(text, model_name):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True)
    outputs = model.generate(
        **inputs,
        max_length=400,
        min_length=200,
        do_sample=False
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# 6. RAG-Tabanlı Özetleme Süreci
def rag_summarize(chapter_text):
    print("📄 Metin parçalara ayrılıyor...")
    chunks = chunk_text(chapter_text)
    print(f"🔹 {len(chunks)} adet chunk üretildi.")

    embed_model = SentenceTransformer(EMBED_MODEL)  # embed_model'i burada tanımla
    index, _ = build_faiss_index(chunks, embed_model)

    print("🔍 En anlamlı chunk'lar seçiliyor (Top-K)...")
    ranked_indices = rerank_chunks("chapter summary", chunks, embed_model)
    selected_chunks = select_diverse_chunks(ranked_indices, chunks, embed_model)  # embed_model'i buraya geçiriyoruz

    print("✍️ Özet hazırlanıyor...")
    combined = " ".join(selected_chunks)
    summary = summarize_text(combined, SUMMARY_MODEL)
    return summary


# 7. Ana işlem
def main():
    with open(CHAPTERS_JSON, "r", encoding="utf-8") as f:
        chapters = json.load(f)

    print("🧠 Mevcut chapter'lar:", ", ".join(chapters.keys()))

    # Kullanıcıdan chapter veya sayfa aralığı bilgisi al
    chapter_or_range = input("Hangi chapter veya sayfa aralığını özetlemek istiyorsun? (örn. Page 1-5, Chapter I veya Page 1, Page 3, Page 5): ").strip()

    # Kullanıcının çoklu sayfaları seçip seçmediğini kontrol et
    if "," in chapter_or_range:
        # Birden fazla sayfa seçildiyse, her sayfayı işleyelim
        selected_pages = chapter_or_range.split(",")
        text = ""
        for page in selected_pages:
            page = page.strip()  # Sayfa başındaki ve sonundaki boşlukları temizle
            if page in chapters:
                text += chapters[page] + " "
            else:
                print(f"❌ '{page}' geçersiz bir sayfa!")
                return
    elif "-" in chapter_or_range:
        # Sayfa aralığı (örneğin "Page 1-5") girildiyse
        start_page, end_page = map(int, chapter_or_range.split("-"))
        text = ""
        for page_num in range(start_page, end_page + 1):
            page_key = f"Page {page_num}"
            if page_key in chapters:
                text += chapters[page_key] + " "
            else:
                print(f"❌ '{page_key}' geçersiz bir sayfa!")
                return
    else:
        # Eğer bir chapter adı girdiyse, direkt olarak chapter'ı al
        if chapter_or_range not in chapters:
            print(f"❌ '{chapter_or_range}' geçersiz bir chapter!")
            return
        text = chapters[chapter_or_range]

    # RAG özetleme işlemi
    summary = rag_summarize(text)

    print("\n📌 Final RAG Özet:\n")
    print(summary)

if __name__ == "__main__":
    main()
