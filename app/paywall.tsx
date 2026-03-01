import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, Typography, buttonShadow } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startFreeTrial, subscribe } from '@/store/slices/subscriptionSlice';
import { TradeBull } from '@/components/svg/TradeBull';
import { ShieldIcon } from '@/components/svg/ShieldIcon';
import { CheckCircleIcon } from '@/components/svg/CheckCircleIcon';
import { StarIcon } from '@/components/svg/StarIcon';
import { CrownIcon } from '@/components/svg/CrownIcon';
import { ChartUpIcon } from '@/components/svg/ChartUpIcon';
import { GemIcon } from '@/components/svg/GemIcon';
import type { SubscriptionPlan } from '@/types';

interface PlanOption {
  plan: SubscriptionPlan;
  title: string;
  price: string;
  perWeek: string;
  savings: string | null;
  popular: boolean;
}

const PLANS: PlanOption[] = [
  { plan: 'yearly', title: 'Annual', price: '$59.99/year', perWeek: '$1.15/week', savings: 'Save 70%', popular: true },
  { plan: 'monthly', title: 'Monthly', price: '$9.99/month', perWeek: '$2.31/week', savings: 'Save 40%', popular: false },
  { plan: 'weekly', title: 'Weekly', price: '$3.99/week', perWeek: '$3.99/week', savings: null, popular: false },
];

const FEATURES = [
  { icon: 'courses', title: 'All 4 Trading Courses', description: 'From fundamentals to advanced strategies' },
  { icon: 'simulator', title: 'Full Trading Simulator', description: 'Practice with unlimited gem capital' },
  { icon: 'leaderboard', title: 'Global Leaderboard', description: 'Compete with traders worldwide' },
  { icon: 'mentor', title: 'AI Trading Mentor', description: 'Personalized tips and feedback' },
  { icon: 'cases', title: 'Pro Trading Cases', description: 'Real-world scenario analysis' },
  { icon: 'support', title: 'Priority Support', description: '24/7 dedicated support team' },
];

function FeatureIcon({ type }: { type: string }) {
  switch (type) {
    case 'courses': return <ChartUpIcon size={22} color={Colors.feather} />;
    case 'simulator': return <GemIcon size={22} color={Colors.macaw} />;
    case 'leaderboard': return <CrownIcon size={22} color={Colors.bee} />;
    case 'mentor': return <StarIcon size={22} color={Colors.fox} />;
    case 'cases': return <ShieldIcon size={22} color={Colors.plum} />;
    case 'support': return <CheckCircleIcon size={22} color={Colors.feather} />;
    default: return <StarIcon size={22} />;
  }
}

