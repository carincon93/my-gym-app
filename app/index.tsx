import React, { useCallback, useEffect, useRef } from "react";
import { AppState, StatusBar, View } from "react-native";
import { useRive, useRiveBoolean } from "rive-react-native";

import { RivePlayer } from "@/components/rive-player";
import { useWorkoutSessionStore } from "@/store/useWorkoutSessionStore";
import { logWithTime } from "@/utils/log-whit-time";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Button } from "heroui-native";

// const WORKOUT_DURATION_IN_SEC = 90 * 60; // 1.5 hours
const STORAGE_KEY = "workout-session-storage";

export default function HomeScreen() {
  const [setRiveRef, riveRef] = useRive();
  const [, setWorkoutSessionInitialized] = useRiveBoolean(riveRef, "IsPlaying");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const {
    dispatch,
    start,
    stop,
    maxGymTime,
    showTabMenu,
    remainingTime,
    reset,
  } = useWorkoutSessionStore();

  // TRIGGERS
  const handlePlayButton = useCallback(() => {
    if (!riveRef) return;

    setWorkoutSessionInitialized(true);
    dispatch({ type: "PLAY" });

    // riveRef?.trigger("TriggPlay");
  }, [dispatch, riveRef, setWorkoutSessionInitialized]);

  const handleStopButton = useCallback(() => {
    if (!riveRef) return;

    setWorkoutSessionInitialized(false);
    dispatch({ type: "STOP" });

    // riveRef?.trigger("TriggStop");
  }, [dispatch, riveRef, setWorkoutSessionInitialized]);

  // RESTORE THE UI
  const restoreUIState = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        const { state } = JSON.parse(data);
        const elapsedInSec = Math.floor((Date.now() - state.maxGymTime) / 1000);
        const remainingInSec = Math.max(state.remainingTime - elapsedInSec, 0);

        logWithTime(elapsedInSec, remainingInSec);

        // dispatch({ type: "RESTORE_TIMER", payload: remaining });

        if (start) {
          handlePlayButton();
        } else if (stop) {
          handleStopButton();
        }
      }

      logWithTime("STORAGE", data);
    } catch (error) {
      console.error("Error restoring UI state:", error);
    }
  }, [handlePlayButton, handleStopButton, start, stop]);

  useEffect(() => {
    if (!start || stop) return;

    logWithTime("start", start);
    logWithTime("stop", stop);
  }, [start, stop]);

  // RESTORE STATE WHEN THE USER RETURNS FROM OTHER ROUTE OR FROM BACKGROUND
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      logWithTime("=======Hello, I'm focused!=====");

      // Restore UI state when focused
      restoreUIState();

      // Capture current interval so the cleanup uses a stable reference
      const interval = intervalRef.current;

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        logWithTime("=============This route is now unfocused.=============");
        // Clear the interval when the screen is unfocused
        if (interval) clearInterval(interval);
      };
    }, [restoreUIState])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        logWithTime("=======Hello, I'm come back!=====");

        // Restore the last state
        restoreUIState();
      }
    });

    // Capture current interval so the cleanup uses a stable reference
    const interval = intervalRef.current;

    return () => {
      logWithTime("=============This app is now in background.=============");
      // Clear the interval when the app is in background
      if (interval) clearInterval(interval);

      subscription.remove();
    };
  }, [restoreUIState]);

  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />

      <View className="absolute z-10 bottom-50">
        <Button onPress={handlePlayButton}>
          <Button.LabelContent>Play</Button.LabelContent>
        </Button>

        <Button onPress={handleStopButton}>
          <Button.LabelContent>Stop</Button.LabelContent>
        </Button>

        <Button onPress={() => router.push("/(config)/height")}>
          <Button.LabelContent>Go to config</Button.LabelContent>
        </Button>
      </View>

      <RivePlayer
        ref={setRiveRef}
        artboardName="Training Day"
        stateMachineName="Training Day State Machine"
      />
    </View>
  );
}
