import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

let drizzleDb: ReturnType<typeof drizzle> | null = null;

export async function getDrizzleDb() {
  if (!drizzleDb) {
    if (!env.EXPO_PUBLIC_DATABASE_NAME) {
      throw new Error("Database name is not configured");
    }

    try {
      const sqliteDb = await SQLite.openDatabaseAsync(
        env.EXPO_PUBLIC_DATABASE_NAME,
        {
          useNewConnection: true,
        }
      );
      drizzleDb = drizzle(sqliteDb);
      console.log("Drizzle initialized");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return drizzleDb;
}
