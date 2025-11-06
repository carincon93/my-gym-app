export const localImages: Record<string, any> = {
  "upperback-seated-row.webp": require("@/assets/images/exercises/upper-seated-row.webp"),

  "biceps-curl-in-machine.webp": require("@/assets/images/exercises/biceps-curl-in-machine.webp"),
  "biceps-in-incline-bench.webp": require("@/assets/images/exercises/biceps-in-incline-bench.webp"),
  "biceps-preacher-curl.webp": require("@/assets/images/exercises/biceps-preacher-curl.webp"),
  "biceps-roman-bar.webp": require("@/assets/images/exercises/biceps-roman-bar.webp"),

  "chest-dips-assist.webp": require("@/assets/images/exercises/chest-dips-assist.webp"),
  "chest-pec-fly-var1.webp": require("@/assets/images/exercises/chest-pec-fly-var1.webp"),
  "chest-flat-bench-press.webp": require("@/assets/images/exercises/chest-flat-bench-press.webp"),
  "chest-incline-bench-press.webp": require("@/assets/images/exercises/chest-incline-bench-press.webp"),
  "chest-press-in-machine.webp": require("@/assets/images/exercises/chest-press-in-machine.webp"),

  "forearms-reverse-curl.webp": require("@/assets/images/exercises/forearms-reverse-curl.webp"),

  "lat-pull-down-var1.webp": require("@/assets/images/exercises/lat-pull-down-var1.webp"),
  "lats-in-chin-assist.webp": require("@/assets/images/exercises/lats-in-chin-assist.webp"),
  "lats-landmine-row.webp": require("@/assets/images/exercises/lats-landmine-row.webp"),
  "lats-seated-row.webp": require("@/assets/images/exercises/lats-seated-row.webp"),

  "lowerback-seated-back-extension.webp": require("@/assets/images/exercises/lowerback-seated-back-extension.webp"),

  "neck-raises.webp": require("@/assets/images/exercises/neck-raises.webp"),

  "rear-deltoids.webp": require("@/assets/images/exercises/rear-deltoids.webp"),
  "shoulders-press-in-machine.webp": require("@/assets/images/exercises/shoulders-press-in-machine.webp"),
  "shoulders-face-pull.webp": require("@/assets/images/exercises/shoulders-face-pull.webp"),

  "triceps-in-cable.webp": require("@/assets/images/exercises/triceps-in-cable.webp"),

  "glutes-hip-trust-in-machine.webp": require("@/assets/images/exercises/glutes-hip-trust-in-machine.webp"),
  "glutes-hip-trust-with-bar.webp": require("@/assets/images/exercises/glutes-hip-trust-with-bar.webp"),

  "hamstrings-prone-leg-curl.webp": require("@/assets/images/exercises/hamstrings-prone-leg-curl.webp"),
  "hamstrings-seated-leg-curl.webp": require("@/assets/images/exercises/hamstrings-seated-leg-curl.webp"),

  "hip-abductor.webp": require("@/assets/images/exercises/hip-abductor.webp"),

  "quads-45-degree-leg-press.webp": require("@/assets/images/exercises/quads-45-degree-leg-press.webp"),
  "quads-hack-squat.webp": require("@/assets/images/exercises/quads-hack-squat.webp"),
  "quads-horizontal-leg-press.webp": require("@/assets/images/exercises/quads-horizontal-leg-press.webp"),
  "quads-in-hammer-machine.webp": require("@/assets/images/exercises/quads-in-hammer-machine.webp"),
  "quads-leg-extension.webp": require("@/assets/images/exercises/quads-leg-extension.webp"),
  "quads-perfect-squat.webp": require("@/assets/images/exercises/quads-perfect-squat.webp"),
};

export const getImageSource = (image: string) => {
  if (image.startsWith("http")) {
    // Remota
    return { uri: image };
  } else if (image.startsWith("file://")) {
    // Local en almacenamiento del dispositivo
    return { uri: image };
  } else {
    console.log(image);

    // Asset local de la app
    return localImages[image];
  }
};
