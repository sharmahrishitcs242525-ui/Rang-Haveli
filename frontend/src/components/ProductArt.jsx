import { useId } from 'react';

/*
  Draws every product from its own data (category + pattern + colours), so the
  shop works without photo uploads. Replace with <img src={product.image}> when
  you have real photography.
*/

const FABRIC = ['sarees', 'dupattas'];
const lum = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255;
};
// light items sit on indigo, dark items on warm sand, so every piece stands out
const backdrop = (colors) => (lum(colors[0]) > 0.55 ? '#1d1c4f' : '#e9ddc3');

/* ---------- sarees, dupattas, lehengas ---------- */
function FabricArt({ colors, pattern, uid, lehenga }) {
  const body = colors[0];
  const border = colors[1] || colors[0];
  const accent = colors[2] || '#EBA21C';
  const P = `${uid}-p`, D = `${uid}-d`, C = `${uid}-c`;
  const content = (
    <>
      <rect width="200" height="250" fill={body} />
      {pattern !== 'plain' && <rect width="200" height="250" fill={`url(#${P})`} />}
      {[36, 72, 108, 144, 176].map((x) => (
        <path key={x} d={`M${x} 0C${x + 6} 80 ${x - 6} 160 ${x} 250`} stroke="#000" strokeOpacity="0.07" strokeWidth="8" fill="none" />
      ))}
      <rect width="200" height="12" fill={border} />
      <rect y="12" width="200" height="2" fill={accent} />
      <rect y="172" width="200" height="78" fill={border} />
      <rect y="172" width="200" height="3" fill={accent} />
      <rect y="180" width="200" height="12" fill={`url(#${D})`} />
      <rect y="198" width="200" height="2" fill={accent} />
      <rect y="206" width="200" height="44" fill={body} opacity="0.35" />
      <rect y="236" width="200" height="14" fill={accent} opacity="0.9" />
    </>
  );
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {pattern === 'bandhani' && (
          <pattern id={P} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.8" fill={accent} />
            <circle cx="10.5" cy="10.5" r="1.8" fill={accent} />
            <circle cx="3.5" cy="3.5" r="0.6" fill={body} />
            <circle cx="10.5" cy="10.5" r="0.6" fill={body} />
          </pattern>
        )}
        {pattern === 'leheriya' && (
          <pattern id={P} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
            <rect width="26" height="7" fill={accent} />
            <rect y="11" width="26" height="4" fill={border} />
            <rect y="19" width="26" height="2" fill={accent} />
          </pattern>
        )}
        {pattern === 'kota' && (
          <pattern id={P} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 0H12M0 0V12" stroke={accent} strokeWidth="0.8" opacity="0.7" fill="none" />
            <path d="M0 6H12M6 0V12" stroke={border} strokeWidth="0.4" opacity="0.35" fill="none" />
          </pattern>
        )}
        {pattern === 'blockprint' && (
          <pattern id={P} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M15 4c6 4 6 11 0 16-6-5-6-12 0-16z" fill={border} opacity="0.85" />
            <circle cx="15" cy="13" r="2" fill={accent} />
            <circle cx="0" cy="30" r="3" fill={accent} opacity="0.9" />
            <circle cx="30" cy="30" r="3" fill={accent} opacity="0.9" />
          </pattern>
        )}
        {pattern === 'gotapatti' && (
          <pattern id={P} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M11 0L22 11L11 22L0 11Z" fill="none" stroke={border} strokeWidth="1.6" />
            <circle cx="11" cy="11" r="2" fill={border} />
          </pattern>
        )}
        <pattern id={D} width="16" height="12" patternUnits="userSpaceOnUse">
          <path d="M8 1L14 6L8 11L2 6Z" fill={accent} />
        </pattern>
        <clipPath id={C}>
          <path d="M62 58H138C150 130 185 190 190 232Q100 250 10 232C15 190 50 130 62 58Z" />
        </clipPath>
      </defs>
      {lehenga ? (
        <>
          <g clipPath={`url(#${C})`}>{content}</g>
          <rect x="58" y="50" width="84" height="14" rx="3" fill={accent} stroke={border} strokeWidth="1.5" />
        </>
      ) : content}
    </svg>
  );
}

