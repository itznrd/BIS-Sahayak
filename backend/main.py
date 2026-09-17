"""
main.py
FastAPI wrapper around the RAG pipeline.

This is chat.py's core logic (retrieve -> generate) with an HTTP layer on top
instead of a terminal loop. Run it with:

    uv run uvicorn main:app --reload --port 8000

Interactive API docs: http://localhost:8000/docs

Memory footprint is deliberately small (~160 MB): no ML model is loaded here.
Document embeddings are precomputed offline by ingest.py; the query is
embedded through a hosted API at request time.
"""

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import GROQ_API_KEY, DEFAULT_K, RETRIEVER
from retrieve import get_retriever
from generate import generate_answer

app = FastAPI(title="BIS Assistant API", version="0.2.0")

# Comma-separated list, e.g. "http://localhost:3000,https://your-app.vercel.app"
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the index once at startup, not per request.
retriever = None
startup_error = None
try:
    retriever = get_retriever()
except Exception as e:
    startup_error = str(e)


class AskRequest(BaseModel):
    query: str
    k: int = DEFAULT_K


class Source(BaseModel):
    source: str
    chunk_id: int
    score: float


class AskResponse(BaseModel):
    answer: str
    sources: list[Source]
    llm_enabled: bool
    retriever_mode: str


@app.get("/health")
def health():
    return {
        "status": "ok" if retriever is not None else "degraded",
        "index_loaded": retriever is not None,
        "retriever_mode": retriever.mode if retriever else RETRIEVER,
        "llm_enabled": bool(GROQ_API_KEY),
        "error": startup_error,
    }


@app.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    if retriever is None:
        raise HTTPException(status_code=503, detail=startup_error or "Index not loaded.")

    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        chunks = retriever.retrieve(req.query, k=req.k)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Retrieval failed: {e}")

    answer = generate_answer(req.query, chunks)

    return AskResponse(
        answer=answer,
        sources=[Source(**c) for c in chunks],
        llm_enabled=bool(GROQ_API_KEY),
        retriever_mode=retriever.mode,
    )
