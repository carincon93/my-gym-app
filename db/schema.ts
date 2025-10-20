import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 🏋️ Exercises
export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(), // uuid string
  name: text("name").notNull(),
  image: text("image").notNull().default("default-image.webp"),
  muscleGroup: text("muscle_group"),
});

// ⭐ Favorites
export const favorites = sqliteTable("favorites", {
  id: text("id").primaryKey(),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id),
});

// 📓 Sets (workout sets)
export const workoutSets = sqliteTable("sets", {
  id: text("id").primaryKey(),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id),
  date: text("date").notNull(),
  reps: integer("reps").notNull(),
  weight: real("weight").notNull(),
  rest: integer("rest").notNull(),
});

// 📝 Annotations
export const annotations = sqliteTable("annotations", {
  id: text("id").primaryKey(),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id),
  annotation: text("annotation").notNull(),
});

// 👤 Users
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  height: real("height").notNull(),
  gender: text("gender").notNull(),
});

// ⚖️ User Weights
export const userWeights = sqliteTable("user_weights", {
  id: text("id").primaryKey(),
  weight: real("weight").notNull(),
  date: text("date").default("CURRENT_TIMESTAMP"),
});

// 📆 Split Days
export const splitDays = sqliteTable("split_days", {
  id: text("id").primaryKey(),
  days: text("days").notNull(),
  areUpperDays: integer("are_upper_days", { mode: "boolean" }).notNull(),
});
