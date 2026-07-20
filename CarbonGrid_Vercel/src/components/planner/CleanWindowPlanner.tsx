"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, Clock3, Database, Gauge, Leaf, RefreshCw, Sparkles, TimerReset, TriangleAlert, Zap } from "lucide-react";

import { digitalActivities } from "@/data/activities";
import { zones } from "@/data/zones";
import { useCarbonHistory } from "@/hooks/useCarbonHistory";
import { calculateCurrentWindow, findCleanestWindow } from "@/utils/clean-window";

function formatHour(value: string) {
  return new Intl.DateTimeFormat("es-SV", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function CleanWindowPlanner() {
  const { zone, setZone, data, loading, error, refresh } = useCarbonHistory("SV", 72);
  const [activityId, setActivityId] = useState("cloud-backup");
  const [customEnergy, setCustomEnergy] = useState(1);
  const [durationHours, setDurationHours] = useState(2);

  const activity = digitalActivities.find((item) => item.id === activityId) ?? digitalActivities[0];
  const energyKwh = activity.id === "custom" ? Math.max(customEnergy, 0.01) : activity.energyKwh;

  const cleanest = useMemo(
    () => data ? findCleanestWindow(data.points, durationHours, energyKwh) : null,
    [data, durationHours, energyKwh],
  );
  const current = useMemo(
    () => data ? calculateCurrentWindow(data.points, durationHours, energyKwh) : null,
    [data, durationHours, energyKwh],
  );

  const savings = cleanest && current ? Number((current.emissions - cleanest.emissions).toFixed(1)) : 0;
  const savingsPercentage = cleanest && current && current.emissions > 0
    ? Number(((savings / current.emissions) * 100).toFixed(1))
    : 0;

  const chartData = data?.points.map((point) => ({ ...point, hour: formatHour(point.datetime) })) ?? [];
  const flexible = activity.flexible;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="compact-hero">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hero-chip"><CalendarClock size={14} /> Carbon-aware scheduling</span>
            <span className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Observa · programa · reduce</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-[-.04em] text-white sm:text-4xl">Encuentra una ventana energética más limpia.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Compara ejecutar una tarea en el periodo actual frente al intervalo reciente con menor intensidad promedio.</p>
        </div>
        <div className="zone-control min-w-[320px]">
          <label>
            <span className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">Zona eléctrica</span>
            <select value={zone} onChange={(event) => setZone(event.target.value)} className="electric-select mt-2 w-full">
              {zones.map((item) => <option key={item.code} value={item.code}>{item.name} · {item.code}</option>)}
            </select>
          </label>
          <button type="button" onClick={refresh} disabled={loading} className="electric-button mt-3 w-full">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> {loading ? "Actualizando" : "Actualizar análisis"}
          </button>
        </div>
      </section>

      {error && <div className="alert-card alert-error"><TriangleAlert size={18} />{error}</div>}
      {data?.warning && <div className="alert-card alert-warning"><Database size={18} /><span><strong>Datos de respaldo.</strong> {data.warning}</span></div>}

      <section className="grid gap-5 xl:grid-cols-[.82fr_1.18fr]">
        <article className="energy-card p-5 sm:p-6">
          <div className="flex items-center gap-3"><div className="icon-orb icon-orb-yellow"><Zap size={20} /></div><div><p className="eyebrow text-yellow-200">Configuración de tarea</p><h2 className="mt-1 text-xl font-black text-white">Actividad y duración</h2></div></div>
          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-500">Actividad digital</span>
              <select value={activityId} onChange={(event) => setActivityId(event.target.value)} className="electric-select mt-2 w-full">
                {digitalActivities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <div className="rounded-2xl border border-white/[.06] bg-white/[.025] p-4">
              <p className="font-black text-white">{activity.name}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{activity.description}</p>
              <div className="mt-4 flex items-end justify-between gap-4"><span className="text-xs font-bold text-slate-500">Consumo didáctico</span><strong className="text-3xl text-yellow-200">{energyKwh} <small className="text-xs text-slate-500">kWh</small></strong></div>
            </div>
            {activity.id === "custom" && (
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-500">Consumo personalizado (kWh)</span>
                <input type="number" min="0.01" step="0.01" value={customEnergy} onChange={(event) => setCustomEnergy(Number(event.target.value))} className="electric-select mt-2 w-full" />
              </label>
            )}
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-500">Duración de la ventana</span>
              <select value={durationHours} onChange={(event) => setDurationHours(Number(event.target.value))} className="electric-select mt-2 w-full">
                {[1, 2, 3, 4, 6].map((value) => <option key={value} value={value}>{value} {value === 1 ? "hora" : "horas"}</option>)}
              </select>
            </label>
            <div className={flexible ? "data-pill data-pill-live" : "data-pill data-pill-demo"}><span className="live-dot" />{flexible ? "Tarea flexible" : "Tarea con restricciones humanas"}</div>
          </div>
        </article>

        <article className="energy-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="eyebrow text-cyan-300">Resultado comparativo</p><h2 className="mt-1 text-xl font-black text-white">Ahora frente a la mejor ventana observada</h2></div>
            {data && <div className={data.mode === "live" ? "data-pill data-pill-live" : "data-pill data-pill-demo"}><span className="live-dot" />{data.mode === "live" ? "Historial real" : "Historial demo"}</div>}
          </div>

          {loading && !data ? <div className="mt-6 h-64 animate-pulse rounded-3xl bg-white/[.035]" /> : cleanest && current ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="scenario-card">
                <div className="flex items-center justify-between"><div className="scenario-letter"><Clock3 size={17} /></div><span className="data-pill data-pill-demo">Periodo actual</span></div>
                <p className="mt-5 text-sm font-black text-slate-300">Promedio actual</p>
                <strong className="mt-2 block text-4xl font-black tracking-[-.05em] text-white">{current.averageIntensity}</strong>
                <small>gCO₂eq/kWh</small>
                <div className="mt-5 border-t border-white/[.06] pt-5"><span className="scenario-label">Emisiones estimadas</span><strong className="scenario-value">{current.emissions}</strong><small>gCO₂eq</small></div>
              </div>
              <div className="scenario-card scenario-winner">
                <div className="flex items-center justify-between"><div className="scenario-letter"><Leaf size={17} /></div><span className="data-pill data-pill-live">Mejor ventana</span></div>
                <p className="mt-5 text-sm font-black text-slate-300">{formatHour(cleanest.startAt)} – {formatHour(cleanest.endAt)}</p>
                <strong className="mt-2 block text-4xl font-black tracking-[-.05em] text-white">{cleanest.averageIntensity}</strong>
                <small>gCO₂eq/kWh promedio</small>
                <div className="mt-5 border-t border-white/[.06] pt-5"><span className="scenario-label">Emisiones estimadas</span><strong className="scenario-value">{cleanest.emissions}</strong><small>gCO₂eq</small></div>
                <div className="winner-chip"><Sparkles size={13} /> Menor estimación</div>
              </div>
            </div>
          ) : <div className="empty-state">No hay suficientes observaciones para calcular esta duración.</div>}
        </article>
      </section>

      {data && cleanest && current && (
        <>
          <section className="grid gap-5 md:grid-cols-3">
            <article className="energy-card p-5"><div className="icon-orb"><Gauge size={20} /></div><p className="mt-5 eyebrow text-slate-500">Diferencia estimada</p><p className="mt-2 text-3xl font-black text-white">{Math.max(savings, 0)} gCO₂eq</p><p className="mt-2 text-xs text-slate-500">Comparación para {energyKwh} kWh.</p></article>
            <article className="energy-card p-5"><div className="icon-orb"><Leaf size={20} /></div><p className="mt-5 eyebrow text-slate-500">Reducción relativa</p><p className="mt-2 text-3xl font-black text-white">{Math.max(savingsPercentage, 0)}%</p><p className="mt-2 text-xs text-slate-500">Respecto al periodo actual observado.</p></article>
            <article className="energy-card p-5"><div className="icon-orb icon-orb-yellow"><TimerReset size={20} /></div><p className="mt-5 eyebrow text-slate-500">Inicio recomendado</p><p className="mt-2 text-3xl font-black text-white">{formatHour(cleanest.startAt)}</p><p className="mt-2 text-xs text-slate-500">Registrado {formatDateTime(cleanest.startAt)}.</p></article>
          </section>

          <section className="energy-card p-5 sm:p-7">
            <div><p className="eyebrow text-cyan-300">Timeline de decisión</p><h2 className="mt-1 text-2xl font-black text-white">La ventana seleccionada dentro de las últimas 72 horas</h2></div>
            <div className="mt-7 h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 12, right: 10, left: -12, bottom: 0 }}>
                  <defs><linearGradient id="plannerFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.38} /><stop offset="100%" stopColor="#1976ff" stopOpacity={0.02} /></linearGradient></defs>
                  <CartesianGrid stroke="rgba(148,163,184,.10)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={28} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={58} />
                  <Tooltip contentStyle={{ background: "#071022", border: "1px solid rgba(34,211,238,.18)", borderRadius: 14, color: "#fff" }} labelFormatter={(_, payload) => payload?.[0]?.payload?.datetime ? formatDateTime(payload[0].payload.datetime) : ""} formatter={(value) => [`${value} gCO₂eq/kWh`, "Intensidad"]} />
                  <ReferenceArea x1={formatHour(cleanest.startAt)} x2={formatHour(cleanest.endAt)} fill="#facc15" fillOpacity={0.12} stroke="#facc15" strokeOpacity={0.45} />
                  <Area type="monotone" dataKey="carbonIntensity" stroke="#22d3ee" strokeWidth={3} fill="url(#plannerFill)" activeDot={{ r: 6, fill: "#facc15", stroke: "#050816", strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="recommendation-card">
            <div className="recommendation-icon"><Sparkles size={23} /></div>
            <p className="eyebrow text-yellow-200">Recomendación responsable</p>
            <h2 className="mt-2 text-2xl font-black text-white">{flexible ? `Programar la tarea alrededor de las ${formatHour(cleanest.startAt)} reduciría la estimación bajo estos datos.` : "La menor intensidad no justifica mover automáticamente esta actividad."}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{flexible ? `La diferencia estimada es de ${Math.max(savings, 0)} gCO₂eq (${Math.max(savingsPercentage, 0)}%).` : "La actividad involucra personas o condiciones operativas. El horario debe considerar disponibilidad, accesibilidad y propósito antes que una optimización puramente energética."}</p>
            <div className="mt-5 rounded-2xl border border-yellow-300/10 bg-yellow-300/[.05] p-4 text-xs leading-6 text-yellow-50/80">El cálculo utiliza un consumo didáctico de {energyKwh} kWh y el promedio de intensidad de una ventana de {durationHours} {durationHours === 1 ? "hora" : "horas"}. No representa la huella total del servicio digital.</div>
          </section>
        </>
      )}
    </div>
  );
}
