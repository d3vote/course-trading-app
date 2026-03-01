import { TextStyle, ViewStyle } from 'react-native';

export const Colors = {
  // Duolingo signature palette
  feather: '#58CC02',
  featherDark: '#58A700',
  featherLight: '#DDF4D2',

  macaw: '#1CB0F6',
  macawDark: '#1899D6',
  macawLight: '#DDF4FF',

  cardinal: '#FF4B4B',
  cardinalDark: '#EA2B2B',
  cardinalLight: '#FFDFE0',

  bee: '#FFC800',
  beeDark: '#CE9E00',
  beeLight: '#FFF5CC',

  fox: '#FF9600',
  foxDark: '#CD7900',
  foxLight: '#FFF3D6',

  plum: '#CE82FF',
  plumDark: '#A855F7',
  plumLight: '#F3E8FF',

  // Neutrals
  snow: '#FFFFFF',
  polar: '#F7F7F7',
  swan: '#E5E5E5',
  hare: '#AFAFAF',
  wolf: '#777777',
  eel: '#4B4B4B',
  ink: '#3C3C3C',

  // Semantic
  background: '#FFFFFF',
  surface: '#F7F7F7',
  text: '#3C3C3C',
  textSecondary: '#777777',
  border: '#E5E5E5',
  success: '#58CC02',
  error: '#FF4B4B',
  warning: '#FF9600',

  // Course colors
  course1: '#58CC02',
  course1Dark: '#58A700',
  course2: '#1CB0F6',
  course2Dark: '#1899D6',
  course3: '#FF9600',
  course3Dark: '#CD7900',
  course4: '#CE82FF',
  course4Dark: '#A855F7',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export const Typography: Record<string, TextStyle> = {
  h1: { fontSize: 28, fontWeight: '800', lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodyBold: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 18 },
  captionBold: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '700', lineHeight: 20, textTransform: 'uppercase' },
};

export function buttonShadow(color: string): ViewStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };
}

export const Shadow: Record<string, ViewStyle> = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
};
