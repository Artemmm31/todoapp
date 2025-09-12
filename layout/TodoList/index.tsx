import StyledButton from "@/components/StyledButton";
import { Todo } from "@/types/todo";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import TodoItem from "../TodoItem";

type TodoListProps = {
  todos: Todo[];
  onCheckTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, updated: Partial<Todo>) => void;
};

type SortOption = "date" | "status";

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onCheckTodo,
  onDeleteTodo,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>("date");

  const sortedTodos = useMemo(() => {
    const copy = [...todos];
    if (sortOption === "date") {
      copy.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortOption === "status") {
      const statusOrder: Record<string, number> = {
        "completed": 0,
        "in progress": 1,
        "cancelled": 2,
      };
      copy.sort((a, b) => {
        const statusA = a.isCompleted ? "completed" : "in progress";
        const statusB = b.isCompleted ? "completed" : "in progress";
        return statusOrder[statusA] - statusOrder[statusB];
      });
    }
    return copy;
  }, [todos, sortOption]);

  return (
    <View style={styles.container}>
      <View style={styles.sortButtons}>
        <StyledButton
          label="Sort by Date"
          size="small"
          variant={sortOption === "date" ? "primary" : "secondary"}
          onPress={() => setSortOption("date")}
        />
        <StyledButton
          label="Sort by Status"
          size="small"
          variant={sortOption === "status" ? "primary" : "secondary"}
          onPress={() => setSortOption("status")}
        />
      </View>



      <FlatList
        data={sortedTodos}
        keyExtractor={(todo) => todo.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            {...item}
            onCheck={(id: number) => onCheckTodo(id)}
            onDelete={(id: number) => onDeleteTodo(id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "#005bf0",
    borderColor: "#005bf0",
    shadowColor: "#005bf0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  activeButtonText: {
    color: "#fff",
  },
});


export default TodoList;
