import DatePicker from "@/components/DatePicker";
import StyledButton from "@/components/StyledButton";
import StyledTextInput from "@/components/StyledTextInput";
import { COLORS } from "@/constants/ui";
import { Todo } from "@/types/todo";
import { BlurView } from "expo-blur";
import { Calendar, FileText, MapPin, Type, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type TodoCreatorModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddTodo: (todo: Omit<Todo, "id" | "isCompleted">) => void;
};

const TodoCreatorModal: React.FC<TodoCreatorModalProps> = ({
  visible,
  onClose,
  onAddTodo,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [inputError, setInputError] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  const onPressAdd = () => {
    if (!title.trim()) {
      setInputError(true);
      return;
    }

    Keyboard.dismiss();

    onAddTodo({
      title,
      description,
      location,
      dueDate: dueDate ? dueDate.toISOString() : "",
    });

    setTitle("");
    setDescription("");
    setLocation("");
    setDueDate(null);
    setInputError(false);
    onClose();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  useEffect(() => {
    if (inputError && title) setInputError(false);
  }, [title]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <BlurView intensity={20} style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [400, 0],
                        }),
                      },
                      {
                        scale: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                    opacity: slideAnim,
                  },
                ]}
              >
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Create New Task</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.content}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Type size={18} color="#4F46E5" />
                      <Text style={styles.fieldLabel}>Title</Text>
                    </View>
                    <StyledTextInput
                      placeholder="Enter task title..."
                      value={title}
                      onChangeText={setTitle}
                      isError={inputError}
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <FileText size={18} color="#059669" />
                      <Text style={styles.fieldLabel}>Description</Text>
                    </View>
                    <StyledTextInput
                      placeholder="Add description..."
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={3}
                      style={{ width: "100%" }}
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <MapPin size={18} color="#DC2626" />
                      <Text style={styles.fieldLabel}>Location</Text>
                    </View>
                    <StyledTextInput
                      placeholder="Add location..."
                      value={location}
                      onChangeText={setLocation}
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Calendar size={18} color="#7C3AED" />
                      <Text style={styles.fieldLabel}>Due Date</Text>
                    </View>
                    <DatePicker date={dueDate} onChange={setDueDate}>
                      {(openPicker) => (
                        <TouchableOpacity onPress={openPicker} style={styles.datePickerButton}>
                          <Text style={styles.datePickerText}>
                            {dueDate ? dueDate.toLocaleDateString() : "Select due date"}
                          </Text>
                          <Calendar size={16} color="#666" />
                        </TouchableOpacity>
                      )}
                    </DatePicker>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <StyledButton
                    label="Create Task"
                    onPress={onPressAdd}
                    disabled={inputError}
                    size="large"
                  />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "70%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.PRIMARY_BORDER,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY_BORDER,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.PRIMARY_TEXT,
  },

  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },

  fieldContainer: {
    marginBottom: 24,
  },

  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.PRIMARY_TEXT,
  },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },

  datePickerText: {
    fontSize: 16,
    color: COLORS.PRIMARY_TEXT,
  },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.PRIMARY_BORDER,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
  },
});


export default TodoCreatorModal;
