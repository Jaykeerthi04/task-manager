import { MD3LightTheme } from 'react-native-paper';
import { Priority } from '../types/task';

export const theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6C63FF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E4E2FF',
    onPrimaryContainer: '#1B1464',
    secondaryContainer: '#E4E2FF',
    onSecondaryContainer: '#1B1464',
    background: '#F6F6FB',
    surface: '#FFFFFF',
  },
};

export const priorityColors: Record<Priority, { bg: string; fg: string }> = {
  low: { bg: '#E3F6E8', fg: '#1E7B3A' },
  medium: { bg: '#FFF1D6', fg: '#A5660A' },
  high: { bg: '#FDE3E3', fg: '#B3261E' },
};
