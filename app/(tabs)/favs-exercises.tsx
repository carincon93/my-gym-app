import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useExercises } from "@/hooks/use-exercises";
import { getAllFavorites, syncFavorites } from "@/services/favorites.service";

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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favoritos</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFav = favorites.includes(item.id);

          return (
            <Pressable onPress={() => toggleFavorite(item.id)}>
              <View
                style={[
                  styles.listItem,
                  { backgroundColor: isFav ? "tomato" : "grey" },
                ]}
              >
                <Text style={styles.text}>{item.name}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  listItem: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: "white",
  },
});
