import { useContext } from "react";
import { ThemeProviderContext } from "../components/theme-provider";

export function useTheme() {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
