import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useWorkoutSessionStore } from "@/store/store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { hasWorkoutSessionStarted } = useWorkoutSessionStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "black",
          borderRadius: 150,
          display: hasWorkoutSessionStarted ? "none" : "flex",
          margin: "auto",
          paddingTop: 10,
          top: -15,
          width: "90%",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favs-exercises"
        options={{
          title: "Exercises favorites",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
