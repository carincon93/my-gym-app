import {
  WorkoutSessionAction,
  WorkoutSessionState,
} from "@/types/workout-session";

const WORKOUT_DURATION_IN_SEC = 90 * 60; // 1.5 hours

export const initialWorkoutSessionState: WorkoutSessionState = {
  start: false,
  stop: false,
  showTabMenu: true,
  maxGymTime: 0,
  remainingTime: 0,
};

export function workoutSessionReducer(
  state: typeof initialWorkoutSessionState,
  action: WorkoutSessionAction
): WorkoutSessionState {
  switch (action.type) {
    case "PLAY":
      return {
        ...state,
        start: true,
        stop: false,
        showTabMenu: false,
        // If resuming, keep old maxGymTime, otherwise set new start time.
        maxGymTime: state.start ? state.maxGymTime : Date.now() + 120000,
        remainingTime: WORKOUT_DURATION_IN_SEC,
      };

    case "STOP":
      return {
        ...state,
        start: false,
        stop: true,
        showTabMenu: true,
        maxGymTime: 0,
        remainingTime: 0,
      };

    case "SHOWTABMENU":
      return {
        ...state,
        showTabMenu: action.payload,
      };

    case "RESTORE_TIMER":
      return { ...state, remainingTime: action.payload };

    case "TICK":
      return { ...state, remainingTime: Math.max(state.remainingTime - 1, 0) };

    default:
      return state;
  }
}
