"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bolt, Info, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { APP_VERSION, navigationItems } from "@/constants/app";
import { cn } from "@/lib/cn";

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/[.06] bg-[#030612]/95 backdrop-blur-2xl">
      <div className="flex h-[74px] items-center justify-between border-b border-white/[.06] px-5">
        <Logo />
        {mobile && <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar menú"><X size={20} /></button>}
      </div>
      <nav className="flex-1 space-y-2 px-4 py-6" aria-label="Navegación principal">
        <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Navegación</p>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return item.enabled ? (
            <Link key={item.label} href={item.href} onClick={onClose} className={cn("sidebar-link", active && "sidebar-link-active")}><Icon size={18} /><span>{item.label}</span></Link>
          ) : (
            <div key={item.label} className="sidebar-link cursor-not-allowed opacity-45"><Icon size={18} /><span>{item.label}</span><span className="ml-auto rounded-full bg-white/[.05] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">Pronto</span></div>
          );
        })}
      </nav>
    </aside>
  );
}
