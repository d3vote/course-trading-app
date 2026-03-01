import React from 'react';
import { StyleSheet, View, Text, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, Typography, buttonShadow } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markBrokerOfferShown } from '@/store/slices/subscriptionSlice';
import { TradeBull } from '@/components/svg/TradeBull';
import { TrophyIcon } from '@/components/svg/TrophyIcon';
import { StarIcon } from '@/components/svg/StarIcon';
import { CrownIcon } from '@/components/svg/CrownIcon';
import { ChartUpIcon } from '@/components/svg/ChartUpIcon';
import { CheckCircleIcon } from '@/components/svg/CheckCircleIcon';

export default function BrokerOfferScreen() {
  const dispatch = useAppDispatch();
  const subscription = useAppSelector((state) => state.subscription);
  const { progress } = useAppSelector((state) => state.user);

  const offerLink = subscription.customOfferLink || subscription.brokerLink;

  const handleAcceptOffer = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(markBrokerOfferShown());

    try {
      const canOpen = await Linking.canOpenURL(offerLink);
      if (canOpen) {
        await Linking.openURL(offerLink);
      }
    } catch {
      // Fallback: just mark as shown and go back
    }
    router.back();
  };

  const handleSkip = () => {
    dispatch(markBrokerOfferShown());
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5CC', '#FFFFFF', '#DDF4D2']}
        style={styles.gradient}
      >
        {/* Celebration */}
        <View style={styles.celebrationRow}>
          <StarIcon size={32} color={Colors.bee} />
          <TrophyIcon size={48} color={Colors.bee} />
          <StarIcon size={32} color={Colors.bee} />
        </View>

        <TradeBull size={120} mood="excited" />

        <Text style={styles.congratsTitle}>Congratulations!</Text>
        <Text style={styles.congratsSubtitle}>
          You've completed the entire TradeQuest program!
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <CrownIcon size={24} color={Colors.bee} />
            <Text style={styles.statValue}>Level {progress.currentLevel}</Text>
            <Text style={styles.statLabel}>Achieved</Text>
          </View>
          <View style={styles.statCard}>
            <ChartUpIcon size={24} color={Colors.feather} />
            <Text style={styles.statValue}>{progress.totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircleIcon size={24} color={Colors.macaw} />
            <Text style={styles.statValue}>{progress.completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>

        {/* Offer Section */}
        <View style={styles.offerSection}>
          <Text style={styles.offerTitle}>Ready for Real Trading?</Text>
          <Text style={styles.offerDescription}>
            You've proven your knowledge. Now it's time to put your skills to work with a real trading account. We've partnered with a top-rated broker to give you the best start.
          </Text>

          <View style={styles.offerBenefits}>
            {[
              'Low commission trading fees',
              'Free demo account with $100,000',
              'Advanced charting tools',
              'Exclusive TradeQuest member bonus',
            ].map((benefit, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <CheckCircleIcon size={18} color={Colors.feather} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={[styles.offerButton, buttonShadow(Colors.featherDark)]}
            onPress={handleAcceptOffer}
          >
            <Text style={styles.offerButtonText}>Start Real Trading</Text>
          </Pressable>

          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Maybe Later</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: Spacing.xl,
  },

  celebrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  congratsTitle: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
    fontSize: 32,
  },
  congratsSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 24,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.snow,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 4,
  },
  statValue: { ...Typography.bodyBold, color: Colors.text },
  statLabel: { ...Typography.small, color: Colors.textSecondary },

  offerSection: {
    width: '100%',
    backgroundColor: Colors.snow,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.feather,
  },
  offerTitle: { ...Typography.h2, color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  offerDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  offerBenefits: { gap: Spacing.sm, marginBottom: Spacing.xl },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  benefitText: { ...Typography.body, color: Colors.text, flex: 1 },

  offerButton: {
    backgroundColor: Colors.feather,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  offerButtonText: { ...Typography.button, color: Colors.snow, fontSize: 18 },

  skipButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  skipButtonText: { ...Typography.bodyBold, color: Colors.hare },
});
