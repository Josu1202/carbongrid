import { getZoneName } from "@/data/zones";
import type { CarbonHistoryPoint, CarbonHistorySeries } from "@/types/electricity";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function collectRecords(payload: unknown): Record<string, unknown>[] {
  const root = asRecord(payload);
  const candidates = [root.data, root.history, root.values, root.results];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate.map(asRecord);
  }
  return Array.isArray(payload) ? payload.map(asRecord) : [];
}

export function normalizeCarbonHistory(zoneCode: string, payload: unknown): CarbonHistorySeries {
  const root = asRecord(payload);
  const points: CarbonHistoryPoint[] = collectRecords(payload)
    .map((record) => {
      const carbonIntensity = numberValue(record.carbonIntensity ?? record.value ?? record.intensity);
      const datetime = stringValue(record.datetime ?? record.timestamp ?? record.date);
      if (carbonIntensity === null || !datetime) return null;
      return { carbonIntensity, datetime, isEstimated: Boolean(record.isEstimated ?? false) };
    })
    .filter((point): point is CarbonHistoryPoint => point !== null)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  if (!points.length) throw new Error("La respuesta histórica no contenía una serie reconocible.");

  const minimumPoint = points.reduce((best, point) => point.carbonIntensity < best.carbonIntensity ? point : best, points[0]);
  const maximumPoint = points.reduce((best, point) => point.carbonIntensity > best.carbonIntensity ? point : best, points[0]);
  const average = points.reduce((sum, point) => sum + point.carbonIntensity, 0) / points.length;

  return {
    zoneCode,
    zoneName: getZoneName(zoneCode),
    temporalGranularity: stringValue(root.temporalGranularity ?? root.granularity) || "histórico",
    points,
    stats: {
      minimum: minimumPoint.carbonIntensity,
      maximum: maximumPoint.carbonIntensity,
      average: Number(average.toFixed(1)),
      minimumAt: minimumPoint.datetime,
      maximumAt: maximumPoint.datetime,
    },
    mode: "live",
    source: "Electricity Maps",
  };
}
