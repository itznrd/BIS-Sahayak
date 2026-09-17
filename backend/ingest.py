"""
ingest.py
Offline index builder. Run this on your laptop, NOT on the server.

    uv run python ingest.py            # uses RETRIEVER from .env
    RETRIEVER=vector uv run python ingest.py
    RETRIEVER=tfidf  uv run python ingest.py

In vector mode this calls the embedding API once per batch of chunks and
writes a small .npz file. That file is committed/deployed with the app, so
the server never has to embed documents or load an ML model.

Re-run this whenever you change the documents OR change the embedding model.
"""

import argparse
import json
import pickle

import numpy as np

from config import (
    DATA_DIR,
    INDEX_DIR,
    RETRIEVER,
    EMBED_PROVIDER,
    EMBED_MODEL,
    VECTOR_INDEX_PATH,
    CHUNKS_PATH,
    TFIDF_VECTORIZER_PATH,
    TFIDF_VECTORS_PATH,
)

MIN_CHUNK_CHARS = 40
BATCH_SIZE = 32


def load_and_chunk_documents():
    """Read every .txt file and split into paragraph-sized chunks."""
    chunks, metadata = [], []

    if not DATA_DIR.exists():
        raise FileNotFoundError(f"No data directory found at {DATA_DIR}")

    doc_files = sorted(DATA_DIR.glob("*.txt"))
    if not doc_files:
        raise FileNotFoundError(f"No .txt files found in {DATA_DIR}")

    for doc_path in doc_files:
        text = doc_path.read_text(encoding="utf-8")
        for i, para in enumerate(text.split("\n\n")):
            cleaned = " ".join(para.split())
            if len(cleaned) < MIN_CHUNK_CHARS:
                continue
            chunks.append(cleaned)
            metadata.append({"source": doc_path.name, "chunk_id": i})

    return chunks, metadata


def save_chunks(chunks, metadata, extra=None):
    INDEX_DIR.mkdir(exist_ok=True)
    payload = {"chunks": chunks, "metadata": metadata}
    if extra:
        payload.update(extra)
    with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)


def build_vector_index(chunks, metadata):
    from embeddings import embed_texts

    print(f"Embedding {len(chunks)} chunks via {EMBED_PROVIDER} ({EMBED_MODEL})...")

    all_vectors = []
    for start in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[start:start + BATCH_SIZE]
        all_vectors.append(embed_texts(batch, is_query=False))
        print(f"  embedded {min(start + BATCH_SIZE, len(chunks))}/{len(chunks)}")

    vectors = np.vstack(all_vectors).astype(np.float32)

    INDEX_DIR.mkdir(exist_ok=True)
    np.savez_compressed(VECTOR_INDEX_PATH, vectors=vectors)
    save_chunks(chunks, metadata, extra={
        "embed_provider": EMBED_PROVIDER,
        "embed_model": EMBED_MODEL,
    })

    size_mb = VECTOR_INDEX_PATH.stat().st_size / (1024 * 1024)
    print(f"\nVector index: {vectors.shape[0]} x {vectors.shape[1]} ({size_mb:.2f} MB)")
    print(f"Saved to {VECTOR_INDEX_PATH}")


def build_tfidf_index(chunks, metadata):
    from sklearn.feature_extraction.text import TfidfVectorizer

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    chunk_vectors = vectorizer.fit_transform(chunks)

    INDEX_DIR.mkdir(exist_ok=True)
    with open(TFIDF_VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(TFIDF_VECTORS_PATH, "wb") as f:
        pickle.dump(chunk_vectors, f)
    save_chunks(chunks, metadata)

    print(f"TF-IDF index: {chunk_vectors.shape[0]} chunks, {chunk_vectors.shape[1]} features")
    print(f"Saved to {INDEX_DIR}")


def main():
    parser = argparse.ArgumentParser(description="Build the retrieval index.")
    parser.add_argument(
        "--mode",
        choices=["vector", "tfidf"],
        default=RETRIEVER,
        help="Override the RETRIEVER setting from .env",
    )
    args = parser.parse_args()

    chunks, metadata = load_and_chunk_documents()
    n_docs = len({m["source"] for m in metadata})
    print(f"Loaded {len(chunks)} chunks from {n_docs} documents.\n")

    if args.mode == "vector":
        build_vector_index(chunks, metadata)
    else:
        build_tfidf_index(chunks, metadata)


if __name__ == "__main__":
    main()
