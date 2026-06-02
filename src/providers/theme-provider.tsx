"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

const DATA_MODE_ATTR = "data-mode";
const DATA_THEME_ATTR = "data-theme";

function resolveMode(
  mode: "light" | "dark" | "system",
  systemDark: boolean,
): "light" | "dark" {
  if (mode === "system") return systemDark ? "dark" : "light";
  return mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (systemDark: boolean) => {
      const effective = resolveMode(mode, systemDark);
      root.setAttribute(DATA_MODE_ATTR, effective);
      root.setAttribute(DATA_THEME_ATTR, theme);
    };

    apply(mql.matches);

    if (mode === "system") {
      const handler = (event: MediaQueryListEvent) => apply(event.matches);
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
  }, [mode, theme]);

  return <>{children}</>;
}
