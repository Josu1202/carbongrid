import { Zap } from "lucide-react";

function getGaugeMeta(value: number) {
  if (value <= 100) return { label: "Muy baja", color: "#4ade80", description: "Red con intensidad muy baja" };
  if (value <= 250) return { label: "Baja", color: "#22d3ee", description: "Red con intensidad baja" };
  if (value <= 500) return { label: "Media", color: "#facc15", description: "Red con intensidad moderada" };
  if (value <= 750) return { label: "Alta", color: "#fb923c", description: "Red con intensidad alta" };
  return { label: "Muy alta", color: "#fb7185", description: "Red con intensidad muy alta" };
}

export function CarbonGauge({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 1000);
  const progress = clamped / 10;
  const meta = getGaugeMeta(value);

  return (
    <article className="energy-card carbon-signal-card relative overflow-hidden p-6 sm:p-7">
      <div className="carbon-glow" aria-hidden="true" />

      <div className="relative flex flex-col gap-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-cyan-300">Señal principal</p>
            <h2 className="mt-1 text-xl font-black text-white">Intensidad de carbono</h2>
            <p className="mt-2 text-sm text-slate-400">Emisiones equivalentes asociadas a cada kWh de electricidad.</p>
          </div>
          <div className="icon-orb"><Zap size={20} fill="currentColor" /></div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[auto_1fr] lg:items-end">
          <div>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-black tracking-[-0.07em] text-white sm:text-7xl">{Math.round(value)}</span>
              <span className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">gCO₂eq/kWh</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black" style={{ borderColor: `${meta.color}55`, backgroundColor: `${meta.color}14`, color: meta.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color, boxShadow: `0 0 14px ${meta.color}` }} />
                Intensidad {meta.label.toLowerCase()}
              </span>
              <span className="text-xs font-semibold text-slate-500">{meta.description}</span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="relative h-5 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/5">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#4ade80_0%,#22d3ee_25%,#facc15_50%,#fb923c_75%,#fb7185_100%)] opacity-90" />
              <div className="absolute inset-y-[-5px] w-1 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,.95)] transition-all duration-700" style={{ left: `calc(${progress}% - 2px)` }} />
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <span>Limpia</span><span>Moderada</span><span>Intensa</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-500">
              <div className="rounded-xl bg-white/[.025] px-2 py-2">0–250</div>
              <div className="rounded-xl bg-white/[.025] px-2 py-2">251–500</div>
              <div className="rounded-xl bg-white/[.025] px-2 py-2">501–1000</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
