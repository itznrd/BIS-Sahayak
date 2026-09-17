"""
retrieve.py
Loads a prebuilt index and returns the chunks most relevant to a query.

Two interchangeable backends behind the SAME interface:

  VectorRetriever -- loads the precomputed .npz, embeds the query via a
    hosted API, scores with a single matrix multiply. No ML model in memory.
    Because vectors are L2-normalized at ingest time, cosine similarity is
    just a dot product.

  TfidfRetriever -- offline keyword matching. No network, no API key. Lower
    retrieval quality (it matches wording, not meaning) but it always works,
    which makes it useful demo-day insurance.

Both expose .retrieve(query, k) -> list of dicts, so nothing downstream
(generate.py, main.py, chat.py) needs to know which one is active.
"""

import json
import pickle

import numpy as np

from config import (
    RETRIEVER,
    DEFAULT_K,
    MIN_SCORE_TFIDF,
    MIN_SCORE_VECTOR,
    EMBED_PROVIDER,
    EMBED_MODEL,
    VECTOR_INDEX_PATH,
    CHUNKS_PATH,
    TFIDF_VECTORIZER_PATH,
    TFIDF_VECTORS_PATH,
)


def _load_chunks():
    if not CHUNKS_PATH.exists():
        raise FileNotFoundError(
            "Index not found. Run `uv run python ingest.py` first."
        )
    with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


class VectorRetriever:
    mode = "vector"

    def __init__(self):
        if not VECTOR_INDEX_PATH.exists():
            raise FileNotFoundError(
                "Vector index not found. Run `RETRIEVER=vector uv run python ingest.py` first."
            )

        data = _load_chunks()
        self.chunks = data["chunks"]
        self.metadata = data["metadata"]

        indexed_provider = data.get("embed_provider")
        indexed_model = data.get("embed_model")
        if indexed_model and indexed_model != EMBED_MODEL:
            raise RuntimeError(
                f"Index was built with '{indexed_provider}/{indexed_model}' but the app "
                f"is configured for '{EMBED_PROVIDER}/{EMBED_MODEL}'. Vectors from "
                "different models are not comparable -- re-run ingest.py."
            )

        self.vectors = np.load(VECTOR_INDEX_PATH)["vectors"]
        if self.vectors.shape[0] != len(self.chunks):
            raise RuntimeError(
                f"Index has {self.vectors.shape[0]} vectors but {len(self.chunks)} "
                "chunks. Re-run ingest.py."
            )

    def retrieve(self, query: str, k: int = DEFAULT_K, min_score: float = MIN_SCORE_VECTOR):
        from embeddings import embed_query

        query_vector = embed_query(query)
        scores = self.vectors @ query_vector

        top = np.argsort(scores)[::-1][:k]
        results = []
        for idx in top:
            score = float(scores[idx])
            if score < min_score:
                continue
            results.append({
                "text": self.chunks[idx],
                "source": self.metadata[idx]["source"],
                "chunk_id": self.metadata[idx]["chunk_id"],
                "score": round(score, 3),
            })
        return results


class TfidfRetriever:
    mode = "tfidf"

    def __init__(self):
        missing = [
            p for p in (TFIDF_VECTORIZER_PATH, TFIDF_VECTORS_PATH, CHUNKS_PATH)
            if not p.exists()
        ]
        if missing:
            raise FileNotFoundError(
                "TF-IDF index not found. Run `RETRIEVER=tfidf uv run python ingest.py` first."
            )

        data = _load_chunks()
        self.chunks = data["chunks"]
        self.metadata = data["metadata"]

        with open(TFIDF_VECTORIZER_PATH, "rb") as f:
            self.vectorizer = pickle.load(f)
        with open(TFIDF_VECTORS_PATH, "rb") as f:
            self.chunk_vectors = pickle.load(f)

    def retrieve(self, query: str, k: int = DEFAULT_K, min_score: float = MIN_SCORE_TFIDF):
        from sklearn.metrics.pairwise import cosine_similarity

        query_vector = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vector, self.chunk_vectors).flatten()

        top = scores.argsort()[::-1][:k]
        results = []
        for idx in top:
            score = float(scores[idx])
            if score < min_score:
                continue
            results.append({
                "text": self.chunks[idx],
                "source": self.metadata[idx]["source"],
                "chunk_id": self.metadata[idx]["chunk_id"],
                "score": round(score, 3),
            })
        return results


def get_retriever(mode: str = None):
    """Factory. Returns the retriever matching RETRIEVER (or an override)."""
    mode = (mode or RETRIEVER).lower()
    if mode == "vector":
        return VectorRetriever()
    return TfidfRetriever()


# Backwards-compatible alias so older scripts importing `Retriever` still work.
Retriever = get_retriever


if __name__ == "__main__":
    r = get_retriever()
    print(f"Retriever mode: {r.mode}\n")
    for q in [
        "how do I check if my LED bulb is ISI certified",
        "helmet certification process",
    ]:
        print(f"Q: {q}")
        for res in r.retrieve(q):
            print(f"  [{res['score']}] {res['source']} #{res['chunk_id']}")
        print()
