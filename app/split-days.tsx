import { useSplitDays } from "@/hooks/use-split-days";
import { router } from "expo-router";
import { Button } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";

export default function SplitDaysScreen() {
  const { addSplitDay, splitDays } = useSplitDays();

  const handleSubmit = () => {
    if (splitDays && splitDays?.length > 0) {
      router.push("/");
      return;
    }

    addSplitDay({ days: "Wed-Sat", areUpperDays: true });
    addSplitDay({ days: "Thu-Sun", areUpperDays: false });
  };
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-blue-600 text-4xl">SplitDaysScreen</Text>

        <Button onPress={handleSubmit}>Create split</Button>
      </View>
    </View>
  );
}
