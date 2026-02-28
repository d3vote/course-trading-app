import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Level, setCurrentLevel, completeLevel, replayLevel } from '@/store/slices/levelsSlice';
import { addXP, addGems } from '@/store/slices/userSlice';

interface RoadmapProps {
  courseId: string;
  onLevelPress: (level: Level) => void;
  courseColor?: string;
  courseShadowColor?: string;
}

export function Roadmap({ courseId, onLevelPress, courseColor = Colors.primary, courseShadowColor = Colors.shadwPrimary }: RoadmapProps) {
  const dispatch = useAppDispatch();
  const levels = useAppSelector((state: any) => 
    state.levels.levels.filter((level: Level) => level.courseId === courseId)
  );
  
  const [animations] = useState(() => 
    levels.reduce((acc: Record<string, Animated.Value>, level: Level) => {
      acc[level.id] = new Animated.Value(0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const getLevelStyle = (level: Level, index: number) => {
    // First button (index 0) uses course colors
    if (index === 0) {
      if (level.state === 'complete') {
        return { backgroundColor: Colors.success };
      }
      if (level.state === 'incomplete') {
        return { backgroundColor: courseColor };
      }
      if (level.state === 'closed') {
        return { backgroundColor: Colors.gray };
      }
      return { backgroundColor: courseColor };
    }
    // Other buttons use gray colors
    return { backgroundColor: Colors.buttonGray };
  };

  const getLevelIcon = (level: Level) => {
    if (level.state === 'complete') return 'checkmark-circle';
    if (level.state === 'incomplete') return 'star';
    if (level.state === 'closed') return 'lock-closed';
    return 'ellipse';
  };

  const handlePressIn = (levelId: string) => {
    Animated.timing(animations[levelId], {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (levelId: string) => {
    Animated.timing(animations[levelId], {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const getButtonTransform = (levelId: string) => {
    const translateY = animations[levelId].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    });
    return { transform: [{ translateY }] };
  };

  const getButtonShadow = (levelId: string, index: number) => {
    const shadowOpacity = animations[levelId].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    const shadowOffsetY = animations[levelId].interpolate({
      inputRange: [0, 1],
      outputRange: [8, 0],
    });
    
    // Use course shadow color for first button vs gray for others
    const shadowColor = index === 0 ? courseShadowColor : Colors.buttonGrayPressed;
    
    return {
      shadowColor: shadowColor,
      shadowOffset: {
        width: 0,
        height: shadowOffsetY,
      },
      shadowOpacity: shadowOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      shadowRadius: 0,
      elevation: 0,
    };
  };

  const getLevelPosition = (index: number) => {
    // Wave pattern: alternate left and right by 40px from center
    const offset = index % 2 === 0 ? 30 : 0; // -40px left, +40px right
    return {
      transform: [{ translateX: offset }]
    };
  };

  return (
    <View style={styles.container}>
      {/* Learning Path */}
      <View style={styles.levelsContainer}>
        {levels.map((level: Level, index: number) => (
          <View key={level.id} style={[
            styles.levelRow,
            getLevelPosition(index)
          ]}>
            {/* Level Button Container */}
            <View style={styles.levelContainer}>
              {/* Progress Circle (only for first level) */}
              {index === 0 && (
                <View style={styles.progressCircleContainer}>
                  <View style={styles.progressCircle}>
                    <View style={styles.progressFill} />
                  </View>
                </View>
              )}
              
              {/* Button Layer */}
              <Animated.View style={[getButtonShadow(level.id, index)]}>
                <TouchableOpacity
                  style={[
                    styles.levelButton,
                    getLevelStyle(level, index),
                    getButtonTransform(level.id),
                  ]}
                  onPress={() => onLevelPress(level)}
                  onPressIn={() => handlePressIn(level.id)}
                  onPressOut={() => handlePressOut(level.id)}
                  disabled={level.state === 'closed'}
                  activeOpacity={1}
                >
                  <Ionicons 
                    name={getLevelIcon(level) as any} 
                    size={32} 
                    color="white" 
                    style={styles.levelIcon}
                  />
                </TouchableOpacity>
              </Animated.View>
              
              {/* START Button (only for first level) */}
              {index === 0 && (
                <TouchableOpacity style={styles.startButton}>
                  <Ionicons name="play" size={16} color={courseColor} style={styles.startButtonIcon} />
                  <ThemedText style={[styles.startButtonText, { color: courseColor }]}>START</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  levelsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  levelRow: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30, 
    width: '100%',
  },
  levelContainer: {
    width: 70,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressCircleContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    top: -13,
    pointerEvents: 'none',
    transform: [{ rotateX: '20deg' }],
  },
  progressCircle: {
    width: 105,
    height: 105,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 105,
    height: 105,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: Colors.progressYellow,
    borderRightColor: Colors.progressYellow,
    transform: [{ rotate: '45deg' }],
  },
  levelButton: {
    width: 70,
    height: 60,
    borderRadius: 31.75,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  startButton: {
    position: 'absolute',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.borderGray,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    top: -45,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonIcon: {
    marginRight: 6,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 0,
  },
  levelIcon: {
    paddingTop: 2,
    transform: [{ rotateX: '20deg' }],
  },
}); 