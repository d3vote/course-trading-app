import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SharedNavigation } from './SharedNavigation';
import { Colors } from '@/constants/Colors';

// Import all screen components
import LearnScreen from '@/app/(tabs)/index';
import BookScreen from '@/app/book';
import SimulatorScreen from '@/app/simulator';
import LeaderboardScreen from '@/app/leaderboard';
import ProfileScreen from '@/app/profile';

type TabName = 'learn' | 'simulator' | 'leaderboard' | 'profile';

interface TabNavigatorProps {
  initialTab?: TabName;
}

// Helper function to determine which tab should be active
const getActiveTab = (currentScreen: string): TabName => {
  if (['learn', 'book', 'unit', 'lesson'].includes(currentScreen)) {
    return 'learn';
  }
  return currentScreen as TabName;
};

export function TabNavigator({ initialTab = 'learn' }: TabNavigatorProps) {
  const [currentScreen, setCurrentScreen] = useState<string>('learn');

  const handleTabPress = (tabName: TabName) => {
    // Navigate to the tab screen
    setCurrentScreen(tabName);
  };

  const navigateToScreen = (screenName: string) => {
    setCurrentScreen(screenName);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'learn':
        return <LearnScreen onNavigate={navigateToScreen} />;
      case 'book':
        return <BookScreen onNavigate={navigateToScreen} />;
      case 'unit':
        return <LearnScreen onNavigate={navigateToScreen} />;
      case 'lesson':
        return <LearnScreen onNavigate={navigateToScreen} />;
      case 'simulator':
        return <SimulatorScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <LearnScreen onNavigate={navigateToScreen} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Render the active screen */}
      {renderActiveScreen()}
      
      {/* Navigation bar - always show, but determine active tab */}
      <SharedNavigation 
        activeTab={getActiveTab(currentScreen)}
        onTabPress={handleTabPress}
        showUserStats={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
}); 