import { useHideShowTabMenuStore } from "@/store/store";
import { getCurrentDay } from "@/utils/get-current-day";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { StatusBar, View } from "react-native";
import Rive, {
  Alignment,
  AutoBind,
  Fit,
  useRive,
  useRiveBoolean,
  useRiveString,
  useRiveTrigger,
} from "rive-react-native";

export default function HomeScreen() {
  const { numberDay, shortDay } = useMemo(() => getCurrentDay(), []);
  const { setShowTabMenu } = useHideShowTabMenuStore();

  const [setRiveRef, riveRef] = useRive();
  const [, setCurrentDayNumber] = useRiveString(riveRef, "CurrentDayNumber");
  const [, setCurrentDayText] = useRiveString(riveRef, "CurrentDayText");

  // Play trigger: dispatch PLAY
  useRiveTrigger(riveRef, "TriggPlay", async () => {
    console.log("Play clicked");
    setShowTabMenu(false);
  });

  // Stop trigger: dispatch STOP
  useRiveTrigger(riveRef, "TriggStop", async () => {
    console.log("Stop clicked");
    setShowTabMenu(true);
  });

  // AddSet trigger: dispatch AddSet
  useRiveTrigger(riveRef, "TriggAddSets", async () => {
    console.log("Add sets clicked");
    router.push("/(config)/split-days");
  });

  const [isPlaying, setIsPlaying] = useRiveBoolean(riveRef, "IsPlaying");
  const [isUpperWorkout, setIsUpperWorkout] = useRiveBoolean(
    riveRef,
    "IsUpperWorkout"
  );

  useEffect(() => {
    if (!isPlaying) return;

    setIsUpperWorkout(true);
  }, [isPlaying, setIsUpperWorkout]);

  useEffect(() => {
    if (isPlaying) return;

    setCurrentDayText(shortDay);
    setCurrentDayNumber(numberDay);
  }, [isPlaying, shortDay, numberDay, setCurrentDayText, setCurrentDayNumber]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("Hello, I'm focused!");
      setShowTabMenu(true);

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  console.log(isUpperWorkout);

  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <Rive
        ref={setRiveRef}
        artboardName="Training Day"
        resourceName="lilo"
        stateMachineName="Training Day State Machine"
        autoplay={true}
        dataBinding={AutoBind(true)}
        style={{ width: "100%", height: "100%" }}
        fit={Fit.Cover}
        alignment={Alignment.Center}
      />
    </View>
  );
}
