export interface EmissionComparison {
  emissionsA: number;
  emissionsB: number;
  difference: number;
  percentageDifference: number;
  lowerScenario: "A" | "B" | "equal";
}

export function calculateEmissions(energyKwh: number, carbonIntensity: number): number {
  return Math.max(0, energyKwh) * Math.max(0, carbonIntensity);
}

export function compareEmissions(
  energyKwh: number,
  intensityA: number,
  intensityB: number,
): EmissionComparison {
  const emissionsA = calculateEmissions(energyKwh, intensityA);
  const emissionsB = calculateEmissions(energyKwh, intensityB);
  const difference = Math.abs(emissionsA - emissionsB);
  const highest = Math.max(emissionsA, emissionsB);

  return {
    emissionsA,
    emissionsB,
    difference,
    percentageDifference: highest > 0 ? (difference / highest) * 100 : 0,
    lowerScenario: emissionsA === emissionsB ? "equal" : emissionsA < emissionsB ? "A" : "B",
  };
}
