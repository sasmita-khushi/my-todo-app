import "../global.css";
import { createContext, useContext, useEffect, useState } from "react";
import { Slot } from "expo-router";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function Layout() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? "dark" : ""}>
        <div className="flex h-screen w-full flex-col overflow-y-auto bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
          <div className="flex-1 overflow-y-auto">
            <Slot />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
