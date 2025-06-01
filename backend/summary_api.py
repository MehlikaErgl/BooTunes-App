from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from rag_summary import rag_summarize  # senin özet fonksiyonun

app = FastAPI()

# CORS ayarı: frontend'ten gelen isteklere izin verir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # üretimde değiştirilebilir
    allow_methods=["*"],
    allow_headers=["*"],
)

# POST /summary: text verisi alır, özet üretir
@app.post("/summary")
async def summarize(req: Request):
    data = await req.json()
    text = data.get("text", "")
    if not text:
        return { "error": "Boş metin gönderildi." }

    try:
        summary = rag_summarize(text)
        return { "summary": summary }
    except Exception as e:
        return { "error": str(e) }

# Terminalden çalıştırmak için:
if __name__ == "__main__":
    uvicorn.run("summary_api:app", host="0.0.0.0", port=8000, reload=True)
