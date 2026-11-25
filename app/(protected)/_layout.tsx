import { useEffect, useState } from "react";
import { Redirect, Slot, usePathname } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/header";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedLayout() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [checkingAuth, setCheckingAuth] = useState(!accessToken);

  useEffect(() => {
    const verifySession = async () => {
      if (accessToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/refresh", {
          method: "POST",
          credentials: "include",
        });
        console.log("going to....refresh ");

        if (!res.ok) throw new Error("Refresh failed");

        const data = await res.json();
        setAccessToken(data.accessToken);
      } catch {
        clearAuth();
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, [accessToken, clearAuth, setAccessToken]);

  if (checkingAuth) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  if (!accessToken) {
    return (
      <Redirect href={`/login?redirect=${encodeURIComponent(pathname)}`} />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
