import { useUserWeights } from "@/hooks/use-user-weights";
import { router } from "expo-router";
import { Button } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";

export default function WeightScreen() {
  const { addUserWeight, userWeights } = useUserWeights();

  const handleSubmit = () => {
    if (userWeights && userWeights?.length > 0) {
      router.push("/split-days");
      return;
    }

    addUserWeight({ weight: 71 });
  };
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-blue-600 text-4xl">WeightScreen</Text>

        <Button onPress={handleSubmit}>Create weight</Button>
      </View>
    </View>
  );
}
