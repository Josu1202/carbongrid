export type DataMode = "live" | "demo";

export interface ElectricityMixItem {
  source: string;
  value: number;
  percentage: number;
  renewable: boolean;
  carbonFree: boolean;
}

export interface ElectricityFlowItem {
  zoneCode: string;
  value: number;
  direction: "import" | "export";
}

export interface ElectricitySnapshot {
  zoneCode: string;
  zoneName: string;
  carbonIntensity: number;
  renewablePercentage: number;
  carbonFreePercentage: number;
  datetime: string;
  updatedAt: string;
  temporalGranularity: string;
  isEstimated: boolean;
  estimationMethod?: string;
  mix: ElectricityMixItem[];
  flows: ElectricityFlowItem[];
  mode: DataMode;
  source: "Electricity Maps" | "Datos locales de demostración";
  warning?: string;
}

export interface ElectricityApiResponse {
  ok: boolean;
  data?: ElectricitySnapshot;
  error?: string;
  details?: string;
}

export interface ZoneOption {
  code: string;
  name: string;
}

export interface CarbonHistoryPoint {
  datetime: string;
  carbonIntensity: number;
  isEstimated: boolean;
}

export interface CarbonHistoryStats {
  minimum: number;
  maximum: number;
  average: number;
  minimumAt: string;
  maximumAt: string;
}

export interface CarbonHistorySeries {
  zoneCode: string;
  zoneName: string;
  temporalGranularity: string;
  points: CarbonHistoryPoint[];
  stats: CarbonHistoryStats;
  mode: DataMode;
  source: "Electricity Maps" | "Datos locales de demostración";
  warning?: string;
}

export interface CarbonHistoryApiResponse {
  ok: boolean;
  data?: CarbonHistorySeries;
  error?: string;
  details?: string;
}
