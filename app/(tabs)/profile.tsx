import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Text, Alert } from 'react-native';
import { router, Href } from 'expo-router';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { COURSES } from '@/constants/courses';
import { useAppSelector } from '@/store/hooks';
import { FlameIcon } from '@/components/svg/FlameIcon';
import { GemIcon } from '@/components/svg/GemIcon';
import { StarIcon } from '@/components/svg/StarIcon';
import { CrownIcon } from '@/components/svg/CrownIcon';
import { TrophyIcon } from '@/components/svg/TrophyIcon';
import { ShieldIcon } from '@/components/svg/ShieldIcon';
import { TradeBull } from '@/components/svg/TradeBull';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DuoButton } from '@/components/ui/DuoButton';
import type { Achievement } from '@/types';

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: 'star', requirement: 1, progress: 0, unlocked: false },
  { id: 'streak-7', title: 'Streak Master', description: 'Maintain a 7-day streak', icon: 'flame', requirement: 7, progress: 0, unlocked: false },
  { id: 'gems-500', title: 'Gem Collector', description: 'Earn 500 gems total', icon: 'gem', requirement: 500, progress: 0, unlocked: false },
  { id: 'course-complete', title: 'Course Graduate', description: 'Complete an entire course', icon: 'trophy', requirement: 1, progress: 0, unlocked: false },
  { id: 'level-10', title: 'Rising Star', description: 'Reach level 10', icon: 'crown', requirement: 10, progress: 0, unlocked: false },
];

type Tab = 'overview' | 'achievements' | 'progress';

const ICONS: Record<string, (size: number) => React.ReactNode> = {
  star: (s) => <StarIcon size={s} />,
  flame: (s) => <FlameIcon size={s} />,
  gem: (s) => <GemIcon size={s} />,
  trophy: (s) => <TrophyIcon size={s} />,
  crown: (s) => <CrownIcon size={s} />,
};

