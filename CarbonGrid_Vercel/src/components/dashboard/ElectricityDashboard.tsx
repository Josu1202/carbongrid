"use client";

import {
  Activity, ArrowDownToLine, ArrowUpFromLine, Clock3, Database, Leaf,
  RefreshCw, ShieldCheck, Sparkles, TriangleAlert, Zap,
} from "lucide-react";

import { CarbonGauge } from "@/components/dashboard/CarbonGauge";
import { MetricCard } from "@/components/ui/MetricCard";
import { zones } from "@/data/zones";
import { useElectricitySnapshot } from "@/hooks/useElectricitySnapshot";
import type { MetricDefinition } from "@/types/dashboard";

function formatDate(value: string): string {
  if (!value) return "No disponible";
  try {
    return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function mixGradient(index: number) {
  const gradients = [
    "from-blue-600 via-cyan-400 to-cyan-200",
    "from-cyan-500 via-sky-400 to-blue-300",
    "from-yellow-300 via-amber-300 to-orange-300",
    "from-indigo-500 via-blue-500 to-cyan-400",
    "from-emerald-400 via-cyan-400 to-blue-400",
  ];
  return gradients[index % gradients.length];
}

export function ElectricityDashboard() {
  const { zone, setZone, data, loading, error, refresh } = useElectricitySnapshot("SV");

  const metrics: MetricDefinition[] = data ? [
    { id: "renewable", label: "Electricidad renovable", value: `${data.renewablePercentage}%`, description: "Participación renovable en la mezcla eléctrica observada.", icon: Leaf, tone: "green" },
    { id: "carbon-free", label: "Libre de carbono", value: `${data.carbonFreePercentage}%`, description: "Renovables y otras fuentes sin carbono operativo.", icon: ShieldCheck, tone: "cyan" },
    { id: "updated", label: "Estado de la señal", value: data.mode === "live" ? "En vivo" : "Demo", description: formatDate(data.updatedAt || data.datetime), icon: Clock3, tone: "yellow" },
  ] : [];

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="compact-hero">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hero-chip"><Zap size={14} fill="currentColor" /> Electricity intelligence</span>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Monitor · interpreta · decide</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">La red eléctrica, convertida en información clara.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Consulta señales energéticas, identifica la mezcla y conserva un respaldo local para que la demostración continúe incluso cuando falle la conexión.</p>
        </div>

        <div className="zone-control">
          <label htmlFor="zone" className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Zona eléctrica</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select id="zone" value={zone} onChange={(event) => setZone(event.target.value)} className="electric-select">
              {zones.map((item) => <option key={item.code} value={item.code}>{item.name} · {item.code}</option>)}
            </select>
            <button type="button" onClick={refresh} disabled={loading} className="electric-button">
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Consultando" : "Actualizar"}</span>
            </button>
          </div>
        </div>
      </section>

      {error && <div className="alert-card alert-error"><TriangleAlert size={18} />{error}</div>}
      {data?.warning && <div className="alert-card alert-warning"><Database size={18} /><span><strong>Modo de respaldo.</strong> {data.warning}</span></div>}

      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-cyan-300">{data?.zoneName ?? "Cargando zona"}</p>
          <h2 className="mt-1 text-2xl font-black text-white">Estado energético actual</h2>
        </div>
        {data && (
          <div className={data.mode === "live" ? "data-pill data-pill-live" : "data-pill data-pill-demo"}>
            <span className="live-dot" />{data.mode === "live" ? "Datos en vivo" : "Datos demostrativos"}
          </div>
        )}
      </section>

      {loading && !data ? (
        <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
          <div className="energy-card h-80 animate-pulse" /><div className="grid gap-4 sm:grid-cols-3">{[0,1,2].map(i => <div key={i} className="energy-card h-56 animate-pulse" />)}</div>
        </div>
      ) : data && (
        <section className="grid gap-5 xl:grid-cols-[1.1fr_1.45fr]">
          <CarbonGauge value={data.carbonIntensity} />
          <div className="grid gap-4 sm:grid-cols-3">{metrics.map((metric) => <MetricCard key={metric.id} metric={metric} />)}</div>
        </section>
      )}

      {data && (
        <section className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
          <article className="energy-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div><p className="eyebrow text-cyan-300">Electricity mix</p><h2 className="mt-1 text-xl font-black text-white">Mezcla eléctrica</h2></div>
              <div className="icon-orb"><Zap size={20} fill="currentColor" /></div>
            </div>

            {data.mix.length ? (
              <div className="mt-7 space-y-5">
                {data.mix.slice(0, 8).map((item, index) => (
                  <div key={item.source}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="font-bold text-slate-200">{item.source}</span>
                      <span className="font-black text-white">{item.percentage}% <span className="font-semibold text-slate-500">· {item.value.toFixed(0)} MW</span></span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/5">
                      <div className={`h-full rounded-full bg-gradient-to-r ${mixGradient(index)} shadow-[0_0_18px_rgba(34,211,238,.25)] transition-all duration-700`} style={{ width: `${Math.max(item.percentage, 1)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="empty-state">La licencia o zona consultada no devolvió el desglose de generación.</p>}
          </article>

          <article className="energy-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div><p className="eyebrow text-yellow-300">Intercambio regional</p><h2 className="mt-1 text-xl font-black text-white">Flujos eléctricos</h2></div>
              <div className="icon-orb icon-orb-yellow"><Activity size={20} /></div>
            </div>

            <div className="mt-6 space-y-3">
              {data.flows.length ? data.flows.map((flow) => (
                <div key={`${flow.direction}-${flow.zoneCode}`} className="flow-row">
                  <div className={flow.direction === "import" ? "flow-icon flow-import" : "flow-icon flow-export"}>
                    {flow.direction === "import" ? <ArrowDownToLine size={19} /> : <ArrowUpFromLine size={19} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-white">{flow.direction === "import" ? "Importación desde" : "Exportación hacia"} {flow.zoneCode}</p>
                    <p className="mt-1 text-xs text-slate-500">Potencia intercambiada</p>
                  </div>
                  <span className="text-lg font-black text-white">{flow.value.toFixed(0)} <small className="text-xs text-slate-500">MW</small></span>
                </div>
              )) : <p className="empty-state">No hay flujos registrados o disponibles en esta respuesta.</p>}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-cyan-300/[.04] p-4 text-xs leading-5 text-slate-400">
              <div className="mb-2 flex items-center gap-2 font-black text-cyan-200"><Sparkles size={15} /> Transparencia del dato</div>
              Fuente: {data.source}. Granularidad: {data.temporalGranularity}. {data.isEstimated ? "El dato está marcado como estimado." : "No está marcado como estimado."}
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
