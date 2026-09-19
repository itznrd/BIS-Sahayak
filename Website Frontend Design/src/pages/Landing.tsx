import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function BISLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Geometric navy mark */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="17" fill="#0E2A47" />
        <circle cx="18" cy="18" r="11" fill="none" stroke="#087F5B" strokeWidth="2" />
        <circle cx="18" cy="18" r="5" fill="#087F5B" />
        <path d="M18 7 L18 11 M18 25 L18 29 M7 18 L11 18 M25 18 L29 18" stroke="#19A982" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-[15px] font-700 tracking-wide" style={{ color: '#081A2B', fontWeight: 700 }}>BIS AI</span>
        <span className="text-[10px] font-500 tracking-widest uppercase" style={{ color: '#526477', fontWeight: 500 }}>Bureau of Indian Standards</span>
      </div>
    </div>
  );
}

function IconBadgeCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function IconFileSearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <circle cx="11.5" cy="14.5" r="2.5"/>
      <path d="M13.25 16.25 15 18"/>
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1"/>
      <path d="M8 6H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3"/>
      <path d="m9 14 2 2 4-4"/>
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function HeroIllustration() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[380px]">
      {/* Radial halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(8,127,91,0.12) 0%, transparent 70%)',
        }}
      />
      <svg width="420" height="380" viewBox="0 0 420 380" fill="none" className="relative z-10 w-full max-w-[420px]" aria-hidden="true">
        {/* Grid lines */}
        {[60, 120, 180, 240, 300, 360].map(x => (
          <line key={`vg-${x}`} x1={x} y1="20" x2={x} y2="360" stroke="#0E2A47" strokeWidth="0.5" opacity="0.08" />
        ))}
        {[60, 120, 180, 240, 300].map(y => (
          <line key={`hg-${y}`} x1="20" y1={y} x2="400" y2={y} stroke="#0E2A47" strokeWidth="0.5" opacity="0.08" />
        ))}

        {/* Emerald glow behind seal */}
        <circle cx="210" cy="190" r="90" fill="#087F5B" opacity="0.06" />
        <circle cx="210" cy="190" r="72" fill="none" stroke="#087F5B" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />

        {/* Central seal */}
        <circle cx="210" cy="190" r="58" fill="#0E2A47" />
        <circle cx="210" cy="190" r="50" fill="none" stroke="#087F5B" strokeWidth="2" />
        <circle cx="210" cy="190" r="32" fill="#081A2B" />
        <circle cx="210" cy="190" r="24" fill="none" stroke="#19A982" strokeWidth="1.5" />
        <circle cx="210" cy="190" r="12" fill="#087F5B" />
        {/* Checkmark in seal */}
        <path d="M203 190 L208 196 L218 183" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* BIS text placeholder ring */}
        <text x="210" y="148" textAnchor="middle" fill="#CBD5E1" fontSize="7" fontFamily="Public Sans, sans-serif" letterSpacing="3" opacity="0.7">B I S A I</text>

        {/* Data paths to nodes */}
        {/* Node 1 — top right: Standards */}
        <line x1="252" y1="158" x2="310" y2="100" stroke="#19A982" strokeWidth="1.5" opacity="0.5" />
        <circle cx="318" cy="92" r="22" fill="white" stroke="#CBD5E1" strokeWidth="1" />
        <text x="318" y="88" textAnchor="middle" fill="#526477" fontSize="7" fontFamily="Public Sans, sans-serif">IS 1293</text>
        <text x="318" y="98" textAnchor="middle" fill="#087F5B" fontSize="6" fontFamily="Public Sans, sans-serif">Standards</text>

        {/* Node 2 — bottom left: Licenses */}
        <line x1="168" y1="222" x2="100" y2="280" stroke="#19A982" strokeWidth="1.5" opacity="0.5" />
        <circle cx="88" cy="288" r="22" fill="white" stroke="#CBD5E1" strokeWidth="1" />
        <text x="88" y="284" textAnchor="middle" fill="#526477" fontSize="7" fontFamily="Public Sans, sans-serif">CM/L</text>
        <text x="88" y="295" textAnchor="middle" fill="#087F5B" fontSize="6" fontFamily="Public Sans, sans-serif">Licenses</text>

        {/* Node 3 — bottom right: Applications */}
        <line x1="248" y1="226" x2="316" y2="280" stroke="#19A982" strokeWidth="1.5" opacity="0.5" />
        <circle cx="326" cy="288" r="22" fill="white" stroke="#CBD5E1" strokeWidth="1" />
        <text x="326" y="284" textAnchor="middle" fill="#526477" fontSize="7" fontFamily="Public Sans, sans-serif">CRS</text>
        <text x="326" y="295" textAnchor="middle" fill="#087F5B" fontSize="6" fontFamily="Public Sans, sans-serif">Applications</text>

        {/* Floating card 1 — Verified */}
        <rect x="42" y="96" width="110" height="52" rx="10" fill="white" style={{ filter: 'drop-shadow(0 4px 12px rgba(14,42,71,0.10))' }} />
        <circle cx="62" cy="122" r="10" fill="#DDF7EC" />
        <path d="M57 122 L61 126 L68 118" stroke="#087F5B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="78" y="117" fill="#087F5B" fontSize="8" fontWeight="600" fontFamily="Public Sans, sans-serif">Verified</text>
        <text x="78" y="130" fill="#526477" fontSize="7" fontFamily="Public Sans, sans-serif">IS 1293:2019</text>

        {/* Floating card 2 — CM/L Reference */}
        <rect x="256" y="44" width="120" height="52" rx="10" fill="white" style={{ filter: 'drop-shadow(0 4px 12px rgba(14,42,71,0.10))' }} />
        <rect x="268" y="56" width="8" height="8" rx="2" fill="#0E2A47" />
        <text x="284" y="63" fill="#081A2B" fontSize="8" fontWeight="600" fontFamily="Public Sans, sans-serif">CM/L Ref</text>
        <text x="268" y="81" fill="#526477" fontSize="7" fontFamily="Public Sans, sans-serif">R-41XXXXXX</text>
      </svg>
    </div>
  );
}

