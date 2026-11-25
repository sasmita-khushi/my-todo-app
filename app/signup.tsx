import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to create account.");
        return;
      }

      const accessToken = data.accessToken || data.token;

      if (accessToken) {
        setAccessToken(accessToken);
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign up to start using HabitFlow
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-colors outline-none focus:border-indigo-500 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
              />
            </div>

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

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-2xl border border-slate-200 bg-transparent py-3 pr-16 pl-4 text-sm text-slate-800 placeholder-slate-400 transition-colors outline-none focus:border-indigo-500 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-colors outline-none focus:border-indigo-500 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
