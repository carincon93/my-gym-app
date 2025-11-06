export type WorkoutSessionState = {
  start: boolean;
  stop: boolean;
  showTabMenu: boolean;
  maxGymTime: number;
  remainingTime: number;
};

export type WorkoutSessionAction =
  | { type: "PLAY" }
  | { type: "STOP" }
  | { type: "SHOWTABMENU"; payload: boolean }
  | { type: "RESTORE_TIMER"; payload: number }
  | { type: "TICK" };
