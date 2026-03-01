import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Text } from 'react-native';
import { router, useLocalSearchParams, Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, Typography, buttonShadow } from '@/constants/theme';
import { getLevel, isLastLevel } from '@/constants/courses';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { completeLesson } from '@/store/slices/userSlice';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DuoButton } from '@/components/ui/DuoButton';
import { TradeBull } from '@/components/svg/TradeBull';
import { GemIcon } from '@/components/svg/GemIcon';
import { StarIcon } from '@/components/svg/StarIcon';
import { CheckCircleIcon } from '@/components/svg/CheckCircleIcon';
import { TrophyIcon } from '@/components/svg/TrophyIcon';
import { ChartUpIcon } from '@/components/svg/ChartUpIcon';
import { CrownIcon } from '@/components/svg/CrownIcon';
import { ShieldIcon } from '@/components/svg/ShieldIcon';
import type { Slide, SlideQuestion } from '@/types';

const SLIDE_ICONS: Record<string, React.ReactNode> = {
  'chart-up': <ChartUpIcon size={64} color={Colors.macaw} />,
  'star': <StarIcon size={64} />,
  'gem': <GemIcon size={64} />,
  'trophy': <TrophyIcon size={64} />,
  'crown': <CrownIcon size={64} />,
  'shield': <ShieldIcon size={64} />,
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { progress } = useAppSelector((state) => state.user);

  const levelData = getLevel(id);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (!levelData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lesson not found</Text>
        <DuoButton title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const { course, level } = levelData;
  const slides = level.slides;
  const currentSlide = slides[slideIndex];
  const totalSlides = slides.length;
  const progressPercent = ((slideIndex + 1) / totalSlides) * 100;

  const handleNext = useCallback(() => {
    if (currentSlide.type === 'question' && !answerRevealed) {
      if (!selectedAnswer) return;
      setAnswerRevealed(true);
      const q = currentSlide as SlideQuestion;
      const isCorrect = q.options.find(o => o.id === selectedAnswer)?.correct;
      if (isCorrect) {
        setCorrectCount(c => c + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (slideIndex < totalSlides - 1) {
      setSlideIndex(i => i + 1);
      setSelectedAnswer(null);
      setAnswerRevealed(false);
    } else {
      // Lesson complete
      const alreadyCompleted = progress.completedLessons.includes(level.id);
      if (!alreadyCompleted) {
        dispatch(completeLesson({
          lessonId: level.id,
          xp: level.xpReward,
          gems: level.gemsReward,
        }));
      }

      if (isLastLevel(level.id)) {
        router.replace('/broker-offer' as Href);
      } else {
        router.back();
      }
    }
  }, [currentSlide, slideIndex, totalSlides, selectedAnswer, answerRevealed, level, dispatch, progress.completedLessons]);

  const renderSlide = () => {
    switch (currentSlide.type) {
      case 'content':
        return (
          <View style={styles.slideContent}>
            <View style={styles.slideIconContainer}>
              {SLIDE_ICONS[currentSlide.icon] || <ChartUpIcon size={64} color={course.color} />}
            </View>
            <Text style={styles.slideTitle}>{currentSlide.title}</Text>
            <Text style={styles.slideBody}>{currentSlide.body}</Text>
          </View>
        );

      case 'question': {
        const q = currentSlide as SlideQuestion;
        return (
          <View style={styles.slideContent}>
            <Text style={styles.slideTitle}>{q.title}</Text>
            <Text style={styles.questionText}>{q.question}</Text>
            <View style={styles.optionsContainer}>
              {q.options.map((option) => {
                let optStyle: Record<string, string> = styles.optionDefault as any;
                let textColor: string = Colors.text;

                if (answerRevealed) {
                  if (option.correct) {
                    optStyle = styles.optionCorrect as any;
                    textColor = Colors.feather;
                  } else if (selectedAnswer === option.id) {
                    optStyle = styles.optionIncorrect as any;
                    textColor = Colors.cardinal;
                  }
                } else if (selectedAnswer === option.id) {
                  optStyle = styles.optionSelected as any;
                  textColor = Colors.macaw;
                }

                return (
                  <Pressable
                    key={option.id}
                    style={[styles.optionButton, optStyle]}
                    onPress={() => {
                      if (!answerRevealed) {
                        setSelectedAnswer(option.id);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    disabled={answerRevealed}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>{option.text}</Text>
                    {answerRevealed && option.correct && <CheckCircleIcon size={22} color={Colors.feather} />}
                  </Pressable>
                );
              })}
            </View>
            {answerRevealed && (
              <View style={[
                styles.feedbackBanner,
                { backgroundColor: q.options.find(o => o.id === selectedAnswer)?.correct ? Colors.featherLight : Colors.cardinalLight },
              ]}>
                <Text style={[
                  styles.feedbackText,
                  { color: q.options.find(o => o.id === selectedAnswer)?.correct ? Colors.featherDark : Colors.cardinalDark },
                ]}>
                  {q.options.find(o => o.id === selectedAnswer)?.correct ? 'Correct!' : 'Not quite. Keep learning!'}
                </Text>
              </View>
            )}
          </View>
        );
      }

      case 'completion':
        return (
          <View style={styles.completionContent}>
            <TradeBull size={100} mood="excited" />
            <Text style={styles.completionTitle}>{currentSlide.title}</Text>
            <Text style={styles.completionBody}>{currentSlide.body}</Text>
            <View style={styles.rewardsRow}>
              <View style={styles.rewardItem}>
                <StarIcon size={28} />
                <Text style={styles.rewardText}>+{currentSlide.xpReward} XP</Text>
              </View>
              <View style={styles.rewardItem}>
                <GemIcon size={28} />
                <Text style={[styles.rewardText, { color: Colors.macaw }]}>+{currentSlide.gemsReward} Gems</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const getButtonTitle = () => {
    if (currentSlide.type === 'question' && !answerRevealed) return 'CHECK';
    if (slideIndex === totalSlides - 1) return 'CONTINUE';
    return 'CONTINUE';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <ProgressBar
          progress={progressPercent}
          color={course.color}
          height={10}
          style={styles.headerProgress}
        />
        <Text style={styles.slideCounter}>{slideIndex + 1}/{totalSlides}</Text>
      </View>

      {/* Slide Content */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderSlide()}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <DuoButton
          title={getButtonTitle()}
          onPress={handleNext}
          variant={currentSlide.type === 'completion' ? 'primary' : 'secondary'}
          size="lg"
          fullWidth
          disabled={currentSlide.type === 'question' && !selectedAnswer && !answerRevealed}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorText: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.lg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  closeButton: { padding: 8 },
  closeIcon: { fontSize: 18, color: Colors.hare, fontWeight: '700' },
  headerProgress: { flex: 1 },
  slideCounter: { ...Typography.small, color: Colors.wolf, minWidth: 32, textAlign: 'right' },

  scrollArea: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: Spacing.lg },

  slideContent: { alignItems: 'center', paddingTop: Spacing.xl },
  slideIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.polar,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  slideTitle: { ...Typography.h2, color: Colors.text, textAlign: 'center', marginBottom: Spacing.md },
  slideBody: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },

  questionText: { ...Typography.h3, color: Colors.text, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 28 },
  optionsContainer: { width: '100%', gap: Spacing.sm },
  optionButton: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
  },
  optionDefault: { borderColor: Colors.border, backgroundColor: Colors.snow },
  optionSelected: { borderColor: Colors.macaw, backgroundColor: Colors.macawLight },
  optionCorrect: { borderColor: Colors.feather, backgroundColor: Colors.featherLight },
  optionIncorrect: { borderColor: Colors.cardinal, backgroundColor: Colors.cardinalLight },
  optionText: { ...Typography.bodyBold, flex: 1 },

  feedbackBanner: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  feedbackText: { ...Typography.bodyBold },

  completionContent: { alignItems: 'center', paddingTop: Spacing.xl },
  completionTitle: { ...Typography.h1, color: Colors.text, marginTop: Spacing.lg, textAlign: 'center' },
  completionBody: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 24 },
  rewardsRow: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.xl },
  rewardItem: { alignItems: 'center', gap: Spacing.xs },
  rewardText: { ...Typography.bodyBold, color: Colors.bee },

  bottomBar: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});
