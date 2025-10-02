import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import useTodo from "@/hooks/useTodo";
import Header from "@/layout/Header";
import TodoCreator from "@/layout/TodoCreator";
import TodoList from "@/layout/TodoList";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";

export default function TasksScreen() {
  const { theme } = useTheme();
  const {
    todos,
    completedTodos,
    onAddTodo,
    onDeleteTodo,
    onCheckTodo,
    onUpdateTodo,
    isLoading,
  } = useTodo();

  if (isLoading) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
      <StatusBar 
        barStyle={theme.mode === 'dark' ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.PRIMARY_BACKGROUND}
      />
      
      <View style={styles.headerWrapper}>
        <Header
          totalTodos={todos.length}
          completedTodos={completedTodos.length}
        />
        <View style={styles.themeToggleContainer}>
          <ThemeToggle />
        </View>
      </View>
      
      <TodoCreator onAddTodo={onAddTodo} />
      <TodoList
        todos={todos}
        onCheckTodo={onCheckTodo}
        onDeleteTodo={onDeleteTodo}
        onUpdateTodo={onUpdateTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    position: 'relative',
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
});
