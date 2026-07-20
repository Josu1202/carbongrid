"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Calculator,
  CheckCircle2,
  Database,
  Gauge,
  Info,
  Leaf,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";

import { digitalActivities } from "@/data/activities";
import { zones } from "@/data/zones";
import { useElectricitySnapshot } from "@/hooks/useElectricitySnapshot";
import { compareEmissions } from "@/utils/emissions";

function number(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("es-SV", { maximumFractionDigits }).format(value);
}

function modeLabel(mode?: string) {
  return mode === "live" ? "Dato en vivo" : "Dato demostrativo";
}

export function ComparisonDashboard() {
  const scenarioA = useElectricitySnapshot("SV");
  const scenarioB = useElectricitySnapshot("CR");
  const [activityId, setActivityId] = useState("ai-processing");
  const [customEnergy, setCustomEnergy] = useState(1);

  const activity = digitalActivities.find((item) => item.id === activityId) ?? digitalActivities[0];
  const energyKwh = activity.id === "custom" ? Math.max(0, customEnergy) : activity.energyKwh;

  const comparison = useMemo(() => {
    if (!scenarioA.data || !scenarioB.data) return null;
    return compareEmissions(energyKwh, scenarioA.data.carbonIntensity, scenarioB.data.carbonIntensity);
  }, [energyKwh, scenarioA.data, scenarioB.data]);

  const loading = scenarioA.loading || scenarioB.loading;
  const hasSameZone = scenarioA.zone === scenarioB.zone;
  const lowerData = comparison?.lowerScenario === "A" ? scenarioA.data : comparison?.lowerScenario === "B" ? scenarioB.data : null;

  function refreshBoth() {
    scenarioA.refresh();
    scenarioB.refresh();
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="compact-hero comparison-hero">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hero-chip"><ArrowRightLeft size={14} /> Comparación energética</span>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Mismo consumo · dos redes</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">Compara dónde una actividad tendría una menor estimación eléctrica.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">Selecciona una actividad y dos zonas. CarbonGrid mantendrá el mismo consumo para mostrar cómo cambia el resultado cuando cambia la intensidad de carbono de la red.</p>
        </div>
        <button type="button" className="electric-button min-w-44" onClick={refreshBoth} disabled={loading}>
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          {loading ? "Consultando" : "Actualizar ambas"}
        </button>
      </section>

      {(scenarioA.error || scenarioB.error) && (
        <div className="alert-card alert-error"><TriangleAlert size={18} /><span>{scenarioA.error || scenarioB.error}</span></div>
      )}

      {(scenarioA.data?.warning || scenarioB.data?.warning) && (
        <div className="alert-card alert-warning"><Database size={18} /><span><strong>Modo de respaldo.</strong> Una o ambas zonas utilizan datos locales. Revisa las etiquetas de cada escenario antes de interpretar.</span></div>
      )}

      <section className="energy-card p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_auto_1fr] xl:items-end">
          <ZoneField label="Zona A" value={scenarioA.zone} onChange={scenarioA.setZone} />
          <div className="hidden pb-3 xl:grid"><div className="comparison-vs">VS</div></div>
          <ZoneField label="Zona B" value={scenarioB.zone} onChange={scenarioB.setZone} />
        </div>
        {hasSameZone && <p className="mt-4 flex items-center gap-2 text-sm font-bold text-yellow-200"><Info size={16} /> Selecciona dos zonas diferentes para obtener una comparación útil.</p>}
      </section>

      <section className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <article className="energy-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div><p className="eyebrow text-yellow-300">Supuesto de consumo</p><h2 className="mt-1 text-xl font-black text-white">Actividad digital</h2></div>
            <div className="icon-orb icon-orb-yellow"><Zap size={20} /></div>
          </div>

          <label className="mt-6 block text-xs font-black uppercase tracking-[.14em] text-slate-400" htmlFor="activity">Actividad</label>
          <select id="activity" className="electric-select mt-2 w-full" value={activityId} onChange={(event) => setActivityId(event.target.value)}>
            {digitalActivities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>

          {activity.id === "custom" && (
            <div className="mt-4">
              <label className="block text-xs font-black uppercase tracking-[.14em] text-slate-400" htmlFor="custom-energy">Energía estimada (kWh)</label>
              <input id="custom-energy" className="electric-select mt-2 w-full" type="number" min="0" step="0.01" value={customEnergy} onChange={(event) => setCustomEnergy(Number(event.target.value))} />
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-white/[.06] bg-white/[.025] p-4">
            <p className="text-sm font-black text-white">{activity.name}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{activity.description}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-xs font-bold text-slate-500">Consumo didáctico</span>
              <span className="text-3xl font-black tracking-[-.04em] text-yellow-200">{number(energyKwh, 2)} <small className="text-xs uppercase text-slate-500">kWh</small></span>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Este valor es un supuesto editable para fines educativos; no representa un consumo universal de la actividad.</p>
        </article>

        <article className="energy-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div><p className="eyebrow text-cyan-300">Resultado comparativo</p><h2 className="mt-1 text-xl font-black text-white">Zona A frente a Zona B</h2></div>
            <div className="icon-orb"><Gauge size={20} /></div>
          </div>

          {!scenarioA.data || !scenarioB.data || !comparison ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="h-48 animate-pulse rounded-2xl bg-white/[.035]" /><div className="h-48 animate-pulse rounded-2xl bg-white/[.035]" /></div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ScenarioCard letter="A" data={scenarioA.data} emissions={comparison.emissionsA} winner={comparison.lowerScenario === "A"} />
              <ScenarioCard letter="B" data={scenarioB.data} emissions={comparison.emissionsB} winner={comparison.lowerScenario === "B"} />
            </div>
          )}
        </article>
      </section>

      {scenarioA.data && scenarioB.data && comparison && (
        <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <article className="energy-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div><p className="eyebrow text-cyan-300">Cálculo transparente</p><h2 className="mt-1 text-xl font-black text-white">Cómo se obtuvo el resultado</h2></div>
              <div className="icon-orb"><Calculator size={20} /></div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormulaCard title={`Escenario A · ${scenarioA.data.zoneName}`} energy={energyKwh} intensity={scenarioA.data.carbonIntensity} result={comparison.emissionsA} />
              <FormulaCard title={`Escenario B · ${scenarioB.data.zoneName}`} energy={energyKwh} intensity={scenarioB.data.carbonIntensity} result={comparison.emissionsB} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="comparison-stat"><span>Diferencia absoluta</span><strong>{number(comparison.difference)} gCO₂eq</strong></div>
              <div className="comparison-stat"><span>Reducción frente al resultado mayor</span><strong>{number(comparison.percentageDifference)}%</strong></div>
            </div>
          </article>

          <article className="recommendation-card">
            <div className="recommendation-icon"><Sparkles size={24} /></div>
            <p className="eyebrow text-yellow-200">Recomendación responsable</p>
            <h2 className="mt-2 text-2xl font-black text-white">
              {comparison.lowerScenario === "equal" ? "Ambos escenarios presentan el mismo resultado." : `${lowerData?.zoneName} presenta la menor estimación.`}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {comparison.lowerScenario === "equal"
                ? "Con el consumo y las intensidades observadas no existe diferencia entre las zonas."
                : `Bajo el consumo supuesto de ${number(energyKwh, 2)} kWh, la diferencia estimada es de ${number(comparison.difference)} gCO₂eq (${number(comparison.percentageDifference)}% respecto al resultado mayor).`}
            </p>
            <div className="mt-5 space-y-3">
              <RecommendationLine ok text="La decisión utiliza el mismo consumo en ambos escenarios." />
              <RecommendationLine ok text="La intensidad y la unidad se muestran de forma explícita." />
              <RecommendationLine ok={activity.flexible} text={activity.flexible ? "La actividad puede considerarse flexible para elegir zona u horario." : "La actividad involucra personas; no debería cambiarse solo por el indicador ambiental."} />
            </div>
            <div className="mt-6 rounded-2xl border border-yellow-200/15 bg-yellow-200/[.06] p-4 text-xs leading-5 text-yellow-50/80">
              Esta recomendación no representa la huella total del servicio. Depende del consumo asumido, el momento observado, la cobertura de la API y la calidad de los datos.
            </div>
          </article>
        </section>
      )}
    </div>
  );
}

function ZoneField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">{label}</label>
      <select className="electric-select mt-2 w-full" value={value} onChange={(event) => onChange(event.target.value)}>
        {zones.map((zone) => <option key={zone.code} value={zone.code}>{zone.name} · {zone.code}</option>)}
      </select>
    </div>
  );
}

