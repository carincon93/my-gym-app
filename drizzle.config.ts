import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts", // aquí defines tus tablas con drizzle
  out: "./drizzle", // carpeta donde se guardan migraciones
  driver: "expo", // driver
  dialect: "sqlite",
} satisfies Config;
