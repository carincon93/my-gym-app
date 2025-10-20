import * as FileSystem from "expo-file-system/legacy";
import { Link } from "expo-router";
import { Button } from "heroui-native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import FormSlider from "@/components/form-slider";
import { DATABASE_NAME } from "@/constants/constants";
import { useSelectedItemsStore, useWorkoutSessionStore } from "@/store/store";

const AnimatedFormSlider = ({
  hasWorkoutSessionStarted,
}: {
  hasWorkoutSessionStarted: boolean;
}) => {
  const translateY = useSharedValue(200); // arranca fuera de pantalla
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (hasWorkoutSessionStarted) {
      // animación de entrada
      translateY.value = withTiming(0, { duration: 400 });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      // animación de salida
      translateY.value = withTiming(200, { duration: 400 });
      opacity.value = withTiming(0, { duration: 400 });
    }
  }, [hasWorkoutSessionStarted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      <FormSlider />
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { hasWorkoutSessionStarted, setHasWorkoutSessionStarted } =
    useWorkoutSessionStore();
  const setSelectedMuscle = useSelectedItemsStore(
    (set) => set.setSelectedMuscle
  );

  const resetDb = async () => {
    const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
    console.log("DB borrada ✅");
  };

  useEffect(() => {
    if (!hasWorkoutSessionStarted) {
      setSelectedMuscle("NONE");
    }
  }, [hasWorkoutSessionStarted]);

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-blue-600 text-4xl">HomeScreen</Text>
        <Button onPress={() => setHasWorkoutSessionStarted(true)}>
          <Button.LabelContent>Start session</Button.LabelContent>
        </Button>
        <Button onPress={() => setHasWorkoutSessionStarted(false)}>
          <Button.LabelContent>Stop session</Button.LabelContent>
        </Button>

        <Button onPress={() => resetDb()}>
          <Button.LabelContent>Reset DB</Button.LabelContent>
        </Button>

        <Link href="/height">Height</Link>
      </View>

      <AnimatedFormSlider hasWorkoutSessionStarted={hasWorkoutSessionStarted} />
    </View>
  );
}
