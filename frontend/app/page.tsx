"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Source = {
  source: string;
  chunk_id: number;
  score: number;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  failed?: boolean;
};

const STARTERS = [
  "Which standard applies to LED bulbs?",
  "What are the steps to get a BIS licence?",
  "How do I check if a helmet is really ISI certified?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((d) => {
        const llm = d.llm_enabled ? "Groq" : "no LLM key";
        setStatus(`${d.retriever_mode} retrieval · ${llm}`);
      })
      .catch(() => setStatus("backend offline"));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const query = text.trim();
    if (!query || busy) return;

    setMessages((m) => [...m, { role: "user", text: query }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            err instanceof Error
              ? `${err.message}. Check that the backend is running on ${API_URL}.`
              : "Something went wrong.",
          failed: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5">
      <header className="flex items-baseline justify-between border-b border-line py-5">
        <div>
          <h1 className="text-xl font-semibold text-ink">BIS Sahayak</h1>
          <p className="text-sm text-muted">
            Indian Standards, certification schemes and licensing
          </p>
        </div>
        {status && (
          <span className="shrink-0 text-xs text-muted">{status}</span>
        )}
      </header>

      <div className="flex-1 space-y-5 py-6">
        {messages.length === 0 && (
          <div className="space-y-3 pt-6">
            <p className="text-sm text-muted">Try asking</p>
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full rounded-lg border border-line bg-white px-4 py-3 text-left text-sm text-ink hover:border-accent"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-white">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={i} className="max-w-[92%] space-y-3">
              <p
                className={`whitespace-pre-wrap leading-relaxed ${
                  m.failed ? "text-red-700" : "text-ink"
                }`}
              >
                {m.text}
              </p>

              {m.sources && m.sources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {m.sources.map((s, j) => (
                    <span
                      key={j}
                      className="rounded border border-cite/30 bg-cite-light px-2 py-1 text-xs text-cite"
                      title={`Relevance ${s.score}`}
                    >
                      {s.source} · chunk {s.chunk_id}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {busy && <p className="text-sm text-muted">Searching the standards…</p>}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 bg-paper pb-6 pt-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about a standard, scheme or licence…"
            disabled={busy}
            className="flex-1 rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-accent disabled:opacity-60"
          />
          <button
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            className="rounded-lg bg-accent px-5 py-3 font-medium text-white disabled:opacity-40"
          >
            Ask
          </button>
        </div>
        <p className="pt-2 text-xs text-muted">
          Prototype using sample data. Verify anything official against bis.gov.in.
        </p>
      </div>
    </main>
  );
}
