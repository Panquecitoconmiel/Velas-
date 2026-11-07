import { useMemo, type CSSProperties } from "react";
import type { SeasonId } from "../lib/seasons";

/** Partículas decorativas de la portada: chispas, nieve, pétalos de cempasúchil o corazones. */
const DECOR: Record<SeasonId, { colors: string[]; shape: "spark" | "circle" | "petal" | "heart"; count: number; rise?: boolean }> = {
  BASE: { colors: ["#e3c8ae", "#f3dcc0", "#a77f60"], shape: "circle", count: 26, rise: true },
  NAVIDAD: { colors: ["#efe9d7", "#ffffff", "#cfc7aa"], shape: "circle", count: 46 },
  MUERTOS: { colors: ["#f29e1f", "#f6b13d", "#c2185b"], shape: "petal", count: 28 },
  AMOR: { colors: ["#f39aac", "#ffc2cd", "#ffffff"], shape: "heart", count: 18 },
};

export function SeasonDecor({ id }: { id: SeasonId }) {
  const cfg = DECOR[id];
  const items = useMemo(() => {
    let seed = 11;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: cfg.count }, (_, i) => ({
      left: `${rnd() * 100}%`,
      size: cfg.shape === "circle" ? 2 + rnd() * (cfg.rise ? 4 : 6) : 9 + rnd() * 10,
      duration: `${(cfg.rise ? 7 : 10) + rnd() * 12}s`,
      delay: `${-rnd() * 20}s`,
      deriva: `${(rnd() - 0.5) * 120}px`,
      color: cfg.colors[i % cfg.colors.length],
    }));
  }, [cfg]);
  const shape = (color: string): CSSProperties => {
    if (cfg.shape === "circle") return { background: color, borderRadius: "50%", boxShadow: cfg.rise ? `0 0 8px ${color}` : undefined };
    if (cfg.shape === "petal") return { background: color, borderRadius: "70% 0 70% 0" };
    if (cfg.shape === "heart") return { background: color, clipPath: "path('M5 9 C1 6 0 4 0 2.5 C0 1 1 0 2.5 0 C3.6 0 4.5 0.7 5 1.6 C5.5 0.7 6.4 0 7.5 0 C9 0 10 1 10 2.5 C10 4 9 6 5 9Z')", transform: "scale(1.4)" };
    return { background: color };
  };
  return (
    <div className="temporada-decor" aria-hidden="true">
      {items.map((it, i) => (
        <i key={i} className={cfg.rise ? "sube" : undefined}
          style={{ left: it.left, width: it.size, height: it.size, animationDuration: it.duration, animationDelay: it.delay, ["--deriva" as string]: it.deriva, ...shape(it.color) }} />
      ))}
    </div>
  );
}

/** Copos de nieve que caen por toda la página (temporada de Navidad). Decorativos: no reciben clics. */
export function Snowfall({ count = 46 }: { count?: number }) {
  const flakes = useMemo(() => {
    let seed = 29;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: count }, () => ({
      left: `${rnd() * 100}%`,
      size: 9 + rnd() * 16,
      duration: `${11 + rnd() * 14}s`,
      delay: `${-rnd() * 25}s`,
      deriva: `${(rnd() - 0.5) * 160}px`,
      giro: `${(rnd() > 0.5 ? 1 : -1) * (120 + rnd() * 240)}deg`,
      opacity: 0.55 + rnd() * 0.4,
    }));
  }, [count]);
  return (
    <div className="nieve" aria-hidden="true">
      {flakes.map((f, i) => (
        <svg key={i} viewBox="0 0 24 24" width={f.size} height={f.size}
          style={{ left: f.left, animationDuration: f.duration, animationDelay: f.delay, opacity: f.opacity, ["--deriva" as string]: f.deriva, ["--giro" as string]: f.giro }}>
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
            <path d="M9.5 3.8 12 6l2.5-2.2M9.5 20.2 12 18l2.5 2.2M3.6 10.4l3.2-.9-.8-3.2M20.4 13.6l-3.2.9.8 3.2M3.6 13.6l3.2.9-.8 3.2M20.4 10.4l-3.2-.9.8-3.2" />
          </g>
        </svg>
      ))}
    </div>
  );
}
