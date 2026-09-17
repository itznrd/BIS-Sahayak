"""
embeddings.py
Thin adapter over hosted embedding APIs.

Why hosted instead of sentence-transformers running locally: PyTorch needs
400 MB - 1 GB of RAM and ~2 GB of disk. Free-tier hosts give you 0.5 GB RAM
and 0.5-1 GB disk, so a local model simply will not fit. Calling an API keeps
the server at roughly 160 MB total.

Documents are embedded once, offline, by ingest.py. At request time only the
user's single short query is embedded, so this is one small call per request.

Several providers expose a free tier. Set EMBED_PROVIDER and EMBED_API_KEY in
.env. Whichever you pick, the SAME provider and model must be used for both
ingestion and querying.
"""

import numpy as np
import httpx

from config import (
    EMBED_PROVIDER,
    EMBED_API_KEY,
    EMBED_MODEL,
    EMBED_BASE_URL,
)

TIMEOUT = httpx.Timeout(30.0)


class EmbeddingError(RuntimeError):
    pass


def _require_key():
    if not EMBED_API_KEY:
        raise EmbeddingError(
            "EMBED_API_KEY is not set. Add it to backend/.env, or run with "
            "RETRIEVER=tfidf to use the offline keyword fallback."
        )


def _post(url: str, headers: dict, payload: dict) -> dict:
    with httpx.Client(timeout=TIMEOUT) as client:
        resp = client.post(url, headers=headers, json=payload)
    if resp.status_code >= 400:
        raise EmbeddingError(
            f"{EMBED_PROVIDER} embedding API returned {resp.status_code}: {resp.text[:300]}"
        )
    return resp.json()


def _embed_jina(texts, is_query):
    data = _post(
        "https://api.jina.ai/v1/embeddings",
        {"Authorization": f"Bearer {EMBED_API_KEY}", "Content-Type": "application/json"},
        {
            "model": EMBED_MODEL,
            "task": "retrieval.query" if is_query else "retrieval.passage",
            "input": texts,
        },
    )
    return [item["embedding"] for item in data["data"]]


def _embed_voyage(texts, is_query):
    data = _post(
        "https://api.voyageai.com/v1/embeddings",
        {"Authorization": f"Bearer {EMBED_API_KEY}", "Content-Type": "application/json"},
        {
            "model": EMBED_MODEL,
            "input": texts,
            "input_type": "query" if is_query else "document",
        },
    )
    return [item["embedding"] for item in data["data"]]


def _embed_cohere(texts, is_query):
    data = _post(
        "https://api.cohere.com/v2/embed",
        {"Authorization": f"Bearer {EMBED_API_KEY}", "Content-Type": "application/json"},
        {
            "model": EMBED_MODEL,
            "texts": texts,
            "input_type": "search_query" if is_query else "search_document",
            "embedding_types": ["float"],
        },
    )
    return data["embeddings"]["float"]


def _embed_openai_compatible(texts, is_query):
    data = _post(
        f"{EMBED_BASE_URL.rstrip('/')}/embeddings",
        {"Authorization": f"Bearer {EMBED_API_KEY}", "Content-Type": "application/json"},
        {"model": EMBED_MODEL, "input": texts},
    )
    return [item["embedding"] for item in data["data"]]


_PROVIDERS = {
    "jina": _embed_jina,
    "voyage": _embed_voyage,
    "cohere": _embed_cohere,
    "openai_compatible": _embed_openai_compatible,
}


def embed_texts(texts, is_query: bool = False) -> np.ndarray:
    """Embed a list of strings. Returns an L2-normalized float32 array of
    shape (len(texts), dim).

    Normalizing here means cosine similarity later is just a dot product,
    which keeps retrieve.py trivial and fast.
    """
    if not texts:
        raise EmbeddingError("No texts given to embed.")

    _require_key()

    fn = _PROVIDERS.get(EMBED_PROVIDER)
    if fn is None:
        raise EmbeddingError(
            f"Unknown EMBED_PROVIDER '{EMBED_PROVIDER}'. "
            f"Supported: {', '.join(_PROVIDERS)}"
        )

    vectors = fn(texts, is_query)
    arr = np.asarray(vectors, dtype=np.float32)

    norms = np.linalg.norm(arr, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return arr / norms


def embed_query(text: str) -> np.ndarray:
    """Embed a single query string, returning a 1-D vector."""
    return embed_texts([text], is_query=True)[0]
