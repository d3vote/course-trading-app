import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './slices/coursesSlice';
import levelsReducer from './slices/levelsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    levels: levelsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 