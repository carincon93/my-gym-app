import { RivePlayer } from "@/components/rive-player";
import { useUserWeights } from "@/hooks/use-user-weights";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useRive, useRiveString, useRiveTrigger } from "rive-react-native";

const MINWEIGHT = 40;
const MAXWEIGHT = 150;

export default function WeightScreen() {
  const [setRiveRef, riveRef] = useRive();
  const [weightString, setWeightString] = useRiveString(
    riveRef,
    "WeightString"
  );
  const { createOrUpdateUserWeight, initialWeight } = useUserWeights();

  useRiveTrigger(riveRef, "NextButtonPressed", async () => {
    await handleSubmit();

    router.push("/split-days");
  });

  const handleSubmit = async () => {
    const weightNumber = Number(weightString);

    if (weightNumber === initialWeight?.weight) return;

    await createOrUpdateUserWeight({
      id: initialWeight?.id,
      weight: weightNumber,
    });
  };

  useEffect(() => {
    if (!initialWeight?.weight || !riveRef) return;

    riveRef.play();

    setWeightString(initialWeight.weight.toString());
  }, [initialWeight, setWeightString, riveRef]);

  console.log(initialWeight);

  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <RivePlayer
        ref={setRiveRef}
        artboardName="Weight"
        stateMachineName="Weight State Machine"
      />
      <Animated.View className="absolute bottom-56">
        <View className="flex-row items-center">
          <Text className="text-white">{MINWEIGHT} kg</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={MINWEIGHT}
            maximumValue={MAXWEIGHT}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#FFFFFF"
            step={1}
            value={Number(weightString)}
            onValueChange={(value) => setWeightString(value.toString())}
          />
          <Text className="text-white">{MAXWEIGHT} kg</Text>
        </View>
      </Animated.View>
    </View>
  );
}
