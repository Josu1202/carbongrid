import type { LucideIcon } from "lucide-react";

export type MetricTone = "blue" | "green" | "cyan" | "amber";

export interface MetricDefinition {
  id: string;
  label: string;
  value: string;
  unit?: string;
  description: string;
  icon: LucideIcon;
  tone: MetricTone;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
  badge?: string;
}

export interface DemoZoneSummary {
  zoneCode: string;
  zoneName: string;
  carbonIntensity: number;
  renewablePercentage: number;
  carbonFreePercentage: number;
  updatedAt: string;
}
