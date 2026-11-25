import { router } from "expo-router";
import { useAuthStore } from "./store/authStore";

let refreshPromise: Promise<string | null> | null = null;

export async function myFetch(url: string, option: RequestInit = {}) {
  const { accessToken, clearAuth, setAccessToken } = useAuthStore.getState();

  function originalRequest(token: string | null | undefined) {
    const headers = new Headers(option.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);

    return fetch(url, {
      ...option,
      credentials: "include",
      headers,
    });
  }

  function refresh() {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const res = await fetch("http://localhost:3000/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!res.ok) return null;

          const { accessToken: newToken } = (await res.json()) as {
            accessToken: string;
          };
          setAccessToken(newToken);
          return newToken;
        } catch {
          return null;
        }
      })().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  }

  let res = await originalRequest(accessToken);

  if (res.status === 401) {
    const newToken = await refresh();
    if (newToken) {
      res = await originalRequest(newToken);
    } else {
      clearAuth();
      router.replace("/login");
    }
  }

  return res;
}
