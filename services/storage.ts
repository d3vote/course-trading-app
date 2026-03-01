import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROGRESS: '@tradequest:user',
  SUBSCRIPTION: '@tradequest:subscription',
  ONBOARDING: '@tradequest:onboarding',
} as const;

export async function saveUserProgress(data: unknown): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(data));
}

export async function loadUserProgress(): Promise<unknown | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSubscription(data: unknown): Promise<void> {
  await AsyncStorage.setItem(KEYS.SUBSCRIPTION, JSON.stringify(data));
}

export async function loadSubscription(): Promise<unknown | null> {
  const raw = await AsyncStorage.getItem(KEYS.SUBSCRIPTION);
  return raw ? JSON.parse(raw) : null;
}

export async function saveOnboarding(data: unknown): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING, JSON.stringify(data));
}

export async function loadOnboarding(): Promise<unknown | null> {
  const raw = await AsyncStorage.getItem(KEYS.ONBOARDING);
  return raw ? JSON.parse(raw) : null;
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
