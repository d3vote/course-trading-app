import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: number;
  isCompleted: boolean;
  isLocked: boolean;
  xpReward: number;
  gemReward: number;
  category: 'beginner' | 'intermediate' | 'advanced';
  color: string;
  shadowColor: string;
  thumbnail?: string;
}

interface CoursesState {
  courses: Course[];
  selectedCourseId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [
    {
      id: 'course-1',
      title: 'Trading Fundamentals',
      description: 'Learn the basics of trading',
      level: 1,
      isCompleted: false,
      isLocked: false,
      xpReward: 100,
      gemReward: 10,
      category: 'beginner',
      color: '#4CAF50', // Green
      shadowColor: '#388E3C', // Darker Green
    },
    {
      id: 'course-2',
      title: 'Technical Analysis',
      description: 'Master chart patterns and technical indicators',
      level: 2,
      isCompleted: false,
      isLocked: true,
      xpReward: 150,
      gemReward: 15,
      category: 'intermediate',
      color: '#2196F3', // Blue
      shadowColor: '#1976D2', // Darker Blue
    },
    {
      id: 'course-3',
      title: 'Risk Management',
      description: 'Learn to protect your capital and manage risk',
      level: 3,
      isCompleted: false,
      isLocked: true,
      xpReward: 200,
      gemReward: 20,
      category: 'advanced',
      color: '#FF9800', // Orange
      shadowColor: '#F57C00', // Darker Orange
    },
    {
      id: 'course-4',
      title: 'Advanced Strategies',
      description: 'Complex trading strategies for experienced traders',
      level: 4,
      isCompleted: false,
      isLocked: true,
      xpReward: 250,
      gemReward: 25,
      category: 'advanced',
      color: '#E91E63', // Pink
      shadowColor: '#C2185B', // Darker Pink
    },
  ],
  selectedCourseId: null,
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    selectCourse: (state, action: PayloadAction<string>) => {
      state.selectedCourseId = action.payload;
    },
    completeCourse: (state, action: PayloadAction<string>) => {
      const course = state.courses.find(c => c.id === action.payload);
      if (course) {
        course.isCompleted = true;
        // Unlock next course if it exists
        const nextCourse = state.courses.find(c => c.level === course.level + 1);
        if (nextCourse) {
          nextCourse.isLocked = false;
        }
      }
    },
    unlockCourse: (state, action: PayloadAction<string>) => {
      const course = state.courses.find(c => c.id === action.payload);
      if (course) {
        course.isLocked = false;
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
  selectCourse, 
  completeCourse, 
  unlockCourse, 
  setLoading, 
  setError 
} = coursesSlice.actions;

export default coursesSlice.reducer; 