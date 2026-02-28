import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Level {
  id: string;
  courseId: string;
  levelNumber: number;
  title: string;
  description: string;
  state: 'incomplete' | 'complete' | 'closed';
  xpReward: number;
  gemReward: number;
  isReplayable: boolean;
  replayCount: number;
  maxReplays: number;
}

interface LevelsState {
  levels: Level[];
  currentLevelId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: LevelsState = {
  levels: [
    // Course 1 levels
    {
      id: 'level-1-1',
      courseId: 'course-1',
      levelNumber: 1,
      title: 'Introduction to Trading',
      description: 'Learn the basic concepts of trading',
      state: 'incomplete',
      xpReward: 25,
      gemReward: 2,
      isReplayable: true,
      replayCount: 0,
      maxReplays: 3,
    },
    {
      id: 'level-1-2',
      courseId: 'course-1',
      levelNumber: 2,
      title: 'Market Basics',
      description: 'Understanding market structure and order types',
      state: 'closed',
      xpReward: 25,
      gemReward: 2,
      isReplayable: true,
      replayCount: 0,
      maxReplays: 3,
    },
    {
      id: 'level-1-3',
      courseId: 'course-1',
      levelNumber: 3,
      title: 'First Trade',
      description: 'Execute your first simulated trade',
      state: 'closed',
      xpReward: 50,
      gemReward: 5,
      isReplayable: true,
      replayCount: 0,
      maxReplays: 3,
    },
    // Course 2 levels
    {
      id: 'level-2-1',
      courseId: 'course-2',
      levelNumber: 1,
      title: 'Chart Patterns',
      description: 'Identify common chart patterns',
      state: 'closed',
      xpReward: 30,
      gemReward: 3,
      isReplayable: true,
      replayCount: 0,
      maxReplays: 3,
    },
    {
      id: 'level-2-2',
      courseId: 'course-2',
      levelNumber: 2,
      title: 'Technical Indicators',
      description: 'Use RSI, MACD, and other indicators',
      state: 'closed',
      xpReward: 30,
      gemReward: 3,
      isReplayable: true,
      replayCount: 0,
      maxReplays: 3,
    },
    // Course 3 levels
    {
      id: 'level-3-1',
      courseId: 'course-3',
      levelNumber: 1,
      title: 'Position Sizing',
      description: 'Calculate proper position sizes',
      state: 'closed',
      xpReward: 40,
      gemReward: 4,
      isReplayable: true,
      replayCount: 0,
      maxReplays: 3,
    },
    // Course 4 levels
    {
      id: 'level-4-1',
      courseId: 'course-4',
      levelNumber: 1,
      title: 'Advanced Entry Strategies',
      description: 'Complex entry and exit strategies',
      state: 'closed',
      xpReward: 50,
      gemReward: 5,
      isReplayable: true,
      replayCount: 0,
      maxReplays: 3,
    },
  ],
  currentLevelId: null,
  loading: false,
  error: null,
};

const levelsSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    setCurrentLevel: (state, action: PayloadAction<string>) => {
      state.currentLevelId = action.payload;
    },
    completeLevel: (state, action: PayloadAction<string>) => {
      const level = state.levels.find(l => l.id === action.payload);
      if (level) {
        level.state = 'complete';
        // Open next level in the same course
        const nextLevel = state.levels.find(l => 
          l.courseId === level.courseId && 
          l.levelNumber === level.levelNumber + 1
        );
        if (nextLevel) {
          nextLevel.state = 'incomplete';
        }
      }
    },
    replayLevel: (state, action: PayloadAction<string>) => {
      const level = state.levels.find(l => l.id === action.payload);
      if (level && level.isReplayable && level.replayCount < level.maxReplays) {
        level.replayCount += 1;
        // Don't change the state - it remains complete but can be replayed
      }
    },
    unlockLevel: (state, action: PayloadAction<string>) => {
      const level = state.levels.find(l => l.id === action.payload);
      if (level) {
        level.state = 'incomplete';
      }
    },
    setLevelState: (state, action: PayloadAction<{ levelId: string; state: 'incomplete' | 'complete' | 'closed' }>) => {
      const level = state.levels.find(l => l.id === action.payload.levelId);
      if (level) {
        level.state = action.payload.state;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setCurrentLevel, 
  completeLevel, 
  replayLevel, 
  unlockLevel, 
  setLevelState,
  setLoading, 
  setError 
} = levelsSlice.actions;

export default levelsSlice.reducer; 