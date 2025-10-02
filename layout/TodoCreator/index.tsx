import { useTheme } from "@/contexts/ThemeContext";
import { Todo } from "@/types/todo";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TodoCreatorModal from "../Modals/TodoCreatorModal";

type TodoCreatorProps = {
  onAddTodo: (todo: Omit<Todo, "id" | "isCompleted">) => void;
};

const TodoCreator: React.FC<TodoCreatorProps> = ({ onAddTodo }) => {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAddTodo = (todo: Omit<Todo, "id" | "isCompleted">) => {
    onAddTodo(todo);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleOpenModal}
        style={[
          styles.addButton,
          {
            backgroundColor: theme.colors.SECONDARY_BACKGROUND,
            borderColor: theme.colors.PRIMARY_BORDER,
            shadowColor: theme.colors.SHADOW_COLOR,
          }
        ]}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.PRIMARY_ACTIVE_BUTTON }]}>
          <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.buttonTitle, { color: theme.colors.PRIMARY_TEXT }]}>Add New Task</Text>
          <Text style={[styles.buttonSubtitle, { color: theme.colors.TEXT_SECONDARY }]}>
            Tap to create a new task with details
          </Text>
        </View>
      </TouchableOpacity>

      <TodoCreatorModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAddTodo={handleAddTodo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
  },
  iconContainer: {
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default TodoCreator;