import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Colors, Spacing, Radius, Typography, buttonShadow } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { TrophyIcon } from '@/components/svg/TrophyIcon';
import { FlameIcon } from '@/components/svg/FlameIcon';
import { GemIcon } from '@/components/svg/GemIcon';
import { CrownIcon } from '@/components/svg/CrownIcon';
import type { LeaderboardEntry } from '@/types';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'TradingPro', xp: 4280, streak: 21, level: 12 },
  { id: '2', rank: 2, username: 'BullTrader', xp: 3890, streak: 18, level: 10 },
  { id: '3', rank: 3, username: 'ChartMaster', xp: 3450, streak: 15, level: 9 },
  { id: '4', rank: 4, username: 'RiskManager', xp: 2980, streak: 12, level: 8 },
  { id: '5', rank: 5, username: 'PatternHunter', xp: 2650, streak: 10, level: 7 },
  { id: '6', rank: 6, username: 'CryptoKing', xp: 2340, streak: 8, level: 6 },
  { id: '7', rank: 7, username: 'StockGuru', xp: 1980, streak: 7, level: 5 },
  { id: '8', rank: 8, username: 'MarketWizard', xp: 1650, streak: 5, level: 4 },
  { id: '9', rank: 9, username: 'TradeQueen', xp: 1320, streak: 4, level: 3 },
  { id: '10', rank: 10, username: 'InvestorPro', xp: 980, streak: 2, level: 2 },
];

const MEDAL_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

function LeaderboardItem({ entry }: { entry: LeaderboardEntry }) {
  const hasMedal = entry.rank <= 3;
  const medalColor = MEDAL_COLORS[entry.rank];

  return (
    <View style={[styles.entryCard, entry.isCurrentUser && styles.entryCardCurrent]}>
      <View style={styles.rankSection}>
        {hasMedal ? (
          <View style={[styles.medalBadge, { backgroundColor: medalColor }]}>
            <Text style={styles.medalText}>{entry.rank}</Text>
          </View>
        ) : (
          <Text style={styles.rankText}>{entry.rank}</Text>
        )}
      </View>
      <View style={styles.userSection}>
        <View style={[styles.avatar, { backgroundColor: `hsl(${entry.rank * 36}, 70%, 85%)` }]}>
          <Text style={styles.avatarText}>{entry.username[0]}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{entry.username}</Text>
          <View style={styles.userStats}>
            <FlameIcon size={14} active />
            <Text style={styles.statValue}>{entry.streak}</Text>
          </View>
        </View>
      </View>
      <View style={styles.xpSection}>
        <Text style={styles.xpValue}>{entry.xp.toLocaleString()}</Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const { progress } = useAppSelector((state) => state.user);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.myStats}>
          <View style={styles.myStatItem}>
            <Text style={styles.myStatLabel}>Rank</Text>
            <Text style={styles.myStatValue}>#15</Text>
          </View>
          <View style={styles.myStatItem}>
            <Text style={styles.myStatLabel}>XP</Text>
            <Text style={styles.myStatValue}>{progress.totalXP}</Text>
          </View>
          <View style={styles.myStatItem}>
            <Text style={styles.myStatLabel}>Streak</Text>
            <Text style={styles.myStatValue}>{progress.currentStreak}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tournament Card */}
        <View style={[styles.tournamentCard, buttonShadow(Colors.macawDark)]}>
          <View style={styles.tournamentIcons}>
            <GemIcon size={28} color={Colors.hare} />
            <TrophyIcon size={32} color={Colors.bee} />
            <GemIcon size={28} color={Colors.macaw} />
          </View>
          <Text style={styles.tournamentTitle}>Diamond Tournament</Text>
          <Text style={styles.tournamentSub}>Top 10 advance to the Semifinals</Text>
          <View style={styles.tournamentTimer}>
            <Text style={styles.tournamentTimerText}>7 days remaining</Text>
          </View>
        </View>

        {/* Leaderboard List */}
        <View style={styles.list}>
          {MOCK_LEADERBOARD.map((entry) => (
            <LeaderboardItem key={entry.id} entry={entry} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.md },
  myStats: { flexDirection: 'row', justifyContent: 'space-around' },
  myStatItem: { alignItems: 'center' },
  myStatLabel: { ...Typography.small, color: Colors.textSecondary, marginBottom: 2 },
  myStatValue: { ...Typography.bodyBold, color: Colors.text },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  tournamentCard: {
    backgroundColor: Colors.macaw,
    margin: Spacing.lg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  tournamentIcons: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  tournamentTitle: { ...Typography.h3, color: Colors.snow, marginBottom: 4 },
  tournamentSub: { ...Typography.caption, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.md },
  tournamentTimer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.xl,
  },
  tournamentTimerText: { ...Typography.captionBold, color: Colors.bee },

  list: { paddingHorizontal: Spacing.lg },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.polar,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  entryCardCurrent: { backgroundColor: Colors.macawLight, borderWidth: 2, borderColor: Colors.macaw },

  rankSection: { width: 36, alignItems: 'center' },
  rankText: { ...Typography.bodyBold, color: Colors.textSecondary },
  medalBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalText: { ...Typography.captionBold, color: Colors.snow },

  userSection: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: Spacing.sm },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: { ...Typography.bodyBold, color: Colors.text },
  userInfo: { flex: 1 },
  userName: { ...Typography.bodyBold, color: Colors.text },
  userStats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statValue: { ...Typography.small, color: Colors.textSecondary },

  xpSection: { alignItems: 'flex-end' },
  xpValue: { ...Typography.bodyBold, color: Colors.macaw },
  xpLabel: { ...Typography.small, color: Colors.textSecondary },
});
