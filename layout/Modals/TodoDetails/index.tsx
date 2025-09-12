import StyledText from "@/components/StyledText";
import { COLORS } from "@/constants/ui";
import { Todo } from "@/types/todo";
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type TodoDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
};

const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({ isOpen, onClose, todo }) => {
  const getStatus = () => {
    if (todo.isCompleted) return "Completed ✅";
    if (!todo.isCompleted && todo.dueDate && new Date(todo.dueDate) > new Date()) return "In Progress ⏳";
    return "Cancelled ❌";
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <StyledText style={styles.title}>{todo.title}</StyledText>
            {todo.description && <StyledText style={styles.description}>{todo.description}</StyledText>}
            {todo.dueDate && <StyledText style={styles.meta}>📅 {new Date(todo.dueDate).toLocaleString()}</StyledText>}
            {todo.location && <StyledText style={styles.meta}>📍 {todo.location}</StyledText>}
            <StyledText style={styles.meta}>
              Status: {getStatus()}
            </StyledText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <StyledText style={styles.closeText}>Close</StyledText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    borderRadius: 12,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: COLORS.PRIMARY_TEXT },
  description: { fontSize: 14, marginBottom: 10, color: COLORS.PRIMARY_TEXT },
  meta: { fontSize: 12, color: COLORS.TEXT_SECONDARY, marginBottom: 5 },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.PRIMARY_ACTIVE_BUTTON,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: COLORS.PRIMARY_TEXT,
    fontWeight: "600",
  },
});

export default TodoDetailsModal;
