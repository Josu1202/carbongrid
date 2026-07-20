import { CleanWindowPlanner } from "@/components/planner";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function PlannerPage() {
  return (
    <DashboardShell>
      <CleanWindowPlanner />
    </DashboardShell>
  );
}
