import React from 'react';
import { StyleSheet, Alert, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { CourseSection } from '@/components/CourseSection';
import { Roadmap } from '@/components/Roadmap';
import { CourseCard } from '@/components/CourseCard';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';

// Mock data for demonstration
const mockRoadmapLevels = [
  { id: 1, title: 'Basics', isCompleted: true, isCurrent: false, isLocked: false, xp: 100, icon: 'book' },
  { id: 2, title: 'Charts', isCompleted: true, isCurrent: false, isLocked: false, xp: 150, icon: 'bar-chart' },
  { id: 3, title: 'Patterns', isCompleted: false, isCurrent: true, isLocked: false, xp: 200, icon: 'search' },
  { id: 4, title: 'Indicators', isCompleted: false, isCurrent: false, isLocked: true, xp: 250, icon: 'trending-up' },
  { id: 5, title: 'Strategy', isCompleted: false, isCurrent: false, isLocked: true, xp: 300, icon: 'diamond' },
  { id: 6, title: 'Advanced', isCompleted: false, isCurrent: false, isLocked: true, xp: 400, icon: 'trophy' },
];

const mockAvailableCourses = [
  {
    title: 'Risk Management',
    description: 'Master position sizing, stop losses, and portfolio management techniques.',
    level: 4,
    isCompleted: false,
    isLocked: false,
  },
  {
    title: 'Psychology of Trading',
    description: 'Develop the mental discipline and emotional control needed for successful trading.',
    level: 5,
    isCompleted: false,
    isLocked: true,
  },
  {
    title: 'Options Trading',
    description: 'Learn advanced options strategies and risk management.',
    level: 6,
    isCompleted: false,
    isLocked: true,
  },
];

export default function LearnScreen() {
  const { courses, selectedCourseId } = useAppSelector((state: any) => state.courses);
  const { levels } = useAppSelector((state: any) => state.levels);
  const { progress } = useAppSelector((state: any) => state.user);
  
  // Get the first course as default
  const currentCourse = courses.find((c: any) => c.id === selectedCourseId) || courses[0];
  
  // Calculate overall progress for the current course
  const courseLevels = levels.filter((l: any) => l.courseId === currentCourse?.id);
  const totalLevels = courseLevels.length;
  const completedLevels = courseLevels.filter((l: any) => l.state === 'complete').length;
  const overallProgress = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

  const handleContinueCourse = () => {
    console.log('Navigating to book screen...');
    router.push({
      pathname: '/book',
      params: { bookId: '1' }
    });
  };

  const handleLevelPress = (level: any) => {
    if (level.isLocked) {
      Alert.alert('Level Locked', 'Complete previous levels to unlock this one!');
    } else {
      Alert.alert('Level Selected', `Starting ${level.title} level!`);
    }
  };

  const handleCoursePress = (course: any) => {
    if (course.isLocked) {
      Alert.alert('Course Locked', 'Complete previous courses to unlock this one!');
    } else {
      Alert.alert('Course Selected', `Starting ${course.title}!`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header Section */}
      <View style={styles.stickyHeader}>
        {/* Current Course Section */}
        {currentCourse && (
          <CourseSection
            courseTitle={currentCourse.title}
            courseDescription={currentCourse.description}
            progress={overallProgress}
            totalLessons={totalLevels}
            completedLessons={completedLevels}
            onContinue={handleContinueCourse}
          />
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Learning Path */}
        <Roadmap courseId={currentCourse?.id || 'course-1'} onLevelPress={handleLevelPress} />
        
        {/* Available Courses Section */}
        <View style={styles.coursesSection}>
          <ThemedText style={styles.sectionTitle}>Available Courses</ThemedText>
          {mockAvailableCourses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              description={course.description}
              level={course.level}
              isCompleted={course.isCompleted}
              isLocked={course.isLocked}
              onPress={() => handleCoursePress(course)}
            />
          ))}
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stickyHeader: {
    backgroundColor: Colors.background,
    zIndex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 120, // Space for navigation bar
  },
  coursesSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 40,
  },
}); 