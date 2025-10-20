import { LinearGradient } from "expo-linear-gradient";
import { Button, Card, Dialog, TextField } from "heroui-native";
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { CachedImage } from "@/components/cached-image";
import {
  bodyGroups,
  getCurrentSplitDay,
  getExercisesByGroup,
  getImageSource,
} from "@/data/exercises.data";
import { useAnnotations } from "@/hooks/use-annotations";
import { useExercises } from "@/hooks/use-exercises";
import { useSplitDays } from "@/hooks/use-split-days";
import { useWorkoutSets } from "@/hooks/use-workout-sets";
import { getAllFavorites } from "@/services/favorites.service";
import { useSelectedItemsStore, useWorkoutSessionStore } from "@/store/store";

const WheelPicker = lazy(() => import("@quidone/react-native-wheel-picker"));

const Picker = ({ data, value, onChange }: any) => (
  <Suspense fallback={<Text>Loading...</Text>}>
    <WheelPicker
      data={data}
      value={value}
      onValueChanging={({ item: { value } }) => onChange(value)}
      enableScrollByTapOnItem={false}
    />
  </Suspense>
);

const usePickerData = (
  startWeightValue: number = 1,
  weightDataValuesLength: number = 200
) => {
  const weightDataValues = useMemo(
    () =>
      Array.from({ length: weightDataValuesLength }, (_, i) => ({
        value: i + startWeightValue,
        label: String(i + startWeightValue),
      })),
    []
  );
  const decimalsDataValues = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        value: i + 0,
        label: String(i + 0),
      })),
    []
  );

  const repsDataValues = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
    []
  );
  return { weightDataValues, decimalsDataValues, repsDataValues };
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACING = 20;

type CardProps = {
  index: number;
  total: number;
  goToCard: (i: number) => void;
};

