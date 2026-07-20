import Link from "next/link";
import { Bolt, Info, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { APP_VERSION, navigationItems } from "@/constants/app";

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
          return item.enabled ? (
            <Link key={item.label} href={item.href} className="sidebar-link sidebar-link-active"><Icon size={18} /><span>{item.label}</span></Link>
          ) : (
            <div key={item.label} className="sidebar-link cursor-not-allowed opacity-45"><Icon size={18} /><span>{item.label}</span><span className="ml-auto rounded-full bg-white/[.05] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">Pronto</span></div>
          );
        })}
      </nav>
      <div className="p-4">
        <div className="rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/[.08] to-blue-500/[.05] p-4">
          <div className="flex gap-3"><Info className="mt-0.5 shrink-0 text-cyan-300" size={17} /><div><p className="text-sm font-black text-white">Integración protegida</p><p className="mt-1 text-xs leading-5 text-slate-400">La clave permanece en el servidor. Los datos locales sostienen la demostración ante fallos.</p></div></div>
        </div>
        <div className="mt-4 flex items-center justify-between px-2 text-xs text-slate-600"><span>{APP_VERSION}</span><span className="flex items-center gap-1"><Bolt size={12} /> CIIC 2026</span></div>
      </div>
    </aside>
  );
}
