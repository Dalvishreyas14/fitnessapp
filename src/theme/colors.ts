export const colors = {
  background: '#0A0A0A',
  surface: '#141414',
  surfaceLight: '#1E1E1E',
  surfaceBorder: '#2A2A2A',

  primary: '#CCFF00',
  primaryDark: '#A3CC00',
  primaryMuted: 'rgba(204, 255, 0, 0.15)',

  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',

  success: '#00E676',
  warning: '#FFB300',
  error: '#FF5252',
  info: '#448AFF',

  blue: '#448AFF',
  purple: '#BB86FC',
  orange: '#FF9100',
  red: '#FF5252',

  overlay: 'rgba(0, 0, 0, 0.6)',
  gradient: {
    primary: ['#CCFF00', '#88CC00'] as const,
    dark: ['#141414', '#0A0A0A'] as const,
    card: ['#1E1E1E', '#141414'] as const,
  },
} as const;
