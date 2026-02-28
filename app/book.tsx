import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import { Course } from '@/store/slices/coursesSlice';

interface BookScreenProps {
  onNavigate?: (screenName: string) => void;
}

export default function BookScreen({ onNavigate }: BookScreenProps) {
  console.log('BookScreen component is loading...');
  const { courses } = useAppSelector((state: any) => state.courses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  
  console.log('BookScreen rendered with courses:', courses.length);
  
  const handleBack = () => {
    console.log('Back button pressed');
    if (onNavigate) {
      onNavigate('learn');
    }
  };

  const handleCoursePress = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const getCourseCardStyle = (course: Course) => {
    // Use the colors defined within each course
    const backgroundColor = course.color;
    const shadowColor = course.shadowColor;
    
    // Make locked courses appear grayed out by reducing opacity
    const opacity = course.isLocked ? 0.7 : 1;

    return {
      ...styles.courseCard,
      backgroundColor,
      shadowColor,
      opacity,
    };
  };

  const getStatusIcon = (course: Course) => {
    if (course.isCompleted) return 'checkmark-circle';
    if (course.isLocked) return 'lock-closed';
    return 'play-circle';
  };

  const getStatusColor = (course: Course) => {
    if (course.isCompleted) return 'white';
    if (course.isLocked) return 'white';
    return 'white';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.tint} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText style={styles.bookTitle}>Course Library</ThemedText>
          <ThemedText style={styles.bookDescription}>Explore all available trading courses</ThemedText>
        </View>
      </View>

      {/* Courses Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.coursesContainer}>
          {courses.map((course: Course) => (
            <TouchableOpacity
              key={course.id}
              style={getCourseCardStyle(course)}
              onPress={() => handleCoursePress(course)}
              disabled={course.isLocked}
              activeOpacity={0.8}
            >
              {/* Left side content */}
              <View style={styles.leftContent}>
                <ThemedText style={styles.unitTitle}>{course.title}</ThemedText>
                <ThemedText style={styles.unitDescription}>{course.description}</ThemedText>
              </View>

              {/* Right side button */}
              <TouchableOpacity 
                style={[styles.guidebookButton, { backgroundColor: course.color, borderLeftColor: course.shadowColor }]}
                onPress={() => handleCoursePress(course)}
                disabled={course.isLocked}
              >
                <Ionicons 
                  name={course.isLocked ? "lock-closed" : "information-circle"} 
                  size={20} 
                  color="white" 
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Course Detail Modal */}
      <Modal
        visible={showCourseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCourseModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeCourseModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Course Details</ThemedText>
            <View style={styles.placeholder} />
          </View>

          {/* Course Details */}
          {selectedCourse && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.courseDetailCard}>
                {/* Course Header */}
                <View style={styles.detailHeader}>
                  <View style={[styles.detailLevelBadge, { backgroundColor: selectedCourse.color }]}>
                    <ThemedText style={styles.detailLevelText}>{selectedCourse.level}</ThemedText>
                  </View>
                  <View style={styles.detailStatusContainer}>
                    {selectedCourse.isCompleted ? (
                      <View style={styles.statusItem}>
                        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                        <ThemedText style={[styles.statusText, { color: Colors.success }]}>Completed</ThemedText>
                      </View>
                    ) : selectedCourse.isLocked ? (
                      <View style={styles.statusItem}>
                        <Ionicons name="lock-closed" size={20} color={Colors.gray} />
                        <ThemedText style={[styles.statusText, { color: Colors.gray }]}>Locked</ThemedText>
                      </View>
                    ) : (
                      <View style={styles.statusItem}>
                        <Ionicons name="play-circle" size={20} color={selectedCourse.color} />
                        <ThemedText style={[styles.statusText, { color: selectedCourse.color }]}>Available</ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                {/* Course Title and Description */}
                <ThemedText style={styles.detailTitle}>{selectedCourse.title}</ThemedText>
                <ThemedText style={styles.detailDescription}>{selectedCourse.description}</ThemedText>

                {/* Category and Rewards Row */}
                <View style={styles.detailInfoRow}>
                  {/* Category */}
                  <View style={styles.detailInfoItem}>
                    <ThemedText style={styles.detailInfoLabel}>Category</ThemedText>
                    <View style={[styles.detailCategoryBadge, { backgroundColor: selectedCourse.color }]}>
                      <ThemedText style={styles.detailCategoryText}>
                        {selectedCourse.category.charAt(0).toUpperCase() + selectedCourse.category.slice(1)}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Rewards */}
                  <View style={styles.detailInfoItem}>
                    <ThemedText style={styles.detailInfoLabel}>Rewards</ThemedText>
                    <View style={styles.detailRewardsContainer}>
                      <View style={styles.detailRewardItem}>
                        <Ionicons name="star" size={16} color={Colors.progressYellow} />
                        <ThemedText style={styles.detailRewardText}>{selectedCourse.xpReward} XP</ThemedText>
                      </View>
                      <View style={styles.detailRewardItem}>
                        <Ionicons name="diamond" size={16} color={selectedCourse.color} />
                        <ThemedText style={styles.detailRewardText}>{selectedCourse.gemReward} Gems</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
      
      {/* Bottom spacing for navigation */}
      <View style={{ height: 150 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  backButton: {
    marginBottom: 15,
  },
  headerContent: {
    gap: 8,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  bookDescription: {
    fontSize: 16,
    color: Colors.darkGray,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  coursesContainer: {
    padding: 16,
    gap: 20,
  },
  courseCard: {
    borderRadius: 13,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
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
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  unitDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 20,
    width: '80%',
  },
  guidebookButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 2,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
  },
  courseDetailCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.borderGray,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailLevelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLevelText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailStatusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.darkGray,
    marginBottom: 24,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  detailCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailCategoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  detailRewardsContainer: {
    gap: 12,
  },
  detailRewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailRewardText: {
    fontSize: 16,
    color: Colors.darkGray,
    fontWeight: '600',
  },
  detailStatusContainer: {
    marginTop: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  detailInfoItem: {
    flex: 1,
    marginRight: 10,
  },
  detailInfoLabel: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 8,
  },
}); 