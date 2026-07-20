import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock3,
  CloudSun,
  Leaf,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { demoMix, demoZone } from "@/data/demo-data";
import type { MetricDefinition } from "@/types/dashboard";

const metrics: MetricDefinition[] = [
  {
    id: "intensity",
    label: "Intensidad de carbono",
    value: String(demoZone.carbonIntensity),
    unit: "gCO₂eq/kWh",
    description: "Emisiones equivalentes asociadas con cada kWh en la zona seleccionada.",
    icon: Activity,
    tone: "blue",
  },
  {
    id: "renewable",
    label: "Electricidad renovable",
    value: `${demoZone.renewablePercentage}%`,
    description: "Participación estimada de fuentes renovables en la mezcla eléctrica.",
    icon: Leaf,
    tone: "green",
  },
  {
    id: "carbon-free",
    label: "Libre de carbono",
    value: `${demoZone.carbonFreePercentage}%`,
    description: "Electricidad procedente de tecnologías de baja emisión operativa.",
    icon: ShieldCheck,
    tone: "cyan",
  },
  {
    id: "updated",
    label: "Actualización",
    value: "Demo",
    description: "En la Fase 2 se mostrará la fecha y condición real proporcionada por la API.",
    icon: Clock3,
    tone: "amber",
  },
];

export function DashboardOverview() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="hero-panel overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="sm:hidden">
            <StatusBadge />
          </div>
          <p className="eyebrow mt-4 sm:mt-0">Sostenibilidad digital</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Convierte datos eléctricos en decisiones comprensibles.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Esta primera versión establece el diseño, la navegación y los componentes que recibirán los datos de Electricity Maps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="hero-chip">
              <Zap size={16} /> {demoZone.zoneName} · {demoZone.zoneCode}
            </div>
            <div className="hero-chip">
              <CloudSun size={16} /> Información demostrativa
            </div>
          </div>
        </div>
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-blue-600 dark:text-blue-400">Resumen de la zona</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">Indicadores principales</h2>
          </div>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">{demoZone.updatedAt}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-blue-600 dark:text-blue-400">Electricity mix</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">Mezcla eléctrica</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <BarChart3 size={20} />
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {demoMix.map((item) => (
              <div key={item.source}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.source}</span>
                  <span className="font-bold text-slate-950 dark:text-white">{item.percentage}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Distribución ficticia incluida únicamente para validar la interfaz. Será sustituida por la respuesta real del endpoint correspondiente.
          </p>
        </article>

        <article className="surface-card flex flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-violet-600 dark:text-violet-400">Siguiente paso</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">Comparación energética</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="my-7 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-300">
              <BarChart3 size={25} />
            </div>
            <p className="mt-4 font-semibold text-slate-950 dark:text-white">Comparador preparado</p>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Aquí aparecerán la Zona A, la Zona B, las emisiones calculadas y su diferencia.
            </p>
          </div>

          <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white dark:bg-blue-600">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 shrink-0 text-cyan-300" size={19} />
              <div>
                <p className="text-sm font-semibold">Recomendación pendiente</p>
                <p className="mt-1 text-xs leading-5 text-slate-300 dark:text-blue-100">
                  Se generará con datos, supuestos y limitaciones visibles; nunca como una orden absoluta.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <Zap size={23} />
          </div>
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">Base de la Fase 1 completada</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Incluye layout adaptable, navegación, tema claro/oscuro, componentes reutilizables y datos locales de demostración.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white sm:self-auto">
          Próxima fase <ArrowRight size={17} />
        </div>
      </section>
    </div>
  );
}
