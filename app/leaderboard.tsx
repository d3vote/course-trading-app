import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';

// Mock data for leaderboard
const mockLeaderboardData = [
  { id: 1, rank: 1, username: 'TradingPro', gems: 2840, streak: 15, avatar: 'trophy', medal: 'gold' },
  { id: 2, rank: 2, username: 'BullTrader', gems: 2650, streak: 12, avatar: 'trophy', medal: 'silver' },
  { id: 3, rank: 3, username: 'ChartMaster', gems: 2480, streak: 10, avatar: 'trophy', medal: 'bronze' },
  { id: 4, rank: 4, username: 'RiskManager', gems: 2300, streak: 8, avatar: 'person' },
  { id: 5, rank: 5, username: 'PatternHunter', gems: 2150, streak: 7, avatar: 'person' },
  { id: 6, rank: 6, username: 'CryptoKing', gems: 1980, streak: 6, avatar: 'person' },
  { id: 7, rank: 7, username: 'StockGuru', gems: 1820, streak: 5, avatar: 'person' },
  { id: 8, rank: 8, username: 'MarketWizard', gems: 1650, streak: 4, avatar: 'person' },
  { id: 9, rank: 9, username: 'TradeQueen', gems: 1480, streak: 3, avatar: 'person' },
  { id: 10, rank: 10, username: 'InvestorPro', gems: 1320, streak: 2, avatar: 'person' },
];

export default function LeaderboardScreen() {
  const { progress } = useAppSelector((state: any) => state.user);
  
  // Use all user progress data from Redux store
  const username = progress.username;
  const gems = progress.gems;
  const streak = progress.currentStreak;
  const currentLevel = progress.currentLevel;
  const totalXP = progress.totalXP;

  const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => {
    const isCurrentUser = item.username === username;
    
    const getMedalColor = (medal: string) => {
      switch (medal) {
        case 'gold': return '#FFD700';
        case 'silver': return '#C0C0C0';
        case 'bronze': return '#CD7F32';
        default: return Colors.tint;
      }
    };
    
    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <ThemedText style={styles.rankText}>{item.rank}</ThemedText>
          {item.rank <= 3 && (
            <View style={styles.medalContainer}>
              <Ionicons 
                name="medal" 
                size={20} 
                color={getMedalColor(item.medal)} 
              />
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <ThemedText style={styles.username}>{item.username}</ThemedText>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={14} color={Colors.warning} />
            <ThemedText style={styles.streakText}>{item.streak} days</ThemedText>
          </View>
        </View>
        
        <View style={styles.scoreContainer}>
          <ThemedText style={styles.gemsText}>{item.gems}</ThemedText>
          <ThemedText style={styles.gemsLabel}>gems</ThemedText>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Rank</ThemedText>
            <ThemedText style={styles.statValue}>#15</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Gems</ThemedText>
            <ThemedText style={styles.statValue}>{gems}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Streak</ThemedText>
            <ThemedText style={styles.statValue}>{streak}</ThemedText>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Tournament Info Card */}
        <View style={styles.tournamentCard}>
          <View style={styles.tournamentHeader}>
            <View style={styles.tournamentIcons}>
              <View style={styles.tournamentIcon}>
                <Ionicons name="diamond" size={24} color={Colors.darkGray} />
              </View>
              <View style={styles.tournamentIcon}>
                <Ionicons name="diamond" size={24} color={Colors.primary} />
              </View>
              <View style={styles.tournamentIcon}>
                <Ionicons name="diamond" size={24} color={Colors.accent} />
              </View>
            </View>
            <ThemedText style={styles.tournamentTitle}>Diamond Tournament</ThemedText>
            <ThemedText style={styles.tournamentGoal}>Top 10 reach the Semifinals</ThemedText>
            <View style={styles.timerContainer}>
              <Ionicons name="time" size={16} color={Colors.warning} />
              <ThemedText style={styles.timerText}>7 days</ThemedText>
            </View>
          </View>
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardContainer}>
          <FlatList
            data={mockLeaderboardData}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.leaderboardList}
            scrollEnabled={false} // Disable FlatList scroll since we're using ScrollView
          />
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  tournamentCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 13,
    padding: 20,
    shadowColor: Colors.shadwPrimary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  tournamentHeader: {
    alignItems: 'center',
  },
  tournamentIcons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tournamentIcon: {
    marginHorizontal: 8,
  },
  tournamentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tournamentGoal: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.warning,
    marginLeft: 6,
  },
  leaderboardContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  leaderboardList: {
    paddingBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.gray,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserItem: {
    backgroundColor: Colors.lightBlue,
    borderWidth: 2,
    borderColor: Colors.tint,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medalContainer: {
    position: 'absolute',
    top: -5,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  gemsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tint,
  },
  gemsLabel: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  bottomSpacing: {
    height: 150, // Account for bottom navigation
  },
}); 