export default function ProfileScreen() {
  const { progress } = useAppSelector((state) => state.user);
  const subscription = useAppSelector((state) => state.subscription);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const completedLessons = progress.completedLessons.length;

  const getAchievements = (): Achievement[] => {
    return ACHIEVEMENTS.map(a => {
      let current = 0;
      if (a.id === 'first-lesson') current = completedLessons;
      if (a.id === 'streak-7') current = progress.currentStreak;
      if (a.id === 'gems-500') current = progress.gems;
      if (a.id === 'course-complete') {
        const completedCourses = COURSES.filter(c => {
          const levels = c.units.flatMap(u => u.levels);
          return levels.length > 0 && levels.every(l => progress.completedLessons.includes(l.id));
        });
        current = completedCourses.length;
      }
      if (a.id === 'level-10') current = progress.currentLevel;
      return { ...a, progress: current, unlocked: current >= a.requirement };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.tabRow}>
          {(['overview', 'achievements', 'progress'] as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FlameIcon size={18} active={progress.currentStreak > 0} />
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
          </View>
          <View style={styles.statItem}>
            <GemIcon size={18} />
            <Text style={styles.statValue}>{progress.gems}</Text>
          </View>
          <View style={styles.statItem}>
            <StarIcon size={18} />
            <Text style={styles.statValue}>{progress.totalXP} XP</Text>
          </View>
          <View style={styles.statItem}>
            <CrownIcon size={18} />
            <Text style={styles.statValue}>Lvl {progress.currentLevel}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <>
            {/* User Card */}
            <View style={styles.userCard}>
              <TradeBull size={60} mood="happy" />
              <View style={styles.userCardInfo}>
                <Text style={styles.userName}>{progress.username}</Text>
                <Text style={styles.userLevel}>Level {progress.currentLevel} Trader</Text>
                <ProgressBar
                  progress={(progress.totalXP % 100)}
                  color={Colors.macaw}
                  height={6}
                  style={{ marginTop: 6 }}
                />
                <Text style={styles.xpToNext}>{100 - (progress.totalXP % 100)} XP to next level</Text>
              </View>
            </View>

            {/* Subscription Status */}
            <View style={styles.subCard}>
              <ShieldIcon size={28} color={subscription.tier === 'pro' ? Colors.plum : Colors.hare} />
              <View style={styles.subInfo}>
                <Text style={styles.subTitle}>
                  {subscription.tier === 'pro' ? 'TradeQuest Pro' : 'Free Plan'}
                </Text>
                <Text style={styles.subDesc}>
                  {subscription.tier === 'pro'
                    ? subscription.isTrialActive ? 'Free trial active' : `${subscription.plan} plan`
                    : 'Unlock all courses and features'}
                </Text>
              </View>
              {subscription.tier === 'free' && (
                <DuoButton
                  title="UPGRADE"
                  onPress={() => router.push('/paywall' as Href)}
                  variant="secondary"
                  size="sm"
                />
              )}
            </View>

            {/* Quick Actions */}
            <Pressable style={styles.actionRow} onPress={() => Alert.alert('Referral', 'Share your code and earn 100 gems!')}>
              <Text style={styles.actionIcon}>🎁</Text>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Refer a Friend</Text>
                <Text style={styles.actionDesc}>Earn 100 gems per friend</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </Pressable>
          </>
        )}

        {activeTab === 'achievements' && (
          <View style={styles.achievementsList}>
            {getAchievements().map((a) => (
              <View key={a.id} style={[styles.achievementCard, !a.unlocked && styles.achievementLocked]}>
                <View style={styles.achievementIcon}>{ICONS[a.icon]?.(24)}</View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{a.title}</Text>
                  <Text style={styles.achievementDesc}>{a.description}</Text>
                  <ProgressBar
                    progress={Math.min(100, (a.progress / a.requirement) * 100)}
                    color={a.unlocked ? Colors.feather : Colors.macaw}
                    height={4}
                    style={{ marginTop: 6 }}
                  />
                  <Text style={styles.achievementProgress}>{a.progress}/{a.requirement}</Text>
                </View>
                {a.unlocked && (
                  <View style={styles.achievementCheck}>
                    <Text style={styles.checkEmoji}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'progress' && (
          <View style={styles.progressList}>
            {COURSES.map((course) => {
              const levels = course.units.flatMap(u => u.levels);
              const done = levels.filter(l => progress.completedLessons.includes(l.id)).length;
              const pct = levels.length > 0 ? Math.round((done / levels.length) * 100) : 0;
              return (
                <View key={course.id} style={styles.progressCard}>
                  <View style={styles.progressHeader}>
                    <View style={[styles.progressBadge, { backgroundColor: course.color }]}>
                      <Text style={styles.progressBadgeText}>
                        {course.category === 'beginner' ? '1' : course.category === 'intermediate' ? '2' : '3'}
                      </Text>
                    </View>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressTitle}>{course.title}</Text>
                      <Text style={styles.progressStat}>{done}/{levels.length} lessons</Text>
                    </View>
                    <Text style={[styles.progressPct, { color: course.color }]}>{pct}%</Text>
                  </View>
                  <ProgressBar progress={pct} color={course.color} height={6} style={{ marginTop: 8 }} />
                </View>
              );
            })}
          </View>
        )}
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
  headerTitle: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.sm },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.polar, borderRadius: Radius.md, padding: 3, marginBottom: Spacing.md },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.snow },
  tabText: { ...Typography.captionBold, color: Colors.textSecondary },
  tabTextActive: { color: Colors.macaw },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { ...Typography.captionBold, color: Colors.text },

  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 120 },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.polar,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  userCardInfo: { flex: 1 },
  userName: { ...Typography.h3, color: Colors.text },
  userLevel: { ...Typography.caption, color: Colors.textSecondary },
  xpToNext: { ...Typography.small, color: Colors.textSecondary, marginTop: 4 },

  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.polar,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  subInfo: { flex: 1 },
  subTitle: { ...Typography.bodyBold, color: Colors.text },
  subDesc: { ...Typography.caption, color: Colors.textSecondary },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.polar,
    borderRadius: Radius.lg,
    gap: Spacing.md,
  },
  actionIcon: { fontSize: 24 },
  actionInfo: { flex: 1 },
  actionTitle: { ...Typography.bodyBold, color: Colors.text },
  actionDesc: { ...Typography.caption, color: Colors.textSecondary },
  actionArrow: { fontSize: 24, color: Colors.hare },

  achievementsList: { gap: Spacing.sm },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.polar,
    borderRadius: Radius.lg,
    gap: Spacing.md,
  },
  achievementLocked: { opacity: 0.6 },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.snow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: { flex: 1 },
  achievementTitle: { ...Typography.bodyBold, color: Colors.text },
  achievementDesc: { ...Typography.caption, color: Colors.textSecondary },
  achievementProgress: { ...Typography.small, color: Colors.textSecondary, marginTop: 2 },
  achievementCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.feather,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEmoji: { color: Colors.snow, fontWeight: '800', fontSize: 14 },

  progressList: { gap: Spacing.sm },
  progressCard: { padding: Spacing.md, backgroundColor: Colors.polar, borderRadius: Radius.lg },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  progressBadgeText: { ...Typography.captionBold, color: Colors.snow },
  progressInfo: { flex: 1 },
  progressTitle: { ...Typography.bodyBold, color: Colors.text },
  progressStat: { ...Typography.small, color: Colors.textSecondary },
  progressPct: { ...Typography.bodyBold },
});
