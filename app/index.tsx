import { RivePlayer } from "@/components/rive-player";
import { useWorkoutSessionStore } from "@/store/useWorkoutSessionStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { AppState, StatusBar, View } from "react-native";
import { useRive, useRiveBoolean, useRiveTrigger } from "rive-react-native";

// const WORKOUT_DURATION_IN_SEC = 90 * 60; // 1.5 hours

export default function HomeScreen() {
  // const { numberDay, shortDay } = useMemo(() => getCurrentDay(), []);

  const [setRiveRef, riveRef] = useRive();
  // const [, setCurrentDayNumber] = useRiveString(riveRef, "CurrentDayNumber");
  // const [, setCurrentDayText] = useRiveString(riveRef, "CurrentDayText");
  const [workoutSessionInitialized, setWorkoutSessionInitialized] =
    useRiveBoolean(riveRef, "IsPlaying");
  // const [, setMinutes] = useRiveString(riveRef, "minutes");
  // const [, setSeconds] = useRiveString(riveRef, "seconds");

  const { dispatch, isPlaying, timestamp, showTabMenu, remainingTime, reset } =
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
    setWorkoutSessionInitializedRef.current(isPlayingRef.current);
    dispatchRef.current({
      type: "SHOWTABMENU",
      payload: !isPlayingRef.current,
    });
    // restoreTimer();
  }, []);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("=======Hello, I'm focused!=====");

      const timeout = setTimeout(() => restoreUIState(), 50);

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("=============This route is now unfocused.=============");
        clearTimeout(timeout);
      };
    }, [restoreUIState])
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

  console.log("=============== OUT ================");
  console.log("isPlaying", isPlaying);
  console.log("showTabMenu", showTabMenu);
  console.log("timestamp", timestamp);
  console.log("remainingTime", remainingTime);
  console.log("=============== END OUT ================");

  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />

      <View className="absolute z-10 bottom-50">
        {/* <Button onPress={handlePlayButton}>
          <Button.LabelContent>Play</Button.LabelContent>
        </Button>

        <Button onPress={handleStopButton}>
          <Button.LabelContent>Stop</Button.LabelContent>
        </Button> */}
      </View>

      <RivePlayer
        ref={setRiveRef}
        artboardName="Training Day"
        stateMachineName="Training Day State Machine"
      />
    </View>
  );
}
