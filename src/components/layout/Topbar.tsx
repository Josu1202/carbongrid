"use client";

import { Code2, Menu } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" onClick={onOpenMenu} className="icon-button" aria-label="Abrir menú">
            <Menu size={21} />
          </button>
          <Logo compact />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">Panel energético</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Base visual preparada para Electricity Maps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <StatusBadge />
          </div>
          <ThemeToggle />
          <a
            className="icon-button"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir GitHub"
            title="GitHub"
          >
            <Code2 size={19} />
          </a>
        </div>
      </div>
    </header>
  );
}
