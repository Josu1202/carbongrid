"use client";

import { useMemo } from "react";
import {
  Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { BarChart3, Clock3, Database, Gauge, RefreshCw, Sparkles, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react";

import { zones } from "@/data/zones";
import { useCarbonHistory } from "@/hooks/useCarbonHistory";

function formatHour(value: string) {
  return new Intl.DateTimeFormat("es-SV", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function intensityLabel(value: number) {
  if (value < 100) return "Baja";
  if (value < 300) return "Moderada";
  if (value < 600) return "Alta";
  return "Muy alta";
}

function StatCard({ icon: Icon, label, value, detail, tone }: { icon: typeof TrendingDown; label: string; value: string; detail: string; tone: "cyan" | "yellow" | "blue" }) {
  const toneClass = tone === "cyan" ? "text-cyan-300 bg-cyan-300/[.08] border-cyan-300/15" : tone === "yellow" ? "text-yellow-200 bg-yellow-300/[.08] border-yellow-300/15" : "text-blue-300 bg-blue-400/[.08] border-blue-400/15";
  return (
    <article className="energy-card p-5">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl border ${toneClass}`}><Icon size={20} /></div>
      <p className="mt-5 text-[10px] font-black uppercase tracking-[.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-[-.04em] text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  );
}

export function HistoryDashboard() {
  const { zone, setZone, hours, setHours, data, loading, error, refresh } = useCarbonHistory("SV", 24);

  const chartData = useMemo(() => data?.points.map((point) => ({
    ...point,
    hour: formatHour(point.datetime),
  })) ?? [], [data]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="compact-hero">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hero-chip"><BarChart3 size={14} /> Historical intelligence</span>
            <span className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Observa · compara · detecta patrones</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-[-.04em] text-white sm:text-4xl">La intensidad cambia durante el día.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Explora la evolución reciente, identifica mínimos y máximos y evita interpretar una zona usando solamente un valor aislado.</p>
        </div>

        <div className="zone-control min-w-[320px]">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">Zona</span>
              <select value={zone} onChange={(event) => setZone(event.target.value)} className="electric-select mt-2 w-full">
                {zones.map((item) => <option key={item.code} value={item.code}>{item.name} · {item.code}</option>)}
              </select>
            </label>
            <label>
              <span className="text-[10px] font-black uppercase tracking-[.18em] text-yellow-200">Periodo</span>
              <select value={hours} onChange={(event) => setHours(Number(event.target.value))} className="electric-select mt-2 w-full">
                <option value={12}>Últimas 12 horas</option>
                <option value={24}>Últimas 24 horas</option>
                <option value={48}>Últimas 48 horas</option>
                <option value={72}>Últimas 72 horas</option>
              </select>
            </label>
          </div>
          <button type="button" onClick={refresh} disabled={loading} className="electric-button mt-3 w-full">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> {loading ? "Actualizando" : "Actualizar historial"}
          </button>
        </div>
      </section>

      {error && <div className="alert-card alert-error"><TriangleAlert size={18} />{error}</div>}
      {data?.warning && <div className="alert-card alert-warning"><Database size={18} /><span><strong>Serie de respaldo.</strong> {data.warning}</span></div>}

      {loading && !data ? (
        <div className="grid gap-5 lg:grid-cols-3"><div className="energy-card h-40 animate-pulse" /><div className="energy-card h-40 animate-pulse" /><div className="energy-card h-40 animate-pulse" /></div>
      ) : data && (
        <>
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard icon={TrendingDown} label="Mínimo" value={`${data.stats.minimum} gCO₂eq/kWh`} detail={`Registrado ${formatDateTime(data.stats.minimumAt)}.`} tone="cyan" />
            <StatCard icon={Gauge} label="Promedio" value={`${data.stats.average} gCO₂eq/kWh`} detail={`Nivel ${intensityLabel(data.stats.average).toLowerCase()} durante el periodo.`} tone="blue" />
            <StatCard icon={TrendingUp} label="Máximo" value={`${data.stats.maximum} gCO₂eq/kWh`} detail={`Registrado ${formatDateTime(data.stats.maximumAt)}.`} tone="yellow" />
          </section>

          <section className="energy-card p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-cyan-300">Carbon intensity timeline</p>
                <h2 className="mt-1 text-2xl font-black text-white">Historial de {data.zoneName}</h2>
                <p className="mt-2 text-sm text-slate-500">{data.points.length} observaciones · {data.temporalGranularity}</p>
              </div>
              <div className={data.mode === "live" ? "data-pill data-pill-live" : "data-pill data-pill-demo"}><span className="live-dot" />{data.mode === "live" ? "Historial real" : "Historial demo"}</div>
            </div>

            <div className="mt-7 h-[390px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 12, right: 10, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="historyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.42} /><stop offset="100%" stopColor="#1976ff" stopOpacity={0.02} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,.10)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={28} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={58} />
                  <Tooltip contentStyle={{ background: "#071022", border: "1px solid rgba(34,211,238,.18)", borderRadius: 14, color: "#fff" }} labelFormatter={(_, payload) => payload?.[0]?.payload?.datetime ? formatDateTime(payload[0].payload.datetime) : ""} formatter={(value) => [`${value} gCO₂eq/kWh`, "Intensidad"]} />
                  <ReferenceLine y={data.stats.average} stroke="#facc15" strokeDasharray="6 6" label={{ value: `Promedio ${data.stats.average}`, fill: "#facc15", fontSize: 11, position: "insideTopRight" }} />
                  <Area type="monotone" dataKey="carbonIntensity" stroke="#22d3ee" strokeWidth={3} fill="url(#historyFill)" activeDot={{ r: 6, fill: "#facc15", stroke: "#050816", strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <article className="energy-card p-5 sm:p-6">
              <div className="flex items-center gap-3"><div className="icon-orb"><Clock3 size={20} /></div><div><p className="eyebrow text-cyan-300">Lectura temporal</p><h2 className="mt-1 text-xl font-black text-white">¿Qué aprendemos del historial?</h2></div></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="comparison-stat"><span>Rango observado</span><strong>{data.stats.maximum - data.stats.minimum}</strong></div>
                <div className="comparison-stat"><span>Momento más limpio</span><strong>{formatHour(data.stats.minimumAt)}</strong></div>
                <div className="comparison-stat"><span>Momento más intenso</span><strong>{formatHour(data.stats.maximumAt)}</strong></div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-400">El valor actual puede ser mayor o menor que el promedio. Por eso una decisión responsable debería considerar una serie temporal cuando la actividad pueda cambiar de horario.</p>
            </article>

            <article className="recommendation-card">
              <div className="recommendation-icon"><Sparkles size={23} /></div>
              <p className="eyebrow text-yellow-200">Siguiente decisión posible</p>
              <h2 className="mt-2 text-2xl font-black text-white">La mejor ventana observada comenzó a las {formatHour(data.stats.minimumAt)}.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">Esto no significa que siempre deba esperar hasta esa hora. La viabilidad depende de la actividad, las personas, la disponibilidad y las condiciones operativas.</p>
              <div className="mt-5 rounded-2xl border border-yellow-300/10 bg-yellow-300/[.05] p-4 text-xs leading-6 text-yellow-50/80">Fuente: {data.source}. Los resultados históricos dependen de la cobertura y granularidad disponible para cada zona.</div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
