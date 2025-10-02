import FileViewer from "@/components/FileViewer";
import StyledText from "@/components/StyledText";
import { useTheme } from "@/contexts/ThemeContext";
import { Todo, TodoAttachment } from "@/types/todo";
import { formatFileSize } from "@/utils/attachments";
import { FileText, Image, Paperclip } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type TodoDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
};

const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({ isOpen, onClose, todo }) => {
  const { theme } = useTheme();
  const [selectedAttachment, setSelectedAttachment] = useState<TodoAttachment | null>(null);
  
  const getStatus = () => {
    if (todo.isCompleted) return "Completed ✅";
    if (!todo.isCompleted && todo.dueDate && new Date(todo.dueDate) > new Date()) return "In Progress ⏳";
    return "Cancelled ❌";
  };

  const getAttachmentIcon = (type: TodoAttachment['type']) => {
    switch (type) {
      case 'image':
        return <Image size={16} color={theme.colors.PRIMARY_TEXT} />;
      case 'pdf':
      case 'document':
        return <FileText size={16} color={theme.colors.PRIMARY_TEXT} />;
      default:
        return <Paperclip size={16} color={theme.colors.PRIMARY_TEXT} />;
    }
  };

  const renderAttachment = ({ item }: { item: TodoAttachment }) => (
    <TouchableOpacity
      style={[styles.attachmentItem, { backgroundColor: theme.colors.SECONDARY_BACKGROUND }]}
      onPress={() => setSelectedAttachment(item)}
    >
      <View style={styles.attachmentIcon}>
        {getAttachmentIcon(item.type)}
      </View>
      <View style={styles.attachmentInfo}>
        <StyledText style={[styles.attachmentName, { color: theme.colors.PRIMARY_TEXT }]} numberOfLines={1}>
          {item.name}
        </StyledText>
        <StyledText style={[styles.attachmentSize, { color: theme.colors.TEXT_SECONDARY }]}>
          {formatFileSize(item.size)}
        </StyledText>
      </View>
      <View style={styles.attachmentAction}>
        <StyledText style={[styles.attachmentActionText, { color: theme.colors.PRIMARY_ACTIVE_BUTTON }]}>
          {item.type === 'image' ? '👁️ View' : '📂 Open'}
        </StyledText>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
          <ScrollView>
            <StyledText style={styles.title}>{todo.title}</StyledText>
            {todo.description && <StyledText style={styles.description}>{todo.description}</StyledText>}
            {todo.dueDate && <StyledText style={styles.meta}>📅 {new Date(todo.dueDate).toLocaleString()}</StyledText>}
            {todo.location?.address && <StyledText style={styles.meta}>📍 {todo.location.address}</StyledText>}
            <StyledText style={styles.meta}>
              Status: {getStatus()}
            </StyledText>

            {/* Attachments Section */}
            {todo.attachments && todo.attachments.length > 0 && (
              <View style={styles.attachmentsSection}>
                <StyledText style={[styles.sectionTitle, { color: theme.colors.PRIMARY_TEXT }]}>
                  📎 Attachments ({todo.attachments.length})
                </StyledText>
                <FlatList
                  data={todo.attachments}
                  renderItem={renderAttachment}
                  keyExtractor={(item) => item.id}
                  style={styles.attachmentsList}
                  scrollEnabled={false}
                />
              </View>
            )}
            

            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.colors.PRIMARY_ACTIVE_BUTTON }]}>
              <StyledText style={styles.closeText}>Close</StyledText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* File Viewer Modal */}
      <FileViewer
        attachment={selectedAttachment}
        visible={!!selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
      />
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
    borderRadius: 12,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  description: { fontSize: 14, marginBottom: 10 },
  meta: { fontSize: 12, marginBottom: 5 },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  attachmentsSection: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  attachmentsList: {
    maxHeight: 150,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentIcon: {
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
  },
  attachmentAction: {
    paddingLeft: 8,
  },
  attachmentActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TodoDetailsModal;