function ScenarioCard({ letter, data, emissions, winner }: { letter: "A" | "B"; data: NonNullable<ReturnType<typeof useElectricitySnapshot>["data"]>; emissions: number; winner: boolean }) {
  return (
    <div className={`scenario-card ${winner ? "scenario-winner" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="scenario-letter">{letter}</span>
        <span className={data.mode === "live" ? "data-pill data-pill-live" : "data-pill data-pill-demo"}>{modeLabel(data.mode)}</span>
      </div>
      <h3 className="mt-5 text-xl font-black text-white">{data.zoneName}</h3>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div><span className="scenario-label">Intensidad</span><strong className="scenario-value">{number(data.carbonIntensity, 0)}</strong><small>gCO₂eq/kWh</small></div>
        <div><span className="scenario-label">Renovable</span><strong className="scenario-value">{number(data.renewablePercentage, 0)}%</strong><small>de la mezcla</small></div>
      </div>
      <div className="mt-5 border-t border-white/[.07] pt-5">
        <span className="scenario-label">Emisiones estimadas</span>
        <div className="mt-1 flex items-end gap-2"><strong className="text-4xl font-black tracking-[-.05em] text-white">{number(emissions)}</strong><small className="mb-1 text-xs font-black uppercase text-slate-500">gCO₂eq</small></div>
      </div>
      {winner && <div className="winner-chip"><Leaf size={14} /> Menor estimación</div>}
    </div>
  );
}

function FormulaCard({ title, energy, intensity, result }: { title: string; energy: number; intensity: number; result: number }) {
  return (
    <div className="formula-card">
      <p className="text-sm font-black text-white">{title}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-300">
        <span>{number(energy, 2)} kWh</span><span className="formula-symbol">×</span><span>{number(intensity, 0)} gCO₂eq/kWh</span><span className="formula-symbol">=</span><strong className="text-cyan-200">{number(result)} gCO₂eq</strong>
      </div>
    </div>
  );
}

function RecommendationLine({ ok, text }: { ok: boolean; text: string }) {
  return <div className="flex items-start gap-3 text-sm leading-6 text-slate-300">{ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-300" /> : <TriangleAlert size={18} className="mt-0.5 shrink-0 text-yellow-200" />}<span>{text}</span></div>;
}
