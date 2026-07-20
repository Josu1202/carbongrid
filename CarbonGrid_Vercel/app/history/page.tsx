import { HistoryDashboard } from "@/components/history";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function HistoryPage() {
  return (
    <DashboardShell>
      <HistoryDashboard />
    </DashboardShell>
  );
}
