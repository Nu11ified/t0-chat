"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
  
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
        return;
      }
  
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
} 