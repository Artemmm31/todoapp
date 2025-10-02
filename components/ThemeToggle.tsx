import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface ThemeToggleProps {
  size?: number;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 24 }) => {
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.SECONDARY_BACKGROUND,
          borderColor: theme.colors.PRIMARY_BORDER,
        },
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Animated.View style={styles.iconContainer}>
        {themeMode === 'light' ? (
          <Sun size={size} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
        ) : (
          <Moon size={size} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle;
