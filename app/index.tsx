import { RivePlayer } from "@/components/rive-player";
import { useWorkoutSessionStore } from "@/store/useWorkoutSessionStore";
import { getCurrentDay } from "@/utils/get-current-day";
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

export default function HomeScreen() {
  const { numberDay, shortDay } = useMemo(() => getCurrentDay(), []);

  const [setRiveRef, riveRef] = useRive();
  const [, setCurrentDayNumber] = useRiveString(riveRef, "CurrentDayNumber");
  const [, setCurrentDayText] = useRiveString(riveRef, "CurrentDayText");
  const [workoutSessionInitialized, setWorkoutSessionInitialized] =
    useRiveBoolean(riveRef, "IsPlaying");

  const { dispatch, isPlaying, showTabMenu } = useWorkoutSessionStore();

  // // Play trigger: dispatch PLAY
  useRiveTrigger(riveRef, "TriggPlay", async () => {
    console.log("Play clicked");
    dispatch({ type: "PLAY" });

    // if (!workoutSession)
    //   setWorkoutSession({ timestamp: Date.now(), initialized: true });
  });

  // Stop trigger: dispatch STOP
  useRiveTrigger(riveRef, "TriggStop", async () => {
    console.log("Stop clicked");
    dispatch({ type: "STOP" });

    // clearWorkoutSession();
  });

  // AddSet trigger: dispatch AddSet
  useRiveTrigger(riveRef, "TriggAddSets", async () => {
    console.log("Add sets clicked");
    router.push("/(config)/split-days");
  });

  // const [isUpperWorkout, setIsUpperWorkout] = useRiveBoolean(
  //   riveRef,
  //   "IsUpperWorkout"
  // );

  const isPlayingRef = useRef(isPlaying);

  // keep ref updated but not trigger re-renders
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const handlePlayButton = () => {
    setWorkoutSessionInitialized(true);
    riveRef?.trigger("TriggPlay");
  };

  const handleStopButton = () => {
    setWorkoutSessionInitialized(false);
    riveRef?.trigger("TriggStop");
  };

  const restoreState = useCallback(() => {
    console.log("===ENTER TO THE RESTORE STATE===");
    if (isPlayingRef.current) {
      setWorkoutSessionInitialized(true);
      riveRef?.trigger("TriggPlay");
    } else {
      setWorkoutSessionInitialized(false);
      riveRef?.trigger("TriggStop");
    }
  }, [riveRef, setWorkoutSessionInitialized]);

  useEffect(() => {
    setCurrentDayText(shortDay);
    setCurrentDayNumber(numberDay);
  }, [shortDay, numberDay, setCurrentDayText, setCurrentDayNumber]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("=======Hello, I'm focused!=====");

      restoreState();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("=============This route is now unfocused.=============");
      };
    }, [restoreState])
  );

  // 🔹 Detecta cuando la app vuelve del background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        console.log("=======Hello, I'm come back!=====");

        // Restaurar el último estado
        restoreState();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [restoreState]);

  console.log("isPlaying", isPlaying);
  console.log("showTabMenu", showTabMenu);

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
