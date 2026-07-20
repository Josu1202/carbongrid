import type { DemoZoneSummary } from "@/types/dashboard";

export const demoZone: DemoZoneSummary = {
  zoneCode: "SV",
  zoneName: "El Salvador",
  carbonIntensity: 146,
  renewablePercentage: 63,
  carbonFreePercentage: 63,
  updatedAt: "Dato demostrativo",
};

export const demoMix = [
  { source: "Geotérmica", percentage: 24 },
  { source: "Hidroeléctrica", percentage: 21 },
  { source: "Solar", percentage: 12 },
  { source: "Biomasa", percentage: 6 },
  { source: "Térmica y otras", percentage: 37 },
];
