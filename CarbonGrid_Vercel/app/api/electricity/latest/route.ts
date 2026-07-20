import { NextRequest, NextResponse } from "next/server";

import { getDemoSnapshot } from "@/data/demo-electricity";
import { zones } from "@/data/zones";
import { getLiveSnapshot } from "@/services/electricity/server-client";
import type { ElectricityApiResponse } from "@/types/electricity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const zone = request.nextUrl.searchParams.get("zone")?.trim() || "SV";
  const forceDemo = request.nextUrl.searchParams.get("demo") === "true";
  const isKnownZone = zones.some((item) => item.code === zone);

  if (!isKnownZone) {
    return NextResponse.json<ElectricityApiResponse>({ ok: false, error: "Zona no permitida." }, { status: 400 });
  }

  if (forceDemo || process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !process.env.ELECTRICITY_MAPS_API_KEY) {
    return NextResponse.json<ElectricityApiResponse>({ ok: true, data: getDemoSnapshot(zone) });
  }

  try {
    const data = await getLiveSnapshot(zone);
    return NextResponse.json<ElectricityApiResponse>({ ok: true, data });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Error desconocido";
    const fallback = getDemoSnapshot(zone);
    fallback.warning = `No fue posible consultar Electricity Maps. Se activaron datos locales. Detalle: ${details}`;
    return NextResponse.json<ElectricityApiResponse>({ ok: true, data: fallback, details });
  }
}
