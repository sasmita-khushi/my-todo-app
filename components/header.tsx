import React from "react";
import { useTheme } from "../app/_layout";

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-slate-100 bg-white px-6 py-3.5 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <circle cx="12" cy="12" r="9" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                HabitFlow
              </h1>
              <span className="rounded-full bg-indigo-100/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-600 uppercase dark:bg-indigo-500/20 dark:text-indigo-300">
                DAILY
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-400">
              Stay focused, build momentum
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle Button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
          >
            {isDark ? (
              /* Sun Icon for Dark Mode */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="5" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
              </svg>
            ) : (
              /* Moon Icon for Light Mode */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
