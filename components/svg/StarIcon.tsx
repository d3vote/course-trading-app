import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface StarIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export function StarIcon({ size = 24, color = '#FFC800', filled = true }: StarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.5L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
      {filled && (
        <Path
          d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.5"
          fill={color}
          opacity={0.8}
        />
      )}
    </Svg>
  );
}
