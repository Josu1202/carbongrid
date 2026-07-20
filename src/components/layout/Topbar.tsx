"use client";

import { Code2, Menu, RadioTower } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[.06] bg-[#050816]/85 backdrop-blur-2xl">
      <div className="flex h-[74px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" onClick={onOpenMenu} className="icon-button" aria-label="Abrir menú"><Menu size={21} /></button>
          <Logo compact />
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300 ring-1 ring-cyan-300/15"><RadioTower size={18} /></div>
          <div><p className="text-sm font-black text-white">Panel energético</p><p className="text-xs text-slate-500">Señales de red, contexto y respaldo automático</p></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><StatusBadge /></div>
          <ThemeToggle />
          <a className="icon-button" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="Abrir GitHub" title="GitHub"><Code2 size={19} /></a>
        </div>
      </div>
    </header>
  );
}
