import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3"
      aria-label="Ir al panel principal de CarbonGrid"
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-xl">
        <Image
          src="/images/carbongrid-logo.png"
          alt="Logo de CarbonGrid"
          fill
          priority
          className="object-cover"
          sizes="40px"
        />
      </div>

      <div className="leading-tight">
        <p className="text-base font-black text-white">
          Carbon<span className="text-cyan-400">Grid</span>
        </p>
        <p className="text-xs text-slate-400">
          Electricity Maps Demo
        </p>
      </div>
    </Link>
  );
}