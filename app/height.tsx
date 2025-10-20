import { useUsers } from "@/hooks/use-users";
import { router } from "expo-router";
import { Button } from "heroui-native";
import React from "react";
import { Text, View } from "react-native";

export default function HeightScreen() {
  const { addUser, users } = useUsers();

  const handleSubmit = () => {
    if (users && users?.length > 0) {
      router.push("/weight");
      return;
    }

    addUser({ height: 180, gender: "male" });
  };
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-blue-600 text-4xl">HeightScreen</Text>

        <Button onPress={handleSubmit}>Create user</Button>
      </View>
    </View>
  );
}
