import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { FlameIcon } from '@/components/svg/FlameIcon';
import { GemIcon } from '@/components/svg/GemIcon';
import { CrownIcon } from '@/components/svg/CrownIcon';

interface StatsBarProps {
  onGemsPress?: () => void;
}

export function StatsBar({ onGemsPress }: StatsBarProps) {
  const insets = useSafeAreaInsets();
  const { progress } = useAppSelector((state) => state.user);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <FlameIcon size={22} active={progress.currentStreak > 0} />
          <Text style={styles.statText}>{progress.currentStreak}</Text>
        </View>

        <Pressable style={styles.statItem} onPress={onGemsPress}>
          <GemIcon size={22} />
          <Text style={[styles.statText, { color: Colors.macaw }]}>{progress.gems}</Text>
        </Pressable>

        <View style={styles.statItem}>
          <CrownIcon size={22} />
          <Text style={[styles.statText, { color: Colors.bee }]}>{progress.currentLevel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    ...Typography.captionBold,
    color: Colors.fox,
  },
});
