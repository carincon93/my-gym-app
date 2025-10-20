import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ReactNode } from "react";
import { SharedValue } from "react-native-reanimated";

type BottomSheetComponentProps = {
  children: ReactNode;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  scroll: boolean;
  snapPoints:
    | (string | number)[]
    | SharedValue<(string | number)[]>
    | undefined;
};

export const BottomSheetComponent = ({
  children,
  bottomSheetRef,
  scroll,
  snapPoints,
}: BottomSheetComponentProps) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      enableContentPanningGesture={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
    >
      {scroll ? (
        <BottomSheetScrollView>{children}</BottomSheetScrollView>
      ) : (
        <BottomSheetView>{children}</BottomSheetView>
      )}
    </BottomSheet>
  );
};
