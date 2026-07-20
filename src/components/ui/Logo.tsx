import { Zap } from "lucide-react";

import { APP_NAME } from "@/constants/app";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <Zap size={21} fill="currentColor" />
      </div>
      {!compact && (
        <div>
          <p className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
            {APP_NAME}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Electricity Maps Demo</p>
        </div>
      )}
    </div>
  );
}
