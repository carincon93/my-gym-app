import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Button } from "heroui-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, StatusBar, View } from "react-native";
import {
  useRive,
  useRiveBoolean,
  useRiveString,
  useRiveTrigger,
} from "rive-react-native";

import { RivePlayer } from "@/components/rive-player";
import { useWorkoutSessionStore } from "@/store/useWorkoutSessionStore";
import { getCurrentDay } from "@/utils/get-current-day";

// const WORKOUT_DURATION_IN_SEC = 90 * 60; // 1.5 hours

export default function HomeScreen() {
  const { numberDay, shortDay } = useMemo(() => getCurrentDay(), []);

  const [setRiveRef, riveRef] = useRive();
  const [, setCurrentDayNumber] = useRiveString(riveRef, "CurrentDayNumber");
  const [, setCurrentDayText] = useRiveString(riveRef, "CurrentDayText");
  const [, setWorkoutSessionInitialized] = useRiveBoolean(riveRef, "IsPlaying");
  // const [, setHourText] = useRiveString(riveRef, "HoursText");
  // const [, setMinutesText] = useRiveString(riveRef, "MinutesText");
  const [hourText, setHourText] = useState<string>("");
  const [minutesText, setMinutesText] = useState<string>("");

  const { dispatch, isPlaying, maxGymTime, showTabMenu, remainingTime, reset } =
    useWorkoutSessionStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Play trigger: dispatch PLAY
  useRiveTrigger(riveRef, "TriggPlay", async () => {
    console.log("Play clicked");
    dispatch({ type: "PLAY" });
    // await saveStartTime();
    const storageItem = await AsyncStorage.getItem("workout-session-storage");
    console.log("storageItem", storageItem);
  });

  // Stop trigger: dispatch STOP
  useRiveTrigger(riveRef, "TriggStop", async () => {
    console.log("Stop clicked");
    dispatch({ type: "STOP" });
    reset();
    const storageItem = await AsyncStorage.getItem("workout-session-storage");
    console.log("storageItem", storageItem);
    if (intervalRef.current) clearInterval(intervalRef.current);
  });

  // AddSet trigger: dispatch AddSet
  useRiveTrigger(riveRef, "TriggAddSets", async () => {
    console.log("Add sets clicked");
    router.push("/(config)/split-days");
  });

  const handlePlayButton = () => {
    setWorkoutSessionInitialized(true);
    riveRef?.trigger("TriggPlay");
  };

  const handleStopButton = () => {
    setWorkoutSessionInitialized(false);
    riveRef?.trigger("TriggStop");
  };

  // Create refs for functions that might change
  const dispatchRef = useRef(dispatch);
  const setWorkoutSessionInitializedRef = useRef(setWorkoutSessionInitialized);
  const isPlayingRef = useRef(isPlaying);

  // Keep them updated without changing the callback identity
  useEffect(() => {
    if (!riveRef) return;
    isPlayingRef.current = isPlaying;
    dispatchRef.current = dispatch;
    setWorkoutSessionInitializedRef.current = setWorkoutSessionInitialized;
  }, [riveRef, isPlaying, dispatch, setWorkoutSessionInitialized]);

  const restoreUIState = useCallback(() => {
    console.log("===ENTER TO THE RESTORE STATE===");
    // This ensures the Rive animation reflects the persisted state

    if (isPlaying) {
      setWorkoutSessionInitialized(true);
      riveRef?.trigger("TriggPlay");
    } else {
      setWorkoutSessionInitialized(false);
      riveRef?.trigger("TriggStop");
    }
    // restoreTimer();
  }, [riveRef, setWorkoutSessionInitialized, isPlaying]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("=======Hello, I'm focused!=====");

      restoreUIState();

      // Start the interval only when the screen is focused and a workout is playing
      if (isPlayingRef.current && maxGymTime > 0) {
        const updateElapsedTime = () => {
          const elapsed = maxGymTime - Date.now();

          if (elapsed <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            dispatchRef.current({ type: "STOP" }); // Reset the workout session state
            return;
          }
          const hours = Math.floor(elapsed / (1000 * 60 * 60));
          const minutes = Math.floor(
            (elapsed % (1000 * 60 * 60)) / (1000 * 60)
          );

          setHourText(String(hours).padStart(2, "0"));
          setMinutesText(String(minutes).padStart(2, "0"));
        };

        updateElapsedTime(); // Run once immediately
        intervalRef.current = setInterval(updateElapsedTime, 1000);
      }

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("=============This route is now unfocused.=============");
        // Clear the interval when the screen is unfocused
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [restoreUIState, maxGymTime])
  );

  // Detect when
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

  useEffect(() => {
    setCurrentDayText(shortDay);
    setCurrentDayNumber(numberDay);
  }, [shortDay, numberDay, setCurrentDayText, setCurrentDayNumber]);

  console.log("=============== OUT ================");
  console.log("isPlaying", isPlaying);
  console.log("showTabMenu", showTabMenu);
  console.log("maxGymTime", maxGymTime);
  console.log("remainingTime", remainingTime);
  console.log("hourText", hourText);
  console.log("minutesText", minutesText);
  console.log("=============== END OUT ================");

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
