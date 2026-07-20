"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("carbongrid-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    setDark(shouldUseDark);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("carbongrid-theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-button"
      aria-label={dark ? "Activar tema claro" : "Activar tema oscuro"}
      title={dark ? "Tema claro" : "Tema oscuro"}
    >
      {!mounted ? <span className="h-5 w-5" /> : dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
