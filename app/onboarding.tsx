import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, Typography, buttonShadow } from '@/constants/theme';
import { useAppDispatch } from '@/store/hooks';
import { completeOnboarding } from '@/store/slices/userSlice';
import { TradeBull } from '@/components/svg/TradeBull';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DuoButton } from '@/components/ui/DuoButton';
import { ChartUpIcon } from '@/components/svg/ChartUpIcon';
import { StarIcon } from '@/components/svg/StarIcon';
import { GemIcon } from '@/components/svg/GemIcon';
import { CrownIcon } from '@/components/svg/CrownIcon';
import { ShieldIcon } from '@/components/svg/ShieldIcon';

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string; style: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What brings you to TradeQuest?',
    options: [
      { id: 'learn', text: 'I want to learn trading from scratch', style: 'curious' },
      { id: 'improve', text: 'I trade a little but want to improve', style: 'growth' },
      { id: 'advanced', text: 'I\'m experienced and want advanced strategies', style: 'pro' },
    ],
  },
  {
    id: 2,
    question: 'How much time can you dedicate daily?',
    options: [
      { id: '5min', text: '5 minutes a day', style: 'casual' },
      { id: '15min', text: '15 minutes a day', style: 'regular' },
      { id: '30min', text: '30+ minutes a day', style: 'dedicated' },
    ],
  },
  {
    id: 3,
    question: 'What interests you most?',
    options: [
      { id: 'stocks', text: 'Stocks & ETFs', style: 'stocks' },
      { id: 'crypto', text: 'Cryptocurrency', style: 'crypto' },
      { id: 'forex', text: 'Forex & Commodities', style: 'forex' },
      { id: 'all', text: 'A bit of everything', style: 'all' },
    ],
  },
  {
    id: 4,
    question: 'What\'s your risk tolerance?',
    options: [
      { id: 'conservative', text: 'Keep it safe - steady growth', style: 'cautious' },
      { id: 'moderate', text: 'Balanced risk and reward', style: 'balanced' },
      { id: 'aggressive', text: 'Higher risk for bigger gains', style: 'bold' },
    ],
  },
];

const TRADER_STYLES: Record<string, string> = {
  'curious-casual-stocks-cautious': 'Steady Learner',
  'curious-casual-crypto-cautious': 'Steady Learner',
  'growth-regular-stocks-moderate': 'Growth Seeker',
  'growth-regular-crypto-balanced': 'Growth Seeker',
  'pro-dedicated-all-bold': 'Alpha Trader',
};

function getTraderStyle(answers: Record<number, string>): string {
  const key = Object.values(answers).join('-');
  return TRADER_STYLES[key] || 'Smart Trader';
}

export default function OnboardingScreen() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const progress = step === 'quiz' ? ((questionIndex + 1) / QUESTIONS.length) * 100 : 0;
  const currentQuestion = QUESTIONS[questionIndex];

  const handleAnswer = () => {
    if (!selectedOption) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const q = QUESTIONS[questionIndex];
    const opt = q.options.find(o => o.id === selectedOption);
    const newAnswers = { ...answers, [q.id]: opt?.style || '' };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      setStep('result');
    }
  };

  const handleFinish = () => {
    const style = getTraderStyle(answers);
    dispatch(completeOnboarding(style));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  };

  if (step === 'welcome') {
    return (
      <View style={styles.welcomeContainer}>
        <TradeBull size={140} mood="excited" />
        <Text style={styles.welcomeTitle}>Welcome to TradeQuest!</Text>
        <Text style={styles.welcomeSubtitle}>
          Learn to trade like a pro with bite-sized lessons, quizzes, and a real trading simulator.
        </Text>
        <View style={styles.welcomeFeatures}>
          <View style={styles.featureItem}>
            <ChartUpIcon size={28} color={Colors.feather} />
            <Text style={styles.featureText}>Interactive Lessons</Text>
          </View>
          <View style={styles.featureItem}>
            <GemIcon size={28} color={Colors.macaw} />
            <Text style={styles.featureText}>Earn Gems & XP</Text>
          </View>
          <View style={styles.featureItem}>
            <CrownIcon size={28} color={Colors.bee} />
            <Text style={styles.featureText}>Compete & Level Up</Text>
          </View>
        </View>
        <DuoButton
          title="Get Started"
          onPress={() => setStep('quiz')}
          size="lg"
          fullWidth
          style={{ marginTop: Spacing.xl }}
        />
      </View>
    );
  }

  if (step === 'result') {
    const style = getTraderStyle(answers);
    return (
      <View style={styles.resultContainer}>
        <TradeBull size={100} mood="happy" />
        <Text style={styles.resultLabel}>Your Trader Style</Text>
        <View style={styles.resultBadge}>
          <ShieldIcon size={32} color={Colors.plum} />
          <Text style={styles.resultStyle}>{style}</Text>
        </View>
        <Text style={styles.resultDesc}>
          We've personalized your learning path based on your answers. Let's begin your trading journey!
        </Text>
        <DuoButton
          title="Start Learning"
          onPress={handleFinish}
          size="lg"
          fullWidth
          style={{ marginTop: Spacing.xl }}
        />
      </View>
    );
  }

  return (
    <View style={styles.quizContainer}>
      {/* Header */}
      <View style={styles.quizHeader}>
        <Pressable onPress={() => {
          if (questionIndex > 0) {
            setQuestionIndex(i => i - 1);
            setSelectedOption(null);
          } else {
            setStep('welcome');
          }
        }}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <ProgressBar
          progress={progress}
          color={Colors.feather}
          height={10}
          style={{ flex: 1, marginHorizontal: Spacing.md }}
        />
        <Text style={styles.questionCount}>{questionIndex + 1}/{QUESTIONS.length}</Text>
      </View>

      {/* Question */}
      <View style={styles.questionSection}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <View style={styles.optionsList}>
          {currentQuestion.options.map((opt) => (
            <Pressable
              key={opt.id}
              style={[
                styles.optionCard,
                selectedOption === opt.id && styles.optionCardSelected,
              ]}
              onPress={() => {
                setSelectedOption(opt.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[
                styles.optionText,
                selectedOption === opt.id && styles.optionTextSelected,
              ]}>
                {opt.text}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.quizBottom}>
        <DuoButton
          title="Continue"
          onPress={handleAnswer}
          size="lg"
          fullWidth
          disabled={!selectedOption}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  welcomeTitle: { ...Typography.h1, color: Colors.text, textAlign: 'center', marginTop: Spacing.xl },
  welcomeSubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 24 },
  welcomeFeatures: { marginTop: Spacing.xl, gap: Spacing.lg, width: '100%' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureText: { ...Typography.bodyBold, color: Colors.text },

  quizContainer: { flex: 1, backgroundColor: Colors.background },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backArrow: { fontSize: 32, color: Colors.hare, fontWeight: '300', lineHeight: 32 },
  questionCount: { ...Typography.small, color: Colors.wolf },

  questionSection: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl },
  questionText: { ...Typography.h2, color: Colors.text, textAlign: 'center', marginBottom: Spacing.xl },
  optionsList: { gap: Spacing.sm },
  optionCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.snow,
  },
  optionCardSelected: { borderColor: Colors.feather, backgroundColor: Colors.featherLight },
  optionText: { ...Typography.bodyBold, color: Colors.text, textAlign: 'center' },
  optionTextSelected: { color: Colors.featherDark },

  quizBottom: { padding: Spacing.xl },

  resultContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  resultLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xl },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.plumLight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  resultStyle: { ...Typography.h2, color: Colors.plumDark },
  resultDesc: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
