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
