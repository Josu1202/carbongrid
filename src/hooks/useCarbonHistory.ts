"use client";

import { useCallback, useEffect, useState } from "react";
import type { CarbonHistoryApiResponse, CarbonHistorySeries } from "@/types/electricity";

export function useCarbonHistory(initialZone = "SV", initialHours = 24) {
  const [zone, setZone] = useState(initialZone);
  const [hours, setHours] = useState(initialHours);
  const [data, setData] = useState<CarbonHistorySeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (requestedZone = zone, requestedHours = hours) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/electricity/history?zone=${encodeURIComponent(requestedZone)}&hours=${requestedHours}`, { cache: "no-store" });
      const payload = await response.json() as CarbonHistoryApiResponse;
      if (!response.ok || !payload.ok || !payload.data) throw new Error(payload.error || "No se pudo obtener el historial.");
      setData(payload.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [hours, zone]);

  useEffect(() => { void load(zone, hours); }, [load, zone, hours]);

  return { zone, setZone, hours, setHours, data, loading, error, refresh: () => load(zone, hours) };
}