/* ---------- bangles ---------- */
function BangleArt({ colors, pattern }) {
  const accent = colors[1] || '#EBA21C';
  const stone = colors[2] || '#F6E7C1';
  const glass = pattern === 'glass';
  const dotted = ['lac', 'meenakari', 'kundan'].includes(pattern);
  const rx = 66, ry = 16;
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => {
        const cy = 56 + i * 24;
        return (
          <g key={i}>
            <ellipse cx="100" cy={cy} rx={rx} ry={ry} fill="none" stroke={colors[i % colors.length]} strokeWidth={glass ? 7 : 12} />
            <ellipse cx="100" cy={cy - 2} rx={rx} ry={ry} fill="none" stroke="#fff" strokeOpacity={glass ? 0.45 : 0.22} strokeWidth="2" />
            {dotted && Array.from({ length: 9 }, (_, k) => {
              const t = ((k + 0.5) / 9) * Math.PI;
              const big = pattern === 'kundan';
              return <circle key={k} cx={100 + rx * Math.cos(t)} cy={cy + ry * Math.sin(t)} r={big ? 3.3 : 2.2} fill={k % 2 ? stone : accent} stroke={big ? accent : 'none'} strokeWidth="0.8" />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- earrings ---------- */
function Jhumka({ cx, c0, c1, c2 }) {
  return (
    <g>
      <circle cx={cx} cy="34" r="9" fill={c0} stroke={c1} strokeWidth="1.5" />
      <circle cx={cx} cy="34" r="3.2" fill={c2} />
      <rect x={cx - 2} y="42" width="4" height="14" fill={c1} />
      <path d={`M${cx - 26} 108C${cx - 26} 62 ${cx + 26} 62 ${cx + 26} 108Z`} fill={c0} stroke={c1} strokeWidth="1.5" />
      {[[-12, 96], [0, 88], [12, 96], [-6, 80], [6, 80], [0, 102]].map(([dx, y], i) => <circle key={i} cx={cx + dx} cy={y} r="2.6" fill={i % 2 ? c2 : c1} />)}
      <ellipse cx={cx} cy="108" rx="27" ry="5" fill={c1} />
      {Array.from({ length: 7 }, (_, i) => <circle key={`a${i}`} cx={cx - 21 + i * 7} cy="116" r="3.6" fill="#F6E7C1" stroke={c1} strokeWidth="0.6" />)}
      {Array.from({ length: 5 }, (_, i) => <circle key={`b${i}`} cx={cx - 14 + i * 7} cy="125" r="3.4" fill="#F6E7C1" stroke={c1} strokeWidth="0.6" />)}
      {Array.from({ length: 3 }, (_, i) => <circle key={`c${i}`} cx={cx - 7 + i * 7} cy="134" r="3.2" fill="#F6E7C1" stroke={c1} strokeWidth="0.6" />)}
    </g>
  );
}
function Chandbali({ cx, c0, c1, c2 }) {
  return (
    <g>
      <circle cx={cx} cy="32" r="10" fill={c0} stroke={c1} strokeWidth="1.5" />
      <circle cx={cx} cy="32" r="3.5" fill={c2} />
      <rect x={cx - 2} y="42" width="4" height="22" fill={c1} />
      <path d={`M${cx - 34} 78Q${cx} 160 ${cx + 34} 78Q${cx} 126 ${cx - 34} 78Z`} fill={c0} stroke={c1} strokeWidth="1.5" />
      {Array.from({ length: 7 }, (_, i) => {
        const t = 0.12 + i * 0.12667;
        const x = (1 - t) ** 2 * (cx - 34) + 2 * (1 - t) * t * cx + t ** 2 * (cx + 34);
        const yOuter = (1 - t) ** 2 * 78 + 2 * (1 - t) * t * 160 + t ** 2 * 78;
        const yMid = (1 - t) ** 2 * 78 + 2 * (1 - t) * t * 143 + t ** 2 * 78;
        return (
          <g key={i}>
            <circle cx={x} cy={yMid} r="2.4" fill={c2} />
            <circle cx={x} cy={yOuter + 6} r="3.4" fill="#F6E7C1" stroke={c1} strokeWidth="0.6" />
          </g>
        );
      })}
    </g>
  );
}
function Stud({ cx, c0, c1, c2 }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={cx} cy="105" rx="8" ry="14" transform={`rotate(${i * 45} ${cx} 125)`} fill={c0} stroke={c1} strokeWidth="1.2" />
      ))}
      <circle cx={cx} cy="125" r="12" fill={c2} stroke={c1} strokeWidth="1.5" />
      <circle cx={cx} cy="125" r="4.5" fill={c1} />
    </g>
  );
}
function EarringsArt({ colors, pattern }) {
  const [c0, c1 = '#EBA21C', c2 = '#F6E7C1'] = colors;
  const Piece = pattern === 'chandbali' ? Chandbali : pattern === 'stud' ? Stud : Jhumka;
  const xs = pattern === 'stud' ? [55, 145] : [62, 138];
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g transform="translate(0 30)">
        {xs.map((x) => <Piece key={x} cx={x} c0={c0} c1={c1} c2={c2} />)}
      </g>
    </svg>
  );
}

/* ---------- necklaces ---------- */
function NecklaceArt({ colors }) {
  const [c0, c1 = '#1B7B5A', c2 = '#A8142F'] = colors;
  const bead = (t, x0, y0, cxp, cyp, x1, y1) => [
    (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cxp + t ** 2 * x1,
    (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cyp + t ** 2 * y1,
  ];
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Array.from({ length: 15 }, (_, i) => {
        const [x, y] = bead(i / 14, 24, 40, 100, 235, 176, 40);
        return <circle key={`o${i}`} cx={x} cy={y} r="6" fill={i % 2 ? c1 : c0} stroke={c0} strokeWidth="1" />;
      })}
      {Array.from({ length: 13 }, (_, i) => {
        const [x, y] = bead(i / 12, 44, 40, 100, 185, 156, 40);
        return <circle key={`i${i}`} cx={x} cy={y} r="4" fill="#F6E7C1" stroke={c0} strokeWidth="0.8" />;
      })}
      <path d="M100 118L122 146L100 188L78 146Z" fill={c0} stroke={c1} strokeWidth="2" />
      <path d="M100 130L112 146L100 168L88 146Z" fill={c2} stroke={c1} strokeWidth="1.2" />
      <circle cx="100" cy="146" r="4" fill="#F6E7C1" />
      <circle cx="100" cy="196" r="5" fill="#F6E7C1" stroke={c0} strokeWidth="1" />
    </svg>
  );
}

/* ---------- juttis (top view of a pair of mojari) ---------- */
function JuttiArt({ colors }) {
  const [c0, c1 = '#EBA21C', c2 = '#F6E7C1'] = colors;
  const shoe = (cx, rot) => (
    <g transform={`translate(${cx} 38) rotate(${rot})`}>
      <path d="M0 0C-30 40 -32 105 -23 158Q0 172 23 158C32 105 30 40 0 0Z" fill={c0} stroke={c1} strokeWidth="2.5" />
      <path d="M0 10C-18 44 -20 80 -16 100L16 100C20 80 18 44 0 10Z" fill="none" stroke={c1} strokeWidth="1.5" />
      {[28, 46, 64, 82].map((y, i) => <path key={y} d={`M0 ${y - 9}L${6 + i * 2} ${y}L0 ${y + 9}L${-6 - i * 2} ${y}Z`} fill={c1} />)}
      <circle cx="0" cy="18" r="3" fill={c2} />
      <ellipse cx="0" cy="130" rx="16" ry="19" fill="#000" opacity="0.28" />
      <path d="M-16 112Q0 104 16 112" stroke={c2} strokeWidth="2" fill="none" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {shoe(62, -4)}
      {shoe(138, 4)}
    </svg>
  );
}

/* ---------- potli bag ---------- */
function PotliArt({ colors, uid }) {
  const [c0, c1 = '#EBA21C', c2 = '#F6E7C1'] = colors;
  const P = `${uid}-pt`;
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={P} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.8" fill={c1} />
          <circle cx="11" cy="11" r="1.8" fill={c2} />
        </pattern>
      </defs>
      <path d="M80 100C58 40 142 40 120 100" fill="none" stroke={c1} strokeWidth="5" strokeLinecap="round" />
      <path d="M50 222C26 150 48 104 100 104C152 104 174 150 150 222Z" fill={c0} stroke={c1} strokeWidth="2.5" />
      <path d="M50 222C26 150 48 104 100 104C152 104 174 150 150 222Z" fill={`url(#${P})`} />
      <path d="M62 112Q80 92 100 108Q120 92 138 112Z" fill={c0} stroke={c1} strokeWidth="2" />
      <rect x="44" y="186" width="112" height="8" fill={c1} opacity="0.95" />
      {[[70, 232], [100, 238], [130, 232]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} 222L${x} ${y}`} stroke={c1} strokeWidth="2" />
          <circle cx={x} cy={y + 5} r="6" fill={c1} />
          <circle cx={x} cy={y + 5} r="2.4" fill={c0} />
        </g>
      ))}
    </svg>
  );
}

/* ---------- home decor: blue pottery vase, kathputli puppet ---------- */
function DecorArt({ colors, pattern, uid }) {
  const [c0, c1 = '#1B7B5A', c2 = '#EBA21C'] = colors;
  const V = `${uid}-v`;
  if (pattern === 'puppet') {
    const puppet = (cx, robe, turban) => (
      <g>
        <path d={`M${cx} 18L${cx} 54M${cx - 22} 18L${cx - 14} 70M${cx + 22} 18L${cx + 14} 70`} stroke="#000" strokeOpacity="0.45" strokeWidth="1" />
        <path d={`M${cx - 26} 52Q${cx} 22 ${cx + 26} 52L${cx + 18} 62L${cx - 18} 62Z`} fill={turban} stroke={c2} strokeWidth="1.5" />
        <circle cx={cx} cy="72" r="14" fill="#F3C9A0" stroke="#8a5a3a" strokeWidth="1" />
        <path d={`M${cx - 6} 70h3M${cx + 3} 70h3M${cx - 4} 79Q${cx} 82 ${cx + 4} 79`} stroke="#3a2a22" strokeWidth="1.4" fill="none" />
        <path d={`M${cx - 30} 100L${cx + 30} 100L${cx + 46} 200L${cx - 46} 200Z`} fill={robe} stroke={c2} strokeWidth="2" />
        <path d={`M${cx - 38} 150H${cx + 38}M${cx - 42} 175H${cx + 42}`} stroke={c2} strokeWidth="3" />
        <circle cx={cx} cy="125" r="5" fill={c2} />
        <path d={`M${cx - 14} 200V228M${cx + 14} 200V228`} stroke="#6b4a2c" strokeWidth="6" strokeLinecap="round" />
      </g>
    );
    return (
      <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {puppet(58, c0, c1)}
        {puppet(142, c1, c0)}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <clipPath id={V}>
          <path d="M82 40H118C118 74 156 92 156 150C156 205 128 226 100 226C72 226 44 205 44 150C44 92 82 74 82 40Z" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="232" rx="46" ry="7" fill="#000" opacity="0.18" />
      <g clipPath={`url(#${V})`}>
        <rect width="200" height="250" fill="#FBF8EF" />
        <rect x="0" y="40" width="200" height="14" fill={c0} />
        <rect x="0" y="58" width="200" height="4" fill={c0} />
        <rect x="0" y="196" width="200" height="14" fill={c0} />
        <rect x="0" y="212" width="200" height="4" fill={c0} />
        {[70, 100, 130].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 160V112`} stroke={c1} strokeWidth="2.5" />
            <path d={`M${x} 140Q${x - 16} 134 ${x - 18} 120Q${x - 4} 124 ${x} 140ZM${x} 128Q${x + 16} 122 ${x + 18} 108Q${x + 4} 112 ${x} 128Z`} fill={c1} />
            {Array.from({ length: 6 }, (_, k) => (
              <ellipse key={k} cx={x} cy={96} rx="5" ry="11" transform={`rotate(${k * 60} ${x} 108)`} fill={i === 1 ? c0 : c2} stroke={c0} strokeWidth="1" />
            ))}
            <circle cx={x} cy="108" r="5" fill={c0} />
          </g>
        ))}
        <path d="M150 60C160 110 150 170 140 190" stroke="#fff" strokeOpacity="0.6" strokeWidth="6" fill="none" />
      </g>
      <path d="M82 40H118C118 74 156 92 156 150C156 205 128 226 100 226C72 226 44 205 44 150C44 92 82 74 82 40Z" fill="none" stroke={c0} strokeWidth="2" />
    </svg>
  );
}

export default function ProductArt({ product, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const colors = product.colors?.length ? product.colors : ['#B5122E', '#EBA21C', '#F6E7C1'];
  const { category, pattern } = product;

  let art;
  switch (category) {
    case 'bangles': art = <BangleArt colors={colors} pattern={pattern} />; break;
    case 'earrings': art = <EarringsArt colors={colors} pattern={pattern} />; break;
    case 'necklaces': art = <NecklaceArt colors={colors} />; break;
    case 'juttis': art = <JuttiArt colors={colors} />; break;
    case 'potli-bags': art = <PotliArt colors={colors} uid={uid} />; break;
    case 'home-decor': art = <DecorArt colors={colors} pattern={pattern} uid={uid} />; break;
    case 'lehengas': art = <FabricArt colors={colors} pattern={pattern} uid={uid} lehenga />; break;
    default: art = <FabricArt colors={colors} pattern={pattern} uid={uid} />;
  }
  const bg = FABRIC.includes(category) ? colors[0] : backdrop(colors);
  return <div className={`arch ${className}`} style={{ background: bg }}>{art}</div>;
}
