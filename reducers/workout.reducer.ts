import {
  WorkoutSessionAction,
  WorkoutSessionState,
} from "@/types/workout-session";

export const initialWorkoutSessionState: WorkoutSessionState = {
  start: false,
  stop: false,
  isPlaying: false,
  showTabMenu: true,
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
        isPlaying: true,
        showTabMenu: false,
        remainingTime: state.remainingTime,
      };

    case "STOP":
      return {
        ...state,
        start: false,
        stop: true,
        isPlaying: false,
        showTabMenu: true,
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
