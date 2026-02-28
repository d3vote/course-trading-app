import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  currentLevel: number;
  totalXp: number;
  streak: number;
  gems: number;
  avatar?: string;
  joinDate: Date;
  totalLessonsCompleted: number;
  currentCourse?: {
    id: string;
    title: string;
    description: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
  };
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  addGems: (amount: number) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  completeLesson: () => void;
}

const defaultUser: User = {
  id: '1',
  username: 'Trader',
  currentLevel: 3,
  totalXp: 1250,
  streak: 7,
  gems: 450,
  joinDate: new Date('2024-01-01'),
  totalLessonsCompleted: 42,
  currentCourse: {
    id: 'course-1',
    title: 'Section 1, Unit 1',
    description: 'The Basics of Trading',
    progress: 65,
    totalLessons: 20,
    completedLessons: 13,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addGems = (amount: number) => {
    setUser(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const addXp = (amount: number) => {
    setUser(prev => {
      const newTotalXp = prev.totalXp + amount;
      const newLevel = Math.floor(newTotalXp / 500) + 1; // Level up every 500 XP
      return {
        ...prev,
        totalXp: newTotalXp,
        currentLevel: newLevel,
      };
    });
  };

  const incrementStreak = () => {
    setUser(prev => ({ ...prev, streak: prev.streak + 1 }));
  };

  const resetStreak = () => {
    setUser(prev => ({ ...prev, streak: 0 }));
  };

  const completeLesson = () => {
    setUser(prev => ({
      ...prev,
      totalLessonsCompleted: prev.totalLessonsCompleted + 1,
      currentCourse: prev.currentCourse ? {
        ...prev.currentCourse,
        completedLessons: prev.currentCourse.completedLessons + 1,
        progress: ((prev.currentCourse.completedLessons + 1) / prev.currentCourse.totalLessons) * 100,
      } : undefined,
    }));
  };

  const value: UserContextType = {
    user,
    updateUser,
    addGems,
    addXp,
    incrementStreak,
    resetStreak,
    completeLesson,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 