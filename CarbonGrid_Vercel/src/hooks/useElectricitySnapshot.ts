"use client";

import { useCallback, useEffect, useState } from "react";

import type { ElectricityApiResponse, ElectricitySnapshot } from "@/types/electricity";

export function useElectricitySnapshot(initialZone = "SV") {
  const [zone, setZone] = useState(initialZone);
  const [data, setData] = useState<ElectricitySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (requestedZone = zone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/electricity/latest?zone=${encodeURIComponent(requestedZone)}`, { cache: "no-store" });
      const payload = (await response.json()) as ElectricityApiResponse;
      if (!response.ok || !payload.ok || !payload.data) throw new Error(payload.error || "No se pudo obtener la información.");
      setData(payload.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [zone]);

  useEffect(() => { void load(zone); }, [load, zone]);

  return { zone, setZone, data, loading, error, refresh: () => load(zone) };
}
