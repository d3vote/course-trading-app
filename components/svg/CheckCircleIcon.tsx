import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface CheckCircleIconProps {
  size?: number;
  color?: string;
}

export function CheckCircleIcon({ size = 24, color = '#58CC02' }: CheckCircleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill={color} />
      <Path
        d="M7 12.5L10.5 16L17 8.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
