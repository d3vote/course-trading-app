import React from 'react';
import Svg, { Path, Polygon } from 'react-native-svg';

interface GemIconProps {
  size?: number;
  color?: string;
}

export function GemIcon({ size = 24, color = '#1CB0F6' }: GemIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Top facet */}
      <Polygon points="12,2 4,9 20,9" fill={color} opacity={0.9} />
      {/* Left facet */}
      <Polygon points="4,9 12,22 12,9" fill={color} opacity={0.7} />
      {/* Right facet */}
      <Polygon points="20,9 12,22 12,9" fill={color} />
      {/* Top-left highlight */}
      <Path d="M12,2 L4,9 L8,9 Z" fill="white" opacity={0.3} />
      {/* Shine */}
      <Path d="M9,6 L11,4 L13,6" stroke="white" strokeWidth="0.5" fill="none" opacity={0.6} />
    </Svg>
  );
}
