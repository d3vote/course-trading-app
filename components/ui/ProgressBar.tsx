import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = Colors.feather,
  backgroundColor = Colors.swan,
  height = 8,
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.container, { height, backgroundColor, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
