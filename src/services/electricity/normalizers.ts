import { getZoneName } from "@/data/zones";
import type { ElectricityFlowItem, ElectricityMixItem, ElectricitySnapshot } from "@/types/electricity";

const renewableSources = new Set([
  "biomass", "geothermal", "hydro", "solar", "wind", "hydroelectricity", "geothermalenergy",
]);
const carbonFreeSources = new Set([...renewableSources, "nuclear"]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function firstDataRecord(payload: unknown): Record<string, unknown> {
  const root = asRecord(payload);
  if (Array.isArray(root.data) && root.data.length > 0) return asRecord(root.data[0]);
  return root;
}

function cleanSourceName(source: string): string {
  const labels: Record<string, string> = {
    biomass: "Biomasa", coal: "Carbón", gas: "Gas", geothermal: "Geotérmica", hydro: "Hidroeléctrica",
    nuclear: "Nuclear", oil: "Petróleo", solar: "Solar", wind: "Eólica", unknown: "Desconocida",
  };
  return labels[source.toLowerCase()] ?? source.replace(/([A-Z])/g, " $1").trim();
}

function normalizeMix(payload: unknown): ElectricityMixItem[] {
  const record = firstDataRecord(payload);
  const mixRecord = asRecord(record.powerProductionBreakdown ?? record.powerConsumptionBreakdown ?? record.powerBreakdown ?? record.mix);
  const entries = Object.entries(mixRecord)
    .filter(([, value]) => typeof value === "number" && value > 0)
    .map(([source, value]) => ({ source, value: value as number }));
  const total = entries.reduce((sum, item) => sum + item.value, 0);

  return entries
    .map(({ source, value }) => {
      const normalized = source.toLowerCase().replace(/[^a-z]/g, "");
      return {
        source: cleanSourceName(source),
        value,
        percentage: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
        renewable: renewableSources.has(normalized),
        carbonFree: carbonFreeSources.has(normalized),
      };
    })
    .sort((a, b) => b.value - a.value);
}

function normalizeFlows(payload: unknown): ElectricityFlowItem[] {
  const record = firstDataRecord(payload);
  const imports = asRecord(record.import ?? record.imports);
  const exports = asRecord(record.export ?? record.exports);
  return [
    ...Object.entries(imports).filter(([, v]) => typeof v === "number").map(([zoneCode, value]) => ({ zoneCode, value: value as number, direction: "import" as const })),
    ...Object.entries(exports).filter(([, v]) => typeof v === "number").map(([zoneCode, value]) => ({ zoneCode, value: value as number, direction: "export" as const })),
  ];
}

export function normalizeElectricitySnapshot(args: {
  zoneCode: string;
  intensityPayload: unknown;
  breakdownPayload: unknown;
  flowsPayload?: unknown;
}): ElectricitySnapshot {
  const intensity = firstDataRecord(args.intensityPayload);
  const breakdown = firstDataRecord(args.breakdownPayload);
  const rootIntensity = asRecord(args.intensityPayload);
  const mix = normalizeMix(args.breakdownPayload);

  const renewableFromApi = asNumber(breakdown.renewablePercentage ?? breakdown.renewablePercentageConsumption, NaN);
  const carbonFreeFromApi = asNumber(breakdown.carbonFreePercentage ?? breakdown.fossilFreePercentage, NaN);
  const renewableCalculated = mix.reduce((sum, item) => sum + (item.renewable ? item.percentage : 0), 0);
  const carbonFreeCalculated = mix.reduce((sum, item) => sum + (item.carbonFree ? item.percentage : 0), 0);

  return {
    zoneCode: args.zoneCode,
    zoneName: getZoneName(args.zoneCode),
    carbonIntensity: asNumber(intensity.carbonIntensity ?? intensity.value),
    renewablePercentage: Number((Number.isFinite(renewableFromApi) ? renewableFromApi : renewableCalculated).toFixed(1)),
    carbonFreePercentage: Number((Number.isFinite(carbonFreeFromApi) ? carbonFreeFromApi : carbonFreeCalculated).toFixed(1)),
    datetime: asString(intensity.datetime ?? breakdown.datetime),
    updatedAt: asString(intensity.updatedAt ?? breakdown.updatedAt ?? rootIntensity.updatedAt),
    temporalGranularity: asString(rootIntensity.temporalGranularity ?? asRecord(args.breakdownPayload).temporalGranularity, "latest"),
    isEstimated: Boolean(intensity.isEstimated ?? breakdown.isEstimated ?? false),
    estimationMethod: asString(intensity.estimationMethod ?? breakdown.estimationMethod) || undefined,
    mix,
    flows: args.flowsPayload ? normalizeFlows(args.flowsPayload) : [],
    mode: "live",
    source: "Electricity Maps",
  };
}
