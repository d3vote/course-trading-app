import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Animated, Text } from 'react-native';
import { router, Href } from 'expo-router';
import { Colors, Spacing, Radius, Typography, buttonShadow } from '@/constants/theme';
import { COURSES, getLevelState } from '@/constants/courses';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setActiveCourse } from '@/store/slices/userSlice';
import { StatsBar } from '@/components/ui/StatsBar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircleIcon } from '@/components/svg/CheckCircleIcon';
import { LockIcon } from '@/components/svg/LockIcon';
import { StarIcon } from '@/components/svg/StarIcon';
import { TradeBull } from '@/components/svg/TradeBull';
import type { CourseId, Course as CourseType } from '@/types';

function CourseHeader({ course, completedCount, totalCount, onBookPress }: {
  course: CourseType;
  completedCount: number;
  totalCount: number;
  onBookPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.courseHeader, { backgroundColor: course.color }, buttonShadow(course.colorDark)]}
      onPress={onBookPress}
    >
      <View style={styles.courseHeaderLeft}>
        <Text style={styles.courseHeaderLabel}>{course.category.toUpperCase()}</Text>
        <Text style={styles.courseHeaderTitle}>{course.title}</Text>
        <View style={styles.courseProgress}>
          <ProgressBar
            progress={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
            color="rgba(255,255,255,0.6)"
            backgroundColor="rgba(255,255,255,0.25)"
            height={6}
          />
          <Text style={styles.courseProgressText}>{completedCount}/{totalCount}</Text>
        </View>
      </View>
      <View style={[styles.courseHeaderBook, { backgroundColor: course.colorDark }]}>
        <Text style={styles.courseHeaderBookIcon}>📖</Text>
      </View>
    </Pressable>
  );
}

