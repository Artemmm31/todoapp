import StyledButton from "@/components/StyledButton";
import StyledCheckbox from "@/components/StyledCheckBox";
import StyledText from "@/components/StyledText";
import { COLORS } from "@/constants/ui";
import { Todo } from "@/types/todo";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, Vibration, View } from "react-native";
import DeleteTodoModal from "../Modals/DeleteTodoModal";
import TodoDetailsModal from "../Modals/TodoDetails";

type TodoItemProps = Todo & {
  onCheck: (id: Todo["id"]) => void;
  onDelete: (id: Todo["id"]) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  description,
  dueDate,
  location,
  isCompleted,
  onCheck,
  onDelete,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onPressCheck = () => onCheck(id);
  const onConfirmDelete = () => {
    onDelete(id);
    Vibration.vibrate(50);
    setIsDeleteModalOpen(false);
  };

  const getStatusEmoji = () => {
    if (isCompleted) return "✅"; 
    if (!isCompleted && dueDate && new Date(dueDate) > new Date()) return "⏳"; 
    return "❌"; 
  };

  return (
    <>
      <View style={styles.container}>
        <StyledCheckbox checked={isCompleted} onCheck={onPressCheck} />
        <TouchableOpacity style={styles.textContainer} onPress={() => setIsDetailsModalOpen(true)}>
          <StyledText style={[styles.title, isCompleted && styles.completed]} numberOfLines={1}>
            {title}
          </StyledText>
          {dueDate && (
            <StyledText style={styles.date}>
              📅 {new Date(dueDate).toLocaleDateString()} {new Date(dueDate).toLocaleTimeString()}
            </StyledText>
          )}
        </TouchableOpacity>

        <View style={styles.controlsContainer}>
          <StyledText style={styles.statusEmoji}>{getStatusEmoji()}</StyledText>
          <StyledButton icon="trash" size="small" variant="delete" onPress={() => setIsDeleteModalOpen(true)} />
        </View>
      </View>

      <TodoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        todo={{ id, title, description, dueDate, location, isCompleted }}
      />
      <DeleteTodoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={onConfirmDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    color: COLORS.PRIMARY_TEXT,
  },
  completed: {
    textDecorationLine: "line-through",
    color: COLORS.TEXT_SECONDARY,
  },
  date: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusEmoji: {
    fontSize: 18,
    marginRight: 5,
  },
});

export default TodoItem;
