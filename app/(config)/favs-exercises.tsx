import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

import { useExercises } from "@/hooks/use-exercises";
import { getAllFavorites, syncFavorites } from "@/services/favorites.service";
import { getImageSource } from "@/utils/get-image-source";

export default function FavsExercisesScreen() {
  const { exercises } = useExercises();

  const [favorites, setFavorites] = useState<string[]>([]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getAllFavorites().then(setFavorites);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      syncFavorites(favorites).catch(console.error);
    }, 2000);
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  console.log("You are in favorites screen");

  return (
    <View className="flex-1 items-center justify-center bg-red-400">
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <Text>Favoritos</Text>

      <FlatList
        className="flex-1 bg-slate-500 size-full"
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFav = favorites.includes(item.id);

          return (
            <Pressable onPress={() => toggleFavorite(item.id)}>
              <View>
                <Image source={getImageSource(item.image)} />
                <Text>{item.name}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
