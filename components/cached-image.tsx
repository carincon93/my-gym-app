import React from 'react';
import { Image, ImageProps } from 'react-native';
import { useImageCache } from '@/context/image-cache-context';

interface CachedImageProps extends ImageProps {
  imagePath: string;
}

export function CachedImage({ imagePath, ...props }: CachedImageProps) {
  const { cachedImages, setCachedStatus } = useImageCache();

  if (!cachedImages[imagePath]) {
    return (
      <Image
        {...props}
        onLoad={() => setCachedStatus(imagePath, true)}
        defaultSource={require("@/assets/images/placeholder.png")}
      />
    );
  }

  return <Image {...props} />;
}