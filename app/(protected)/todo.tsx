import React, { useEffect, useState } from "react";
import { myFetch } from "../../my-fetch";
import { useAuthStore } from "../../store/authStore";
import Calender from "./calender";

const TODOS_URL = "http://localhost:3000/todo";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function Todo() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [savingTodo, setSavingTodo] = useState(false);
  const [busyIds, setBusyIds] = useState<number[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) {
      setTodos([]);
      setLoadingTodos(false);
      return;
    }

    let active = true;
    setLoadingTodos(true);

    const loadTodos = async () => {
      try {
        const response = await myFetch(TODOS_URL);
        if (!response.ok) throw new Error("Could not load todos.");
        const data = await response.json();
        if (active) {
          setTodos(Array.isArray(data) ? data : (data.todos ?? []));
          setError("");
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load todos.",
          );
        }
      } finally {
        if (active) setLoadingTodos(false);
      }
    };

    loadTodos();
    return () => {
      active = false;
    };
  }, [accessToken]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || savingTodo) return;

    setSavingTodo(true);
    setError("");
    try {
      const response = await myFetch(TODOS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!response.ok) throw new Error("Could not add todo.");
      const createdTodo: TodoItem = await response.json();
      setInputText("");
      setTodos((current) => [createdTodo, ...current]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not add todo.",
      );
    } finally {
      setSavingTodo(false);
    }
  };

  const toggleTodo = async (todo: TodoItem) => {
    if (busyIds.includes(todo.id)) return;
    setBusyIds((prev) => [...prev, todo.id]);
    setError("");

    try {
      const response = await myFetch(`${TODOS_URL}/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) throw new Error("Could not update todo.");
      const updatedTodo: TodoItem = await response.json();
      setTodos((current) =>
        current.map((item) => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not update todo.",
      );
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== todo.id));
    }
  };

  const deleteTodo = async (id: number) => {
    if (busyIds.includes(id)) return;
    setBusyIds((prev) => [...prev, id]);
    setError("");

    try {
      const response = await myFetch(`${TODOS_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not delete todo.");
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not delete todo.",
      );
    } finally {
      setBusyIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const completionPercentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="flex w-full flex-col items-center">
      <Calender />

      <div className="w-full max-w-4xl px-4 pb-10">
        {/* Completion Rate Banner Card */}
        <div className="mb-6 w-full rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-5 text-white shadow-lg shadow-indigo-500/20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-indigo-200 uppercase">
                COMPLETION RATE
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                {completionPercentage}% Complete
              </h2>
            </div>

            <div className="text-right">
              <div className="leading-none">
                <span className="text-3xl font-extrabold text-white">
                  {completedCount}
                </span>
                <span className="text-lg font-medium text-indigo-200">
                  /{totalCount}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-indigo-200">
                tasks done
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-indigo-950/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Todo Input / Search Bar */}
        <form
          onSubmit={handleAddTodo}
          className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-colors focus-within:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-indigo-500"
        >
          <div className="pl-3 text-slate-400">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write a new todo..."
            className="w-full bg-transparent py-2 text-sm text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
          />

          <button
            type="submit"
            disabled={savingTodo}
            className="shrink-0 cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60"
          >
            {savingTodo ? "Adding..." : "Add Todo"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {/* Filter Tabs (All / Active / Completed) */}
        <div className="mb-4 flex items-center">
          <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-100/90 p-1 dark:bg-slate-800/80">
            {(
              [
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "completed", label: "Completed" },
              ] as const
            ).map((tab) => {
              const isActive = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`cursor-pointer rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stored Todos List */}
        <div className="flex max-h-80 flex-col gap-2.5 overflow-y-auto pr-1">
          {loadingTodos ? (
            <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
              Loading todos...
            </p>
          ) : filteredTodos.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
              {todos.length === 0
                ? "No todos yet. Write one above to get started!"
                : `No ${filter} todos found.`}
            </p>
          ) : (
            filteredTodos.map((todo) => {
              const isBusy = busyIds.includes(todo.id);
              return (
                <div
                  key={todo.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
                >
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => toggleTodo(todo)}
                    className="flex flex-1 cursor-pointer items-center gap-3 text-left disabled:opacity-60"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        todo.completed
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-transparent dark:border-slate-600"
                      }`}
                    >
                      {todo.completed && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>

                    <span
                      className={`text-sm font-medium ${
                        todo.completed
                          ? "text-slate-400 line-through dark:text-slate-500"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete todo"
                    className="ml-3 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-60 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
