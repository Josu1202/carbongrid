import { normalizeElectricitySnapshot } from "@/services/electricity/normalizers";
import type { ElectricitySnapshot } from "@/types/electricity";

const DEFAULT_BASE_URL = "https://api.electricitymap.org/v3";

function buildUrl(path: string, zone: string): string {
  const baseUrl = (process.env.ELECTRICITY_MAPS_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const separator = normalizedPath.includes("?") ? "&" : "?";
  return `${baseUrl}${normalizedPath}${separator}zone=${encodeURIComponent(zone)}`;
}

async function electricityFetch(path: string, zone: string): Promise<unknown> {
  const apiKey = process.env.ELECTRICITY_MAPS_API_KEY?.trim();
  if (!apiKey) throw new Error("ELECTRICITY_MAPS_API_KEY no está configurada.");

  const response = await fetch(buildUrl(path, zone), {
    method: "GET",
    headers: {
      [process.env.ELECTRICITY_MAPS_AUTH_HEADER || "auth-token"]: apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Electricity Maps respondió ${response.status}: ${body.slice(0, 220)}`);
  }

  return response.json();
}

export async function getLiveSnapshot(zone: string): Promise<ElectricitySnapshot> {
  const intensityPath = process.env.ELECTRICITY_MAPS_CARBON_INTENSITY_PATH || "/carbon-intensity/latest";
  const breakdownPath = process.env.ELECTRICITY_MAPS_POWER_BREAKDOWN_PATH || "/power-breakdown/latest";
  const flowsPath = process.env.ELECTRICITY_MAPS_FLOWS_PATH || "/electricity-flows/latest";

  const [intensityPayload, breakdownPayload, flowsResult] = await Promise.all([
    electricityFetch(intensityPath, zone),
    electricityFetch(breakdownPath, zone),
    electricityFetch(flowsPath, zone).catch(() => undefined),
  ]);

  return normalizeElectricitySnapshot({
    zoneCode: zone,
    intensityPayload,
    breakdownPayload,
    flowsPayload: flowsResult,
  });
}
