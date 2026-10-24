"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppTheme, AppDensity, AppAccent, DefaultView } from "@/types/database";
import { updateUserPreferencesAction } from "@/app/actions/preferences";

interface ThemeContextType {
  theme: AppTheme;
  density: AppDensity;
  accent: AppAccent;
  defaultView: DefaultView;
  setTheme: (theme: AppTheme) => void;
  setDensity: (density: AppDensity) => void;
  setAccent: (accent: AppAccent) => void;
  setDefaultView: (view: DefaultView) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  density: "comfortable",
  accent: "indigo",
  defaultView: "today",
  setTheme: () => {},
  setDensity: () => {},
  setAccent: () => {},
  setDefaultView: () => {},
});

export function ThemeProvider({
  children,
  initialTheme = "system",
  initialDensity = "comfortable",
  initialAccent = "indigo",
  initialDefaultView = "today",
}: {
  children: React.ReactNode;
  initialTheme?: AppTheme;
  initialDensity?: AppDensity;
  initialAccent?: AppAccent;
  initialDefaultView?: DefaultView;
}) {
  const [theme, setThemeState] = useState<AppTheme>(initialTheme);
  const [density, setDensityState] = useState<AppDensity>(initialDensity);
  const [accent, setAccentState] = useState<AppAccent>(initialAccent);
  const [defaultView, setDefaultViewState] = useState<DefaultView>(initialDefaultView);

  useEffect(() => {
    const root = document.documentElement;

    // Apply Theme
    if (theme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", systemDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }

    // Apply Accent
    root.setAttribute("data-accent", accent);

    // Apply Density
    root.setAttribute("data-density", density);
  }, [theme, density, accent]);

  function setTheme(newTheme: AppTheme) {
    setThemeState(newTheme);
    updateUserPreferencesAction({ theme: newTheme });
  }

  function setDensity(newDensity: AppDensity) {
    setDensityState(newDensity);
    updateUserPreferencesAction({ density: newDensity });
  }

  function setAccent(newAccent: AppAccent) {
    setAccentState(newAccent);
    updateUserPreferencesAction({ accent: newAccent });
  }

  function setDefaultView(newView: DefaultView) {
    setDefaultViewState(newView);
    updateUserPreferencesAction({ default_view: newView });
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        density,
        accent,
        defaultView,
        setTheme,
        setDensity,
        setAccent,
        setDefaultView,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
