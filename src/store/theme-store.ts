"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const THEME_MODES = ["light", "dark", "system"] as const;
export const THEME_NAMES = ["default", "blue", "green", "purple"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type ThemeName = (typeof THEME_NAMES)[number];

interface ThemeState {
  mode: ThemeMode;
  theme: ThemeName;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: ThemeName) => void;
  reset: () => void;
}

const STORAGE_KEY = "theme-store";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system",
      theme: "default",
      setMode: (mode) => set({ mode }),
      setTheme: (theme) => set({ theme }),
      reset: () => set({ mode: "system", theme: "default" }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode, theme: state.theme }),
      version: 1,
    },
  ),
);
