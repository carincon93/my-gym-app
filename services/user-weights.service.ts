import { getDrizzleDb } from "@/db/client";
import { userWeights } from "@/db/schema";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid";

export const getInitialWeight = async () => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb.select().from(userWeights).limit(1);
};

export const addUserWeight = async (weight: number) => {
  const drizzleDb = await getDrizzleDb();

  const id = uuid.v4() as string;
  const date = Date.now().toString();
  await drizzleDb.insert(userWeights).values({
    id,
    weight,
    date,
  });
  return id;
};

export const getAllUserWeights = async () => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb.select().from(userWeights);
};

export const updateUserWeight = async (
  id: string,
  data: { weight?: number }
) => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb
    .update(userWeights)
    .set(data)
    .where(eq(userWeights.id, id));
};

export const deleteUserWeight = async (id: string) => {
  const drizzleDb = await getDrizzleDb();

  await drizzleDb.delete(userWeights).where(eq(userWeights.id, id));
};
