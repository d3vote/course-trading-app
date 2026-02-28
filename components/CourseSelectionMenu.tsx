import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCourse } from '@/store/slices/coursesSlice';
import { Course } from '@/store/slices/coursesSlice';

interface CourseSelectionMenuProps {
  visible: boolean;
  onClose: () => void;
  onCourseSelect: (course: Course) => void;
}

export function CourseSelectionMenu({ visible, onClose, onCourseSelect }: CourseSelectionMenuProps) {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector(state => state.courses);

  const handleCoursePress = (course: Course) => {
    dispatch(selectCourse(course.id));
    onCourseSelect(course);
    onClose();
  };

  const getCourseCardStyle = (course: Course) => {
    let backgroundColor = '#FFFFFF';
    let borderColor = Colors.primary;
    
    // Different colors based on category
    switch (course.category) {
      case 'beginner':
        backgroundColor = '#E8F5E8';
        break;
      case 'intermediate':
        backgroundColor = '#FFF3E0';
        break;
      case 'advanced':
        backgroundColor = '#F3E5F5';
        break;
    }

    // Different border colors based on status
    if (course.isCompleted) {
      borderColor = Colors.success;
    } else if (course.isLocked) {
      borderColor = Colors.gray;
    } else {
      borderColor = Colors.primary;
    }

    return {
      ...styles.courseCard,
      backgroundColor,
      borderColor,
    };
  };

  const getStatusIcon = (course: Course) => {
    if (course.isCompleted) return 'checkmark-circle';
    if (course.isLocked) return 'lock-closed';
    return 'play-circle';
  };

  const getStatusColor = (course: Course) => {
    if (course.isCompleted) return Colors.success;
    if (course.isLocked) return Colors.gray;
    return Colors.primary;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Choose Your Course</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Courses List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.coursesContainer}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={getCourseCardStyle(course)}
                onPress={() => handleCoursePress(course)}
                disabled={course.isLocked}
                activeOpacity={0.8}
              >
                {/* Course Header */}
                <View style={styles.courseHeader}>
                  <View style={[styles.levelBadge, { backgroundColor: getStatusColor(course) }]}>
                    <ThemedText style={styles.levelText}>{course.level}</ThemedText>
                  </View>
                  <View style={[styles.statusIcon, { backgroundColor: getStatusColor(course) }]}>
                    <Ionicons 
                      name={getStatusIcon(course) as any} 
                      size={16} 
                      color="white" 
                    />
                  </View>
                </View>

                {/* Course Content */}
                <View style={styles.courseContent}>
                  <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                  <ThemedText style={styles.courseDescription}>{course.description}</ThemedText>
                  
                  {/* Rewards */}
                  <View style={styles.rewardsContainer}>
                    <View style={styles.rewardItem}>
                      <Ionicons name="star" size={16} color={Colors.progressYellow} />
                      <ThemedText style={styles.rewardText}>{course.xpReward} XP</ThemedText>
                    </View>
                    <View style={styles.rewardItem}>
                      <Ionicons name="diamond" size={16} color={Colors.primary} />
                      <ThemedText style={styles.rewardText}>{course.gemReward} Gems</ThemedText>
                    </View>
                  </View>

                  {/* Category Badge */}
                  <View style={[styles.categoryBadge, { backgroundColor: getStatusColor(course) }]}>
                    <ThemedText style={styles.categoryText}>
                      {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  coursesContainer: {
    padding: 20,
    gap: 16,
  },
  courseCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContent: {
    gap: 12,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  courseDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.darkGray,
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 14,
    color: Colors.darkGray,
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}); 