const Card1 = ({ index, total, goToCard }: CardProps) => {
  const { muscleSelected } = useSelectedItemsStore();

  const { splitDays } = useSplitDays();
  const currentSplitDay = getCurrentSplitDay({ splitDays });

  const workoutDay = currentSplitDay?.areUpperDays
    ? "UPPER"
    : currentSplitDay?.areUpperDays === false
      ? "LOWER"
      : "RESISTANCE";

  const setSelectedMuscle = useSelectedItemsStore(
    (set) => set.setSelectedMuscle
  );

  const handleMuscleSelected = (muscle: BodyGroup) => {
    setSelectedMuscle(muscle);
    goToCard(index + 1);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <LinearGradient
        colors={["#A855F7", "#D946EF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <Card.Body className="h-[300]">
        <Text className="text-center mt-4 mb-3.5 text-white font-bold">
          Select a body group:
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap gap-4 justify-center w-full px-2">
            {bodyGroups
              .filter((muscle) => muscle.workoutDay === workoutDay)
              .map((muscle, index) => (
                <Pressable
                  key={index}
                  className={`size-20 items-center justify-center rounded-sm`}
                  onPress={() => handleMuscleSelected(muscle.name)}
                  style={{ opacity: muscleSelected === muscle.name ? 0.6 : 1 }}
                >
                  <Image
                    className="size-full rounded-sm p-0"
                    source={muscle.image}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
          </View>
        </ScrollView>
      </Card.Body>
    </Card>
  );
};

const Card2 = React.memo(({ index, total, goToCard }: CardProps) => {
  const { exercises } = useExercises();
  const { muscleSelected } = useSelectedItemsStore();
  const { hasWorkoutSessionStarted } = useWorkoutSessionStore();

  const [favorites, setFavorites] = useState<ExerciseProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const setSelectedExercise = useSelectedItemsStore(
    (set) => set.setSelectedExercise
  );
  const setSelectedWorkoutSet = useSelectedItemsStore(
    (set) => set.setSelectedWorkoutSet
  );

  const handleExerciseSelected = useCallback(
    (exercise: ExerciseProps) => {
      setSelectedWorkoutSet(null);
      setSelectedExercise(exercise);
      goToCard(index + 1);
    },
    [goToCard, index, setSelectedExercise, setSelectedWorkoutSet]
  );

  useEffect(() => {
    let isMounted = true;
    if (muscleSelected === "NONE") return;

    const fetchFavorites = async () => {
      if (!exercises?.length) return;

      setIsLoading(true);
      try {
        const exercisesByMuscleGroup = getExercisesByGroup(
          exercises,
          muscleSelected
        );
        const allFavs = await getAllFavorites();
        const filtered = exercisesByMuscleGroup.filter((it) =>
          allFavs.includes(it.id)
        );
        if (isMounted) setFavorites(filtered);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, [muscleSelected, hasWorkoutSessionStarted, exercises]);

  // 🔹 Memoizamos los favoritos para evitar recrear el arreglo en cada render
  const memoizedFavorites = useMemo(() => favorites, [favorites]);

  // 🔹 Memoizamos el renderItem para mantener referencia estable
  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseProps }) => {
      // getImageSource is a pure function; call it directly (can't use hooks inside callbacks)
      const source = getImageSource(item.image);

      return (
        <Pressable
          className="flex-1 m-1"
          onPress={() => handleExerciseSelected(item)}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <Card className="min-h-20">
            <Card.Body className="flex-row justify-between items-center">
              <CachedImage
                className="size-32 rounded-sm"
                source={source}
                resizeMode="contain"
                imagePath={item.image}
              />
              <Text>{item.name}</Text>
            </Card.Body>
          </Card>
        </Pressable>
      );
    },
    [handleExerciseSelected]
  );

  if (isLoading) {
    return (
      <Card className="bg-[#ffadad] p-0">
        <Card.Body className="h-[300] items-center justify-center">
          <Text>Loading favorites...</Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="bg-[#ffadad] p-0">
      <Card.Body className="h-[300] p-4">
        <Text className="text-xl font-bold text-blue-500 mb-2">
          Exercises favs
        </Text>

        <FlatList
          data={memoizedFavorites}
          numColumns={1}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          removeClippedSubviews
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          updateCellsBatchingPeriod={100}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
        />
      </Card.Body>
    </Card>
  );
});
Card2.displayName = "Card2";

const WorkoutSetHistory = ({
  exerciseSelected,
  index,
  goToCard,
}: {
  exerciseSelected: ExerciseProps;
  index: number;
  goToCard: (i: number) => void;
}) => {
  const { sets } = useWorkoutSets(exerciseSelected.id);
  const setSelectedWorkoutSet = useSelectedItemsStore(
    (set) => set.setSelectedWorkoutSet
  );

  const handleWorkoutSetSelected = (workoutSet: WorkoutSetProps) => {
    setSelectedWorkoutSet(workoutSet);
    goToCard(index + 1);
  };

  return (
    <View className="gap-y-2">
      {sets?.map((workoutSet) => (
        <Pressable
          key={workoutSet.id}
          onPress={() => handleWorkoutSetSelected(workoutSet)}
        >
          <Card>
            <Card.Body>
              <View className="flex-row">
                <Text className="flex-1">REPS: {workoutSet.reps}</Text>
                <Text className="flex-1">WEIGHT: {workoutSet.weight} KG</Text>
              </View>
            </Card.Body>
          </Card>
        </Pressable>
      ))}
    </View>
  );
};

const Card3 = ({ index, total, goToCard }: CardProps) => {
  const { exerciseSelected, setSelectedWorkoutSet } = useSelectedItemsStore();
  const { annotation, addAnnotation, updateAnnotation } = useAnnotations(
    exerciseSelected?.id
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [annotationValue, setAnnotationValue] = useState<string>("");
  const [isDataSaved, setIsDataSaved] = useState<boolean>(false);

  const handleAnnotationSubmit = async () => {
    if (!annotationValue.trim()) return;

    const currentAnnotation = annotation;

    try {
      if (currentAnnotation) {
        const result = await updateAnnotation({
          id: currentAnnotation.id,
          data: { annotation: annotationValue },
        });

        if (result.changes === 1) setIsDataSaved(true);
      } else {
        const result = await addAnnotation({ annotation: annotationValue });

        if (result.indexOf("annotation") !== -1) setIsDataSaved(true);
      }
    } catch (error) {
      console.error("❌ Error guardando anotación:", error);
      setIsDataSaved(false);
    }
  };

  useEffect(() => {
    if (!annotation) return;

    setAnnotationValue(annotation.annotation);
  }, [annotation]);

  useEffect(() => {
    if (!isOpen) {
      setIsDataSaved(false);
    }
  }, [isOpen]);

  return (
    <Card className="bg-[#ffd6a5] p-0">
      <Card.Body className="h-[300] p-4">
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger className="size-16 rounded-full right-0 top-0 absolute">
            <Button variant="primary">Edit</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />

            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <Dialog.Content className="-top-20">
                <Dialog.Close />
                <View className="mb-5 gap-1.5">
                  <Dialog.Title>Add annotation</Dialog.Title>
                </View>
                <View className="mb-4">
                  <TextField>
                    <TextField.Input
                      placeholder="Type your annotation..."
                      multiline
                      numberOfLines={4}
                      value={annotationValue}
                      onChangeText={setAnnotationValue}
                    />
                  </TextField>
                </View>
                <View className="flex-row justify-between items-center gap-3">
                  <View>
                    {isDataSaved && (
                      <Text className="text-green-400">
                        Annotation saved successfully.
                      </Text>
                    )}
                  </View>
                  <View className="flex-row gap-2">
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="sm">
                        Close
                      </Button>
                    </Dialog.Close>
                    <Button
                      size="sm"
                      className="px-5"
                      onPress={handleAnnotationSubmit}
                    >
                      Save
                    </Button>
                  </View>
                </View>
              </Dialog.Content>
            </TouchableWithoutFeedback>
          </Dialog.Portal>
        </Dialog>

        <View className="justify-around items-center h-full">
          {exerciseSelected && (
            <View className="px-4 w-full">
              <Text className="mb-4 text-center text-2xl">
                {exerciseSelected?.name}
              </Text>
              <WorkoutSetHistory
                index={index}
                goToCard={goToCard}
                exerciseSelected={exerciseSelected}
              />
            </View>
          )}

          <Button
            className="rounded-full size-14"
            onPress={() => {
              setSelectedWorkoutSet(null);
              goToCard(index + 1);
            }}
          >
            <Button.LabelContent>+</Button.LabelContent>
          </Button>
        </View>
      </Card.Body>
    </Card>
  );
};

const Card4 = ({ index, total, goToCard }: CardProps) => {
  const { exerciseSelected, workoutSetSelected } = useSelectedItemsStore();

  const { weightDataValues, decimalsDataValues, repsDataValues } =
    usePickerData();

  const { addWorkoutSet, updateWorkoutSet } = useWorkoutSets(
    exerciseSelected?.id
  );

  const [weightValue, setWeightValue] = useState<number>(0);
  const [decimalsValue, setDecimalValue] = useState<number>(0);
  const [repsValue, setRepsValue] = useState<number>(0);

  const handleSubmit = () => {
    if (!exerciseSelected) return;

    const decimal = weightValue + decimalsValue / 10;

    if (workoutSetSelected) {
      updateWorkoutSet({
        id: workoutSetSelected?.id,
        exerciseId: workoutSetSelected?.exerciseId,
        data: {
          reps: repsValue,
          weight: decimal,
          rest: 240,
        },
      });
    } else {
      addWorkoutSet({
        exerciseId: exerciseSelected?.id,
        reps: repsValue,
        weight: decimal,
        rest: 240,
      });
    }

    goToCard(index - 1);
  };

  useEffect(() => {
    if (!workoutSetSelected) return;

    const weight = Math.floor(workoutSetSelected?.weight);
    const decimals = Number((workoutSetSelected?.weight % 1).toFixed(1))
      .toString()
      .replace("0.", "");

    setRepsValue(workoutSetSelected.reps);
    setWeightValue(weight);
    setDecimalValue(Number(decimals));
  }, [workoutSetSelected]);

  return (
    <Card className="bg-[#caffbf] mb-1">
      <Card.Body className="h-[300] flex-row flex-wrap gap-2 justify-center w-full">
        <Text className="text-2xl">{exerciseSelected?.name}</Text>

        <View className="flex-row flex-wrap gap-2 justify-center w-full">
          <View className="w-1/4">
            <Text className="text-center font-bold">Reps</Text>

            <View className="flex-row flex-wrap gap-2 justify-center p-1 w-full">
              <View className="w-4/5">
                <Picker
                  data={repsDataValues}
                  // value={repsValue}
                  onChange={setRepsValue}
                />
              </View>
              <View
                style={{
                  width: 1,
                  height: "100%",
                  backgroundColor: "gray",
                  opacity: 0.3,
                }}
              />
            </View>
          </View>

          <View className="w-2/4">
            <Text className="text-center font-bold">Weight (KG)</Text>
            <View style={styles.grid}>
              <View className="w-1/4">
                <Picker
                  data={weightDataValues}
                  // value={weightValue}
                  onChange={setWeightValue}
                />
              </View>

              <View className="items-center justify-center px-3.5">
                <Text className="text-black">.</Text>
              </View>

              <View className="w-1/4">
                <Picker
                  data={decimalsDataValues}
                  // value={decimalsValue}
                  onChange={setDecimalValue}
                />
              </View>
            </View>
          </View>
        </View>

        <Button
          className="absolute bottom-0 right-0 w-full"
          onPress={handleSubmit}
        >
          <Button.LabelContent>
            {workoutSetSelected ? "Update" : "Save"}
          </Button.LabelContent>
        </Button>
      </Card.Body>
    </Card>
  );
};

const cards = [Card1, Card2, Card3, Card4];

export default function FormSlider() {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const goToCard = (index: number) => {
    if (index >= 0 && index < cards.length) {
      scrollRef.current?.scrollTo({
        x: index * (CARD_WIDTH + SPACING),
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  const SlideCard = ({
    CardComponent,
    index,
  }: {
    CardComponent: any;
    index: number;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        [
          (index - 1) * (CARD_WIDTH + SPACING),
          index * (CARD_WIDTH + SPACING),
          (index + 1) * (CARD_WIDTH + SPACING),
        ],
        [0.9, 1, 0.9]
      );
      return { transform: [{ scale }] };
    });

    return (
      <Animated.View
        style={[animatedStyle, { width: CARD_WIDTH, marginRight: SPACING }]}
      >
        <CardComponent index={index} total={cards.length} goToCard={goToCard} />
      </Animated.View>
    );
  };

  return (
    <View>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (width - CARD_WIDTH) / 2,
          paddingRight: (width - CARD_WIDTH) / 2 - SPACING, // evita overscroll
        }}
      >
        {cards.map((CardComponent, index) => (
          <SlideCard key={index} CardComponent={CardComponent} index={index} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    padding: 4,
    width: "100%",
  },
  separator: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});
