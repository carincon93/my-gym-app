import { getDrizzleDb } from "@/db/client";
import { annotations } from "@/db/schema";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid";

export const addAnnotation = async (exerciseId: string, annotation: string) => {
  const drizzleDb = await getDrizzleDb();

  const id = uuid.v4() as string;
  await drizzleDb.insert(annotations).values({
    id,
    exerciseId,
    annotation,
  });
  return id;
};

export const getLastAnnotation = async (exerciseId: string) => {
  const drizzleDb = await getDrizzleDb();

  const result = await drizzleDb
    .select()
    .from(annotations)
    .where(eq(annotations.exerciseId, exerciseId))
    .limit(1);

  return result[0] ?? null;
};

export const updateAnnotation = async (
  id: string,
  data: { exerciseId?: string; annotation?: string }
) => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb
    .update(annotations)
    .set(data)
    .where(eq(annotations.id, id));
};

export const deleteAnnotation = async (id: string) => {
  const drizzleDb = await getDrizzleDb();

  await drizzleDb.delete(annotations).where(eq(annotations.id, id));
};
