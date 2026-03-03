import { useMemo, useRef, useEffect, useState } from 'react';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function initPlanets() {
  const rng = seededRandom(777);
  const planets = [];
  const cols = 5, rows = 5;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const r = 3 + rng() * 4;
      const x = (col / cols) * 100 + rng() * 15 + 2;
      const y = 5 + (row / rows) * 85 + rng() * 12;
      const speed = 0.008 + rng() * 0.015;
      const angle = rng() * Math.PI * 2;
      planets.push({
        x, y, r,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        imgSize: r * 1.5,
      });
    }
  }
  return planets;
}

function initStars() {
  const rng = seededRandom(999);
  return Array.from({ length: 120 }, () => ({
    cx: rng() * 100,
    cy: rng() * 100,
    r: 0.15 + rng() * 0.55,
    opacity: 0.3 + rng() * 0.7,
    twinkle: 2 + rng() * 5,
    delay: rng() * 5,
    speed: 40 + rng() * 120,
    startX: rng() * 100,
    driftY: (rng() - 0.5) * 6,
  }));
}

function initShootingStars() {
  const rng = seededRandom(555);
  return Array.from({ length: 3 }, (_, i) => ({
    x1: 10 + rng() * 60,
    y1: 5 + rng() * 30,
    angle: 25 + rng() * 20,
    len: 8 + rng() * 12,
    dur: 2.5 + rng() * 2,
    delay: i * 4 + rng() * 3,
  }));
}

const nebulae = [
  { cx: 20, cy: 30, rx: 18, ry: 12, color: '196,181,253', opacity: 0.06, speed: 200 },
  { cx: 75, cy: 60, rx: 22, ry: 14, color: '245,213,71', opacity: 0.04, speed: 260 },
  { cx: 50, cy: 85, rx: 16, ry: 10, color: '158,206,106', opacity: 0.04, speed: 180 },
];

export default function SpaceBackground() {
  const stars = useMemo(initStars, []);
  const shootingStars = useMemo(initShootingStars, []);
  const planetsRef = useRef(initPlanets());
  const rafRef = useRef(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let frame = 0;
    const step = () => {
      const ps = planetsRef.current;

      // Move planets
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls with extra kick
        const wallBounce = 1.15;
        if (p.x - p.r < 0) { p.x = p.r; p.vx = Math.abs(p.vx) * wallBounce; }
        if (p.x + p.r > 100) { p.x = 100 - p.r; p.vx = -Math.abs(p.vx) * wallBounce; }
        if (p.y - p.r < 0) { p.y = p.r; p.vy = Math.abs(p.vy) * wallBounce; }
        if (p.y + p.r > 100) { p.y = 100 - p.r; p.vy = -Math.abs(p.vy) * wallBounce; }
        // Cap speed after wall bounce too
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 0.12) { p.vx = (p.vx / spd) * 0.12; p.vy = (p.vy / spd) * 0.12; }
      }

      // Collision detection & response
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = a.r + b.r;

          if (dist < minDist && dist > 0) {
            // Normal vector
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate overlapping planets
            const overlap = (minDist - dist) / 2;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            // Relative velocity along normal
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const dvn = dvx * nx + dvy * ny;

            // Only resolve if moving toward each other
            if (dvn > 0) {
              // Mass proportional to radius squared
              const ma = a.r * a.r;
              const mb = b.r * b.r;
              const totalM = ma + mb;

              // Super bouncy collision (restitution > 1)
              const bounce = 1.8;
              const impulse = (dvn * (1 + bounce)) / totalM;

              a.vx -= impulse * mb * nx;
              a.vy -= impulse * mb * ny;
              b.vx += impulse * ma * nx;
              b.vy += impulse * ma * ny;

              // Cap max speed so they don't go nuclear
              const maxV = 0.12;
              for (const p of [a, b]) {
                const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (spd > maxV) { p.vx = (p.vx / spd) * maxV; p.vy = (p.vy / spd) * maxV; }
              }
            }
          }
        }
      }

      frame++;
      // Update React state every 2 frames (~30fps visual updates)
      if (frame % 2 === 0) setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const planets = planetsRef.current;

  return (
    <svg
      className="space-bg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="nebula-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="shoot-glow">
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
        <filter id="planet-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Nebulae */}
      {nebulae.map((n, i) => (
        <ellipse
          key={`neb-${i}`}
          cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry}
          fill={`rgba(${n.color},${n.opacity})`}
          filter="url(#nebula-blur)"
        >
          <animate attributeName="opacity" values={`${n.opacity};${n.opacity * 1.8};${n.opacity}`} dur="8s" begin={`${i * 2}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${n.cx};${n.cx - 30};${n.cx - 60};${n.cx}`} keyTimes="0;0.45;0.9;1" dur={`${n.speed}s`} repeatCount="indefinite" />
        </ellipse>
      ))}

      {/* Stars */}
      {stars.map((s, i) => (
        <circle key={`star-${i}`} r={s.r} fill="#e6e0ff">
          <animate attributeName="opacity" values={`${s.opacity};${s.opacity * 0.3};${s.opacity}`} dur={`${s.twinkle}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${s.startX + 20};${s.startX};${s.startX - 20};${s.startX - 40};${s.startX - 60};${s.startX - 80};${s.startX - 100};${s.startX + 20}`} dur={`${s.speed}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${s.cy};${s.cy + s.driftY * 0.5};${s.cy + s.driftY};${s.cy + s.driftY * 0.5};${s.cy}`} dur={`${s.speed}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Bouncing question planets */}
      {planets.map((q, i) => {
        const imgOff = q.imgSize / 2;
        return (
          <g key={`qp-${i}`} filter="url(#planet-glow)">
            <circle cx={q.x} cy={q.y} r={q.r} fill="#b0c4de" opacity="0.75" />
            <circle cx={q.x} cy={q.y} r={q.r + 1} fill="none" stroke="rgba(200,220,240,0.15)" strokeWidth="0.3" />
            <image
              href="./any-question.png"
              x={q.x - imgOff}
              y={q.y - imgOff * 1.25}
              width={q.imgSize}
              height={q.imgSize * 1.25}
              opacity="0.85"
            />
          </g>
        );
      })}

      {/* Shooting stars */}
      {shootingStars.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const x2 = s.x1 + Math.cos(rad) * s.len;
        const y2 = s.y1 + Math.sin(rad) * s.len;
        return (
          <line
            key={`shoot-${i}`}
            x1={s.x1} y1={s.y1} x2={x2} y2={y2}
            stroke="white" strokeWidth="0.15" strokeLinecap="round"
            filter="url(#shoot-glow)" opacity="0"
          >
            <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.4;0.6;1" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;5,3" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </line>
        );
      })}
    </svg>
  );
}
