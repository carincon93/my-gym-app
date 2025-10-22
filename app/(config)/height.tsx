import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useRive, useRiveNumber, useRiveTrigger } from "rive-react-native";

import { RivePlayer } from "@/components/rive-player";
import { useUsers } from "@/hooks/use-users";

const MINHEIGHT = 140;
const MAXHEIGHT = 220;

export default function HeightScreen() {
  const [setRiveRef, riveRef] = useRive();
  const [heightNumber, setHeightNumber] = useRiveNumber(
    riveRef,
    "HeightNumber"
  );

  const { createOrUpdateUser, user } = useUsers();

  useRiveTrigger(riveRef, "NextButtonPressed", async () => {
    await handleSubmit();

    router.push("/weight");
  });

  const handleSubmit = async () => {
    if (!heightNumber || heightNumber === user?.height) return;

    await createOrUpdateUser({
      id: user?.id,
      height: heightNumber,
      gender: "undefined",
    });
  };

  useEffect(() => {
    if (!user || !riveRef) return;

    riveRef.play();

    setHeightNumber(user.height);
  }, [user, setHeightNumber, riveRef]);

  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <RivePlayer
        ref={setRiveRef}
        artboardName="Height"
        stateMachineName="State Machine 1"
      />
      <Animated.View className="absolute bottom-56">
        <View className="flex-row items-center">
          <Text className="text-white">{MINHEIGHT} cm</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={MINHEIGHT}
            maximumValue={MAXHEIGHT}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#FFFFFF"
            step={1}
            value={heightNumber}
            onValueChange={setHeightNumber}
            vertical={true}
          />
          <Text className="text-white">{MAXHEIGHT} cm</Text>
        </View>
      </Animated.View>
    </View>
  );
}
