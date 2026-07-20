import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "CarbonGrid | Electricity Maps Demo",
  description:
    "Dashboard educativo para comparar intensidad de carbono, mezcla eléctrica y emisiones estimadas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
