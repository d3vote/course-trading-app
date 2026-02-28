import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Level {
  id: number;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Unit {
  id: number;
  levels: Level[];
  isCompleted: boolean;
  isLocked: boolean;
}

interface Book {
  id: number;
  units: Unit[];
  isCompleted: boolean;
  isLocked: boolean;
}

interface LearningProgress {
  books: Book[];
  completedLevels: number[];
  completedUnits: number[];
  completedBooks: number[];
}

interface LearningProgressContextType {
  progress: LearningProgress;
  completeLevel: (bookId: number, unitId: number, levelId: number) => void;
  isLevelCompleted: (bookId: number, unitId: number, levelId: number) => boolean;
  isLevelLocked: (bookId: number, unitId: number, levelId: number) => boolean;
  isUnitCompleted: (bookId: number, unitId: number) => boolean;
  isUnitLocked: (bookId: number, unitId: number) => boolean;
  isBookCompleted: (bookId: number) => boolean;
  isBookLocked: (bookId: number) => boolean;
}

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

// Initial mock data structure
const initialProgress: LearningProgress = {
  books: [
    {
      id: 1,
      isCompleted: false,
      isLocked: false,
      units: [
        {
          id: 1,
          isCompleted: true,
          isLocked: false,
          levels: [
            { id: 1, isCompleted: true, isLocked: false },
            { id: 2, isCompleted: true, isLocked: false },
            { id: 3, isCompleted: true, isLocked: false },
            { id: 4, isCompleted: false, isLocked: false },
            { id: 5, isCompleted: false, isLocked: true },
          ]
        },
        {
          id: 2,
          isCompleted: false,
          isLocked: false,
          levels: [
            { id: 1, isCompleted: true, isLocked: false },
            { id: 2, isCompleted: false, isLocked: false },
            { id: 3, isCompleted: false, isLocked: true },
            { id: 4, isCompleted: false, isLocked: true },
            { id: 5, isCompleted: false, isLocked: true },
            { id: 6, isCompleted: false, isLocked: true },
          ]
        },
        {
          id: 3,
          isCompleted: false,
          isLocked: true,
          levels: [
            { id: 1, isCompleted: false, isLocked: true },
            { id: 2, isCompleted: false, isLocked: true },
            { id: 3, isCompleted: false, isLocked: true },
            { id: 4, isCompleted: false, isLocked: true },
          ]
        },
        {
          id: 4,
          isCompleted: false,
          isLocked: true,
          levels: [
            { id: 1, isCompleted: false, isLocked: true },
            { id: 2, isCompleted: false, isLocked: true },
            { id: 3, isCompleted: false, isLocked: true },
            { id: 4, isCompleted: false, isLocked: true },
            { id: 5, isCompleted: false, isLocked: true },
          ]
        }
      ]
    }
  ],
  completedLevels: [1, 2, 3, 4], // Level IDs that are completed
  completedUnits: [1], // Unit IDs that are completed
  completedBooks: [], // Book IDs that are completed
};

export function LearningProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(initialProgress);
  
  console.log('LearningProgressProvider initialized with:', progress);

  const completeLevel = (bookId: number, unitId: number, levelId: number) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      
      // Find and update the level
      const book = newProgress.books.find(b => b.id === bookId);
      if (book) {
        const unit = book.units.find(u => u.id === unitId);
        if (unit) {
          const level = unit.levels.find(l => l.id === levelId);
          if (level) {
            level.isCompleted = true;
            
            // Add to completed levels
            if (!newProgress.completedLevels.includes(levelId)) {
              newProgress.completedLevels.push(levelId);
            }
            
            // Check if unit is completed
            const allLevelsCompleted = unit.levels.every(l => l.isCompleted);
            if (allLevelsCompleted && !unit.isCompleted) {
              unit.isCompleted = true;
              if (!newProgress.completedUnits.includes(unitId)) {
                newProgress.completedUnits.push(unitId);
              }
              
              // Unlock next unit
              const nextUnit = book.units.find(u => u.id === unitId + 1);
              if (nextUnit) {
                nextUnit.isLocked = false;
                // Unlock first level of next unit
                const firstLevel = nextUnit.levels[0];
                if (firstLevel) {
                  firstLevel.isLocked = false;
                }
              }
            }
            
            // Check if book is completed
            const allUnitsCompleted = book.units.every(u => u.isCompleted);
            if (allUnitsCompleted && !book.isCompleted) {
              book.isCompleted = true;
              if (!newProgress.completedBooks.includes(bookId)) {
                newProgress.completedBooks.push(bookId);
              }
            }
          }
        }
      }
      
      return newProgress;
    });
  };

  const isLevelCompleted = (bookId: number, unitId: number, levelId: number): boolean => {
    const book = progress.books.find(b => b.id === bookId);
    if (!book) return false;
    
    const unit = book.units.find(u => u.id === unitId);
    if (!unit) return false;
    
    const level = unit.levels.find(l => l.id === levelId);
    return level ? level.isCompleted : false;
  };

  const isLevelLocked = (bookId: number, unitId: number, levelId: number): boolean => {
    const book = progress.books.find(b => b.id === bookId);
    if (!book) return true;
    
    const unit = book.units.find(u => u.id === unitId);
    if (!unit) return true;
    
    const level = unit.levels.find(l => l.id === levelId);
    return level ? level.isLocked : true;
  };

  const isUnitCompleted = (bookId: number, unitId: number): boolean => {
    const book = progress.books.find(b => b.id === bookId);
    if (!book) return false;
    
    const unit = book.units.find(u => u.id === unitId);
    return unit ? unit.isCompleted : false;
  };

  const isUnitLocked = (bookId: number, unitId: number): boolean => {
    const book = progress.books.find(b => b.id === bookId);
    if (!book) return true;
    
    const unit = book.units.find(u => u.id === unitId);
    return unit ? unit.isLocked : true;
  };

  const isBookCompleted = (bookId: number): boolean => {
    const book = progress.books.find(b => b.id === bookId);
    return book ? book.isCompleted : false;
  };

  const isBookLocked = (bookId: number): boolean => {
    const book = progress.books.find(b => b.id === bookId);
    return book ? book.isLocked : true;
  };

  return (
    <LearningProgressContext.Provider value={{
      progress,
      completeLevel,
      isLevelCompleted,
      isLevelLocked,
      isUnitCompleted,
      isUnitLocked,
      isBookCompleted,
      isBookLocked,
    }}>
      {children}
    </LearningProgressContext.Provider>
  );
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext);
  if (context === undefined) {
    throw new Error('useLearningProgress must be used within a LearningProgressProvider');
  }
  return context;
} 