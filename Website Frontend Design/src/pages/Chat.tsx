import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BISMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="17" fill="#0E2A47" />
      <circle cx="18" cy="18" r="11" fill="none" stroke="#087F5B" strokeWidth="2" />
      <circle cx="18" cy="18" r="5" fill="#087F5B" />
    </svg>
  );
}

type Message = {
  role: 'user' | 'ai';
  text: string;
};

const EXAMPLE_PROMPTS = [
  'How do I verify an ISI mark?',
  'What are the requirements for IS 1293:2019 (plugs and sockets)?',
  'Show the status of my CRS application (R-41XXXXXX).',
  'What is the difference between BIS and hallmark?',
];

const AI_RESPONSES: Record<string, string> = {
  'How do I verify an ISI mark?':
    'Start with the CM/L number printed alongside the ISI mark. BIS AI can help you identify the relevant license reference and the standard connected to the product. You can visit the BIS portal at bis.gov.in or use the BIS Care mobile app to verify any CM/L number in real time.',
  'What are the requirements for IS 1293:2019 (plugs and sockets)?':
    'IS 1293:2019 specifies the requirements for two-pole and three-pole plugs and socket-outlets rated up to 16 A. Key requirements include rated voltage (250 V), contact dimensions, insulation resistance (>1 MΩ), and dielectric strength testing. Products must carry a valid CM/L number granted by BIS before sale.',
  'Show the status of my CRS application (R-41XXXXXX).':
    'CRS application R-41XXXXXX is currently under review by the BIS Central Marks Department. Typical processing time is 30–45 working days from the date of document submission. You can track real-time status at the BIS online portal using your registered email and application ID.',
  'What is the difference between BIS and hallmark?':
    'BIS (Bureau of Indian Standards) is the national standards body that certifies a wide range of products with the ISI mark. Hallmarking specifically refers to BIS certification of precious metal jewellery (gold, silver, platinum) for purity — indicated by the BIS Hallmark. ISI covers industrial/consumer goods; hallmarking covers jewellery.',
};

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFFFFF' : '#CBD5E1'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#526477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#087F5B' : '#526477'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hello! I\'m BIS AI, your intelligent assistant for Bureau of Indian Standards queries. You can ask me about IS codes, license verification, CRS applications, hallmarking, and more.',
    },
  ]);
  const [input, setInput] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    const reply =
      AI_RESPONSES[text] ??
      `Thanks for your question about "${text}". BIS AI is processing your query against IS codes and certification databases. For the most authoritative answer, please cross-reference with official BIS publications at bis.gov.in.`;

    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: reply }]);
      setIsTyping(false);
    }, 1100);
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: '#F9FAFB', fontFamily: "'Public Sans', sans-serif" }}
    >
      {/* ── Minimal header ── */}
      <header
        className="flex items-center sticky top-0 z-40 px-4 md:px-8"
        style={{ height: 72, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}
      >
        <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BISMark />
            <div>
              <div className="text-[14px] font-700" style={{ color: '#081A2B', fontWeight: 700 }}>BIS AI</div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: '#526477' }}>Intelligent Assistant</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1.5 text-[13px] font-500 transition-colors duration-150"
              style={{ color: '#526477', fontWeight: 500 }}
              onClick={() => navigate('/')}
              onMouseEnter={e => (e.currentTarget.style.color = '#081A2B')}
              onMouseLeave={e => (e.currentTarget.style.color = '#526477')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
            </button>
            <button
              className="text-[13px] font-500 px-3 py-1.5 rounded-lg transition-colors duration-150"
              style={{ color: '#087F5B', fontWeight: 500, background: '#DDF7EC', border: '1px solid rgba(8,127,91,0.2)' }}
              onClick={() => setMessages([{
                role: 'ai',
                text: 'Hello! I\'m BIS AI, your intelligent assistant for Bureau of Indian Standards queries.',
              }])}
            >
              New chat
            </button>
          </div>
        </div>
      </header>

      {/* ── Chat body ── */}
      <div className="flex-1 overflow-y-auto pb-44">
        <div className="w-full max-w-[960px] mx-auto px-4 md:px-6 pt-10">

          {/* Prompt introduction */}
          {messages.length <= 1 && (
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-700 mb-2" style={{ color: '#081A2B', fontWeight: 700, lineHeight: '38px' }}>
                Try asking about...
              </h1>
              <p className="text-[15px]" style={{ color: '#526477' }}>
                Get clear guidance on standards, licenses, applications, and compliance.
              </p>
            </div>
          )}

          {/* Example prompt cards — shown only at start */}
          {messages.length <= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {EXAMPLE_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center justify-between gap-3 p-4 text-left rounded-[14px] transition-all duration-150 group"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    fontFamily: "'Public Sans', sans-serif",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = '#087F5B';
                    el.style.boxShadow = '0 6px 18px rgba(14,42,71,0.08)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = '#CBD5E1';
                    el.style.boxShadow = '';
                  }}
                >
                  <span className="text-[14px] leading-5" style={{ color: '#081A2B' }}>{prompt}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-all duration-150 group-hover:stroke-[#087F5B]">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Message thread */}
          <div className="flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {msg.role === 'ai' && (
                  <div className="shrink-0 rounded-full flex items-center justify-center mt-0.5" style={{ width: 32, height: 32, background: '#0E2A47' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DDF7EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
                    </svg>
                  </div>
                )}

                <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`} style={{ maxWidth: msg.role === 'ai' ? 720 : 620 }}>
                  <div
                    className="px-4 py-3 text-[15px] leading-6"
                    style={{
                      background: msg.role === 'ai' ? '#F1F5F9' : '#E4F7EF',
                      color: '#081A2B',
                      borderRadius: msg.role === 'ai' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                      fontFamily: "'Public Sans', sans-serif",
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* AI utility row */}
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-3 px-1">
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="flex items-center gap-1 text-[11px] transition-all duration-150"
                        style={{ color: copiedIdx === idx ? '#087F5B' : '#CBD5E1' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#526477')}
                        onMouseLeave={e => (e.currentTarget.style.color = copiedIdx === idx ? '#087F5B' : '#CBD5E1')}
                      >
                        <CopyIcon /> {copiedIdx === idx ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        className="flex items-center gap-1 text-[11px] transition-colors duration-150"
                        style={{ color: '#CBD5E1' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#526477')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                      >
                        <ThumbUpIcon /> Helpful
                      </button>
                      <button
                        className="flex items-center gap-1 text-[11px] transition-colors duration-150"
                        style={{ color: '#CBD5E1' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#526477')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                      >
                        <ThumbDownIcon /> Not helpful
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full flex items-center justify-center" style={{ width: 32, height: 32, background: '#0E2A47' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DDF7EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
                  </svg>
                </div>
                <div
                  className="px-4 py-3 flex items-center gap-1"
                  style={{ background: '#F1F5F9', borderRadius: '14px 14px 14px 4px' }}
                >
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        width: 6, height: 6,
                        background: '#087F5B',
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Chat input bar — fixed bottom ── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 md:px-6 pb-5 pt-3"
        style={{ background: 'linear-gradient(to top, #F9FAFB 80%, transparent)' }}
      >
        <div className="w-full max-w-[920px] mx-auto">
          <div
            className="flex items-center gap-2 px-3 transition-all duration-150"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 14,
              height: 76,
              boxShadow: '0 4px 20px rgba(14,42,71,0.08)',
            }}
            onFocus={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = '#087F5B';
              el.style.boxShadow = '0 0 0 2px rgba(8,127,91,0.15), 0 4px 20px rgba(14,42,71,0.08)';
            }}
            onBlur={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = '#CBD5E1';
              el.style.boxShadow = '0 4px 20px rgba(14,42,71,0.08)';
            }}
          >
            {/* Attach */}
            <button
              className="flex items-center justify-center rounded-xl transition-colors duration-150"
              style={{ width: 44, height: 44, flexShrink: 0 }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#F1F5F9')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              aria-label="Attach file"
            >
              <AttachIcon />
            </button>

            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about IS codes, licensing, or compliance..."
              className="flex-1 bg-transparent outline-none text-[15px]"
              style={{ color: '#081A2B', fontFamily: "'Public Sans', sans-serif" }}
            />

            {/* Mic */}
            <button
              className="flex items-center justify-center rounded-xl transition-colors duration-150"
              style={{
                width: 44, height: 44, flexShrink: 0,
                background: micActive ? '#DDF7EC' : 'transparent',
              }}
              onMouseEnter={e => {
                if (!micActive) (e.currentTarget as HTMLButtonElement).style.background = '#F1F5F9';
              }}
              onMouseLeave={e => {
                if (!micActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
              onClick={() => setMicActive(m => !m)}
              aria-label="Voice input"
            >
              <MicIcon active={micActive} />
            </button>

            {/* Send */}
            <button
              onClick={() => sendMessage(input)}
              className="flex items-center justify-center rounded-full transition-all duration-150"
              style={{
                width: 44, height: 44, flexShrink: 0,
                background: input.trim() ? '#087F5B' : '#F1F5F9',
                boxShadow: input.trim() ? '0 2px 8px rgba(8,127,91,0.3)' : 'none',
              }}
              aria-label="Send message"
            >
              <SendIcon active={!!input.trim()} />
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-[12px] mt-2" style={{ color: '#526477' }}>
            BIS AI can make mistakes. Verify critical compliance decisions against official BIS publications.
          </p>
        </div>
      </div>

      {/* Typing dot animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
