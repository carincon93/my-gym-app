interface Env {
  EXPO_PUBLIC_RIVE_FILENAME: string;
  EXPO_PUBLIC_DATABASE_NAME: string;
}

if (!process.env.EXPO_PUBLIC_DATABASE_NAME) {
  throw new Error("DATABASE_NAME environment variable is not set");
}

if (!process.env.EXPO_PUBLIC_RIVE_FILENAME) {
  throw new Error("RIVE_FILENAME environment variable is not set");
}

export const env: Env = {
  EXPO_PUBLIC_RIVE_FILENAME: process.env.EXPO_PUBLIC_RIVE_FILENAME,
  EXPO_PUBLIC_DATABASE_NAME: process.env.EXPO_PUBLIC_DATABASE_NAME,
};
