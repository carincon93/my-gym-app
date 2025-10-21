import Rive, { Alignment, AutoBind, Fit, useRive } from "rive-react-native";

export default function SplitDaysRive() {
  const [setRiveRef, riveRef] = useRive();

  return (
    <Rive
      ref={setRiveRef}
      artboardName="Split Days"
      resourceName="lilo"
      stateMachineName="Split Days State Machine"
      autoplay={true}
      dataBinding={AutoBind(true)}
      style={{ width: "100%", height: "100%" }}
      fit={Fit.Cover}
      alignment={Alignment.Center}
    />
  );
}
