import { getDrizzleDb } from "@/db/client";
import { favorites } from "@/db/schema";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid";

interface FavoriteRecord {
  id: string;
  exerciseId: string;
}

/**
 * Syncs favorites with the database by replacing all existing entries
 * @param favs Array of exercise IDs to mark as favorites
 * @throws {Error} If database operations fail
 */
export async function syncFavorites(favs: string[]): Promise<void> {
  const drizzleDb = await getDrizzleDb();

  try {
    // First delete existing favorites
    await drizzleDb.delete(favorites);

    // Then insert new favorites if any exist
    if (favs.length > 0) {
      const newFavorites: FavoriteRecord[] = favs.map((exerciseId) => ({
        id: uuid.v4().toString(),
        exerciseId,
      }));

      await drizzleDb.insert(favorites).values(newFavorites);
    }
  } catch (error) {
    console.error("Failed to sync favorites:", error);
    throw new Error("Failed to sync favorites");
  }
}

/**
 * Deletes a single favorite by ID
 * @param id The favorite ID to delete
 * @throws {Error} If deletion fails
 */
export async function deleteFavorite(id: string): Promise<void> {
  const drizzleDb = await getDrizzleDb();

  try {
    await drizzleDb.delete(favorites).where(eq(favorites.id, id));
  } catch (error) {
    console.error("Failed to delete favorite:", error);
    throw new Error("Failed to delete favorite");
  }
}

/**
 * Retrieves all favorite exercise IDs
 * @returns Array of exercise IDs
 * @throws {Error} If query fails
 */
export async function getAllFavorites(): Promise<string[]> {
  const drizzleDb = await getDrizzleDb();

  try {
    const rows = await drizzleDb
      .select({ exerciseId: favorites.exerciseId })
      .from(favorites);

    return rows.map((row) => row.exerciseId);
  } catch (error) {
    console.error("Failed to get favorites:", error);
    throw new Error("Failed to get favorites");
  }
}
