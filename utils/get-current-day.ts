interface CurrentDay {
  shortDay: string;
  numberDay: string;
}

export const getCurrentDay = (): CurrentDay => {
  const today = new Date();
  const shortDay = today.toLocaleDateString("en-US", { weekday: "short" });
  const numberDay = today.getDate().toString();

  return {
    shortDay,
    numberDay,
  };
};
