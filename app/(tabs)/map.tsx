import TodoMapView from '@/components/TodoMapView';
import { useTheme } from '@/contexts/ThemeContext';
import useTodo from '@/hooks/useTodo';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const { theme } = useTheme();
  const { todos } = useTodo();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
      <StatusBar 
        barStyle={theme.mode === 'dark' ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.PRIMARY_BACKGROUND}
      />
      <TodoMapView
        todos={todos}
        visible={true}
        onClose={() => {}}
        showHeader={false}
        useModal={false} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
