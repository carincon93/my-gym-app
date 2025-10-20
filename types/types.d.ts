type ExerciseProps = {
  id: string;
  name: string;
  image: string;
  muscleGroup?: string | null;
};

type WorkoutSetProps = {
  id: string;
  exerciseId: string;
  date: string;
  reps: number;
  weight: number;
  rest: number;
};

type SplitDay = {
  id: string;
  days: string;
  areUpperDays: boolean;
};

type BodyGroup =
  | "CHEST"
  | "BICEPS"
  | "SHOULDERS"
  | "FOREARMS"
  | "UPPERBACK"
  | "LOWERBACK"
  | "LATS"
  | "TRICEPS"
  | "NECK"
  | "QUADS"
  | "GLUTES"
  | "HAMSTRINGS"
  | "CALVES"
  | "ADDUCTORS"
  | "HIPADDUCTORS"
  | "HIPABDUCTORS"
  | "CORE"
  | "RESISTANCE"
  | "NONE";
