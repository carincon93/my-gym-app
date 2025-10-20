import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { Suspense, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { DATABASE_NAME } from "@/constants/constants";
import { ImageCacheProvider } from "@/context/image-cache-context";
import { seedExercises } from "@/db/seed";
import migrations from "@/drizzle/migrations";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

// ✅ Encapsula drizzle + migrations en un componentes
function DatabaseProvider() {
  const sqlite = useSQLiteContext();
  const db = drizzle(sqlite);
  const [isSeeded, setIsSeeded] = useState(false);

  useDrizzleStudio(sqlite);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success && !isSeeded) {
      try {
        seedExercises();
        setIsSeeded(true);
      } catch (err) {
        console.error("Seeding error:", err);
      }
    }
  }, [success, isSeeded]);

  if (error) {
    console.error("Migration error:", error);
    return null; // or an error component
  }

  if (!success) {
    return null; // or a loading component
  }

  return <AppProviders />;
}

// ✅ Providers de React Query + Navigation
function AppProviders() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <HeroUINativeProvider>
          <ImageCacheProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="height" options={{ headerShown: false }} />
              <Stack.Screen name="weight" options={{ headerShown: false }} />
              <Stack.Screen
                name="split-days"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ImageCacheProvider>
        </HeroUINativeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <DatabaseProvider />
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}
