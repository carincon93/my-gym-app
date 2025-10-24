export type WorkoutSessionState = {
  start: boolean;
  stop: boolean;
  isPlaying: boolean;
  showTabMenu: boolean;
  timestamp: number;
  remainingTime: number;
};

export type WorkoutSessionAction =
  | { type: "PLAY" }
  | { type: "STOP" }
  | { type: "SHOWTABMENU"; payload: boolean }
  | { type: "RESTORE_TIMER"; payload: number }
  | { type: "TICK" };
