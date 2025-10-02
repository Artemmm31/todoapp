import AttachmentPicker from "@/components/AttachmentPicker";
import DatePicker from "@/components/DatePicker";
import LocationPicker from "@/components/LocationPicker";
import StyledButton from "@/components/StyledButton";
import StyledTextInput from "@/components/StyledTextInput";
import { useTheme } from "@/contexts/ThemeContext";
import { Todo, TodoAttachment, TodoLocation } from "@/types/todo";
import { BlurView } from "expo-blur";
import { Calendar, FileText, MapPin, Type, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
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
  const [location, setLocation] = useState<TodoLocation>({ address: '' });
  const [attachments, setAttachments] = useState<TodoAttachment[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [inputError, setInputError] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const { theme } = useTheme();

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
      attachments,
      dueDate: dueDate ? dueDate.toISOString() : "",
    });

    setTitle("");
    setDescription("");
    setLocation({ address: '' });
    setAttachments([]);
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
          <BlurView intensity={20} style={[styles.overlay, { backgroundColor: theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)' }]}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    backgroundColor: theme.colors.SECONDARY_BACKGROUND,
                    borderTopColor: theme.colors.PRIMARY_BORDER,
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
                <View style={[styles.header, { borderBottomColor: theme.colors.PRIMARY_BORDER }]}>
                  <Text style={[styles.headerTitle, { color: theme.colors.PRIMARY_TEXT }]}>Create New Task</Text>
                  <TouchableOpacity onPress={handleClose} style={[styles.closeButton, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
                    <X size={24} color={theme.colors.TEXT_SECONDARY} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Type size={18} color="#4F46E5" />
                      <Text style={[styles.fieldLabel, { color: theme.colors.PRIMARY_TEXT }]}>Title</Text>
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
                      <Text style={[styles.fieldLabel, { color: theme.colors.PRIMARY_TEXT }]}>Description</Text>
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
                      <Text style={[styles.fieldLabel, { color: theme.colors.PRIMARY_TEXT }]}>Location</Text>
                    </View>
                    <LocationPicker
                      location={location}
                      onLocationChange={setLocation}
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Calendar size={18} color="#7C3AED" />
                      <Text style={[styles.fieldLabel, { color: theme.colors.PRIMARY_TEXT }]}>Due Date</Text>
                    </View>
                    <DatePicker date={dueDate} onChange={setDueDate}>
                      {(openPicker) => (
                        <TouchableOpacity onPress={openPicker} style={[styles.datePickerButton, { backgroundColor: theme.colors.PRIMARY_BACKGROUND, borderColor: theme.colors.PRIMARY_BORDER }]}>
                          <Text style={[styles.datePickerText, { color: theme.colors.PRIMARY_TEXT }]}>
                            {dueDate ? dueDate.toLocaleDateString() : "Select due date"}
                          </Text>
                          <Calendar size={16} color={theme.colors.TEXT_SECONDARY} />
                        </TouchableOpacity>
                      )}
                    </DatePicker>
                  </View>

                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <FileText size={18} color="#F59E0B" />
                      <Text style={[styles.fieldLabel, { color: theme.colors.PRIMARY_TEXT }]}>Attachments</Text>
                    </View>
                    <AttachmentPicker
                      attachments={attachments}
                      onAddAttachment={(attachment) => setAttachments([...attachments, attachment])}
                      onRemoveAttachment={(attachmentId) => 
                        setAttachments(attachments.filter(a => a.id !== attachmentId))
                      }
                    />
                  </View>
                </ScrollView>

                <View style={[styles.actions, { borderTopColor: theme.colors.PRIMARY_BORDER }]}>
                  <TouchableOpacity onPress={handleClose} style={[styles.cancelButton, { backgroundColor: theme.colors.PRIMARY_BACKGROUND, borderColor: theme.colors.PRIMARY_BORDER }]}>
                    <Text style={[styles.cancelButtonText, { color: theme.colors.TEXT_SECONDARY }]}>Cancel</Text>
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
    justifyContent: "flex-end",
  },

  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 1,
    display: 'flex',
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  closeButton: {
    padding: 8,
    borderRadius: 12,
  },

  content: {
    flex: 1,
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
  },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },

  datePickerText: {
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});


export default TodoCreatorModal;
