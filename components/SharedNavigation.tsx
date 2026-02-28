import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';

interface SharedNavigationProps {
  activeTab: 'learn' | 'simulator' | 'leaderboard' | 'profile';
  onTabPress: (tabName: 'learn' | 'simulator' | 'leaderboard' | 'profile') => void;
  showUserStats?: boolean;
}

export function SharedNavigation({ 
  activeTab, 
  onTabPress, 
  showUserStats = true 
}: SharedNavigationProps) {
  const { progress } = useAppSelector((state: any) => state.user);

  return (
    <View style={styles.container}>
      {/* User Stats Bar */}
      {showUserStats && (
        <View style={styles.userStatsBar}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={16} color={Colors.warning} />
            <ThemedText style={styles.statText}>{progress.currentStreak}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="diamond" size={16} color={Colors.accent} />
            <ThemedText style={styles.statText}>{progress.gems}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color={Colors.primary} />
            <ThemedText style={styles.statText}>Lvl {progress.currentLevel}</ThemedText>
          </View>
        </View>
      )}

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'learn' && styles.activeNavItem]} 
          onPress={() => onTabPress('learn')}
        >
          <Ionicons 
            name="book" 
            size={24} 
            color={activeTab === 'learn' ? Colors.tint : Colors.darkGray} 
          />
          <ThemedText style={[styles.navText, activeTab === 'learn' && styles.activeNavText]}>
            Learn
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'simulator' && styles.activeNavItem]} 
          onPress={() => onTabPress('simulator')}
        >
          <Ionicons 
            name="game-controller" 
            size={24} 
            color={activeTab === 'simulator' ? Colors.tint : Colors.darkGray} 
          />
          <ThemedText style={[styles.navText, activeTab === 'simulator' && styles.activeNavText]}>
            Simulator
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'leaderboard' && styles.activeNavItem]} 
          onPress={() => onTabPress('leaderboard')}
        >
          <Ionicons 
            name="trophy" 
            size={24} 
            color={activeTab === 'leaderboard' ? Colors.tint : Colors.darkGray} 
          />
          <ThemedText style={[styles.navText, activeTab === 'leaderboard' && styles.activeNavText]}>
            Leaderboard
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
          onPress={() => onTabPress('profile')}
        >
          <Ionicons 
            name="person" 
            size={24} 
            color={activeTab === 'profile' ? Colors.tint : Colors.darkGray} 
          />
          <ThemedText style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>
            Profile
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    zIndex: 1000,
  },
  userStatsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
    backgroundColor: Colors.background,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  navigationBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 30, // Safe area for home indicator
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    // Active state styling
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.darkGray,
  },
  activeNavText: {
    color: Colors.tint,
    fontWeight: '600',
  },
}); 