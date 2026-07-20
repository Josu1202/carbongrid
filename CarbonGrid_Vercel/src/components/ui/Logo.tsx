import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/constants/app";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3"
      aria-label="Ir al panel principal de CarbonGrid"
    >
      <Image
        src="/images/carbongrid-logo.png"
        alt="Logo de CarbonGrid"
        width={compact ? 38 : 44}
        height={compact ? 38 : 44}
        priority
        className="shrink-0 rounded-full object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.32)]"
      />
      {!compact && (
        <div>
          <p className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
            {APP_NAME}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Electricity Maps Demo</p>
        </div>
      )}
    </Link>
  );
}
