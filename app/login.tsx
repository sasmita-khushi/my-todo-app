import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Invalid email or password.");
        return;
      }

      const accessToken = data.accessToken;

      if (accessToken) {
        setAccessToken(accessToken);

        console.log("Zustand state:", useAuthStore.getState());
      }

      router.replace("/todo");
    } catch {
      setError(
        "Cannot connect to the server. Make sure your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Ionicons name="checkmark" size={28} color="#ffffff" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Log in to continue to HabitFlow
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-colors outline-none focus:border-indigo-500 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-transparent py-3 pr-16 pl-4 text-sm text-slate-800 placeholder-slate-400 transition-colors outline-none focus:border-indigo-500 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
