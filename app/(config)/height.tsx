import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import Animated from "react-native-reanimated";
import Rive, {
  Alignment,
  AutoBind,
  Fit,
  useRive,
  useRiveNumber,
  useRiveTrigger,
} from "rive-react-native";

import { useUsers } from "@/hooks/use-users";
import { useHideShowTabMenuStore } from "@/store/store";

export default function HeightScreen() {
  const [setRiveRef, riveRef] = useRive();
  const [heightNumber, setHeightNumber] = useRiveNumber(
    riveRef,
    "HeightNumber"
  );
  const { showTabMenu } = useHideShowTabMenuStore();

  const { createOrUpdateUser, user } = useUsers();

  useRiveTrigger(riveRef, "NextButtonPressed", async () => {
    handleSubmit();
  });

  const handleSubmit = async () => {
    if (!heightNumber) return;

    await createOrUpdateUser({
      id: user?.id,
      height: heightNumber !== user?.height ? heightNumber : user?.height,
      gender: "undefined",
    });

    router.push("/weight");
  };

  useEffect(() => {
    if (!user || !riveRef) return;

    setHeightNumber(user.height);
  }, [user, setHeightNumber, riveRef]);

  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <Rive
        ref={setRiveRef}
        artboardName="Height"
        resourceName="lilo2"
        stateMachineName="Height State Machine"
        autoplay={true}
        dataBinding={AutoBind(true)}
        style={{ width: "100%", height: "100%" }}
        fit={Fit.Cover}
        alignment={Alignment.Center}
      />

      <Animated.View className="absolute bottom-56">
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={140}
          maximumValue={220}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          thumbTintColor="#FFFFFF"
          step={1}
          value={heightNumber}
          onValueChange={setHeightNumber}
          vertical={true}
        />
      </Animated.View>
    </View>
  );
}
