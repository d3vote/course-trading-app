import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface CrownIconProps {
  size?: number;
  color?: string;
}

export function CrownIcon({ size = 24, color = '#FFC800' }: CrownIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 18L2 7L7 11L12 4L17 11L22 7L21 18H3Z"
        fill={color}
      />
      <Path
        d="M3 18L2 7L7 11L12 4L17 11L22 7L21 18H3Z"
        fill="white"
        opacity={0.15}
      />
      <Path d="M3 18H21V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V18Z" fill={color} />
      <Circle cx="7" cy="10" r="1.5" fill="white" opacity={0.5} />
      <Circle cx="12" cy="6" r="1.5" fill="white" opacity={0.5} />
      <Circle cx="17" cy="10" r="1.5" fill="white" opacity={0.5} />
    </Svg>
  );
}
