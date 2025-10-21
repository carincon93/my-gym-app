import { getDrizzleDb } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid";

export const addUser = async (height: number, gender: string) => {
  const drizzleDb = await getDrizzleDb();

  const id = uuid.v4() as string;
  await drizzleDb.insert(users).values({
    id,
    height,
    gender,
  });
  return id;
};

export const getFirstUser = async () => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb.select().from(users).limit(1);
};

export const updateUser = async (
  id: string,
  data: { height?: number; gender?: string }
) => {
  const drizzleDb = await getDrizzleDb();

  return await drizzleDb.update(users).set(data).where(eq(users.id, id));
};

export const deleteUser = async (id: string) => {
  const drizzleDb = await getDrizzleDb();

  await drizzleDb.delete(users).where(eq(users.id, id));
};
