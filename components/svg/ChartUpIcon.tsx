import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface ChartUpIconProps {
  size?: number;
  color?: string;
}

export function ChartUpIcon({ size = 24, color = '#58CC02' }: ChartUpIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Chart line going up */}
      <Path
        d="M3 18L8 13L12 16L21 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow head */}
      <Path
        d="M16 6H21V11"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Bottom line */}
      <Line x1="3" y1="22" x2="21" y2="22" stroke={color} strokeWidth="1.5" opacity={0.3} />
    </Svg>
  );
}
