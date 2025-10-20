import { DATABASE_NAME } from "@/constants/constants";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

let drizzleDb: ReturnType<typeof drizzle> | null = null;

export async function getDrizzleDb() {
  if (!drizzleDb) {
    const sqliteDb = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true,
    });
    drizzleDb = drizzle(sqliteDb);
    console.log("Drizzle initialized");
  }
  return drizzleDb;
}
