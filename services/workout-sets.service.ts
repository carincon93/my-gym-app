import { getDrizzleDb } from "@/db/client";
import { workoutSets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import uuid from "react-native-uuid";

export const addWorkoutSet = async (
  exerciseId: string,
  reps: number,
  weight: number,
  rest: number
) => {
  const drizzleDb = await getDrizzleDb();

  const id = uuid.v4() as string;
  await drizzleDb.insert(workoutSets).values({
    id,
    date: Date.now().toString(),
    exerciseId,
    reps,
    weight,
    rest,
  });
  return id;
};

export const getAllWorkoutSets = async () => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb.select().from(workoutSets);
};

export const updateWorkoutSet = async (
  id: string,
  data: { reps?: number; weight?: number; rest?: number }
) => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb
    .update(workoutSets)
    .set(data)
    .where(eq(workoutSets.id, id));
};

export const getWorkoutSetsByExercisesId = async (
  exerciseId: string
): Promise<WorkoutSetProps[]> => {
  const drizzleDb = await getDrizzleDb();

  const result = await drizzleDb
    .select()
    .from(workoutSets)
    .where(eq(workoutSets.exerciseId, exerciseId))
    .limit(3)
    .orderBy(desc(workoutSets.date));

  // 🔹 Mapear cada resultado y formatear la fecha
  return result.map((workoutSet) => ({
    ...workoutSet,
    date: new Date(Number(workoutSet.date)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
};

export const deleteWorkoutSet = async (id: string) => {
  const drizzleDb = await getDrizzleDb();

  await drizzleDb.delete(workoutSets).where(eq(workoutSets.id, id));
};
