import { useWorkoutSessionStore } from "@/store/useWorkoutSessionStore";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function ConfigRootLayout() {
  const { dispatch } = useWorkoutSessionStore();

  useEffect(() => {
    dispatch({ type: "SHOWTABMENU", payload: false });
  }, [dispatch]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000000" },
      }}
    >
      <Stack.Screen
        name="height"
        options={{
          animation: "slide_from_right",
          animationDuration: 350,
          contentStyle: { backgroundColor: "#FF3E3E" },
        }}
      />
      <Stack.Screen
        name="weight"
        options={{
          animation: "slide_from_right",
          animationDuration: 350,
          contentStyle: { backgroundColor: "#FF3E3E" },
        }}
      />
      <Stack.Screen
        name="split-days"
        options={{
          animation: "slide_from_right",
          animationDuration: 350,
          contentStyle: { backgroundColor: "#131010" },
        }}
      />
      <Stack.Screen name="favs-exercises" />
    </Stack>
  );
}
