import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProgress {
  username: string;
  totalXP: number;
  currentLevel: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  totalCoursesCompleted: number;
  totalLevelsCompleted: number;
}

interface UserState {
  progress: UserProgress;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  progress: {
    username: 'Trader',
    totalXP: 0,
    currentLevel: 1,
    gems: 50, // Starting gems
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: new Date().toISOString(),
    totalCoursesCompleted: 0,
    totalLevelsCompleted: 0,
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUsername: (state, action: PayloadAction<string>) => {
      state.progress.username = action.payload;
    },
    addXP: (state, action: PayloadAction<number>) => {
      state.progress.totalXP += action.payload;
      // Simple level calculation: every 100 XP = 1 level
      const newLevel = Math.floor(state.progress.totalXP / 100) + 1;
      if (newLevel > state.progress.currentLevel) {
        state.progress.currentLevel = newLevel;
      }
    },
    addGems: (state, action: PayloadAction<number>) => {
      state.progress.gems += action.payload;
    },
    spendGems: (state, action: PayloadAction<number>) => {
      if (state.progress.gems >= action.payload) {
        state.progress.gems -= action.payload;
      }
    },
    updateStreak: (state, action: PayloadAction<number>) => {
      state.progress.currentStreak = action.payload;
      if (action.payload > state.progress.longestStreak) {
        state.progress.longestStreak = action.payload;
      }
    },
    incrementStreak: (state) => {
      state.progress.currentStreak += 1;
      if (state.progress.currentStreak > state.progress.longestStreak) {
        state.progress.longestStreak = state.progress.currentStreak;
      }
    },
    resetStreak: (state) => {
      state.progress.currentStreak = 0;
    },
    updateLastLogin: (state) => {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = state.progress.lastLoginDate.split('T')[0];
      
      if (today !== lastLogin) {
        // Check if it's consecutive days
        const lastLoginDate = new Date(lastLogin);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastLoginDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day, increment streak
          state.progress.currentStreak += 1;
        } else if (diffDays > 1) {
          // Break in streak, reset
          state.progress.currentStreak = 1;
        }
        // If diffDays === 0, same day, don't change streak
        
        state.progress.lastLoginDate = today;
      }
    },
    completeCourse: (state) => {
      state.progress.totalCoursesCompleted += 1;
    },
    completeLevel: (state) => {
      state.progress.totalLevelsCompleted += 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetProgress: (state) => {
      state.progress = initialState.progress;
    },
  },
});

export const { 
  updateUsername,
  addXP, 
  addGems, 
  spendGems, 
  updateStreak, 
  incrementStreak, 
  resetStreak,
  updateLastLogin,
  completeCourse,
  completeLevel,
  setLoading, 
  setError,
  resetProgress
} = userSlice.actions;

export default userSlice.reducer; 