import { Provider } from 'react-redux';
import { store } from '@/store';
import { TabNavigator } from '@/components/TabNavigator';
import { LearningProgressProvider } from '@/contexts/LearningProgressContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <LearningProgressProvider>
        <TabNavigator />
      </LearningProgressProvider>
    </Provider>
  );
}
