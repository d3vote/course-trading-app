import React, { useRef } from 'react';
import { StyleSheet, Text, Pressable, Animated, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radius, Typography, buttonShadow } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface DuoButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

const VARIANT_COLORS: Record<ButtonVariant, { bg: string; shadow: string; text: string }> = {
  primary: { bg: Colors.feather, shadow: Colors.featherDark, text: Colors.snow },
  secondary: { bg: Colors.macaw, shadow: Colors.macawDark, text: Colors.snow },
  danger: { bg: Colors.cardinal, shadow: Colors.cardinalDark, text: Colors.snow },
  outline: { bg: 'transparent', shadow: 'transparent', text: Colors.macaw },
  ghost: { bg: 'transparent', shadow: 'transparent', text: Colors.wolf },
};

const SIZE_STYLES: Record<ButtonSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: 16, paddingV: 10, fontSize: 14 },
  md: { paddingH: 24, paddingV: 14, fontSize: 16 },
  lg: { paddingH: 32, paddingV: 18, fontSize: 18 },
};

export function DuoButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  haptic = true,
}: DuoButtonProps) {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const colors = VARIANT_COLORS[variant];
  const sizeStyle = SIZE_STYLES[size];
  const hasShadow = variant !== 'outline' && variant !== 'ghost';

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const translateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hasShadow ? 4 : 0],
  });

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[fullWidth && styles.fullWidth]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: disabled ? Colors.swan : colors.bg,
            paddingHorizontal: sizeStyle.paddingH,
            paddingVertical: sizeStyle.paddingV,
            transform: [{ translateY }],
          },
          hasShadow && !disabled && buttonShadow(disabled ? Colors.hare : colors.shadow),
          variant === 'outline' && {
            borderWidth: 2,
            borderColor: disabled ? Colors.swan : Colors.macaw,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyle.fontSize,
              color: disabled ? Colors.hare : colors.text,
            },
            variant === 'outline' && { color: disabled ? Colors.hare : Colors.macaw },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.button,
  },
  fullWidth: {
    width: '100%',
  },
});
