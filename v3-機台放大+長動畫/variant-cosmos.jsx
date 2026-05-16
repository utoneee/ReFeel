// variant-cosmos.jsx — 塔羅式宇宙
// Deep navy outer + ornamental gold frame + cream tarot card reveal.
// Machine swappable via prop: 'sphere' (armillary) | 'bottle' (mystical).
// Capsule randomly orb or rune-stone.

const CP = /*COSMOS PALETTE*/ {
  navy:       '#1a2138',
  navyDeep:   '#13192a',
  navySoft:   '#242d48',
  gold:       '#d4af6f',
  goldDim:    '#967640',
  goldBright: '#e8c888',
  cream:      '#f3e8c8',
  creamDeep:  '#e8d8b0',
  ink:        '#3a2f1f',
  inkSoft:    '#5a4e36',
  textOnNavy: '#e8d8b0',
  textMuted:  '#9c8868',
  textDim:    '#5a5068',
};

function VariantCosmos({ machine = 'sphere' }) {
  const g = useGacha();
  const { state, capsule, result, rolls, startGacha, openCapsule, reset } = g;
  const machineName = machine === 'sphere' ? 'ARMILLARIA' : 'ESENCIA';
  const machineSub  = machine === 'sphere' ? '\u00b7 \u5929\u7403\u5100 \u00b7'   : '\u00b7 \u795e\u7955\u85e5\u74f6 \u00b7';

  const onCrank = () => {
    if (state === 'idle') {
      startGacha();
    } else if (state === 'result') {
      reset();
      setTimeout(startGacha, 320);
    }
  };
  // Close the tarot card without auto-rolling
  const onCloseCard = () => {
    if (state === 'result') reset();
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `
        radial-gradient(ellipse at 50% 30%, ${CP.navySoft} 0%, ${CP.navy} 50%, ${CP.navyDeep} 100%)
      `,
      color: CP.textOnNavy,
      fontFamily: '"Noto Serif TC", serif',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      padding: '16px 14px',
      position: 'relative', overflow: 'hidden',
    }}>
      <StarSpeckle />

      {/* Tarot card outer frame */}
      <TarotFrame>
        {/* Top ornament */}
        <TopOrnament />

        {/* Machine */}
        <div style={{
          width: '100%', display: 'flex', justifyContent: 'center',
          marginTop: 4, position: 'relative', zIndex: 2,
        }}>
          {machine === 'sphere'
            ? <ArmillarySphere spinning={state === 'spinning'} onClick={onCrank}/>
            : <GachaMachine    spinning={state === 'spinning'} onClick={onCrank}/>}
        </div>

        {/* Capsule drop zone */}
        <div style={{
          width: '100%', minHeight: 120,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
          marginTop: 4, position: 'relative', zIndex: 2,
        }}>
          {state === 'idle' && <IdleHint/>}
          {state === 'spinning' && <SpinningHint/>}
          {(state === 'capsule' || state === 'opening') && capsule && (
            <DroppedCapsule
              capsule={capsule}
              opening={state === 'opening'}
              onClick={openCapsule}
              hint={state === 'capsule'}
            />
          )}
        </div>

        {/* Bottom banner */}
        <Banner numeral={String(rolls).padStart(2,'0') || '00'}
                title={machineName} subtitle={machineSub}/>

        {/* Full-card overlay when result */}
        {state === 'result' && result && (
          <TarotCardReveal result={result} onClose={onCloseCard} rolls={rolls}/>
        )}
      </TarotFrame>

      {/* Crank button below frame */}
      <button onClick={onCrank}
        disabled={state === 'spinning' || state === 'capsule' || state === 'opening'}
        style={{
          marginTop: 12,
          background: 'transparent',
          border: `1px solid ${CP.goldDim}`,
          borderRadius: 0,
          padding: '9px 26px',
          color: CP.cream,
          fontFamily: 'inherit',
          fontSize: '0.74rem',
          letterSpacing: '0.4em',
          cursor: state === 'idle' || state === 'result' ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', gap: 14,
          position: 'relative',
          opacity: (state === 'spinning' || state === 'capsule' || state === 'opening') ? 0.4 : 1,
          transition: 'background 0.2s, opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,111,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ color: CP.gold }}>✦</span>
        {state === 'result' ? '\u62bd\u4e0b\u4e00\u5f35' : '\u8f49\u4e00\u9846'}
        <span style={{ color: CP.gold }}>✦</span>
      </button>

      <style>{`
        @keyframes cosmosOrbPulse {
          0%,100% { box-shadow: 0 0 14px var(--orb-glow), inset -6px -8px 14px rgba(0,0,0,0.18), inset 5px 5px 10px rgba(255,255,255,0.5); }
          50%     { box-shadow: 0 0 22px var(--orb-glow), inset -6px -8px 14px rgba(0,0,0,0.18), inset 5px 5px 10px rgba(255,255,255,0.5); }
        }
        @keyframes cosmosDrop {
          0%   { opacity: 0; transform: translateY(-50px) scale(0.55); }
          55%  { transform: translateY(8px) scale(1.06); opacity: 1; }
          78%  { transform: translateY(-3px) scale(0.99); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes cosmosCapsuleOpen {
          0%   { transform: scale(1); opacity: 1; }
          50%  { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(0.5); opacity: 0; }
        }
        @keyframes cosmosCardIn {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.72) rotateY(-70deg); }
          100% { opacity: 1; transform: translate(-50%,-50%) scale(1) rotateY(0deg); }
        }
        @keyframes cosmosTwinkle {
          0%,100% { opacity: 0.15; }
          50%     { opacity: 0.55; }
        }
        @keyframes cosmosRingSpin1 { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes cosmosRingSpin2 { from { transform: rotate(0); } to { transform: rotate(-360deg); } }
        @keyframes cosmosStarBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-2px); }
        }
        @keyframes cosmosFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-3px); }
        }
        @keyframes cosmosHintBlink {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 1; }
        }
        @keyframes cosmosHaloPulse {
          0%   { opacity: 0.5; transform: scale(0.9); }
          50%  { opacity: 1;   transform: scale(1.25); }
          100% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes cosmosCrankTurn {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── Sparse static stars in background ──
function StarSpeckle() {
  const stars = React.useMemo(() => {
    const s = [];
    for (let i = 0; i < 22; i++) {
      s.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 1.4 + 0.5,
        delay: Math.random() * 3.5,
      });
    }
    return s;
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {stars.map((s,i)=>(
        <div key={i} style={{
          position:'absolute', left:`${s.x}%`, top:`${s.y}%`,
          width:s.size, height:s.size, borderRadius:'50%',
          background: CP.cream,
          animation: `cosmosTwinkle 4s ${s.delay}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

// ── Tarot card outer frame with gold ornaments ──
function TarotFrame({ children }) {
  return (
    <div style={{
      width: '100%', maxWidth: 384, aspectRatio: '5/8.6',
      position: 'relative',
      background: `linear-gradient(180deg, ${CP.navy} 0%, ${CP.navyDeep} 100%)`,
      border: `1px solid ${CP.goldDim}`,
      padding: '14px 18px 0',
      boxShadow: `0 8px 28px rgba(0,0,0,0.55), 0 0 0 1px ${CP.navyDeep}, inset 0 0 0 4px ${CP.navyDeep}, inset 0 0 0 5px ${CP.goldDim}66`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', overflow: 'hidden',
      zIndex: 1,
    }}>
      {/* Corner flourishes */}
      <CornerFlourishes/>
      {children}
    </div>
  );
}

function CornerFlourishes() {
  const corner = (rot, x, y) => (
    <svg width="28" height="28" viewBox="0 0 28 28" style={{
      position: 'absolute', [x]: 7, [y]: 7,
      transform: `rotate(${rot}deg)`, zIndex: 3,
    }}>
      <g fill="none" stroke={CP.gold} strokeWidth="0.9" strokeLinecap="round">
        <path d="M 2 14 L 2 2 L 14 2"/>
        <path d="M 6 6 L 6 8 M 8 6 L 6 6"/>
        <circle cx="2" cy="2" r="1.4" fill={CP.gold}/>
        <path d="M 14 2 L 18 2 M 2 14 L 2 18" opacity="0.6"/>
      </g>
    </svg>
  );
  return (
    <>
      {corner(0,   'left',  'top')}
      {corner(90,  'right', 'top')}
      {corner(270, 'left',  'bottom')}
      {corner(180, 'right', 'bottom')}
    </>
  );
}

// ── Top ornament: moon phases ──
function TopOrnament() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 9, marginTop: 6, marginBottom: 4, zIndex: 2,
    }}>
      <svg width="28" height="6" viewBox="0 0 28 6">
        <line x1="0" y1="3" x2="28" y2="3" stroke={CP.goldDim} strokeWidth="0.6"/>
        <circle cx="14" cy="3" r="1.2" fill={CP.gold}/>
      </svg>
      {/* Moon phases */}
      {[
        <circle key="0" cx="6" cy="6" r="4.5" fill="none" stroke={CP.gold} strokeWidth="0.8"/>,
        <g key="1"><circle cx="6" cy="6" r="4.5" fill={CP.gold}/><circle cx="7.5" cy="6" r="4.2" fill={CP.navy}/></g>,
        <circle key="2" cx="6" cy="6" r="4.5" fill={CP.gold}/>,
        <g key="3"><circle cx="6" cy="6" r="4.5" fill={CP.gold}/><circle cx="4.5" cy="6" r="4.2" fill={CP.navy}/></g>,
        <circle key="4" cx="6" cy="6" r="4.5" fill="none" stroke={CP.gold} strokeWidth="0.8"/>,
      ].map((shape, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12">{shape}</svg>
      ))}
      <svg width="28" height="6" viewBox="0 0 28 6">
        <line x1="0" y1="3" x2="28" y2="3" stroke={CP.goldDim} strokeWidth="0.6"/>
        <circle cx="14" cy="3" r="1.2" fill={CP.gold}/>
      </svg>
    </div>
  );
}

