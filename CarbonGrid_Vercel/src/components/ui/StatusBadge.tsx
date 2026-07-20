import { Database } from "lucide-react";

export function StatusBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
      <Database size={14} />
      Modo demostración
    </div>
  );
}
