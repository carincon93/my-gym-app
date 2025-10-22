import { type Ref } from "react";
import Rive, { Alignment, AutoBind, Fit, RiveRef } from "rive-react-native";

import { env } from "@/config/env";

type RivePlayerProps = {
  ref?: Ref<RiveRef>;
  artboardName: string;
  stateMachineName: string;
  setStateName?: React.Dispatch<React.SetStateAction<string>>;
};

export function RivePlayer({
  ref,
  artboardName,
  stateMachineName,
  setStateName,
}: RivePlayerProps) {
  return (
    <Rive
      ref={ref}
      artboardName={artboardName}
      resourceName={env.EXPO_PUBLIC_RIVE_FILENAME}
      stateMachineName={stateMachineName}
      dataBinding={AutoBind(true)}
      onStateChanged={(_, stateName) => {
        if (!setStateName) return;

        setStateName(stateName);
      }}
      style={{ width: "100%", height: "100%" }}
      fit={Fit.Cover}
      alignment={Alignment.Center}
    />
  );
}
