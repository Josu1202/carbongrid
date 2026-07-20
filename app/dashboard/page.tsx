import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardOverview />
    </DashboardShell>
  );
}
