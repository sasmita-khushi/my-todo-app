import React, { useRef, useState } from "react";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getSundayOfWeek(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function formatInputDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getWeekDays(weekStart: Date, todayKey: string) {
  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + index);
    return {
      key: d.toDateString(),
      fullDate: d,
      day: DAY_NAMES[d.getDay()],
      date: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      hasDot: d.toDateString() === todayKey,
      isHighlighted: index === 0,
    };
  });
}

export default function Calender() {
  const today = new Date();
  const todayKey = today.toDateString();

  const [weekStart, setWeekStart] = useState<Date>(() =>
    getSundayOfWeek(today),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const days = getWeekDays(weekStart, todayKey);
  const selectedKey = selectedDate.toDateString();

  const firstDay = days[0];
  const lastDay = days[6];
  const monthLabel =
    firstDay.month === lastDay.month
      ? `${firstDay.month} ${firstDay.year}`
      : firstDay.year === lastDay.year
        ? `${firstDay.month} – ${lastDay.month} ${firstDay.year}`
        : `${firstDay.month} ${firstDay.year} – ${lastDay.month} ${lastDay.year}`;

  const changeWeek = (direction: number) => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + direction * 7);
      return next;
    });
  };

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [year, month, day] = val.split("-").map(Number);
    const picked = new Date(year, month - 1, day);
    setSelectedDate(picked);
    setWeekStart(getSundayOfWeek(picked));
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
        dateInputRef.current.click();
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Month & Year Header with Calendar Picker Icon */}
        <div className="mb-2 flex items-center justify-between px-2">
          <h3 className="text-base font-bold tracking-tight text-slate-700 dark:text-slate-200">
            {monthLabel}
          </h3>

          <div className="relative">
            <button
              type="button"
              onClick={openDatePicker}
              title="Select a date"
              aria-label="Select a date"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            <input
              ref={dateInputRef}
              type="date"
              value={formatInputDate(selectedDate)}
              onChange={handleManualDateChange}
              className="pointer-events-none absolute right-0 bottom-0 h-0 w-0 opacity-0"
              tabIndex={-1}
            />
          </div>
        </div>

        <div className="flex w-full flex-row items-center justify-between gap-2 rounded-3xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
          {/* Previous Week Button */}
          <button
            type="button"
            onClick={() => changeWeek(-1)}
            aria-label="Previous week"
            className="flex h-12 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <span className="text-lg font-bold leading-none">&#8249;</span>
          </button>

          {/* Calendar Days */}
          {days.map((item) => {
            const isSelected = selectedKey === item.key;
            const isSubtleHighlight = !isSelected && item.isHighlighted;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedDate(item.fullDate)}
                className={`flex h-20 flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl px-2 pt-2 pb-1.5 transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : isSubtleHighlight
                      ? "bg-slate-100/80 text-slate-700 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
                      : "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`mb-1.5 text-xs font-semibold tracking-wider uppercase ${
                    isSelected
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.day}
                </span>

                <span
                  className={`text-xl font-bold leading-none ${
                    isSelected
                      ? "text-white"
                      : "text-slate-700 dark:text-slate-100"
                  }`}
                >
                  {item.date}
                </span>

                <div className="mt-1 flex h-2 items-center justify-center">
                  {item.hasDot && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected
                          ? "bg-white"
                          : "bg-indigo-600 dark:bg-indigo-400"
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}

          {/* Next Week Button */}
          <button
            type="button"
            onClick={() => changeWeek(1)}
            aria-label="Next week"
            className="flex h-12 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <span className="text-lg font-bold leading-none">&#8250;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
