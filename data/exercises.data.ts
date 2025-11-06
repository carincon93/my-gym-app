export const getExercisesByGroup = (
  exercises: ExerciseProps[],
  muscleGroup: BodyGroup
): ExerciseProps[] => {
  return exercises?.filter((exercise) => exercise.muscleGroup === muscleGroup);
};

// export const getCurrentSplitDay = ({
//   splitDays,
// }: {
//   splitDays?: SplitDay[];
// }) => {
//   const shortDay = getShortDay();
//   return splitDays?.find((splitDay) => splitDay.days.includes("Sat"));
// };

export const bodyGroups: { name: BodyGroup; image: any; workoutDay: string }[] =
  [
    {
      name: "UPPERBACK",
      image: require("@/assets/images/body-groups/upper-back.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "BICEPS",
      image: require("@/assets/images/body-groups/biceps.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "CHEST",
      image: require("@/assets/images/body-groups/chest.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "FOREARMS",
      image: require("@/assets/images/body-groups/forearms.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "LATS",
      image: require("@/assets/images/body-groups/lats.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "LOWERBACK",
      image: require("@/assets/images/body-groups/lower-back.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "NECK",
      image: require("@/assets/images/body-groups/neck.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "SHOULDERS",
      image: require("@/assets/images/body-groups/shoulders.webp"),
      workoutDay: "UPPER",
    },
    {
      name: "TRICEPS",
      image: require("@/assets/images/body-groups/triceps.webp"),
      workoutDay: "UPPER",
    },
    // {
    //   name: "CORE",
    //   image: require("@/assets/images/body-groups/core.webp"),
    //   workoutDay: "RESISTANCE",
    // },
    // {
    //   name: "RESISTANCE",
    //   image: require("@/assets/images/body-groups/resistance.webp"),
    //   workoutDay: "RESISTANCE",
    // },
  ];
