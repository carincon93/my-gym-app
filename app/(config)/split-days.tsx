import { useSplitDays } from "@/hooks/use-split-days";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import Rive, { Alignment, AutoBind, Fit, useRive } from "rive-react-native";

export default function SplitDaysScreen() {
  const { addSplitDay, splitDays } = useSplitDays();
  const [setRiveRef, riveRef] = useRive();

  const handleSubmit = () => {
    if (splitDays && splitDays?.length > 0) {
      router.push("/");
      return;
    }

    addSplitDay({ days: "Wed-Sat", areUpperDays: true });
    addSplitDay({ days: "Thu-Sun", areUpperDays: false });
  };

  riveRef?.play();

  return (
    <View className="flex-1 items-center justify-center">
      <Rive
        ref={setRiveRef}
        artboardName="Split Days"
        resourceName="lilo"
        stateMachineName="State Machine 1"
        dataBinding={AutoBind(true)}
        style={{ width: "100%", height: "100%" }}
        fit={Fit.Cover}
        alignment={Alignment.Center}
      />
      {/* <Text className="text-blue-600 text-4xl">SplitDaysScreen</Text>

        <Button onPress={handleSubmit}>Create split</Button> */}
    </View>
  );
}