// ── Idle / spinning hints ──
function IdleHint() {
  return (
    <div style={{
      textAlign: 'center', marginTop: 16,
      fontSize: '0.7rem', letterSpacing: '0.22em',
      color: CP.textMuted,
      fontFamily: '"Cormorant Garamond", "Noto Serif TC", serif',
      fontStyle: 'italic',
      lineHeight: 1.9,
    }}>
      <div style={{ color: CP.goldDim, fontStyle: 'normal', letterSpacing: '0.3em', fontSize: '0.62rem' }}>· TURN THE DIAL ·</div>
      <div>讓今天的訊息降臨</div>
    </div>
  );
}
function SpinningHint() {
  return (
    <div style={{
      marginTop: 22, display: 'flex', gap: 14, alignItems: 'center',
      animation: 'cosmosHintBlink 1.1s ease-in-out infinite',
    }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          fontSize: 12, color: CP.gold,
          animation: `cosmosStarBob 1.1s ${i*0.18}s ease-in-out infinite`,
        }}>✦</span>
      ))}
    </div>
  );
}

// ── Dropped capsule: orb or stone ──
function DroppedCapsule({ capsule, opening, onClick, hint }) {
  return (
    <>
      <div onClick={opening ? undefined : onClick}
        style={{
          marginTop: 4, cursor: opening ? 'default' : 'pointer',
          animation: opening
            ? 'cosmosCapsuleOpen 0.42s ease-out forwards'
            : 'cosmosDrop 0.55s cubic-bezier(0.22,1,0.36,1) both',
        }}>
        {capsule.type === 'orb'
          ? <OrbCapsule colors={capsule} />
          : <StoneCapsule colors={capsule} />}
      </div>
      {hint && !opening && (
        <div style={{
          fontSize: '0.66rem', color: CP.gold,
          marginTop: 14, letterSpacing: '0.32em',
          fontFamily: 'ui-monospace, "Cormorant Garamond", monospace',
          animation: 'cosmosHintBlink 1.4s ease-in-out infinite',
        }}>· TAP TO REVEAL ·</div>
      )}
    </>
  );
}

