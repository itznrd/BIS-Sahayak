"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../components/ThemeProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Source = { source: string; chunk_id: number; score: number };
type Message = { role: "user" | "ai"; text: string; sources?: Source[]; failed?: boolean };

const EXAMPLE_PROMPTS = [
  "How do I verify an ISI mark?",
  "What are the requirements for IS 1293:2019 (plugs and sockets)?",
  "What are the steps to get a BIS licence?",
  "What is the difference between BIS and hallmark?",
];

// Demo responses used as fallback when backend is offline
const DEMO_RESPONSES: Record<string, string> = {
  "How do I verify an ISI mark?":
    "Start with the CM/L number printed alongside the ISI mark. You can visit the BIS portal at bis.gov.in or use the BIS Care mobile app to verify any CM/L number in real time. The ISI mark on a product means it has been certified by BIS to conform to the relevant Indian Standard.",
  "What are the requirements for IS 1293:2019 (plugs and sockets)?":
    "IS 1293:2019 specifies the requirements for two-pole and three-pole plugs and socket-outlets rated up to 16 A. Key requirements include rated voltage (250 V), contact dimensions, insulation resistance (>1 MΩ), and dielectric strength testing. Products must carry a valid CM/L number granted by BIS before sale in India.",
  "What are the steps to get a BIS licence?":
    "The BIS product certification process involves: (1) Apply online at manakonline.in with product details and test reports. (2) BIS reviews the application and may conduct a factory inspection. (3) Submit samples to a BIS-recognised lab for testing against the relevant IS standard. (4) On successful testing and inspection, BIS grants a CM/L licence. (5) Mark your products with the ISI mark and CM/L number. Renewal is required periodically.",
  "What is the difference between BIS and hallmark?":
    "BIS (Bureau of Indian Standards) is the national standards body that certifies a wide range of products with the ISI mark covering industrial and consumer goods. BIS Hallmarking specifically refers to BIS certification of precious metal jewellery (gold, silver, platinum) for purity — indicated by the BIS Hallmark with HUID. ISI covers general products; hallmarking is exclusively for jewellery purity.",
};

function BISMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="17" fill="#0E2A47" />
      <circle cx="18" cy="18" r="11" fill="none" stroke="#087F5B" strokeWidth="2" />
      <circle cx="18" cy="18" r="5" fill="#087F5B" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function ThumbUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14Z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10Z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  );
}

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFFFFF" : "#CBD5E1"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#526477" }}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#087F5B" : "#526477"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  );
}

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{
    role: "ai",
    text: "Hello! I'm BIS AI, your intelligent assistant for Bureau of Indian Standards queries. You can ask me about IS codes, license verification, CRS applications, hallmarking, and more.",
  }]);
  const [input, setInput] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(d => { const llm = d.llm_enabled ? "Groq" : "no LLM"; setBackendStatus(`${d.retriever_mode} · ${llm}`); })
      .catch(() => setBackendStatus("backend offline"));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setIsTyping(true);
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error((detail as { detail?: string }).detail ?? `Request failed (${res.status})`);
      }
      const data = await res.json() as { answer: string; sources?: Source[] };
      setMessages(m => [...m, { role: "ai", text: data.answer, sources: data.sources }]);
    } catch {
      // Backend offline — try demo responses first, then a generic fallback
      const demo = DEMO_RESPONSES[text];
      if (demo) {
        await new Promise(r => setTimeout(r, 800)); // simulate thinking
        setMessages(m => [...m, { role: "ai", text: demo + "\n\n⚠️ Demo mode — connect a backend for live answers." }]);
      } else {
        setMessages(m => [...m, {
          role: "ai",
          text: `I don't have a cached answer for that question yet. Start the backend server and I'll give you a live, RAG-powered answer from the BIS knowledge base.\n\n⚠️ Backend offline — run: cd backend && uv run uvicorn main:app --reload --port 8000`,
          failed: true,
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--color-canvas)", fontFamily: "'Public Sans', sans-serif" }}>

      {/* Header */}
      <header className="flex flex-col sticky top-0 z-40" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="flex items-center px-4 md:px-8" style={{ height: 72 }}>
          <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BISMark />
              <div>
                <div className="text-[14px] font-bold" style={{ color: "var(--color-text)" }}>BIS AI</div>
                <div className="text-[10px] tracking-widest uppercase" style={{ color: backendStatus === "backend offline" ? "#E53E3E" : "var(--color-muted)" }}>
                  {backendStatus ?? "Intelligent Assistant"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                className="flex items-center gap-1.5 text-[13px] transition-colors duration-150"
                style={{ color: "var(--color-muted)", fontWeight: 500 }}
                onClick={() => router.push("/")}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Home
              </button>
              <button
                className="text-[13px] px-3 py-1.5 rounded-lg transition-colors duration-150"
                style={{ color: "#087F5B", fontWeight: 500, background: "#DDF7EC", border: "1px solid rgba(8,127,91,0.2)" }}
                onClick={() => setMessages([{ role: "ai", text: "Hello! I'm BIS AI, your intelligent assistant for Bureau of Indian Standards queries." }])}
              >New chat</button>
            </div>
          </div>
        </div>
        {/* Offline banner */}
        {backendStatus === "backend offline" && (
          <div className="w-full px-4 py-2 text-center text-[12px]" style={{ background: "rgba(8,127,91,0.08)", color: "#087F5B", borderTop: "1px solid rgba(8,127,91,0.15)" }}>
            🔌 Demo mode — backend offline. Example questions use cached answers.
            <span className="ml-2 opacity-70">Start backend: <code className="font-mono">cd backend && uv run uvicorn main:app --reload</code></span>
          </div>
        )}
      </header>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto pb-44">
        <div className="w-full max-w-[960px] mx-auto px-4 md:px-6 pt-10">

          {/* Intro + example prompts */}
          {messages.length <= 1 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-[28px] font-bold mb-2" style={{ color: "var(--color-text)", lineHeight: "38px" }}>Try asking about...</h1>
                <p className="text-[15px]" style={{ color: "var(--color-muted)" }}>Get clear guidance on standards, licenses, applications, and compliance.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {EXAMPLE_PROMPTS.map(prompt => (
                  <button key={prompt} onClick={() => sendMessage(prompt)}
                    className="flex items-center justify-between gap-3 p-4 text-left rounded-[14px] transition-all duration-150 group"
                    style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontFamily: "'Public Sans', sans-serif" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#087F5B"; el.style.boxShadow = "0 6px 18px rgba(14,42,71,0.08)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--color-border)"; el.style.boxShadow = ""; }}
                  >
                    <span className="text-[14px] leading-5" style={{ color: "var(--color-text)" }}>{prompt}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Messages */}
          <div className="flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "ai" && (
                  <div className="shrink-0 rounded-full flex items-center justify-center mt-0.5" style={{ width: 32, height: 32, background: "#0E2A47" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DDF7EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
                    </svg>
                  </div>
                )}
                <div className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`} style={{ maxWidth: msg.role === "ai" ? 720 : 620 }}>
                  <div className="px-4 py-3 text-[15px] leading-6" style={{
                    /* User messages: always emerald with white text — works in light & dark */
                    background: msg.role === "user"
                      ? "#087F5B"
                      : msg.failed
                        ? "rgba(180,35,24,0.12)"
                        : "var(--color-card)",
                    color: msg.role === "user"
                      ? "#FFFFFF"
                      : msg.failed
                        ? "#E53E3E"
                        : "var(--color-text)",
                    borderRadius: msg.role === "ai" ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
                    border: msg.failed ? "1px solid rgba(180,35,24,0.25)" : "none",
                  }}>
                    {msg.text}
                  </div>

                  {/* Source chips */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-1">
                      {msg.sources.map((s, j) => (
                        <span key={j} className="rounded-full px-2.5 py-1 text-[11px]"
                          style={{ background: "#DDF7EC", color: "#087F5B", border: "1px solid rgba(8,127,91,0.2)" }}
                          title={`Relevance ${s.score.toFixed(2)}`}
                        >{s.source} · chunk {s.chunk_id}</span>
                      ))}
                    </div>
                  )}

                  {/* AI utility row — only on non-failed AI messages */}
                  {msg.role === "ai" && !msg.failed && (
                    <div className="flex items-center gap-3 px-1">
                      <button onClick={() => handleCopy(msg.text, idx)}
                        className="flex items-center gap-1 text-[11px] transition-all duration-150"
                        style={{ color: copiedIdx === idx ? "#087F5B" : "var(--color-muted)" }}
                      ><CopyIcon /> {copiedIdx === idx ? "Copied" : "Copy"}</button>
                      <button className="flex items-center gap-1 text-[11px] transition-colors duration-150" style={{ color: "var(--color-muted)" }}><ThumbUpIcon /> Helpful</button>
                      <button className="flex items-center gap-1 text-[11px] transition-colors duration-150" style={{ color: "var(--color-muted)" }}><ThumbDownIcon /> Not helpful</button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full flex items-center justify-center" style={{ width: 32, height: 32, background: "#0E2A47" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DDF7EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
                  </svg>
                </div>
                <div className="px-4 py-3 flex items-center gap-1" style={{ background: "var(--color-card)", borderRadius: "14px 14px 14px 4px" }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="rounded-full" style={{ width: 6, height: 6, background: "#087F5B", animation: `bis-pulse 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.6 }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 px-4 md:px-6 pb-5 pt-3" style={{ background: "linear-gradient(to top, var(--color-canvas) 80%, transparent)" }}>
        <div className="w-full max-w-[920px] mx-auto">
          <div className="flex items-center gap-2 px-3 transition-all duration-150"
            style={{ background: "var(--color-input)", border: "1px solid var(--color-border)", borderRadius: 14, height: 76, boxShadow: "0 4px 20px rgba(14,42,71,0.08)" }}
            onFocus={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#087F5B"; el.style.boxShadow = "0 0 0 2px rgba(8,127,91,0.15), 0 4px 20px rgba(14,42,71,0.08)"; }}
            onBlur={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--color-border)"; el.style.boxShadow = "0 4px 20px rgba(14,42,71,0.08)"; }}
          >
            <button className="flex items-center justify-center rounded-xl transition-colors duration-150" style={{ width: 44, height: 44, flexShrink: 0 }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-card)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
              aria-label="Attach file"
            ><AttachIcon /></button>

            <input type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about IS codes, licensing, or compliance..."
              className="flex-1 bg-transparent outline-none text-[15px]"
              style={{ color: "var(--color-text)", fontFamily: "'Public Sans', sans-serif" }}
            />

            <button className="flex items-center justify-center rounded-xl transition-colors duration-150"
              style={{ width: 44, height: 44, flexShrink: 0, background: micActive ? "#DDF7EC" : "transparent" }}
              onClick={() => setMicActive(m => !m)} aria-label="Voice input"
            ><MicIcon active={micActive} /></button>

            <button onClick={() => sendMessage(input)}
              className="flex items-center justify-center rounded-full transition-all duration-150"
              style={{ width: 44, height: 44, flexShrink: 0, background: input.trim() ? "#087F5B" : "var(--color-card)", boxShadow: input.trim() ? "0 2px 8px rgba(8,127,91,0.3)" : "none" }}
              aria-label="Send message"
            ><SendIcon active={!!input.trim()} /></button>
          </div>
          <p className="text-center text-[12px] mt-2" style={{ color: "var(--color-muted)" }}>
            BIS AI can make mistakes. Verify critical compliance decisions against official BIS publications.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bis-pulse {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
