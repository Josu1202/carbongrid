import { ArrowRightLeft, CalendarClock, History, LayoutDashboard } from "lucide-react";
import type { NavigationItem } from "@/types/dashboard";

export const APP_NAME = "CarbonGrid";
export const APP_VERSION = "Fase 5 · v0.5.0";

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, enabled: true },
  { label: "Comparación", href: "/comparison", icon: ArrowRightLeft, enabled: true },
  { label: "Historial", href: "/history", icon: History, enabled: true },
  { label: "Ventana limpia", href: "/planner", icon: CalendarClock, enabled: true },
];
