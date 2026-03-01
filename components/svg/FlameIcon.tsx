import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FlameIconProps {
  size?: number;
  active?: boolean;
}

export function FlameIcon({ size = 24, active = true }: FlameIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Outer flame */}
      <Path
        d="M12 2C12 2 4 10 4 15C4 19.4 7.6 23 12 23C16.4 23 20 19.4 20 15C20 10 12 2 12 2Z"
        fill={active ? '#FF9600' : '#AFAFAF'}
      />
      {/* Inner flame */}
      <Path
        d="M12 8C12 8 8 13 8 16C8 18.2 9.8 20 12 20C14.2 20 16 18.2 16 16C16 13 12 8 12 8Z"
        fill={active ? '#FFC800' : '#E5E5E5'}
      />
      {/* Core */}
      <Path
        d="M12 13C12 13 10 15.5 10 17C10 18.1 10.9 19 12 19C13.1 19 14 18.1 14 17C14 15.5 12 13 12 13Z"
        fill={active ? '#FFE066' : '#F7F7F7'}
      />
    </Svg>
  );
}
