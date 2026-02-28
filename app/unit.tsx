import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useLearningProgress } from '@/contexts/LearningProgressContext';

// Mock unit data with levels
const mockUnit = {
  id: 1,
  title: 'Unit 1: Market Basics',
  description: 'Understanding how markets work and basic terminology',
  levels: [
    {
      id: 1,
      title: 'What is Trading?',
      description: 'Introduction to trading concepts',
      isCompleted: true,
      isLocked: false,
      type: 'info',
    },
    {
      id: 2,
      title: 'Market Types',
      description: 'Different types of financial markets',
      isCompleted: true,
      isLocked: false,
      type: 'info',
    },
    {
      id: 3,
      title: 'Basic Terminology',
      description: 'Essential trading terms you need to know',
      isCompleted: true,
      isLocked: false,
      type: 'info',
    },
    {
      id: 4,
      title: 'Quiz: Market Basics',
      description: 'Test your knowledge with multiple choice questions',
      isCompleted: false,
      isLocked: false,
      type: 'quiz',
    },
    {
      id: 5,
      title: 'Practice: Market Analysis',
      description: 'Apply what you learned with real examples',
      isCompleted: false,
      isLocked: true,
      type: 'practice',
    },
  ]
};

export default function UnitScreen() {
  const params = useLocalSearchParams();
  const unitId = parseInt(params.unitId as string);
  const bookId = parseInt(params.bookId as string);
  const { progress, isLevelCompleted, isLevelLocked } = useLearningProgress();

  const book = progress.books.find(b => b.id === bookId);
  const unit = book?.units.find(u => u.id === unitId);
  const levels = unit?.levels || [];

  const handleLevelPress = (level: any) => {
    const isLocked = isLevelLocked(bookId, unitId, level.id);
    if (isLocked) {
      Alert.alert('Level Locked', 'Complete previous levels to unlock this one!');
    } else {
      router.push({
        pathname: '/lesson',
        params: { 
          levelId: level.id.toString(), 
          unitId: unitId.toString(), 
          bookId: bookId.toString(),
          levelType: level.type 
        }
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getLevelIcon = (level: any) => {
    if (level.isCompleted) return 'checkmark-circle';
    if (level.isLocked) return 'lock-closed';
    
    switch (level.type) {
      case 'info': return 'information-circle';
      case 'quiz': return 'help-circle';
      case 'practice': return 'play-circle';
      default: return 'ellipse';
    }
  };

  const getLevelColor = (level: any) => {
    if (level.isCompleted) return Colors.success;
    if (level.isLocked) return Colors.darkGray;
    
    switch (level.type) {
      case 'info': return Colors.primary;
      case 'quiz': return Colors.accent;
      case 'practice': return Colors.tint;
      default: return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.tint} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText style={styles.unitTitle}>{mockUnit.title}</ThemedText>
          <ThemedText style={styles.unitDescription}>{mockUnit.description}</ThemedText>
        </View>
      </View>

      {/* Levels List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.levelsContainer}>
          {levels.map((level, index) => {
            const isCompleted = isLevelCompleted(bookId, unitId, level.id);
            const isLocked = isLevelLocked(bookId, unitId, level.id);
            const levelType = mockUnit.levels[index]?.type || 'info';
            
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  {
                    backgroundColor: isLocked ? Colors.gray : 'white',
                    borderColor: getLevelColor({ ...level, type: levelType }),
                  }
                ]}
                onPress={() => handleLevelPress({ ...level, type: levelType })}
                disabled={isLocked}
              >
                {/* Level Header */}
                <View style={styles.levelHeader}>
                  <View style={[styles.levelNumber, { backgroundColor: getLevelColor({ ...level, type: levelType }) }]}>
                    <ThemedText style={styles.levelNumberText}>{index + 1}</ThemedText>
                  </View>
                  <View style={styles.levelStatus}>
                    <Ionicons 
                      name={getLevelIcon({ ...level, type: levelType })} 
                      size={24} 
                      color={getLevelColor({ ...level, type: levelType })} 
                    />
                  </View>
                </View>

                {/* Level Content */}
                <View style={styles.levelContent}>
                  <ThemedText style={[
                    styles.levelTitle,
                    { color: isLocked ? Colors.darkGray : Colors.text }
                  ]}>
                    {mockUnit.levels[index]?.title || `Level ${level.id}`}
                  </ThemedText>
                  <ThemedText style={[
                    styles.levelDescription,
                    { color: isLocked ? Colors.darkGray : Colors.darkGray }
                  ]}>
                    {mockUnit.levels[index]?.description || 'Complete previous levels to unlock this content.'}
                  </ThemedText>
                  
                  {/* Level Type Badge */}
                  {!isLocked && (
                    <View style={[styles.typeBadge, { backgroundColor: getLevelColor({ ...level, type: levelType }) }]}>
                      <ThemedText style={styles.typeBadgeText}>
                        {levelType.charAt(0).toUpperCase() + levelType.slice(1)}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  unitTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  unitDescription: {
    fontSize: 16,
    color: Colors.darkGray,
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  levelsContainer: {
    padding: 20,
    gap: 16,
  },
  levelCard: {
    borderRadius: 16,
    padding: 20,
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
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelStatus: {
    alignItems: 'center',
  },
  levelContent: {
    gap: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
}); 