function LevelNode({ levelId, index, state, courseColor, courseDarkColor, onPress }: {
  levelId: string;
  index: number;
  state: 'locked' | 'available' | 'completed';
  courseColor: string;
  courseDarkColor: string;
  onPress: () => void;
}) {
  const animValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (state === 'locked') return;
    Animated.timing(animValue, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animValue, { toValue: 0, duration: 120, useNativeDriver: true }).start();
  };

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });

  const bgColor = state === 'completed' ? courseColor : state === 'available' ? courseColor : Colors.swan;
  const shadowColor = state === 'completed' ? courseDarkColor : state === 'available' ? courseDarkColor : '#CACACA';

  // Zigzag pattern
  const offsetX = index % 4 === 0 ? 0 : index % 4 === 1 ? 40 : index % 4 === 2 ? 0 : -40;

  return (
    <View style={[styles.levelRow, { transform: [{ translateX: offsetX }] }]}>
      {state === 'available' && index === 0 && (
        <View style={styles.startBadge}>
          <Text style={[styles.startBadgeText, { color: courseColor }]}>START</Text>
        </View>
      )}
      <Pressable
        onPress={state !== 'locked' ? onPress : undefined}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={state === 'locked'}
      >
        <Animated.View
          style={[
            styles.levelButton,
            {
              backgroundColor: bgColor,
              shadowColor,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: state !== 'locked' ? 1 : 0,
              shadowRadius: 0,
              elevation: 0,
              transform: [{ translateY }],
            },
          ]}
        >
          {state === 'completed' && <CheckCircleIcon size={28} color="white" />}
          {state === 'available' && <StarIcon size={28} color="white" />}
          {state === 'locked' && <LockIcon size={28} color={Colors.hare} />}
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default function LearnScreen() {
  const dispatch = useAppDispatch();
  const { progress } = useAppSelector((state) => state.user);
  const subscription = useAppSelector((state) => state.subscription);

  const activeCourse = COURSES.find(c => c.id === progress.activeCourseId) || COURSES[0];

  const allLevels = activeCourse.units.flatMap(u => u.levels);
  const completedCount = allLevels.filter(l => progress.completedLessons.includes(l.id)).length;

  const handleLevelPress = useCallback((levelId: string, isFree: boolean) => {
    if (!isFree && subscription.tier === 'free') {
      router.push('/paywall' as Href);
      return;
    }
    router.push(`/lesson/${levelId}` as Href);
  }, [subscription.tier]);

  const handleCourseSwitch = useCallback(() => {
    const currentIdx = COURSES.findIndex(c => c.id === activeCourse.id);
    const nextIdx = (currentIdx + 1) % COURSES.length;
    dispatch(setActiveCourse(COURSES[nextIdx].id));
  }, [activeCourse.id, dispatch]);

  return (
    <View style={styles.container}>
      <StatsBar onGemsPress={() => router.push('/paywall' as Href)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CourseHeader
          course={activeCourse}
          completedCount={completedCount}
          totalCount={allLevels.length}
          onBookPress={handleCourseSwitch}
        />

        {/* Mascot welcome */}
        {completedCount === 0 && (
          <View style={styles.mascotContainer}>
            <TradeBull size={80} mood="excited" />
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>Let's start your trading journey!</Text>
              <View style={styles.speechArrow} />
            </View>
          </View>
        )}

        {/* Level roadmap */}
        <View style={styles.roadmap}>
          {allLevels.map((level, index) => {
            const state = getLevelState(level.id, progress.completedLessons);
            return (
              <LevelNode
                key={level.id}
                levelId={level.id}
                index={index}
                state={state}
                courseColor={activeCourse.color}
                courseDarkColor={activeCourse.colorDark}
                onPress={() => handleLevelPress(level.id, level.isFree)}
              />
            );
          })}
        </View>

        {/* Course selector */}
        <View style={styles.courseSelector}>
          <Text style={styles.courseSelectorTitle}>All Courses</Text>
          {COURSES.map((course) => {
            const isActive = course.id === activeCourse.id;
            const courseLevels = course.units.flatMap(u => u.levels);
            const done = courseLevels.filter(l => progress.completedLessons.includes(l.id)).length;
            const isLocked = !course.isFree && subscription.tier === 'free';

            return (
              <Pressable
                key={course.id}
                style={[styles.courseCard, isActive && styles.courseCardActive, { borderColor: course.color }]}
                onPress={() => {
                  if (isLocked) {
                    router.push('/paywall' as Href);
                  } else {
                    dispatch(setActiveCourse(course.id));
                  }
                }}
              >
                <View style={[styles.courseCardBadge, { backgroundColor: course.color }]}>
                  <Text style={styles.courseCardBadgeText}>
                    {course.category === 'beginner' ? '1' : course.category === 'intermediate' ? '2' : '3'}
                  </Text>
                </View>
                <View style={styles.courseCardInfo}>
                  <Text style={styles.courseCardTitle}>{course.title}</Text>
                  <Text style={styles.courseCardDesc}>{course.description}</Text>
                  <ProgressBar
                    progress={courseLevels.length > 0 ? (done / courseLevels.length) * 100 : 0}
                    color={course.color}
                    height={4}
                    style={{ marginTop: 6 }}
                  />
                </View>
                {isLocked && (
                  <View style={styles.courseCardLock}>
                    <LockIcon size={18} color={Colors.hare} />
                    <Text style={styles.courseCardLockText}>PRO</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  courseHeader: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseHeaderLeft: { flex: 1, paddingRight: 50 },
  courseHeaderLabel: { ...Typography.small, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  courseHeaderTitle: { ...Typography.h3, color: Colors.snow, marginBottom: 8 },
  courseProgress: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  courseProgressText: { ...Typography.small, color: 'rgba(255,255,255,0.8)' },
  courseHeaderBook: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 54,
    borderTopRightRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseHeaderBookIcon: { fontSize: 22 },

  mascotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  speechBubble: {
    backgroundColor: Colors.polar,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    maxWidth: 200,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  speechText: { ...Typography.captionBold, color: Colors.text },
  speechArrow: {
    position: 'absolute',
    left: -8,
    top: '50%',
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Colors.border,
  },

  roadmap: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
  levelRow: { alignItems: 'center', marginBottom: 28 },
  levelButton: {
    width: 68,
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBadge: {
    backgroundColor: Colors.snow,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 8,
    ...({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 } as any),
  },
  startBadgeText: { ...Typography.captionBold },

  courseSelector: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  courseSelectorTitle: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.md },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.snow,
    marginBottom: Spacing.sm,
  },
  courseCardActive: { borderWidth: 2 },
  courseCardBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  courseCardBadgeText: { ...Typography.bodyBold, color: Colors.snow },
  courseCardInfo: { flex: 1 },
  courseCardTitle: { ...Typography.bodyBold, color: Colors.text },
  courseCardDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  courseCardLock: { alignItems: 'center', gap: 2 },
  courseCardLockText: { ...Typography.small, color: Colors.hare },
});
