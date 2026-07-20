import { NextRequest, NextResponse } from "next/server";

import { getDemoHistory } from "@/data/demo-history";
import { getLiveHistory } from "@/services/electricity/server-client";
import type { CarbonHistoryApiResponse } from "@/types/electricity";

function getFriendlyHistoryWarning(error: unknown, zone: string): string {
  if (!(error instanceof Error)) {
    return "La consulta histórica en vivo no estuvo disponible. Se muestran datos demostrativos.";
  }

  if (error.name === "ElectricityMapsHistoryAccessError") {
    return `La licencia actual no incluye el historial en vivo para la zona ${zone}. Se muestran datos demostrativos para conservar el recorrido del taller.`;
  }

  if (error.name === "ElectricityMapsHistoryCoverageError") {
    return `No hay cobertura histórica disponible para la zona ${zone} con la configuración actual. Se muestran datos demostrativos.`;
  }

  if (error.message.includes("API_KEY no está configurada")) {
    return "No se encontró una API key configurada. Se muestran datos demostrativos.";
  }

  return "La consulta histórica en vivo no estuvo disponible. Se muestran datos demostrativos para que la presentación pueda continuar.";
}

export async function GET(request: NextRequest) {
  const zone = request.nextUrl.searchParams.get("zone") || "SV";
  const requestedHours = Number(request.nextUrl.searchParams.get("hours") || 24);
  const hours = [12, 24, 48, 72].includes(requestedHours) ? requestedHours : 24;
  const forcedDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (forcedDemo) {
    return NextResponse.json<CarbonHistoryApiResponse>({
      ok: true,
      data: getDemoHistory(zone, hours),
    });
  }

  try {
    const data = await getLiveHistory(zone, hours);
    return NextResponse.json<CarbonHistoryApiResponse>({ ok: true, data });
  } catch (error) {
    const warning = getFriendlyHistoryWarning(error, zone);
    const demo = getDemoHistory(zone, hours);
    demo.warning = warning;

    return NextResponse.json<CarbonHistoryApiResponse>({
      ok: true,
      data: demo,
      details: error instanceof Error ? error.name : "HistoryFallback",
    });
  }
}
