import React from 'react';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

interface TradeBullProps {
  size?: number;
  mood?: 'happy' | 'excited' | 'thinking' | 'sad';
}

export function TradeBull({ size = 120, mood = 'happy' }: TradeBullProps) {
  const scale = size / 120;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <G transform={`scale(${1})`}>
        {/* Body */}
        <Ellipse cx="60" cy="72" rx="32" ry="28" fill="#58CC02" />
        <Ellipse cx="60" cy="72" rx="28" ry="24" fill="#6EE018" />

        {/* Head */}
        <Circle cx="60" cy="45" r="26" fill="#58CC02" />
        <Circle cx="60" cy="45" r="22" fill="#6EE018" />

        {/* Horns */}
        <Path d="M38 30 C32 18, 24 16, 22 22" stroke="#FFC800" strokeWidth="4" strokeLinecap="round" fill="none" />
        <Path d="M82 30 C88 18, 96 16, 98 22" stroke="#FFC800" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Horn tips */}
        <Circle cx="22" cy="22" r="3" fill="#FFD93D" />
        <Circle cx="98" cy="22" r="3" fill="#FFD93D" />

        {/* Ears */}
        <Ellipse cx="36" cy="34" rx="6" ry="4" fill="#58CC02" transform="rotate(-20 36 34)" />
        <Ellipse cx="84" cy="34" rx="6" ry="4" fill="#58CC02" transform="rotate(20 84 34)" />

        {/* Snout */}
        <Ellipse cx="60" cy="54" rx="14" ry="10" fill="#DDF4D2" />

        {/* Nostrils */}
        <Ellipse cx="54" cy="54" rx="2.5" ry="2" fill="#58A700" />
        <Ellipse cx="66" cy="54" rx="2.5" ry="2" fill="#58A700" />

        {/* Eyes */}
        <Circle cx="48" cy="40" r="5" fill="white" />
        <Circle cx="72" cy="40" r="5" fill="white" />

        {/* Pupils - mood based */}
        {mood === 'happy' && (
          <>
            <Circle cx="49" cy="39" r="3" fill="#3C3C3C" />
            <Circle cx="73" cy="39" r="3" fill="#3C3C3C" />
            <Circle cx="50" cy="38" r="1" fill="white" />
            <Circle cx="74" cy="38" r="1" fill="white" />
          </>
        )}
        {mood === 'excited' && (
          <>
            <Circle cx="48" cy="39" r="3.5" fill="#3C3C3C" />
            <Circle cx="72" cy="39" r="3.5" fill="#3C3C3C" />
            <Circle cx="49.5" cy="37.5" r="1.5" fill="white" />
            <Circle cx="73.5" cy="37.5" r="1.5" fill="white" />
          </>
        )}
        {mood === 'thinking' && (
          <>
            <Circle cx="50" cy="40" r="3" fill="#3C3C3C" />
            <Circle cx="74" cy="40" r="3" fill="#3C3C3C" />
            <Circle cx="51" cy="39" r="1" fill="white" />
            <Circle cx="75" cy="39" r="1" fill="white" />
          </>
        )}
        {mood === 'sad' && (
          <>
            <Circle cx="48" cy="41" r="3" fill="#3C3C3C" />
            <Circle cx="72" cy="41" r="3" fill="#3C3C3C" />
          </>
        )}

        {/* Mouth - mood based */}
        {(mood === 'happy' || mood === 'excited') && (
          <Path d="M52 58 Q60 64, 68 58" stroke="#58A700" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {mood === 'thinking' && (
          <Path d="M54 60 L66 60" stroke="#58A700" strokeWidth="2" strokeLinecap="round" />
        )}
        {mood === 'sad' && (
          <Path d="M52 62 Q60 56, 68 62" stroke="#58A700" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Eyebrows for excited */}
        {mood === 'excited' && (
          <>
            <Path d="M43 33 L53 31" stroke="#3C3C3C" strokeWidth="2" strokeLinecap="round" />
            <Path d="M67 31 L77 33" stroke="#3C3C3C" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Arms */}
        <Path d="M32 68 C24 64, 20 70, 24 78" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" fill="none" />
        <Path d="M88 68 C96 64, 100 70, 96 78" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Hooves */}
        <Circle cx="24" cy="78" r="4" fill="#CE9E00" />
        <Circle cx="96" cy="78" r="4" fill="#CE9E00" />

        {/* Legs */}
        <Path d="M48 94 L46 108" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" />
        <Path d="M72 94 L74 108" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" />

        {/* Feet/Hooves */}
        <Ellipse cx="46" cy="110" rx="6" ry="3" fill="#CE9E00" />
        <Ellipse cx="74" cy="110" rx="6" ry="3" fill="#CE9E00" />

        {/* Belly */}
        <Ellipse cx="60" cy="78" rx="18" ry="14" fill="#DDF4D2" opacity={0.5} />
      </G>
    </Svg>
  );
}
