import { RivePlayer } from "@/components/rive-player";
import { useWorkoutSessionStore } from "@/store/useWorkoutSessionStore";
import { getCurrentDay } from "@/utils/get-current-day";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { router, useFocusEffect } from "expo-router";
import { Button } from "heroui-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AppState, StatusBar, View } from "react-native";
import {
  useRive,
  useRiveBoolean,
  useRiveString,
  useRiveTrigger,
} from "rive-react-native";

const STORAGE_KEY = "workout_session_state";
const WORKOUT_DURATION_IN_SEC = 90 * 60; // 1.5 hours

export default function HomeScreen() {
  const { numberDay, shortDay } = useMemo(() => getCurrentDay(), []);

  const [setRiveRef, riveRef] = useRive();
  const [, setCurrentDayNumber] = useRiveString(riveRef, "CurrentDayNumber");
  const [, setCurrentDayText] = useRiveString(riveRef, "CurrentDayText");
  const [workoutSessionInitialized, setWorkoutSessionInitialized] =
    useRiveBoolean(riveRef, "IsPlaying");
  const [, setMinutes] = useRiveString(riveRef, "minutes");
  const [, setSeconds] = useRiveString(riveRef, "seconds");

  const { dispatch, isPlaying, timestamp, showTabMenu, remainingTime, start } =
    useWorkoutSessionStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // // Play trigger: dispatch PLAY
  useRiveTrigger(riveRef, "TriggPlay", async () => {
    console.log("Play clicked");
    dispatch({ type: "PLAY" });
    await saveStartTime();
  });

  // Stop trigger: dispatch STOP
  useRiveTrigger(riveRef, "TriggStop", async () => {
    console.log("Stop clicked");
    dispatch({ type: "STOP" });
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (intervalRef.current) clearInterval(intervalRef.current);
  });

  // AddSet trigger: dispatch AddSet
  useRiveTrigger(riveRef, "TriggAddSets", async () => {
    console.log("Add sets clicked");
    router.push("/(config)/split-days");
  });

  const isPlayingRef = useRef(isPlaying);

  // keep ref updated but not trigger re-renders
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const saveStartTime = useCallback(async () => {
    try {
      const startTime = Date.now();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime }));
    } catch (err) {
      console.warn("saveStartTime error", err);
    }
  }, []);

  const restoreTimer = useCallback(async () => {
    if (!isPlayingRef.current) return;
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const { startTime } = JSON.parse(data);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(WORKOUT_DURATION_IN_SEC - elapsed, 0);
        dispatch({ type: "RESTORE_TIMER", payload: remaining });
      } else {
        dispatch({ type: "RESTORE_TIMER", payload: WORKOUT_DURATION_IN_SEC });
      }
    } catch (err) {
      console.warn("restoreTimer error", err);
    }
  }, [dispatch]);

  // Effect to control the countdown interval
  // useEffect(() => {
  //   if (isPlaying) {
  //     intervalRef.current = setInterval(() => {
  //       dispatch({ type: "TICK" });
  //     }, 1000);
  //   } else {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, [isPlaying, dispatch]);

  const handlePlayButton = () => {
    setWorkoutSessionInitialized(true);
    riveRef?.trigger("TriggPlay");
  };

  const handleStopButton = () => {
    setWorkoutSessionInitialized(false);
    riveRef?.trigger("TriggStop");
  };

  const restoreUIState = useCallback(() => {
    console.log("===ENTER TO THE RESTORE STATE===");
    // This ensures the Rive animation reflects the persisted state
    setWorkoutSessionInitialized(isPlayingRef.current);
    dispatch({ type: "SHOWTABMENU", payload: !isPlayingRef.current });
    restoreTimer();
  }, [setWorkoutSessionInitialized, restoreTimer, dispatch]);

  useEffect(() => {
    setCurrentDayText(shortDay);
    setCurrentDayNumber(numberDay);
  }, [shortDay, numberDay, setCurrentDayText, setCurrentDayNumber]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("=======Hello, I'm focused!=====");

      restoreUIState();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("=============This route is now unfocused.=============");
      };
    }, [restoreUIState])
  );

  // 🔹 Detecta cuando la app vuelve del background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        console.log("=======Hello, I'm come back!=====");

        // Restore the last state
        restoreUIState();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [restoreUIState]);

  // Update Rive with remaining time
  useEffect(() => {
    if (!riveRef || !isPlaying) return;

    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;

    setMinutes(String(mins).padStart(2, "0"));
    setSeconds(String(secs).padStart(2, "0"));
  }, [riveRef, remainingTime, isPlaying, setMinutes, setSeconds]);

  // Keep screen awake during workout
  useEffect(() => {
    const keepAwake = async () => {
      if (isPlaying) {
        await activateKeepAwakeAsync();
      } else {
        deactivateKeepAwake();
      }
    };

    keepAwake();
  }, [isPlaying]);

  console.log("isPlaying", isPlaying);
  console.log("showTabMenu", showTabMenu);
  console.log("timestamp", timestamp);
  console.log("remainingTime", remainingTime);

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
      </View>

      <RivePlayer
        ref={setRiveRef}
        artboardName="Training Day"
        stateMachineName="Training Day State Machine"
      />
    </View>
  );
}
