# Course Trading App - Redux Architecture

A professional React Native trading education app built with Redux Toolkit for state management.

## 🏗️ Architecture Overview

### Redux Store Structure
```
store/
├── index.ts              # Main store configuration
├── hooks.ts              # Typed Redux hooks
└── slices/
    ├── coursesSlice.ts   # Course management
    ├── levelsSlice.ts    # Level state management
    └── userSlice.ts      # User progress & stats
```

## 🎯 Core Features

### 1. Course Management
- **3 Course States**: Open, Locked, Completed
- **Progressive Unlocking**: Next course unlocks after previous completion
- **Category-based Design**: Beginner, Intermediate, Advanced with different colors

### 2. Level System
- **3 Level States**: 
  - `incomplete` - Available to play
  - `complete` - Finished, can be replayed
  - `closed` - Locked until previous level completed
- **Replay System**: Complete levels can be replayed without losing progress
- **XP & Gem Rewards**: Each level provides XP and gems

### 3. User Progress Tracking
- **XP System**: Earn XP to level up
- **Gem Economy**: Collect and spend gems
- **Streak System**: Daily login streaks with rewards
- **Progress Persistence**: All progress saved in Redux store

## 🎨 Component Architecture

### Professional Component Layer
```
components/
├── index.ts              # Centralized exports
├── Core Components/
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   ├── Navbar.tsx
│   └── TabNavigator.tsx
├── Course Components/
│   ├── CourseCard.tsx
│   ├── CourseSection.tsx
│   └── CourseSelectionMenu.tsx
├── Learning Components/
│   ├── Roadmap.tsx
│   └── LearnHeader.tsx
└── UI Components/
    ├── SharedDesignSystem.tsx
    └── ui/
        ├── IconSymbol.tsx
        └── TabBarBackground.tsx
```

## 🚀 Usage Examples

### Using Redux in Components

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCourse, completeCourse } from '@/store/slices/coursesSlice';
import { completeLevel, addXP } from '@/store/slices/userSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector(state => state.courses);
  const { progress } = useAppSelector(state => state.user);

  const handleLevelComplete = (levelId: string) => {
    dispatch(completeLevel(levelId));
    dispatch(addXP(100));
  };

  return (
    // Your component JSX
  );
}
```

### Course Selection Menu

```typescript
import { CourseSelectionMenu } from '@/components';

function App() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <CourseCard 
        showCourseMenu={true}
        onPress={() => setMenuVisible(true)}
      />
      
      <CourseSelectionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onCourseSelect={(course) => {
          console.log('Selected:', course);
          setMenuVisible(false);
        }}
      />
    </>
  );
}
```

## 📊 State Management

### Courses Slice
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  level: number;
  isCompleted: boolean;
  isLocked: boolean;
  xpReward: number;
  gemReward: number;
  category: 'beginner' | 'intermediate' | 'advanced';
}
```

### Levels Slice
```typescript
interface Level {
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
```

### User Slice
```typescript
interface UserProgress {
  totalXP: number;
  currentLevel: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  totalCoursesCompleted: number;
  totalLevelsCompleted: number;
}
```

## 🎨 Design System

### Color Categories
- **Beginner**: Light green (`#E8F5E8`)
- **Intermediate**: Light orange (`#FFF3E0`)
- **Advanced**: Light purple (`#F3E5F5`)

### Status Colors
- **Completed**: Green (`Colors.success`)
- **Locked**: Gray (`Colors.gray`)
- **Open**: Primary (`Colors.primary`)

## 🔧 Development

### Installation
```bash
npm install
```

### Running the App
```bash
npm start
```

### Key Dependencies
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React Redux bindings
- `expo-router` - Navigation
- `@expo/vector-icons` - Icons

## 📱 Features

### Course Selection
- Beautiful course cards with category-based colors
- Modal-based course selection menu
- Progressive unlocking system
- Visual status indicators

### Learning Path
- Interactive roadmap with animated buttons
- Level state visualization
- Progress tracking
- Replay functionality

### User Experience
- Streak tracking with daily rewards
- Gem economy for in-app purchases
- XP-based leveling system
- Professional UI/UX design

## 🎯 Next Steps

1. **Add Persistence**: Implement AsyncStorage for data persistence
2. **Add Animations**: Enhance user experience with smooth transitions
3. **Add Analytics**: Track user progress and engagement
4. **Add Multiplayer**: Implement leaderboards and social features
5. **Add Content**: Expand course library with more trading topics

## 🤝 Contributing

This project follows a professional component architecture with:
- Clear separation of concerns
- TypeScript for type safety
- Redux for predictable state management
- Modular component design
- Comprehensive documentation 