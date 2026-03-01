import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ShieldIconProps {
  size?: number;
  color?: string;
}

export function ShieldIcon({ size = 24, color = '#CE82FF' }: ShieldIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Shield body */}
      <Path
        d="M12 2L3 6V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V6L12 2Z"
        fill={color}
      />
      {/* Highlight */}
      <Path
        d="M12 2L3 6V11C3 16.5 6.8 21.7 12 23V2Z"
        fill="white"
        opacity={0.1}
      />
      {/* Checkmark */}
      <Path
        d="M8 12L11 15L16 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
