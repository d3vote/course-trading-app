import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from './ui/IconSymbol';

interface CourseSectionProps {
  courseTitle: string;
  courseDescription: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  onContinue: () => void;
  courseColor?: string;
  courseShadowColor?: string;
}

export function CourseSection({ 
  courseTitle, 
  courseDescription, 
  progress, 
  totalLessons, 
  completedLessons, 
  onContinue,
  courseColor = Colors.primary,
  courseShadowColor = Colors.shadwPrimary
}: CourseSectionProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.courseCard, { backgroundColor: courseColor, shadowColor: courseShadowColor }]}>
        {/* Left side content */}
        <View style={styles.leftContent}>
          <ThemedText style={styles.unitTitle}>{courseTitle}</ThemedText>
          <ThemedText style={styles.unitDescription}>{courseDescription}</ThemedText>
        </View>

        {/* Right side guidebook button */}
        <TouchableOpacity 
          style={[styles.guidebookButton, { backgroundColor: courseColor, borderLeftColor: courseShadowColor }]}
          onPress={() => {
            console.log('Book button pressed in CourseSection');
            onContinue();
          }}
        >
          <IconSymbol 
            name="book.fill" 
            size={20} 
            color="white" 
            style={styles.bookIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    marginHorizontal: 20,
    marginVertical: 20,
    marginTop: 40,
  },
  courseCard: {
    backgroundColor: '#1CB0F6',
    borderRadius: 13,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    shadowColor: Colors.shadwPrimary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  leftContent: {
    flex: 1,
    paddingRight: 60,
  },
  unitTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  unitDescription: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 22,
    width: '80%',
  },
  guidebookButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#1CB0F6',
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 2,
    borderLeftColor: Colors.shadwPrimary,
  },
  bookIcon: {
    color: 'white',
  },
}); 