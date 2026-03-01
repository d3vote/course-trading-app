import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface TrophyIconProps {
  size?: number;
  color?: string;
}

export function TrophyIcon({ size = 24, color = '#FFC800' }: TrophyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Cup body */}
      <Path
        d="M6 3H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V3Z"
        fill={color}
      />
      {/* Left handle */}
      <Path
        d="M6 5H4C3 5 2 6 2 7V8C2 9.7 3.3 11 5 11H6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Right handle */}
      <Path
        d="M18 5H20C21 5 22 6 22 7V8C22 9.7 20.7 11 19 11H18"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Shine */}
      <Path d="M9 5L10 3H14L15 5" fill="white" opacity={0.25} />
      {/* Stem */}
      <Rect x="10" y="16" width="4" height="3" fill={color} />
      {/* Base */}
      <Path d="M7 19H17V21C17 21.5 16.5 22 16 22H8C7.5 22 7 21.5 7 21V19Z" fill={color} />
      {/* Star on cup */}
      <Circle cx="12" cy="9" r="2.5" fill="white" opacity={0.35} />
    </Svg>
  );
}
