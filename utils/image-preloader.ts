import { localImages } from "@/data/exercises.data";
import { Image } from "react-native";

export const preloadImages = () => {
  const imageAssets = Object.values(localImages).map((image) => {
    return Image.prefetch(Image.resolveAssetSource(image).uri);
  });

  return Promise.all(imageAssets);
};
