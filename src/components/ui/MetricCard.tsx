import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/cn";
import type { MetricDefinition } from "@/types/dashboard";

const tones = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

export function MetricCard({ metric }: { metric: MetricDefinition }) {
  const Icon = metric.icon;

  return (
    <article className="surface-card group p-5">
      <div className="flex items-start justify-between gap-4">
        <div className={cn("grid h-11 w-11 place-items-center rounded-2xl", tones[metric.tone])}>
          <Icon size={21} />
        </div>
        <ArrowUpRight
          size={18}
          className="text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-slate-600"
        />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {metric.value}
          </span>
          {metric.unit && (
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {metric.unit}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {metric.description}
        </p>
      </div>
    </article>
  );
}
