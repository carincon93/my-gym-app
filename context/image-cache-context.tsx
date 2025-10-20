import React, { createContext, useContext, useState } from "react";

type ImageCacheContextType = {
  cachedImages: Record<string, boolean>;
  setCachedStatus: (imagePath: string, status: boolean) => void;
};

const ImageCacheContext = createContext<ImageCacheContextType>({
  cachedImages: {},
  setCachedStatus: () => {},
});

export function ImageCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cachedImages, setCachedImages] = useState<Record<string, boolean>>({});

  const setCachedStatus = (imagePath: string, status: boolean) => {
    setCachedImages((prev) => ({ ...prev, [imagePath]: status }));
  };

  return (
    <ImageCacheContext.Provider value={{ cachedImages, setCachedStatus }}>
      {children}
    </ImageCacheContext.Provider>
  );
}

export const useImageCache = () => useContext(ImageCacheContext);