export default function PaywallScreen() {
  const dispatch = useAppDispatch();
  const subscription = useAppSelector((state) => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('yearly');

  const handleSubscribe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(subscribe(selectedPlan));
    Alert.alert(
      'Welcome to TradeQuest Pro!',
      'You now have full access to all courses and features.',
      [{ text: 'Start Learning', onPress: () => router.back() }]
    );
  };

  const handleStartTrial = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(startFreeTrial());
    Alert.alert(
      '7-Day Free Trial Started!',
      'Enjoy full Pro access. Cancel anytime before the trial ends.',
      [{ text: 'Start Exploring', onPress: () => router.back() }]
    );
  };

  const handleClose = () => {
    router.back();
  };

  if (subscription.tier === 'pro') {
    return (
      <View style={styles.alreadyProContainer}>
        <ShieldIcon size={64} color={Colors.plum} />
        <Text style={styles.alreadyProTitle}>You're a Pro!</Text>
        <Text style={styles.alreadyProDesc}>
          {subscription.isTrialActive
            ? `Free trial ends: ${new Date(subscription.trialEndsAt!).toLocaleDateString()}`
            : `${subscription.plan} plan active`
          }
        </Text>
        <Pressable style={styles.closeBtn} onPress={handleClose}>
          <Text style={styles.closeBtnText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeIcon}>✕</Text>
      </Pressable>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.plumLight, Colors.snow]}
          style={styles.heroSection}
        >
          <TradeBull size={90} mood="excited" />
          <View style={styles.proBadge}>
            <ShieldIcon size={20} color={Colors.snow} />
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
          <Text style={styles.heroTitle}>Unlock Your Full{'\n'}Trading Potential</Text>
          <Text style={styles.heroSubtitle}>
            Join thousands of traders who upgraded to Pro and accelerated their learning
          </Text>
        </LinearGradient>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Everything in Pro</Text>
          {FEATURES.map((feature, idx) => (
            <View key={idx} style={styles.featureRow}>
              <View style={styles.featureIconContainer}>
                <FeatureIcon type={feature.icon} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {PLANS.map((plan) => (
            <Pressable
              key={plan.plan}
              style={[
                styles.planCard,
                selectedPlan === plan.plan && styles.planCardSelected,
                plan.popular && selectedPlan === plan.plan && { borderColor: Colors.plum },
              ]}
              onPress={() => {
                setSelectedPlan(plan.plan);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              <View style={styles.planRadio}>
                <View style={[
                  styles.radioOuter,
                  selectedPlan === plan.plan && styles.radioOuterActive,
                ]}>
                  {selectedPlan === plan.plan && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPerWeek}>{plan.perWeek}</Text>
              </View>
              {plan.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{plan.savings}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Pressable
            style={[styles.ctaButton, buttonShadow(Colors.plumDark)]}
            onPress={handleSubscribe}
          >
            <Text style={styles.ctaButtonText}>Subscribe Now</Text>
          </Pressable>

          <Pressable style={styles.trialButton} onPress={handleStartTrial}>
            <Text style={styles.trialButtonText}>Start 7-Day Free Trial</Text>
          </Pressable>

          <Text style={styles.legalText}>
            Cancel anytime. No commitment. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
          </Text>
        </View>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <View style={styles.socialProofStars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} size={18} color={Colors.bee} />
            ))}
          </View>
          <Text style={styles.socialProofText}>
            Rated 4.8/5 by 12,000+ traders
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: { fontSize: 16, color: Colors.eel, fontWeight: '700' },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 50 },

  heroSection: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.plum,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.xl,
    gap: 6,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  proBadgeText: { ...Typography.captionBold, color: Colors.snow, letterSpacing: 2 },
  heroTitle: { ...Typography.h1, color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  heroSubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  featuresSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.md },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.polar,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: { flex: 1 },
  featureTitle: { ...Typography.bodyBold, color: Colors.text },
  featureDesc: { ...Typography.caption, color: Colors.textSecondary },

  plansSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: { borderColor: Colors.plum, backgroundColor: Colors.plumLight },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.plum,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: Radius.sm,
  },
  popularText: { ...Typography.small, color: Colors.snow, fontSize: 10 },
  planRadio: { marginRight: Spacing.md },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.hare,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: { borderColor: Colors.plum },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.plum },
  planInfo: { flex: 1 },
  planTitle: { ...Typography.bodyBold, color: Colors.text },
  planPrice: { ...Typography.caption, color: Colors.textSecondary },
  planPerWeek: { ...Typography.small, color: Colors.wolf },
  savingsBadge: {
    backgroundColor: Colors.featherLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  savingsText: { ...Typography.small, color: Colors.featherDark, fontSize: 11 },

  ctaSection: { paddingHorizontal: Spacing.lg, alignItems: 'center', marginBottom: Spacing.xl },
  ctaButton: {
    backgroundColor: Colors.plum,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  ctaButtonText: { ...Typography.button, color: Colors.snow, fontSize: 18 },
  trialButton: {
    borderWidth: 2,
    borderColor: Colors.plum,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  trialButtonText: { ...Typography.button, color: Colors.plum },
  legalText: {
    ...Typography.small,
    color: Colors.hare,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: Spacing.md,
  },

  socialProof: { alignItems: 'center', paddingBottom: Spacing.xl },
  socialProofStars: { flexDirection: 'row', gap: 4, marginBottom: 6 },
  socialProofText: { ...Typography.captionBold, color: Colors.textSecondary },

  alreadyProContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  alreadyProTitle: { ...Typography.h1, color: Colors.text },
  alreadyProDesc: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  closeBtn: {
    backgroundColor: Colors.plum,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  closeBtnText: { ...Typography.button, color: Colors.snow },
});