const features = [
  {
    icon: <IconBadgeCheck />,
    heading: 'Verify Licenses',
    description: 'Find CM/L and R-numbers with less manual searching.',
  },
  {
    icon: <IconFileSearch />,
    heading: 'Understand Standards',
    description: 'Simplify IS 1293:2019 and other technical requirements.',
  },
  {
    icon: <IconClipboard />,
    heading: 'Track Applications',
    description: 'Check application status while you are on the go.',
  },
];

const trustPoints = [
  'Clear explanations',
  'Standards-focused guidance',
  'Human-readable compliance support',
];

const navLinks = ['About', 'Standards', 'CRS', 'Services', 'Contact'];

const footerLinks = {
  Product: ['About', 'Standards', 'CRS', 'Services'],
  Support: ['Contact', 'Help', 'Accessibility'],
  Legal: ['Privacy', 'Terms', 'Disclaimer'],
};

export default function Landing() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9FAFB', fontFamily: "'Public Sans', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', height: 76 }} className="flex items-center sticky top-0 z-50">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <BISLogo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link}
                href="#"
                className="px-4 py-2 text-[14px] font-medium transition-colors duration-150 rounded-md"
                style={{ color: '#526477', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#081A2B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#526477')}
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => navigate('/chat')}
              className="ml-4 flex items-center gap-2 px-5 py-2 text-[14px] font-600 text-white transition-all duration-150"
              style={{ background: '#087F5B', borderRadius: 10, fontWeight: 600, boxShadow: '0 1px 4px rgba(8,127,91,0.2)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#065f46')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#087F5B')}
            >
              Launch AI
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: '#081A2B' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>}
            </svg>
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="absolute top-[76px] left-0 right-0 bg-white border-b border-slate-200 md:hidden z-50 px-6 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <a key={link} href="#" className="py-2 text-[15px] font-medium" style={{ color: '#526477' }}>{link}</a>
            ))}
            <button
              onClick={() => navigate('/chat')}
              className="mt-2 py-3 text-[15px] font-600 text-white rounded-xl"
              style={{ background: '#087F5B', fontWeight: 600 }}
            >
              Launch AI
            </button>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section style={{ background: '#F9FAFB' }} className="flex-1">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div
                className="text-[11px] font-600 tracking-[0.15em] uppercase"
                style={{ color: '#087F5B', fontWeight: 600 }}
              >
                Bureau of Indian Standards · Intelligent Assistance
              </div>
              <h1
                className="font-700 leading-[1.05]"
                style={{
                  color: '#081A2B',
                  fontWeight: 700,
                  fontSize: 'clamp(36px, 5vw, 62px)',
                  maxWidth: 610,
                }}
              >
                Navigate Indian Standards Instantly with BIS AI.
              </h1>
              <p className="text-[18px] leading-[30px]" style={{ color: '#526477', maxWidth: 520 }}>
                Get clear guidance on certification processes, IS codes, licensing, and compliance — powered by AI trained on BIS resources.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                <button
                  onClick={() => navigate('/chat')}
                  className="flex items-center gap-2 px-7 py-3.5 text-[15px] font-600 text-white transition-all duration-150"
                  style={{ background: '#087F5B', borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 16px rgba(8,127,91,0.25)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#065f46')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#087F5B')}
                >
                  Start Chatting Now <IconArrowRight />
                </button>
              </div>
              <p className="text-[13px]" style={{ color: '#526477' }}>
                Guidance for certification, standards, licensing, and compliance.
              </p>
            </div>

            {/* Right */}
            <div className="w-full">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Helps ── */}
      <section style={{ background: '#FFFFFF' }} className="py-16 md:py-20">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="mb-10">
            <p className="text-[11px] font-600 tracking-[0.15em] uppercase mb-3" style={{ color: '#087F5B', fontWeight: 600 }}>
              How It Helps
            </p>
            <h2 className="text-[28px] font-700 leading-tight" style={{ color: '#081A2B', fontWeight: 700 }}>
              A clearer path through compliance
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon, heading, description }) => (
              <div
                key={heading}
                className="p-7 rounded-[16px] transition-all duration-200 cursor-default"
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 8px 24px rgba(14,42,71,0.08)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = '';
                  el.style.boxShadow = '';
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-5"
                  style={{ width: 44, height: 44, background: '#DDF7EC', color: '#087F5B' }}
                >
                  {icon}
                </div>
                <h3 className="text-[18px] font-700 mb-2" style={{ color: '#081A2B', fontWeight: 700 }}>
                  {heading}
                </h3>
                <p className="text-[15px] leading-[24px]" style={{ color: '#526477' }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section style={{ background: '#F9FAFB', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }} className="py-10">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <p className="text-[15px] font-500 text-center md:text-left md:flex-1" style={{ color: '#526477', fontWeight: 500 }}>
            Built to make standards information easier to find, understand, and act on.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            {trustPoints.map(point => (
              <div key={point} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#087F5B' }} />
                <span className="text-[13px] font-500" style={{ color: '#081A2B', fontWeight: 500 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0E2A47' }} className="pt-12 pb-6">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Logo column */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <circle cx="18" cy="18" r="17" fill="#0E2A47" stroke="#CBD5E1" strokeWidth="1" />
                  <circle cx="18" cy="18" r="11" fill="none" stroke="#087F5B" strokeWidth="2" />
                  <circle cx="18" cy="18" r="5" fill="#087F5B" />
                </svg>
                <div>
                  <div className="text-[14px] font-700" style={{ color: '#FFFFFF', fontWeight: 700 }}>BIS AI</div>
                  <div className="text-[10px] tracking-widest uppercase" style={{ color: '#CBD5E1' }}>Bureau of Indian Standards</div>
                </div>
              </div>
              <p className="text-[12px] leading-5" style={{ color: '#CBD5E1', maxWidth: 200 }}>
                BIS AI provides informational guidance and does not replace official BIS standards, notices, certification decisions, or regulatory requirements.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-[12px] font-600 tracking-widest uppercase mb-4" style={{ color: '#CBD5E1', fontWeight: 600 }}>
                  {category}
                </h4>
                <ul className="flex flex-col gap-2">
                  {links.map(link => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[14px] transition-colors duration-150"
                        style={{ color: '#CBD5E1' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(203,213,225,0.2)' }} className="pt-5">
            <p className="text-[12px] text-center" style={{ color: 'rgba(203,213,225,0.6)' }}>
              © {new Date().getFullYear()} Bureau of Indian Standards. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
