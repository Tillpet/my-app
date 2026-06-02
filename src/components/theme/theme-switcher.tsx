"use client";

import {
  Monitor,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useThemeStore,
  type ThemeMode,
  type ThemeName,
} from "@/store/theme-store";

interface ModeOption {
  value: ThemeMode;
  label: string;
  icon: ReactNode;
}

interface ThemeOption {
  value: ThemeName;
  label: string;
  swatch: string;
}

const MODE_OPTIONS: ModeOption[] = [
  { value: "light", label: "Light", icon: <Sun className="size-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="size-4" /> },
  { value: "system", label: "System", icon: <Monitor className="size-4" /> },
];

const THEME_OPTIONS: ThemeOption[] = [
  { value: "default", label: "Default", swatch: "oklch(0.205 0 0)" },
  { value: "blue", label: "Blue", swatch: "hsl(218 72% 43%)" },
  { value: "green", label: "Green", swatch: "hsl(142.4 76.2% 36.3%)" },
  { value: "purple", label: "Purple", swatch: "hsl(262.1 83.3% 57.8%)" },
];

function findMode(value: ThemeMode): ModeOption {
  return MODE_OPTIONS.find((option) => option.value === value) ?? MODE_OPTIONS[2];
}

function findTheme(value: ThemeName): ThemeOption {
  return (
    THEME_OPTIONS.find((option) => option.value === value) ?? THEME_OPTIONS[0]
  );
}

export function ThemeSwitcher() {
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeStore((state) => state.theme);
  const setMode = useThemeStore((state) => state.setMode);
  const setTheme = useThemeStore((state) => state.setTheme);

  const currentMode = findMode(mode);
  const currentTheme = findTheme(theme);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border bg-popover/80 p-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/60"
      role="group"
      aria-label="Theme switcher"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 rounded-full px-3 text-xs"
            aria-label={`Mode: ${currentMode.label}`}
          >
            {currentMode.icon}
            <span className="hidden sm:inline">{currentMode.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuLabel>Mode</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={mode}
            onValueChange={(value) => setMode(value as ThemeMode)}
          >
            {MODE_OPTIONS.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="gap-2"
              >
                {option.icon}
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenuSeparator className="mx-1 h-5" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 rounded-full px-3 text-xs"
            aria-label={`Theme: ${currentTheme.label}`}
          >
            <span
              aria-hidden
              className="size-3 rounded-full ring-1 ring-border"
              style={{ background: currentTheme.swatch }}
            />
            <Palette className="size-3.5 opacity-70" />
            <span className="hidden sm:inline">{currentTheme.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as ThemeName)}
          >
            {THEME_OPTIONS.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="gap-2"
              >
                <span
                  aria-hidden
                  className="size-3 rounded-full ring-1 ring-border"
                  style={{ background: option.swatch }}
                />
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
