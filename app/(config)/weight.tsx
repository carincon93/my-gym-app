import { useUserWeights } from "@/hooks/use-user-weights";
import { router } from "expo-router";
import React from "react";
import { StatusBar, View } from "react-native";
import Rive, {
  Alignment,
  AutoBind,
  Fit,
  useRive,
  useRiveTrigger,
} from "rive-react-native";

export default function WeightScreen() {
  const [setRiveRef, riveRef] = useRive();

  const { addUserWeight, userWeights } = useUserWeights();

  useRiveTrigger(riveRef, "NextButtonPressed", async () => {
    handleSubmit();
  });

  const handleSubmit = () => {
    if (userWeights && userWeights?.length > 0) {
      router.push("/split-days");
      return;
    }

    addUserWeight({ weight: 71 });
  };
  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <Rive
        ref={setRiveRef}
        artboardName="Weight"
        resourceName="lilo"
        stateMachineName="Weight State Machine"
        autoplay={true}
        dataBinding={AutoBind(true)}
        style={{ width: "100%", height: "100%" }}
        fit={Fit.Cover}
        alignment={Alignment.Center}
      />
    </View>
  );
}
