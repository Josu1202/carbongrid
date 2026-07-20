import type { ZoneOption } from "@/types/electricity";

export const zones: ZoneOption[] = [
  { code: "SV", name: "El Salvador" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panamá" },
  { code: "ES", name: "España" },
  { code: "DK-DK1", name: "Dinamarca occidental" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Alemania" },
  { code: "US-CAL-CISO", name: "California (CISO)" },
];

export function getZoneName(code: string): string {
  return zones.find((zone) => zone.code === code)?.name ?? code;
}
