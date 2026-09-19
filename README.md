# BIS Sahayak

AI assistant for Indian Standards and BIS services. One repository, two
independently running services.

```
bis-sahayak/
├── backend/                     FastAPI + RAG pipeline (Python)
├── frontend/                    Next.js 15 + React 19 UI (TypeScript)
└── Website Frontend Design/     Original Figma/Vite design source
```

They are separate processes that talk over HTTP. Sharing a repo is a
convenience for version control, not a runtime coupling.

## What's New

- **New UI** — Redesigned frontend with a full landing page, hero section,
  feature cards, and a polished chat interface ported from the Figma design.
- **Dark Mode** — Toggle between light and dark themes from any page.
  Preference is saved in `localStorage` and respects your system preference
  on first visit.
- **Next.js 15 + React 19** — Upgraded from Next.js 14 / React 18.
  Optional Turbopack dev server for faster hot-reload.
- **Real API integration** — Chat page calls `POST /ask` on the backend and
  surfaces source chunks alongside answers.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, feature cards, trust strip, footer |
| `/chat` | AI chat interface connected to the backend RAG pipeline |

## Running locally

Before starting the services, configure the backend environment:

```bash
mv backend/.env.local.example backend/.env
```

Open `backend/.env` and add your `EMBED_API_KEY` and `GROQ_API_KEY` values.
Keep this file local; it is ignored by Git.

Use two terminals.

**Terminal 1 — backend**
```bash
cd backend
uv sync
source .venv/bin/activate
uv run python ingest.py          # builds the index
uv run uvicorn main:app --reload --port 8000
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm run dev                      # http://localhost:3000

# Optional: faster dev builds with Turbopack
# npm run dev -- --turbopack
```

The frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).
Copy `frontend/.env.local.example` to `.env.local` to change it.

## Dark Mode

Click the **sun/moon icon** in the top-right corner of any page to toggle
dark mode. The preference is stored in `localStorage` under the key
`bis-theme` and auto-detects your OS preference on first visit.

## The thin-server design

Document embeddings are computed **offline on your laptop** and saved to a
small `.npz` file that ships with the app. The server never loads a machine
learning model, so it runs in roughly 160 MB and fits on a free-tier host.

| Where | What runs | Cost |
|---|---|---|
| Your laptop, once | Chunk documents, embed them, save `vector_index.npz` | minutes |
| Server, per request | Embed the query via API, matrix multiply, call Groq | ~160 MB RAM |

### Two retrieval modes

Set `RETRIEVER` in `backend/.env`:

- `RETRIEVER=vector` — hosted embedding API. Understands meaning, not just
  keywords. Needs `EMBED_API_KEY` and internet access. **Use this for real
  retrieval quality.**
- `RETRIEVER=tfidf` — offline keyword matching. No API key, no network,
  works if the venue wifi dies. Lower quality; keep it as demo-day insurance.

Switching modes requires rebuilding the index:
```bash
RETRIEVER=vector uv run python ingest.py
```

### The one rule

**The same embedding model must be used for ingestion and for queries.**
Vectors from different models are not comparable and the failure is silent —
retrieval just quietly gets worse. `config.py` holds the model name in one
place, and `retrieve.py` refuses to start if the index was built with a
different model than the app is configured for.

## Backend configuration

Create `backend/.env`:

```bash
# Retrieval mode: vector or tfidf
RETRIEVER=vector

# Embedding provider: jina, voyage, cohere, or openai_compatible
EMBED_PROVIDER=jina
EMBED_API_KEY=your_key_here

# Answer generation (free tier at https://console.groq.com/keys)
GROQ_API_KEY=your_key_here

# Production only
ALLOWED_ORIGINS=https://your-app.vercel.app
```

Without `GROQ_API_KEY` the pipeline still works end to end — it returns the
best-matching excerpt instead of an LLM-composed answer. Useful for testing
retrieval quality on its own.

## API

- `GET /health` — index status, retriever mode, whether the LLM key is set
- `POST /ask` — `{"query": "...", "k": 3}` returns an answer plus the source
  chunks it was grounded in
- `GET /docs` — interactive API docs

## Deploying

Frontend and backend deploy independently to different hosts.

1. **Build the index locally** and commit it. Do not embed on the server.
2. **Backend** → Render, Fly.io, or Hugging Face Spaces. Set the environment
   variables above, including `ALLOWED_ORIGINS` pointing at your frontend URL.
3. **Frontend** → Vercel. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
   The frontend runs Next.js 15 with React 19; Vercel supports both out of the box.

Railway's free tier after the 30-day trial is 0.5 GB RAM and 0.5 GB disk,
which this backend fits inside — but only because no ML model is loaded.
Adding `sentence-transformers` locally would break that.

## Frontend tech stack

| Package | Version | Role |
|---|---|---|
| Next.js | 15 | Framework, App Router, SSR |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Utility styling |
| Public Sans | — | Typography (Google Fonts) |

## Sample data

`backend/data/sample_docs/` holds simplified, illustrative summaries written
for this prototype. They are **not** verbatim official IS text, which is
copyrighted and sold by BIS.

For the real system, use publicly available material: standard numbers,
titles and scope sections; certification scheme documentation; licensing
procedure guides; and lab directories. Clause-level full text needs a data
sharing agreement with BIS.

## Next steps

- Structured lookup module (labs, certification steps) backed by SQLite —
  these are better as direct database queries than RAG, since procedural
  facts should not be LLM-generated.
- Multilingual support: translate the query in, translate the answer out.
- Replace sample documents with real public BIS content.
