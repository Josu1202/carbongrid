import { getZoneName } from "@/data/zones";
import type { CarbonHistoryPoint, CarbonHistorySeries } from "@/types/electricity";

const zoneProfiles: Record<string, { base: number; amplitude: number; phase: number }> = {
  SV: { base: 158, amplitude: 42, phase: 0.7 },
  CR: { base: 44, amplitude: 18, phase: 1.5 },
  GT: { base: 235, amplitude: 58, phase: 0.2 },
  HN: { base: 190, amplitude: 48, phase: 0.9 },
  NI: { base: 205, amplitude: 55, phase: 1.2 },
  PA: { base: 132, amplitude: 36, phase: 0.4 },
  ES: { base: 118, amplitude: 44, phase: 1.8 },
  FR: { base: 62, amplitude: 21, phase: 0.3 },
  DE: { base: 315, amplitude: 82, phase: 1.1 },
  DK: { base: 96, amplitude: 51, phase: 2.0 },
};

function computeStats(points: CarbonHistoryPoint[]) {
  const minimumPoint = points.reduce((best, point) => point.carbonIntensity < best.carbonIntensity ? point : best, points[0]);
  const maximumPoint = points.reduce((best, point) => point.carbonIntensity > best.carbonIntensity ? point : best, points[0]);
  const average = points.reduce((sum, point) => sum + point.carbonIntensity, 0) / points.length;
  return {
    minimum: minimumPoint.carbonIntensity,
    maximum: maximumPoint.carbonIntensity,
    average: Number(average.toFixed(1)),
    minimumAt: minimumPoint.datetime,
    maximumAt: maximumPoint.datetime,
  };
}

export function getDemoHistory(zoneCode: string, hours = 24): CarbonHistorySeries {
  const profile = zoneProfiles[zoneCode] ?? { base: 210, amplitude: 60, phase: 0.5 };
  const now = new Date();
  now.setMinutes(0, 0, 0);

  const points = Array.from({ length: hours + 1 }, (_, index) => {
    const date = new Date(now.getTime() - (hours - index) * 60 * 60 * 1000);
    const localHour = date.getHours();
    const solarEffect = localHour >= 8 && localHour <= 16 ? -profile.amplitude * Math.sin(((localHour - 8) / 8) * Math.PI) : 0;
    const demandWave = Math.sin((index / 3.2) + profile.phase) * profile.amplitude * 0.34;
    const eveningPeak = localHour >= 18 && localHour <= 21 ? profile.amplitude * 0.45 : 0;
    const value = Math.max(12, Math.round(profile.base + solarEffect + demandWave + eveningPeak));
    return { datetime: date.toISOString(), carbonIntensity: value, isEstimated: true };
  });

  return {
    zoneCode,
    zoneName: getZoneName(zoneCode),
    temporalGranularity: "1 hora",
    points,
    stats: computeStats(points),
    mode: "demo",
    source: "Datos locales de demostración",
    warning: "La serie histórica es demostrativa porque la consulta histórica en vivo no estuvo disponible.",
  };
}
