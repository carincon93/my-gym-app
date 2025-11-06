import { env } from "@/config/env";
import React, { forwardRef } from "react";
import Rive, { Alignment, AutoBind, Fit, RiveRef } from "rive-react-native";

type RivePlayerProps = {
  artboardName: string;
  stateMachineName: string;
  setStateName?: React.Dispatch<React.SetStateAction<string>>;
};

// 👇 forwardRef allows parent components to access the internal Rive ref
export const RivePlayer = forwardRef<RiveRef, RivePlayerProps>(
  ({ artboardName, stateMachineName, setStateName }, ref) => {
    return (
      <Rive
        ref={ref}
        artboardName={artboardName}
        resourceName={env.EXPO_PUBLIC_RIVE_FILENAME}
        stateMachineName={stateMachineName}
        dataBinding={AutoBind(true)}
        onStateChanged={(_, stateName) => {
          if (setStateName) setStateName(stateName);
        }}
        style={{ width: "100%", height: "100%" }}
        fit={Fit.Cover}
        alignment={Alignment.Center}
      />
    );
  }
);

RivePlayer.displayName = "RivePlayer";
