import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface LockIconProps {
  size?: number;
  color?: string;
}

export function LockIcon({ size = 24, color = '#AFAFAF' }: LockIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Lock body */}
      <Rect x="5" y="11" width="14" height="11" rx="2" fill={color} />
      {/* Shackle */}
      <Path
        d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Keyhole */}
      <Path
        d="M12 15C11.2 15 10.5 15.7 10.5 16.5C10.5 17 10.8 17.4 11.2 17.7L10.8 20H13.2L12.8 17.7C13.2 17.4 13.5 17 13.5 16.5C13.5 15.7 12.8 15 12 15Z"
        fill="white"
        opacity={0.6}
      />
    </Svg>
  );
}