function OrbCapsule({ colors }) {
  return (
    <div style={{
      width: 70, height: 70, borderRadius: '50%',
      position: 'relative',
      // Pre-composed gradient + box-shadow only — no filter animation
      background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${colors.top} 28%, ${colors.bot} 75%, ${colors.bot}c0 100%)`,
      ['--orb-glow']: `${colors.top}88`,
      animation: 'cosmosOrbPulse 2.4s ease-in-out infinite, cosmosFloat 3.2s ease-in-out infinite',
    }}>
      <div style={{
        position: 'absolute', top: '24%', left: '28%',
        width: 10, height: 10, borderRadius: '50%',
        background: '#fff', opacity: 0.85,
      }}/>
    </div>
  );
}

function StoneCapsule({ colors }) {
  // Irregular octagon stone with rune etching
  return (
    <div style={{
      width: 76, height: 76, position: 'relative',
      animation: 'cosmosFloat 3.2s ease-in-out infinite',
    }}>
      <svg viewBox="0 0 76 76" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="stoneGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
            <stop offset="0" stopColor={colors.top}/>
            <stop offset="1" stopColor={colors.bot}/>
          </linearGradient>
          <filter id="stoneShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" in="SourceAlpha"/>
            <feOffset dy="3"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Irregular polygon shape */}
        <path
          d="M 38 6 L 60 14 L 72 32 L 68 56 L 54 70 L 32 72 L 12 60 L 6 38 L 14 16 Z"
          fill="url(#stoneGrad)"
          stroke={CP.goldDim} strokeWidth="0.8"
          filter="url(#stoneShadow)"
        />
        {/* Highlight */}
        <path
          d="M 22 22 Q 30 16 42 18"
          stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none" strokeLinecap="round"
        />
        {/* Etched rune */}
        <g stroke={CP.ink} strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
          <line x1="38" y1="28" x2="38" y2="50"/>
          <line x1="30" y1="36" x2="46" y2="36"/>
          <line x1="32" y1="48" x2="44" y2="48"/>
          <circle cx="38" cy="56" r="1.5" fill={CP.ink} stroke="none"/>
        </g>
      </svg>
    </div>
  );
}

// ── Bottom banner ──
function Banner({ numeral, title, subtitle }) {
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: 0, right: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      zIndex: 2,
    }}>
      <svg width="200" height="34" viewBox="0 0 200 34" style={{ marginBottom: 2 }}>
        {/* Ribbon banner — simple stylized */}
        <path d="M 14 8 L 186 8 L 178 22 L 186 32 L 14 32 L 22 22 Z"
              fill={CP.gold} opacity="0.92"/>
        <path d="M 14 8 L 186 8 L 178 22 L 186 32 L 14 32 L 22 22 Z"
              fill="none" stroke={CP.goldDim} strokeWidth="0.6"/>
        <line x1="22" y1="22" x2="178" y2="22" stroke={CP.navyDeep} strokeWidth="0.4" opacity="0.5"/>
        <text x="100" y="17" textAnchor="middle"
              fontFamily="Cormorant Garamond, serif" fontWeight="500"
              fontSize="10" fill={CP.navyDeep} letterSpacing="3">{title}</text>
        <text x="100" y="29" textAnchor="middle"
              fontFamily="Noto Serif TC, serif" fontSize="6" fill={CP.navyDeep} letterSpacing="2">{subtitle}</text>
      </svg>
      <div style={{
        fontSize: '0.6rem', color: CP.goldDim,
        letterSpacing: '0.32em',
        fontFamily: 'ui-monospace, monospace',
      }}>{numeral}</div>
    </div>
  );
}

// ── Tarot card reveal (overlay on machine area) ──
function TarotCardReveal({ result, onClose, rolls }) {
  return (
    <div onClick={onClose}
      style={{
        position: 'absolute', inset: 12, zIndex: 5,
        background: 'rgba(15,20,38,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(2px)',
        cursor: 'pointer',
      }}>
      <div onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '88%', maxWidth: 260, aspectRatio: '5/8',
          background: `linear-gradient(180deg, ${CP.cream} 0%, ${CP.creamDeep} 100%)`,
          border: `1.5px solid ${CP.goldDim}`,
          boxShadow: `0 12px 32px rgba(0,0,0,0.5), inset 0 0 0 3px ${CP.cream}, inset 0 0 0 4px ${CP.gold}88`,
          padding: '16px 14px',
          animation: 'cosmosCardIn 0.5s cubic-bezier(0.34,1.2,0.4,1) both',
          transformStyle: 'preserve-3d',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          cursor: 'default',
          color: CP.ink,
        }}>
        {/* Corner flourishes (ink) */}
        <CardCornerFlourishes/>

        {/* Numeral top */}
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.4em',
          color: CP.goldDim, fontFamily: 'ui-monospace, monospace',
          marginTop: 4,
        }}>· {result.numeral} ·</div>

        {/* Decorative star */}
        <CenterStar/>

        {/* Quote */}
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px 6px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '2.6rem', lineHeight: 0.5,
              color: CP.goldDim, marginBottom: 6,
            }}>&ldquo;</div>
            <div style={{
              fontSize: '0.86rem', lineHeight: 1.85,
              fontWeight: 400, color: CP.ink,
              fontFamily: '"Noto Serif TC", serif',
            }}>{result.text}</div>
            <div style={{
              fontSize: '0.66rem', color: CP.inkSoft,
              fontStyle: 'italic', marginTop: 6,
              fontFamily: '"Cormorant Garamond", serif',
              letterSpacing: '0.08em',
            }}>— {result.source}</div>
          </div>
        </div>

        {/* Banner with title */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <svg width="180" height="26" viewBox="0 0 180 26">
            <path d="M 8 6 L 172 6 L 164 16 L 172 22 L 8 22 L 16 16 Z"
                  fill={CP.gold} opacity="0.95" stroke={CP.goldDim} strokeWidth="0.5"/>
            <text x="90" y="15" textAnchor="middle"
                  fontFamily="Cormorant Garamond, serif" fontWeight="500"
                  fontSize="9" fill={CP.navyDeep} letterSpacing="2.5">{result.title}</text>
          </svg>
        </div>

        <div style={{
          fontSize: '0.56rem', color: CP.goldDim,
          letterSpacing: '0.36em', fontFamily: 'ui-monospace, monospace',
          marginTop: 2,
        }}>N° {String(rolls).padStart(3,'0')}</div>
      </div>
    </div>
  );
}

function CardCornerFlourishes() {
  const corner = (rot, x, y) => (
    <svg width="22" height="22" viewBox="0 0 22 22" style={{
      position:'absolute', [x]:5, [y]:5,
      transform:`rotate(${rot}deg)`,
    }}>
      <g fill="none" stroke={CP.goldDim} strokeWidth="0.7" strokeLinecap="round">
        <path d="M 2 12 L 2 2 L 12 2"/>
        <circle cx="2" cy="2" r="1.2" fill={CP.gold}/>
        <path d="M 5 5 L 5 7 M 7 5 L 5 5" opacity="0.7"/>
      </g>
    </svg>
  );
  return (
    <>
      {corner(0,'left','top')}
      {corner(90,'right','top')}
      {corner(270,'left','bottom')}
      {corner(180,'right','bottom')}
    </>
  );
}

function CenterStar() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" style={{ marginTop: 8, marginBottom: 6 }}>
      <g fill="none" stroke={CP.goldDim} strokeWidth="0.7" strokeLinecap="round">
        {/* radiating rays */}
        {Array.from({length: 12}).map((_,i)=>{
          const a = (i*Math.PI*2)/12;
          const x1 = 28 + Math.cos(a)*9, y1 = 28 + Math.sin(a)*9;
          const x2 = 28 + Math.cos(a)*22, y2 = 28 + Math.sin(a)*22;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={i%2?0.4:0.85}/>;
        })}
        <circle cx="28" cy="28" r="9" fill={CP.cream}/>
      </g>
      {/* central compass star */}
      <g fill={CP.gold} stroke={CP.goldDim} strokeWidth="0.4">
        <path d="M 28 18 L 30 27 L 28 28 L 26 27 Z"/>
        <path d="M 28 38 L 30 29 L 28 28 L 26 29 Z"/>
        <path d="M 18 28 L 27 30 L 28 28 L 27 26 Z"/>
        <path d="M 38 28 L 29 30 L 28 28 L 29 26 Z"/>
      </g>
      <circle cx="28" cy="28" r="1.6" fill={CP.goldDim}/>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// MACHINE A: Armillary sphere (rings always rotate; converge on spin)
// ──────────────────────────────────────────────────────────
function ArmillarySphere({ spinning, onClick }) {
  // Stars inside sphere — random positions; CSS vars carry vector to center
  const innerStars = React.useMemo(() => {
    const out = [];
    const CX = 100, CY = 96;
    for (let i = 0; i < 9; i++) {
      const ang = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
      const r = 24 + Math.random() * 32; // 24..56
      const x = CX + Math.cos(ang) * r;
      const y = CY + Math.sin(ang) * r * 0.85;
      out.push({ x, y, dx: CX - x, dy: CY - y, size: 0.8 + Math.random() * 1.2, delay: Math.random() * 1.6 });
    }
    return out;
  }, []);

  return (
    <svg viewBox="0 0 200 220" width="240" style={{ display: 'block', cursor: 'pointer' }} onClick={onClick}>
      <defs>
        <radialGradient id="armCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CP.cream}/>
          <stop offset="55%" stopColor={CP.gold}/>
          <stop offset="100%" stopColor={CP.goldDim} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="armHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CP.goldBright} stopOpacity="0.6"/>
          <stop offset="60%" stopColor={CP.gold} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={CP.gold} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Pedestal */}
      <ellipse cx="100" cy="206" rx="56" ry="4" fill="#000" opacity="0.45"/>
      <rect x="74" y="190" width="52" height="14" rx="1" fill={CP.navySoft} stroke={CP.goldDim} strokeWidth="0.6"/>
      <rect x="74" y="190" width="52" height="2" fill={CP.gold} opacity="0.7"/>
      <rect x="84" y="176" width="32" height="14" rx="0.5" fill={CP.navy} stroke={CP.goldDim} strokeWidth="0.5"/>

      {/* Pole through center */}
      <line x1="100" y1="16" x2="100" y2="176" stroke={CP.goldDim} strokeWidth="0.7"/>

      {/* Halo behind core — pulses on spin */}
      <circle cx="100" cy="96" r="42" fill="url(#armHalo)"
              opacity={spinning ? 1 : 0.5}
              style={{ transition: 'opacity 0.3s', animation: spinning ? 'cosmosHaloPulse 0.6s ease-out forwards' : 'none' }}/>

      {/* Outer fixed ring (meridian) */}
      <g>
        <ellipse cx="100" cy="96" rx="68" ry="68" fill="none" stroke={CP.gold} strokeWidth="1.4"/>
        <ellipse cx="100" cy="96" rx="68" ry="68" fill="none" stroke={CP.goldDim} strokeWidth="0.4" strokeDasharray="2 4" opacity="0.7"/>
        {/* Degree ticks */}
        {Array.from({length:12}).map((_,i)=>{
          const a = (i*Math.PI*2)/12;
          const r1 = 64, r2 = 68;
          const x1 = 100+Math.cos(a)*r1, y1 = 96+Math.sin(a)*r1;
          const x2 = 100+Math.cos(a)*r2, y2 = 96+Math.sin(a)*r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={CP.gold} strokeWidth="0.6" opacity="0.85"/>;
        })}
      </g>

      {/* Inner ring tilted (ecliptic) — always rotating */}
      <g style={{
        transformOrigin: '100px 96px',
        animation: 'cosmosRingSpin1 14s linear infinite',
      }}>
        <ellipse cx="100" cy="96" rx="60" ry="24" fill="none" stroke={CP.gold} strokeWidth="1"
                 transform="rotate(-20 100 96)"/>
        <ellipse cx="100" cy="96" rx="60" ry="24" fill="none" stroke={CP.goldDim} strokeWidth="0.4"
                 transform="rotate(-20 100 96)" strokeDasharray="3 3"/>
      </g>

      {/* Equatorial ring — always rotating counter */}
      <g style={{
        transformOrigin: '100px 96px',
        animation: 'cosmosRingSpin2 18s linear infinite',
      }}>
        <ellipse cx="100" cy="96" rx="54" ry="16" fill="none" stroke={CP.gold} strokeWidth="1" opacity="0.85"/>
      </g>

      {/* Innermost ring — vertical, always rotating slow */}
      <g style={{
        transformOrigin: '100px 96px',
        animation: 'cosmosRingSpin1 22s linear infinite',
      }}>
        <ellipse cx="100" cy="96" rx="20" ry="46" fill="none" stroke={CP.gold} strokeWidth="0.7" opacity="0.7"/>
      </g>

      {/* Inner star particles — twinkle idle; converge on spin */}
      <g>
        {innerStars.map((s,i)=>(
          <g key={i} style={{
            transform: spinning ? `translate(${s.dx}px,${s.dy}px)` : 'translate(0,0)',
            transformOrigin: `${s.x}px ${s.y}px`,
            transition: spinning ? 'transform 0.55s cubic-bezier(0.5,0,0.8,1)' : 'transform 0.4s ease',
          }}>
            <circle cx={s.x} cy={s.y} r={s.size}
              fill={CP.cream}
              opacity={spinning ? 1 : 0.55}
              style={{ animation: !spinning ? `cosmosTwinkle 2.6s ${s.delay}s ease-in-out infinite` : 'none' }}/>
          </g>
        ))}
      </g>

      {/* Core star — brightens & enlarges on spin */}
      <g style={{
        transformOrigin: '100px 96px',
        animation: 'cosmosStarBob 2.6s ease-in-out infinite',
      }}>
        <circle cx="100" cy="96" r={spinning ? 18 : 14} fill="url(#armCore)"
                style={{ transition: 'r 0.5s ease' }}/>
        <g fill={CP.gold} style={{
          transformOrigin: '100px 96px',
          transform: spinning ? 'scale(1.35)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.5,0,0.5,1.4)',
        }}>
          <path d="M 100 84 L 102 94 L 100 96 L 98 94 Z"/>
          <path d="M 100 108 L 102 98 L 100 96 L 98 98 Z"/>
          <path d="M 88 96 L 98 98 L 100 96 L 98 94 Z"/>
          <path d="M 112 96 L 102 98 L 100 96 L 102 94 Z"/>
        </g>
        <circle cx="100" cy="96" r={spinning ? 3 : 2} fill={CP.cream}
                style={{ transition: 'r 0.4s ease' }}/>
      </g>

      {/* Top finial */}
      <circle cx="100" cy="18" r="2.5" fill={CP.gold}/>
      <line x1="100" y1="20" x2="100" y2="24" stroke={CP.goldDim} strokeWidth="0.6"/>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// MACHINE B: Gashapon machine — glass dome + body + tray + crank
// ──────────────────────────────────────────────────────────
function GachaMachine({ spinning, onClick }) {
  return (
    <svg viewBox="0 0 200 250" width="230" style={{ display: 'block', cursor: 'pointer' }} onClick={onClick}>
      <defs>
        <radialGradient id="domeGlass" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor={CP.gold} stopOpacity="0.04"/>
          <stop offset="60%" stopColor={CP.gold} stopOpacity="0.10"/>
          <stop offset="100%" stopColor={CP.gold} stopOpacity="0.22"/>
        </radialGradient>
        <radialGradient id="domeInner" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#3a4878" stopOpacity="0.5"/>
          <stop offset="100%" stopColor={CP.navyDeep} stopOpacity="0.95"/>
        </radialGradient>
        <radialGradient id="trayGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={CP.gold} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={CP.gold} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="240" rx="70" ry="4" fill="#000" opacity="0.5"/>

      {/* Pedestal base */}
      <rect x="22" y="222" width="156" height="18" rx="2" fill={CP.navySoft} stroke={CP.goldDim} strokeWidth="0.6"/>
      <rect x="22" y="222" width="156" height="2.5" fill={CP.gold} opacity="0.7"/>
      <rect x="22" y="234" width="156" height="2" fill={CP.gold} opacity="0.3"/>

      {/* Main body box */}
      <rect x="32" y="128" width="136" height="94" rx="3"
            fill={CP.navySoft} stroke={CP.gold} strokeWidth="0.9"/>
      {/* Inner panel inset */}
      <rect x="38" y="134" width="124" height="82" rx="2"
            fill="none" stroke={CP.goldDim} strokeWidth="0.4" opacity="0.6"/>

      {/* Decorative rune circle on body front */}
      <g opacity="0.85" transform="translate(100,160)">
        <circle r="22" fill="none" stroke={CP.gold} strokeWidth="0.6"/>
        <circle r="18" fill="none" stroke={CP.goldDim} strokeWidth="0.4" strokeDasharray="2 2"/>
        {/* 8 cardinal marks */}
        {Array.from({length:8}).map((_,i)=>{
          const a = (i*Math.PI*2)/8;
          return <circle key={i}
            cx={Math.cos(a)*22} cy={Math.sin(a)*22}
            r={i%2===0?1.4:0.8} fill={CP.gold}/>;
        })}
        {/* center compass star */}
        <g fill={CP.gold} stroke={CP.goldDim} strokeWidth="0.3">
          <path d="M 0 -10 L 1.6 -1.6 L 0 0 L -1.6 -1.6 Z"/>
          <path d="M 0 10 L 1.6 1.6 L 0 0 L -1.6 1.6 Z"/>
          <path d="M -10 0 L -1.6 1.6 L 0 0 L -1.6 -1.6 Z"/>
          <path d="M 10 0 L 1.6 1.6 L 0 0 L 1.6 -1.6 Z"/>
        </g>
        <circle r="1.4" fill={CP.cream}/>
      </g>

      {/* 取球口 window — brass framed, with subtle glow inside */}
      <g>
        <rect x="62" y="192" width="76" height="24" rx="1.5"
              fill={CP.navyDeep} stroke={CP.gold} strokeWidth="0.7"/>
        <rect x="65" y="195" width="70" height="18" rx="1"
              fill="url(#trayGlow)"/>
        {/* tray lip */}
        <rect x="76" y="216" width="48" height="3" rx="1" fill={CP.gold} opacity="0.55"/>
        {/* tiny label */}
        <text x="100" y="207" textAnchor="middle"
              fontSize="5" fill={CP.goldDim}
              fontFamily="Cormorant Garamond, serif" letterSpacing="2.2">RETIRO</text>
      </g>

      {/* Dome rim ring — separates dome from body */}
      <rect x="36" y="120" width="128" height="10" rx="1"
            fill={CP.gold} opacity="0.92" stroke={CP.goldDim} strokeWidth="0.5"/>
      {/* Knurled ticks on rim */}
      {Array.from({length:24}).map((_,i)=>(
        <line key={i} x1={38+i*5.3} y1="121" x2={38+i*5.3} y2="129"
              stroke={CP.goldDim} strokeWidth="0.3" opacity="0.55"/>
      ))}
      <line x1="36" y1="125" x2="164" y2="125" stroke={CP.navyDeep} strokeWidth="0.3" opacity="0.5"/>

      {/* Glass dome — half-circle on top of rim */}
      <path d="M 36 122 Q 36 50 100 50 Q 164 50 164 122 Z"
            fill="url(#domeInner)" stroke={CP.gold} strokeWidth="1"/>
      {/* Glass overlay highlight */}
      <path d="M 36 122 Q 36 50 100 50 Q 164 50 164 122 Z"
            fill="url(#domeGlass)"/>
      {/* Specular highlight on dome */}
      <path d="M 56 110 Q 50 86 70 64" fill="none"
            stroke={CP.cream} strokeWidth="1.2" opacity="0.32" strokeLinecap="round"/>
      <path d="M 60 78 Q 56 70 66 60" fill="none"
            stroke={CP.cream} strokeWidth="0.6" opacity="0.45" strokeLinecap="round"/>

      {/* Etched rune circle on glass front */}
      <g opacity="0.7" transform="translate(100,86)">
        <circle r="30" fill="none" stroke={CP.gold} strokeWidth="0.5" strokeDasharray="3 2"/>
        <circle r="24" fill="none" stroke={CP.goldDim} strokeWidth="0.4"/>
        {Array.from({length:12}).map((_,i)=>{
          const a = (i*Math.PI*2)/12 - Math.PI/2;
          return <circle key={i}
            cx={Math.cos(a)*30} cy={Math.sin(a)*30}
            r={i%3===0?1.2:0.6} fill={CP.gold}/>;
        })}
      </g>

      {/* Floating contents inside dome — rotates */}
      <g style={{
        transformOrigin: '100px 86px',
        animation: spinning ? 'cosmosRingSpin1 1.6s linear infinite' : 'cosmosRingSpin1 22s linear infinite',
      }}>
        {/* small stars */}
        {[
          {x: 100, y: 76, s: 1.4},
          {x: 84,  y: 86, s: 1.0},
          {x: 116, y: 86, s: 1.0},
          {x: 100, y: 100, s: 1.2},
          {x: 90,  y: 94, s: 0.7},
          {x: 110, y: 76, s: 0.7},
        ].map((st,i)=>(
          <path key={i}
            d={`M ${st.x} ${st.y-st.s*4} L ${st.x+st.s} ${st.y-st.s} L ${st.x+st.s*4} ${st.y} L ${st.x+st.s} ${st.y+st.s} L ${st.x} ${st.y+st.s*4} L ${st.x-st.s} ${st.y+st.s} L ${st.x-st.s*4} ${st.y} L ${st.x-st.s} ${st.y-st.s} Z`}
            fill={CP.gold} opacity="0.9"
          />
        ))}
        {/* moon phase center */}
        <g transform="translate(100,86)">
          <circle r="6" fill={CP.gold} opacity="0.92"/>
          <circle cx="2" r="5.4" fill={CP.navyDeep}/>
        </g>
      </g>

      {/* Top finial */}
      <line x1="100" y1="50" x2="100" y2="42" stroke={CP.gold} strokeWidth="0.8"/>
      <circle cx="100" cy="40" r="2.5" fill={CP.gold}/>
      <circle cx="100" cy="40" r="1" fill={CP.navyDeep}/>

      {/* Side crank — prominent brass handle */}
      <g style={{
        transformOrigin: '180px 170px', cursor: 'pointer',
        animation: spinning ? 'cosmosCrankTurn 0.55s ease-out' : 'none',
      }} onClick={onClick}>
        {/* Shaft into body */}
        <rect x="162" y="167.5" width="10" height="5" fill={CP.gold} opacity="0.85"/>
        {/* Crank arm */}
        <line x1="172" y1="170" x2="186" y2="158" stroke={CP.gold} strokeWidth="2.4" strokeLinecap="round"/>
        <line x1="172" y1="170" x2="186" y2="158" stroke={CP.goldBright} strokeWidth="0.6" strokeLinecap="round" opacity="0.7"/>
        {/* Inner pivot */}
        <circle cx="172" cy="170" r="3" fill={CP.gold} stroke={CP.goldDim} strokeWidth="0.4"/>
        <circle cx="172" cy="170" r="1.2" fill={CP.navyDeep}/>
        {/* Star/floret handle */}
        <g transform="translate(186,158)">
          <path d="M 0 -6 L 1.6 -1.6 L 6 0 L 1.6 1.6 L 0 6 L -1.6 1.6 L -6 0 L -1.6 -1.6 Z"
                fill={CP.gold} stroke={CP.goldDim} strokeWidth="0.4"/>
          <circle r="1.6" fill={CP.cream}/>
        </g>
      </g>

      {/* Small brand plaque on body */}
      <rect x="78" y="192" width="44" height="0" fill="none"/>
    </svg>
  );
}

window.VariantCosmos = VariantCosmos;
