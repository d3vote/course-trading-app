import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';

// Mock achievements data
const mockAchievements = [
  { id: 1, title: 'First Trade', description: 'Complete your first trade', icon: 'target', unlocked: true },
  { id: 2, title: 'Streak Master', description: 'Maintain a 7-day streak', icon: 'flame', unlocked: true },
  { id: 3, title: 'Profit Hunter', description: 'Earn 1000 gems in profits', icon: 'diamond', unlocked: true },
  { id: 4, title: 'Chart Reader', description: 'Complete all chart analysis lessons', icon: 'bar-chart', unlocked: false },
  { id: 5, title: 'Risk Manager', description: 'Complete risk management course', icon: 'shield-checkmark', unlocked: false },
];

const mockProgress = [
  { category: 'Basics', progress: 100, total: 20 },
  { category: 'Charts', progress: 85, total: 25 },
  { category: 'Patterns', progress: 60, total: 30 },
  { category: 'Indicators', progress: 0, total: 35 },
  { category: 'Strategy', progress: 0, total: 40 },
];

export default function ProfileScreen() {
  const { progress } = useAppSelector((state: any) => state.user);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'progress'>('overview');
  
  // Use all user progress data from Redux store
  const username = progress.username;
  const gems = progress.gems;
  const streak = progress.currentStreak;
  const currentLevel = progress.currentLevel;
  const totalXP = progress.totalXP;
  const totalLessonsCompleted = progress.totalLevelsCompleted;

  const handleSubscriptionUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Get access to:\n• Pro Trading Cases\n• AI Mentor\n• Advanced Strategies\n• Priority Support',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => Alert.alert('Upgrade', 'Redirecting to payment...') }
      ]
    );
  };

  const handleReferral = () => {
    Alert.alert('Refer a Friend', 'Share your referral code and earn 100 gems for each friend who joins!');
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={40} color={Colors.tint} />
        </View>
        <View style={styles.userInfo}>
          <ThemedText style={styles.username}>{username}</ThemedText>
          <ThemedText style={styles.email}>trader@example.com</ThemedText>
          <View style={styles.levelContainer}>
            <ThemedText style={styles.levelText}>Level {currentLevel}</ThemedText>
            <ThemedText style={styles.xpText}>{totalXP} XP</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color={Colors.tint} />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSubscriptionUpgrade}>
          <Ionicons name="diamond" size={20} color={Colors.accent} />
          <ThemedText style={styles.actionButtonText}>Upgrade to Premium</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleReferral}>
          <Ionicons name="share" size={20} color={Colors.tint} />
          <ThemedText style={styles.actionButtonText}>Refer a Friend</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      {mockAchievements.map((achievement) => (
        <View key={achievement.id} style={[
          styles.achievementCard,
          !achievement.unlocked && styles.achievementLocked
        ]}>
          <View style={styles.achievementIcon}>
            <Ionicons 
              name={achievement.icon as any} 
              size={24} 
              color={achievement.unlocked ? Colors.tint : Colors.darkGray} 
            />
          </View>
          <View style={styles.achievementInfo}>
            <ThemedText style={[
              styles.achievementTitle,
              !achievement.unlocked && styles.achievementTitleLocked
            ]}>
              {achievement.title}
            </ThemedText>
            <ThemedText style={[
              styles.achievementDescription,
              !achievement.unlocked && styles.achievementDescriptionLocked
            ]}>
              {achievement.description}
            </ThemedText>
          </View>
          {achievement.unlocked && (
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          )}
        </View>
      ))}
    </View>
  );

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {mockProgress.map((item, index) => (
        <View key={index} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.progressCategory}>{item.category}</ThemedText>
            <ThemedText style={styles.progressPercentage}>{item.progress}%</ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            {item.progress} of {item.total} lessons completed
          </ThemedText>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'overview' && styles.activeTabButton]}
              onPress={() => setActiveTab('overview')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                Overview
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'achievements' && styles.activeTabButton]}
              onPress={() => setActiveTab('achievements')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
                Achievements
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'progress' && styles.activeTabButton]}
              onPress={() => setActiveTab('progress')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
                Progress
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Gems</ThemedText>
            <ThemedText style={styles.statValue}>{gems}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Streak</ThemedText>
            <ThemedText style={styles.statValue}>{streak}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Level</ThemedText>
            <ThemedText style={styles.statValue}>{currentLevel}</ThemedText>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'progress' && renderProgress()}
        
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: Colors.background,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  activeTabText: {
    color: Colors.tint,
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
  overviewContainer: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.tint,
    marginRight: 10,
  },
  xpText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  editButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    width: '45%',
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  achievementsContainer: {
    paddingBottom: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  achievementCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: Colors.darkGray,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  achievementDescriptionLocked: {
    color: Colors.gray,
  },
  progressContainer: {
    paddingBottom: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  progressCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressCategory: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.tint,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.tint,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 150, // Account for bottom navigation
  },
}); 