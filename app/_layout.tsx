import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { hydrateUser, persistUser } from '@/store/slices/userSlice';
import { hydrateSubscription, checkExpiration } from '@/store/slices/subscriptionSlice';

function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateUser());
    store.dispatch(hydrateSubscription());
    store.dispatch(checkExpiration());
  }, []);

  // Auto-persist on state changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      store.dispatch(persistUser());
    });
    return unsubscribe;
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="paywall"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="broker-offer"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="lesson/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </AppInitializer>
    </Provider>
  );
}
