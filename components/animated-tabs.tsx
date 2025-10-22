import { router } from "expo-router";
import { Button } from "heroui-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useWorkoutSessionStore } from "@/store/useWorkoutSessionStore";

export const AnimatedTabMenu = () => {
  const { showTabMenu, dispatch } = useWorkoutSessionStore();

  const translateY = useSharedValue(200); // arranca fuera de pantalla
  const opacity = useSharedValue(0);

  const handleConfigButton = () => {
    dispatch({ type: "SHOWTABMENU", payload: false });
    router.push("/height");
  };

  useEffect(() => {
    if (showTabMenu) {
      // animación de entrada
      translateY.value = withTiming(0, { duration: 400 });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      // animación de salida
      translateY.value = withTiming(200, { duration: 400 });
      opacity.value = withTiming(0, { duration: 400 });
    }
  }, [showTabMenu, opacity, translateY]);

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
      <View className="absolute bottom-10 left-0 right-0 justify-between flex-row gap-4 px-2">
        <Button className="flex-1" onPress={() => router.push("/")}>
          <Button.LabelContent>Home</Button.LabelContent>
        </Button>
        <Button className="flex-1" onPress={handleConfigButton}>
          <Button.LabelContent>Config</Button.LabelContent>
        </Button>
      </View>
    </Animated.View>
  );
};
