import { create } from "zustand";

type SelectedItemsProps = {
  exerciseSelected: ExerciseProps | null;
  setSelectedExercise: (exerciseSelected: ExerciseProps) => void;
  muscleSelected: BodyGroup;
  setSelectedMuscle: (muscleSelected: BodyGroup) => void;
  workoutSetSelected: WorkoutSetProps | null;
  setSelectedWorkoutSet: (workoutSetSelected: WorkoutSetProps | null) => void;
};

export const useSelectedItemsStore = create<SelectedItemsProps>((set) => ({
  exerciseSelected: null,
  setSelectedExercise: (exerciseSelected) => set({ exerciseSelected }),
  muscleSelected: "NONE",
  setSelectedMuscle: (muscleSelected) => set({ muscleSelected }),
  workoutSetSelected: null,
  setSelectedWorkoutSet: (workoutSetSelected) => set({ workoutSetSelected }),
}));

type WorkoutSessionProps = {
  hasWorkoutSessionStarted: boolean;
  setHasWorkoutSessionStarted: (hasWorkoutSessionStarted: boolean) => void;
};

export const useWorkoutSessionStore = create<WorkoutSessionProps>((set) => ({
  hasWorkoutSessionStarted: false,
  setHasWorkoutSessionStarted: (hasWorkoutSessionStarted) =>
    set({ hasWorkoutSessionStarted }),
}));
