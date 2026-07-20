import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "CarbonGrid | Electricity Maps Demo",
  description: "Dashboard educativo para interpretar intensidad de carbono y mezcla eléctrica.",
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem('carbongrid-theme');
    const dark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
