import type { CarbonHistoryPoint } from "@/types/electricity";

export interface CleanWindowResult {
  startAt: string;
  endAt: string;
  averageIntensity: number;
  emissions: number;
  points: CarbonHistoryPoint[];
}

function average(points: CarbonHistoryPoint[]) {
  return points.reduce((total, point) => total + point.carbonIntensity, 0) / points.length;
}

export function findCleanestWindow(
  points: CarbonHistoryPoint[],
  durationHours: number,
  energyKwh: number,
): CleanWindowResult | null {
  if (!points.length || durationHours < 1 || points.length < durationHours) return null;

  let best: CarbonHistoryPoint[] | null = null;
  let bestAverage = Number.POSITIVE_INFINITY;

  for (let index = 0; index <= points.length - durationHours; index += 1) {
    const window = points.slice(index, index + durationHours);
    const windowAverage = average(window);
    if (windowAverage < bestAverage) {
      bestAverage = windowAverage;
      best = window;
    }
  }

  if (!best) return null;
  const last = best.at(-1)!;
  return {
    startAt: best[0].datetime,
    endAt: last.datetime,
    averageIntensity: Number(bestAverage.toFixed(1)),
    emissions: Number((energyKwh * bestAverage).toFixed(1)),
    points: best,
  };
}

export function calculateCurrentWindow(
  points: CarbonHistoryPoint[],
  durationHours: number,
  energyKwh: number,
): CleanWindowResult | null {
  if (!points.length || points.length < durationHours) return null;
  const window = points.slice(-durationHours);
  const windowAverage = average(window);
  return {
    startAt: window[0].datetime,
    endAt: window.at(-1)!.datetime,
    averageIntensity: Number(windowAverage.toFixed(1)),
    emissions: Number((energyKwh * windowAverage).toFixed(1)),
    points: window,
  };
}
