import TaskHistory from '@/components/TaskHistory';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StatusBar } from 'react-native';

export default function HistoryScreen() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={theme.mode === 'dark' ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.PRIMARY_BACKGROUND}
      />
      <TaskHistory />
    </>
  );
}
