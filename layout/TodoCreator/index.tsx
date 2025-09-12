import { COLORS } from "@/constants/ui";
import { Todo } from "@/types/todo";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TodoCreatorModal from "../Modals/TodoCreatorModal";

type TodoCreatorProps = {
  onAddTodo: (todo: Omit<Todo, "id" | "isCompleted">) => void;
};

const TodoCreator: React.FC<TodoCreatorProps> = ({ onAddTodo }) => {
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
        style={styles.addButton}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Add New Task</Text>
          <Text style={styles.buttonSubtitle}>
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
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: COLORS.PRIMARY_ACTIVE_BUTTON,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
  },
  iconContainer: {
    backgroundColor: COLORS.PRIMARY_ACTIVE_BUTTON,
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
    color: COLORS.PRIMARY_TEXT,
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "500",
  },
});

export default TodoCreator;