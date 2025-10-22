import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistStorage, StorageValue } from "zustand/middleware";

export const createJSONStorage = <T>(): PersistStorage<T> => ({
  getItem: async (name): Promise<StorageValue<T> | null> => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
});
