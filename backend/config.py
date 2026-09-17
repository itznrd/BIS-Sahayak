"""
config.py
Single source of truth for settings shared between ingest.py and the server.

The critical invariant: ingest.py and retrieve.py MUST use the same embedding
model. Vectors from two different models are not comparable -- cosine
similarity between them is meaningless noise, and it fails silently (bad
retrieval that looks like a chunking bug). Keeping the model name in one
place here is what prevents that.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data" / "sample_docs"
INDEX_DIR = BASE_DIR / "index"

# "vector" = hosted embedding API (production path, needs internet + API key)
# "tfidf"  = offline keyword fallback (zero dependencies, demo-day insurance)
RETRIEVER = os.environ.get("RETRIEVER", "tfidf").lower()

# Which hosted embedding provider to use when RETRIEVER=vector.
# Supported: jina, voyage, cohere, openai_compatible
EMBED_PROVIDER = os.environ.get("EMBED_PROVIDER", "jina").lower()
EMBED_API_KEY = os.environ.get("EMBED_API_KEY")

_DEFAULT_MODELS = {
    "jina": "jina-embeddings-v3",
    "voyage": "voyage-3",
    "cohere": "embed-english-v3.0",
    "openai_compatible": "text-embedding-3-small",
}
EMBED_MODEL = os.environ.get("EMBED_MODEL", _DEFAULT_MODELS.get(EMBED_PROVIDER, ""))

# Only used when EMBED_PROVIDER=openai_compatible
EMBED_BASE_URL = os.environ.get("EMBED_BASE_URL", "https://api.openai.com/v1")

# Groq (answer generation)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")

# Retrieval tuning
DEFAULT_K = int(os.environ.get("DEFAULT_K", "3"))
MIN_SCORE_TFIDF = float(os.environ.get("MIN_SCORE_TFIDF", "0.05"))
MIN_SCORE_VECTOR = float(os.environ.get("MIN_SCORE_VECTOR", "0.25"))

# Index file paths
VECTOR_INDEX_PATH = INDEX_DIR / "vector_index.npz"
CHUNKS_PATH = INDEX_DIR / "chunks.json"
TFIDF_VECTORIZER_PATH = INDEX_DIR / "vectorizer.pkl"
TFIDF_VECTORS_PATH = INDEX_DIR / "chunk_vectors.pkl"
