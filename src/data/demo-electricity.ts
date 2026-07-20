import { getZoneName } from "@/data/zones";
import type { ElectricitySnapshot } from "@/types/electricity";

const demoByZone: Record<string, Omit<ElectricitySnapshot, "zoneCode" | "zoneName" | "mode" | "source" | "warning">> = {
  SV: {
    carbonIntensity: 146,
    renewablePercentage: 63,
    carbonFreePercentage: 63,
    datetime: "2026-07-19T23:45:00.000Z",
    updatedAt: "2026-07-20T01:06:01.078Z",
    temporalGranularity: "15 minutos",
    isEstimated: true,
    estimationMethod: "Datos demostrativos basados en una mezcla didáctica",
    mix: [
      { source: "Geotérmica", value: 285, percentage: 24, renewable: true, carbonFree: true },
      { source: "Hidroeléctrica", value: 249, percentage: 21, renewable: true, carbonFree: true },
      { source: "Solar", value: 142, percentage: 12, renewable: true, carbonFree: true },
      { source: "Biomasa", value: 71, percentage: 6, renewable: true, carbonFree: true },
      { source: "Gas y derivados", value: 439, percentage: 37, renewable: false, carbonFree: false },
    ],
    flows: [{ zoneCode: "GT", value: 107, direction: "export" }],
  },
  CR: {
    carbonIntensity: 38,
    renewablePercentage: 94,
    carbonFreePercentage: 94,
    datetime: "2026-07-19T23:45:00.000Z",
    updatedAt: "2026-07-20T01:03:00.000Z",
    temporalGranularity: "15 minutos",
    isEstimated: true,
    estimationMethod: "Escenario local de respaldo",
    mix: [
      { source: "Hidroeléctrica", value: 630, percentage: 55, renewable: true, carbonFree: true },
      { source: "Eólica", value: 218, percentage: 19, renewable: true, carbonFree: true },
      { source: "Geotérmica", value: 172, percentage: 15, renewable: true, carbonFree: true },
      { source: "Solar", value: 57, percentage: 5, renewable: true, carbonFree: true },
      { source: "Térmica", value: 69, percentage: 6, renewable: false, carbonFree: false },
    ],
    flows: [{ zoneCode: "NI", value: 43, direction: "export" }],
  },
};

export function getDemoSnapshot(zoneCode: string): ElectricitySnapshot {
  const fallback = demoByZone.SV;
  const selected = demoByZone[zoneCode] ?? {
    ...fallback,
    carbonIntensity: 212,
    renewablePercentage: 48,
    carbonFreePercentage: 51,
    flows: [],
  };

  return {
    ...selected,
    zoneCode,
    zoneName: getZoneName(zoneCode),
    mode: "demo",
    source: "Datos locales de demostración",
    warning: "La consulta en vivo no está disponible. Estos valores son únicamente para continuar la demostración.",
  };
}
