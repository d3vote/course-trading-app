import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

interface NavbarProps {
  streak: number;
  dollars: number;
}

export function Navbar({ streak, dollars = 0 }: NavbarProps) {
  const getStreakColor = () => {
    return streak > 0 ? Colors.warning : Colors.darkGray;
  };

  const getStreakIcon = () => {
    return streak > 0 ? 'flame' : 'flame-outline';
  };

  return (
    <View style={styles.container}>
      {/* Top Stats Bar */}
      <View style={styles.statsBar}>
        {/* Streak */}
        <View style={styles.statItem}>
          <Ionicons 
            name={getStreakIcon() as any} 
            size={20} 
            color={getStreakColor()} 
          />
          <ThemedText style={[styles.statValue, { color: getStreakColor() }]}>
            {streak}
          </ThemedText>
        </View>

        {/* Dollars */}
        <View style={styles.statItem}>
          <View style={styles.dollarsContainer}>
            <Ionicons name="cash" size={20} color={Colors.secondary} />
            {dollars > 0 && (
              <View style={styles.notificationDot} />
            )}
          </View>
          <ThemedText style={[styles.statValue, { color: Colors.secondary }]}>
            {dollars}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingTop: 30, // Safe area for status bar
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  statsBar: {
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dollarsContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1,
    borderColor: Colors.background,
  },
}); 