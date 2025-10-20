import { getDrizzleDb } from "@/db/client";
import { exercises } from "@/db/schema";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid";

export const addExercise = async (
  name: string,
  image?: string,
  muscleGroup?: string
) => {
  const drizzleDb = await getDrizzleDb();

  const id = uuid.v4() as string;
  await drizzleDb.insert(exercises).values({
    id,
    name,
    image: image ?? null,
    muscleGroup: muscleGroup ?? null,
  });
  return id;
};

export const deleteExercise = async (id: string) => {
  const drizzleDb = await getDrizzleDb();

  await drizzleDb.delete(exercises).where(eq(exercises.id, id));
};

export const getAllExercises = async () => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb.select().from(exercises);
};

export async function getExerciseById(id: string) {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb
    .select()
    .from(exercises)
    .where(eq(exercises.id, id))
    .limit(1);
}
