import { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  captionBold: {
    fontSize: 13,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  metric: {
    fontSize: 36,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 42,
  },
} as const;
