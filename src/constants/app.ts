import { ArrowRightLeft, BookOpenText, LayoutDashboard } from "lucide-react";

import type { NavigationItem } from "@/types/dashboard";

export const APP_NAME = "CarbonGrid";
export const APP_VERSION = "Fase 3 · v0.3.0";

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, enabled: true },
  { label: "Comparación", href: "/comparison", icon: ArrowRightLeft, enabled: true },
  { label: "Guía del taller", href: "/guide", icon: BookOpenText, enabled: false, badge: "Próximamente" },
];
