import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  initialWorkoutSessionState,
  workoutSessionReducer,
} from "@/reducers/workout.reducer";
import {
  WorkoutSessionAction,
  WorkoutSessionState,
} from "@/types/workout-session";
import { createJSONStorage } from "./persistConfig";

interface WorkoutSessionStoreProps extends WorkoutSessionState {
  dispatch: (action: WorkoutSessionAction) => void;
  reset: () => void;
}

export const useWorkoutSessionStore = create<WorkoutSessionStoreProps>()(
  persist(
    (set, get) => ({
      ...initialWorkoutSessionState,

      dispatch: (action: WorkoutSessionAction) => {
        const current = get();
        const next = workoutSessionReducer(current, action);
        set(next);
      },

      reset: () => set(initialWorkoutSessionState),
    }),
    {
      name: "workout-session-storage",
      storage: createJSONStorage<WorkoutSessionStoreProps>(),
    }
  )
);
