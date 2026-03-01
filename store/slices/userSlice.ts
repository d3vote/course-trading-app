import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProgress, CourseId } from '@/types';
import { saveUserProgress, loadUserProgress } from '@/services/storage';

interface UserState {
  progress: UserProgress;
  isHydrated: boolean;
}

const initialProgress: UserProgress = {
  username: 'Trader',
  totalXP: 0,
  currentLevel: 1,
  gems: 50,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  activeCourseId: 'fundamentals',
  hasCompletedOnboarding: false,
  traderStyle: null,
};

const initialState: UserState = {
  progress: initialProgress,
  isHydrated: false,
};

export const hydrateUser = createAsyncThunk('user/hydrate', async () => {
  const data = await loadUserProgress();
  return data as UserProgress | null;
});

export const persistUser = createAsyncThunk(
  'user/persist',
  async (_, { getState }) => {
    const state = getState() as { user: UserState };
    await saveUserProgress(state.user.progress);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.progress.username = action.payload;
    },
    addXP(state, action: PayloadAction<number>) {
      state.progress.totalXP += action.payload;
      state.progress.currentLevel = Math.floor(state.progress.totalXP / 100) + 1;
    },
    addGems(state, action: PayloadAction<number>) {
      state.progress.gems += action.payload;
    },
    spendGems(state, action: PayloadAction<number>) {
      if (state.progress.gems >= action.payload) {
        state.progress.gems -= action.payload;
      }
    },
    completeLesson(state, action: PayloadAction<{ lessonId: string; xp: number; gems: number }>) {
      const { lessonId, xp, gems } = action.payload;
      if (!state.progress.completedLessons.includes(lessonId)) {
        state.progress.completedLessons.push(lessonId);
        state.progress.totalXP += xp;
        state.progress.gems += gems;
        state.progress.currentLevel = Math.floor(state.progress.totalXP / 100) + 1;
      }
    },
    setActiveCourse(state, action: PayloadAction<CourseId>) {
      state.progress.activeCourseId = action.payload;
    },
    updateStreak(state) {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = state.progress.lastActiveDate;
      if (today === lastActive) return;

      const lastDate = new Date(lastActive);
      const todayDate = new Date(today);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        state.progress.currentStreak += 1;
      } else if (diffDays > 1) {
        state.progress.currentStreak = 1;
      }

      if (state.progress.currentStreak > state.progress.longestStreak) {
        state.progress.longestStreak = state.progress.currentStreak;
      }
      state.progress.lastActiveDate = today;
    },
    completeOnboarding(state, action: PayloadAction<string>) {
      state.progress.hasCompletedOnboarding = true;
      state.progress.traderStyle = action.payload;
    },
    resetProgress(state) {
      state.progress = initialProgress;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.progress = { ...initialProgress, ...action.payload };
      }
      state.isHydrated = true;
    });
    builder.addCase(hydrateUser.rejected, (state) => {
      state.isHydrated = true;
    });
  },
});

export const {
  setUsername,
  addXP,
  addGems,
  spendGems,
  completeLesson,
  setActiveCourse,
  updateStreak,
  completeOnboarding,
  resetProgress,
} = userSlice.actions;

export default userSlice.reducer;
