import Link from "next/link";
import { Info, X } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { APP_VERSION, navigationItems } from "@/constants/app";
import { cn } from "@/lib/cn";

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-18 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
        <Logo />
        {mobile && (
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6" aria-label="Navegación principal">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Navegación
        </p>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return item.enabled ? (
            <Link key={item.label} href={item.href} className="sidebar-link sidebar-link-active">
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          ) : (
            <div key={item.label} className="sidebar-link cursor-not-allowed opacity-55">
              <Icon size={19} />
              <span>{item.label}</span>
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Pronto
              </span>
            </div>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-400/15 dark:bg-blue-500/10">
          <div className="flex gap-3">
            <Info className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-300" size={18} />
            <div>
              <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">Fase inicial</p>
              <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-200/75">
                La integración real con la API se incorporará en la siguiente fase.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 px-2 text-xs text-slate-400">{APP_VERSION}</p>
      </div>
    </aside>
  );
}
