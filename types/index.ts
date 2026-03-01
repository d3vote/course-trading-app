export type CourseId = 'fundamentals' | 'technical-analysis' | 'risk-management' | 'advanced-strategies';
export type LessonType = 'info' | 'quiz' | 'practice';
export type LevelState = 'locked' | 'available' | 'completed';
export type SubscriptionTier = 'free' | 'pro';
export type SubscriptionPlan = 'weekly' | 'monthly' | 'yearly';

export interface SlideContent {
  id: string;
  type: 'content';
  title: string;
  body: string;
  icon: string;
}

export interface SlideQuestion {
  id: string;
  type: 'question';
  title: string;
  question: string;
  options: { id: string; text: string; correct: boolean }[];
}

export interface SlideCompletion {
  id: string;
  type: 'completion';
  title: string;
  body: string;
  xpReward: number;
  gemsReward: number;
}

export type Slide = SlideContent | SlideQuestion | SlideCompletion;

export interface Level {
  id: string;
  courseId: CourseId;
  unitIndex: number;
  levelIndex: number;
  title: string;
  description: string;
  type: LessonType;
  xpReward: number;
  gemsReward: number;
  slides: Slide[];
  isFree: boolean;
}

export interface Unit {
  id: string;
  courseId: CourseId;
  title: string;
  description: string;
  levels: Level[];
}

export interface Course {
  id: CourseId;
  title: string;
  description: string;
  color: string;
  colorDark: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  units: Unit[];
  isFree: boolean;
}

export interface UserProgress {
  username: string;
  totalXP: number;
  currentLevel: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  completedLessons: string[];
  activeCourseId: CourseId;
  hasCompletedOnboarding: boolean;
  traderStyle: string | null;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  plan: SubscriptionPlan | null;
  expiresAt: string | null;
  trialEndsAt: string | null;
  isTrialActive: boolean;
  hasBrokerOfferBeenShown: boolean;
  brokerLink: string;
  customOfferLink: string | null;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  xp: number;
  streak: number;
  level: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
}
