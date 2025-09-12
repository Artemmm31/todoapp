import { COLORS } from "@/constants/ui";
import useTodo from "@/hooks/useTodo";
import Header from "@/layout/Header";
import TodoCreator from "@/layout/TodoCreator";
import TodoList from "@/layout/TodoList";
import { StatusBar, StyleSheet, View } from "react-native";

export default function Index() {
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        totalTodos={todos.length}
        completedTodos={completedTodos.length}
      />
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
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
  },
});