import { getDrizzleDb } from "./client";
import { exercises } from "./schema";

import uuid from "react-native-uuid";

// 👇 Tu dataset inicial
const initialExercises = {
  BICEPS: [
    {
      name: "Biceps in machine",
      image: "biceps-curl-in-machine.webp",
      muscleGroup: "BICEPS",
    },
    {
      name: "Biceps in incline bench",
      image: "biceps-in-incline-bench.webp",
      muscleGroup: "BICEPS",
    },
    {
      name: "Biceps in preacher bench",
      image: "biceps-preacher-curl.webp",
      muscleGroup: "BICEPS",
    },
    {
      name: "Biceps with roman bar",
      image: "biceps-roman-bar.webp",
      muscleGroup: "BICEPS",
    },
  ],
  CHEST: [
    {
      name: "Chest in dips assist",
      image: "chest-dips-assist.webp",
      muscleGroup: "CHEST",
    },
    {
      name: "Pec fly (Var1)",
      image: "chest-pec-fly-var1.webp",
      muscleGroup: "CHEST",
    },
    {
      name: "Flat bench press",
      image: "chest-flat-bench-press.webp",
      muscleGroup: "CHEST",
    },
    {
      name: "Incline bench press",
      image: "chest-incline-bench-press.webp",
      muscleGroup: "CHEST",
    },
    {
      name: "Chest press",
      image: "chest-press-in-machine.webp",
      muscleGroup: "CHEST",
    },
  ],
  GLUTES: [
    {
      name: "Hip trust in machine",
      image: "glutes-hip-trust-in-machine.webp",
      muscleGroup: "GLUTES",
    },
    {
      name: "Hip trust with bar",
      image: "glutes-hip-trust-with-bar.webp",
      muscleGroup: "GLUTES",
    },
  ],
  HAMSTRINGS: [
    {
      name: "Prone leg curl",
      image: "hamstrings-prone-leg-curl.webp",
      muscleGroup: "HAMSTRINGS",
    },
    {
      name: "Seated leg curl",
      image: "hamstrings-seated-leg-curl.webp",
      muscleGroup: "HAMSTRINGS",
    },
  ],
  HIPABDUCTOR: [
    {
      name: "Hip abductor",
      image: "hip-abductor.webp",
      muscleGroup: "HIPABDUCTOR",
    },
  ],
  HIPADDUCTOR: [
    {
      name: "Hip adductor",
      image: "hip-abductor.webp",
      muscleGroup: "HIPADDUCTOR",
    },
  ],
  FOREARMS: [
    {
      name: "Reverse curl",
      image: "forearms-reverse-curl.webp",
      muscleGroup: "FOREARMS",
    },
  ],
  LATS: [
    {
      name: "Lat pull down (Var1)",
      image: "lat-pull-down-var1.webp",
      muscleGroup: "LATS",
    },
    {
      name: "Pull ups assisted",
      image: "lats-in-chin-assist.webp",
      muscleGroup: "LATS",
    },
    {
      name: "Landmine row",
      image: "lats-landmine-row.webp",
      muscleGroup: "LATS",
    },
    {
      name: "Seated row",
      image: "lats-seated-row.webp",
      muscleGroup: "LATS",
    },
  ],
  QUADS: [
    {
      name: "Leg press (45 degree)",
      image: "quads-45-degree-leg-press.webp",
      muscleGroup: "QUADS",
    },
    {
      name: "Hack squat",
      image: "quads-hack-squat.webp",
      muscleGroup: "QUADS",
    },
    {
      name: "Leg press (Var1)",
      image: "quads-horizontal-leg-press.webp",
      muscleGroup: "QUADS",
    },
    {
      name: "Leg press (Var2)",
      image: "quads-in-hammer-machine.webp",
      muscleGroup: "QUADS",
    },
    {
      name: "Leg extension",
      image: "quads-leg-extension.webp",
      muscleGroup: "QUADS",
    },
    {
      name: "Perfect squat",
      image: "quads-perfect-squat.webp",
      muscleGroup: "QUADS",
    },
  ],
  SHOULDERS: [
    {
      name: "Rear deltoids",
      image: "rear-deltoids.webp",
      muscleGroup: "SHOULDERS",
    },
    {
      name: "Shoulders press in machine",
      image: "shoulders-press-in-machine.webp",
      muscleGroup: "SHOULDERS",
    },
    {
      name: "Face pull",
      image: "shoulders-face-pull.webp",
      muscleGroup: "SHOULDERS",
    },
  ],
  TRICEPS: [
    {
      name: "Triceps in cable",
      image: "triceps-in-cable.webp",
      muscleGroup: "TRICEPS",
    },
  ],
  UPPERBACK: [
    {
      name: "Seated row",
      image: "upperback-seated-row.webp",
      muscleGroup: "UPPERBACK",
    },
  ],
  LOWERBACK: [
    {
      name: "Seated back extension",
      image: "lowerback-seated-back-extension.webp",
      muscleGroup: "LOWERBACK",
    },
  ],
  NECK: [
    {
      name: "Neck raises",
      image: "neck-raises.webp",
      muscleGroup: "NECK",
    },
  ],
  CALVES: [
    {
      name: "Standing calf raise",
      image: "standing-calf-raise.webp",
      muscleGroup: "CALVES",
    },
  ],
  CORE: [
    {
      name: "Abdominal crunch in machine",
      image: "abdominal-crunch.webp",
      muscleGroup: "CORE",
    },
  ],
};

export async function seedExercises() {
  // 1️⃣ Inicializar drizzle
  const drizzleDb = await getDrizzleDb();

  // 2️⃣ ¿Ya existen ejercicios?
  const existing = await drizzleDb.select().from(exercises).limit(1);

  if (existing.length > 0) {
    console.log("✅ Seed skipped, data already exists.");
    return;
  }
  // 3️⃣ Insertar todos
  const allExercises = Object.values(initialExercises).flat();

  try {
    await drizzleDb.insert(exercises).values(
      allExercises.map((exercise) => ({
        id: uuid.v4(),
        name: exercise.name,
        image: exercise.image,
        muscleGroup: exercise.muscleGroup,
      }))
    );
    console.log("✅ Seed completed exercises inserted.");
  } catch (error) {
    console.error(error);
  }
}
