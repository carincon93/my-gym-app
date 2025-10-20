import { getDrizzleDb } from "@/db/client";
import { splitDays } from "@/db/schema";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid";

export const addSplitDay = async (days: string, areUpperDays: boolean) => {
  const drizzleDb = await getDrizzleDb();

  const id = uuid.v4() as string;
  const date = Date.now().toString();
  await drizzleDb.insert(splitDays).values({
    id,
    days,
    areUpperDays,
  });
  return id;
};

export const getAllSplitDays = async () => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb.select().from(splitDays);
};

export const updateSplitDay = async (
  id: string,
  data: { days?: string; areUpperDays?: boolean }
) => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb
    .update(splitDays)
    .set(data)
    .where(eq(splitDays.id, id));
};

export const deleteSplitDay = async (id: string) => {
  const drizzleDb = await getDrizzleDb();

  await drizzleDb.delete(splitDays).where(eq(splitDays.id, id));
};
