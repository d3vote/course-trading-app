import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { CourseSelectionMenu } from './CourseSelectionMenu';
import { Course } from '@/store/slices/coursesSlice';

interface CourseCardProps {
  title: string;
  description: string;
  level: number;
  isCompleted: boolean;
  isLocked: boolean;
  onPress: () => void;
  showCourseMenu?: boolean;
}

export function CourseCard({ title, description, level, isCompleted, isLocked, onPress, showCourseMenu = false }: CourseCardProps) {
  const [courseMenuVisible, setCourseMenuVisible] = useState(false);

  const getStatusColor = () => {
    if (isCompleted) return Colors.success;
    if (isLocked) return Colors.darkGray;
    return Colors.primary;
  };

  const getStatusIcon = () => {
    if (isCompleted) return '✓';
    if (isLocked) return '🔒';
    return '▶';
  };

  const handleCourseSelect = (course: Course) => {
    // Handle course selection - this could navigate to the course or update state
    console.log('Selected course:', course);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: isLocked ? Colors.gray : 'white',
            borderColor: getStatusColor(),
          },
        ]}
        onPress={showCourseMenu ? () => setCourseMenuVisible(true) : onPress}
        disabled={isLocked}
      >
        <View style={styles.header}>
          <View style={[styles.levelBadge, { backgroundColor: getStatusColor() }]}>
            <ThemedText style={styles.levelText}>{level}</ThemedText>
          </View>
          <View style={[styles.statusIcon, { backgroundColor: getStatusColor() }]}>
            <ThemedText style={styles.statusIconText}>{getStatusIcon()}</ThemedText>
          </View>
        </View>
        
        <View style={styles.content}>
          <ThemedText style={[styles.title, { color: isLocked ? Colors.darkGray : Colors.text }]}>
            {title}
          </ThemedText>
          <ThemedText style={[styles.description, { color: isLocked ? Colors.darkGray : Colors.darkGray }]}>
            {description}
          </ThemedText>
        </View>
      </TouchableOpacity>

      {/* Course Selection Menu */}
      {showCourseMenu && (
        <CourseSelectionMenu
          visible={courseMenuVisible}
          onClose={() => setCourseMenuVisible(false)}
          onCourseSelect={handleCourseSelect}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 