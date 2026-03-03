import { useMemo } from 'react';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function SpaceBackground() {
  const { stars, shootingStars, nebulae, planets } = useMemo(() => {
    const rng = seededRandom(777);

    // Stars get a slow drift — each one scrolls from right to left at its own speed
    const stars = Array.from({ length: 120 }, () => {
      const speed = 40 + rng() * 120; // 40–160s to cross the screen
      const startX = rng() * 100;
      const cy = rng() * 100;
      return {
        cy,
        startX,
        r: 0.15 + rng() * 0.55,
        opacity: 0.3 + rng() * 0.7,
        twinkle: 2 + rng() * 5,
        delay: rng() * 5,
        speed,
        // Drift vertically a little too
        driftY: (rng() - 0.5) * 6,
      };
    });

    const shootingStars = Array.from({ length: 3 }, (_, i) => ({
      x1: 10 + rng() * 60,
      y1: 5 + rng() * 30,
      angle: 25 + rng() * 20,
      len: 8 + rng() * 12,
      dur: 2.5 + rng() * 2,
      delay: i * 4 + rng() * 3,
    }));

    const nebulae = [
      { cx: 20, cy: 30, rx: 18, ry: 12, color: '196,181,253', opacity: 0.06, speed: 200 },
      { cx: 75, cy: 60, rx: 22, ry: 14, color: '245,213,71', opacity: 0.04, speed: 260 },
      { cx: 50, cy: 85, rx: 16, ry: 10, color: '158,206,106', opacity: 0.04, speed: 180 },
    ];

    // Planets drift across the entire viewport
    const planets = [
      { cy: 18, r: 2.5, fill: '#c4b5fd', ring: true, speed: 90, startX: 85, driftY: 8 },
      { cy: 72, r: 1.8, fill: '#f5d547', ring: false, speed: 120, startX: 15, driftY: -5 },
      { cy: 12, r: 1.2, fill: '#f7768e', ring: false, speed: 70, startX: 50, driftY: 10 },
    ];

    return { stars, shootingStars, nebulae, planets };
  }, []);

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
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Nebulae — slowly drift right to left */}
      {nebulae.map((n, i) => (
        <ellipse
          key={`neb-${i}`}
          cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry}
          fill={`rgba(${n.color},${n.opacity})`}
          filter="url(#nebula-blur)"
        >
          <animate
            attributeName="opacity"
            values={`${n.opacity};${n.opacity * 1.8};${n.opacity}`}
            dur="8s"
            begin={`${i * 2}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cx"
            values={`${n.cx};${n.cx - 30};${n.cx - 30 - 30};${n.cx}`}
            keyTimes="0;0.45;0.9;1"
            dur={`${n.speed}s`}
            repeatCount="indefinite"
          />
        </ellipse>
      ))}

      {/* Stars — twinkle AND drift across */}
      {stars.map((s, i) => (
        <circle key={`star-${i}`} r={s.r} fill="#e6e0ff">
          <animate
            attributeName="opacity"
            values={`${s.opacity};${s.opacity * 0.3};${s.opacity}`}
            dur={`${s.twinkle}s`}
            begin={`${s.delay}s`}
            repeatCount="indefinite"
          />
          {/* Horizontal drift: start off-right → cross screen → wrap from right again */}
          <animate
            attributeName="cx"
            values={`${s.startX + 20};${s.startX};${s.startX - 20};${s.startX - 40};${s.startX - 60};${s.startX - 80};${s.startX - 100};${s.startX + 20}`}
            dur={`${s.speed}s`}
            repeatCount="indefinite"
          />
          {/* Gentle vertical drift */}
          <animate
            attributeName="cy"
            values={`${s.cy};${s.cy + s.driftY * 0.5};${s.cy + s.driftY};${s.cy + s.driftY * 0.5};${s.cy}`}
            dur={`${s.speed}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Planets — slow full traversal across the sky */}
      {planets.map((p, i) => (
        <g key={`planet-${i}`}>
          <circle r={p.r} fill={p.fill} opacity="0.8">
            <animate
              attributeName="cx"
              values={`${110};${50};${-10};${110}`}
              keyTimes="0;0.45;0.9;1"
              dur={`${p.speed}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${p.cy};${p.cy + p.driftY};${p.cy};${p.cy}`}
              keyTimes="0;0.5;0.9;1"
              dur={`${p.speed}s`}
              repeatCount="indefinite"
            />
          </circle>
          {p.ring && (
            <ellipse
              rx={p.r * 2} ry={p.r * 0.5}
              fill="none"
              stroke="url(#ring-grad)"
              strokeWidth="0.25"
              opacity="0.6"
            >
              <animate
                attributeName="cx"
                values={`${110};${50};${-10};${110}`}
                keyTimes="0;0.45;0.9;1"
                dur={`${p.speed}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${p.cy};${p.cy + p.driftY};${p.cy};${p.cy}`}
                keyTimes="0;0.5;0.9;1"
                dur={`${p.speed}s`}
                repeatCount="indefinite"
              />
            </ellipse>
          )}
        </g>
      ))}

      {/* Shooting stars */}
      {shootingStars.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const x2 = s.x1 + Math.cos(rad) * s.len;
        const y2 = s.y1 + Math.sin(rad) * s.len;
        return (
          <line
            key={`shoot-${i}`}
            x1={s.x1} y1={s.y1} x2={x2} y2={y2}
            stroke="white"
            strokeWidth="0.15"
            strokeLinecap="round"
            filter="url(#shoot-glow)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0;0.9;0"
              keyTimes="0;0.4;0.6;1"
              dur={`${s.dur}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;5,3"
              dur={`${s.dur}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </line>
        );
      })}
    </svg>
  );
}
