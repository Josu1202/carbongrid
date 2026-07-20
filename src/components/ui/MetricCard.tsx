import { cn } from "@/lib/cn";
import type { MetricDefinition } from "@/types/dashboard";

const tones = {
  blue: "from-blue-500/25 to-blue-400/5 text-blue-200 ring-blue-400/20",
  cyan: "from-cyan-400/25 to-cyan-300/5 text-cyan-200 ring-cyan-300/20",
  yellow: "from-yellow-300/25 to-yellow-200/5 text-yellow-100 ring-yellow-300/20",
  electric: "from-blue-600/35 via-cyan-400/15 to-transparent text-cyan-100 ring-cyan-300/25",
  green: "from-emerald-400/25 to-emerald-300/5 text-emerald-200 ring-emerald-300/20",
  amber: "from-amber-400/25 to-amber-300/5 text-amber-100 ring-amber-300/20",
};

export function MetricCard({ metric }: { metric: MetricDefinition }) {
  const Icon = metric.icon;
  return (
    <article className="energy-card group relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className={cn("grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ring-1", tones[metric.tone])}>
          <Icon size={21} />
        </div>
        <span className="live-dot" aria-hidden="true" />
      </div>
      <div className="mt-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">{metric.label}</p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-4xl font-black tracking-[-0.04em] text-white">{metric.value}</span>
          {metric.unit && <span className="pb-1 text-xs font-bold text-slate-400">{metric.unit}</span>}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">{metric.description}</p>
      </div>
    </article>
  );
}
