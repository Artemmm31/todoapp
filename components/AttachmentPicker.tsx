import { useTheme } from '@/contexts/ThemeContext';
import { TodoAttachment } from '@/types/todo';
import { pickDocument, pickImage, takePhoto } from '@/utils/attachments';
import { Camera, FileText, Image, Paperclip } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AttachmentPickerProps {
  attachments: TodoAttachment[];
  onAddAttachment: (attachment: TodoAttachment) => void;
  onRemoveAttachment: (attachmentId: string) => void;
}

const AttachmentPicker: React.FC<AttachmentPickerProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const { theme } = useTheme();
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handlePickImage = async () => {
    setIsPickerVisible(false);
    const attachment = await pickImage();
    if (attachment) {
      onAddAttachment(attachment);
    }
  };

  const handleTakePhoto = async () => {
    setIsPickerVisible(false);
    const attachment = await takePhoto();
    if (attachment) {
      onAddAttachment(attachment);
    }
  };

  const handlePickDocument = async () => {
    setIsPickerVisible(false);
    const attachment = await pickDocument();
    if (attachment) {
      onAddAttachment(attachment);
    }
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
      onPress={() => {
        Alert.alert(
          'Remove Attachment',
          `Remove "${item.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Remove', 
              style: 'destructive',
              onPress: () => onRemoveAttachment(item.id)
            },
          ]
        );
      }}
    >
      <View style={styles.attachmentIcon}>
        {getAttachmentIcon(item.type)}
      </View>
      <Text style={[styles.attachmentName, { color: theme.colors.PRIMARY_TEXT }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: theme.colors.SECONDARY_BACKGROUND,
            borderColor: theme.colors.PRIMARY_BORDER,
          }
        ]}
        onPress={() => setIsPickerVisible(true)}
      >
        <Paperclip size={20} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
        <Text style={[styles.addButtonText, { color: theme.colors.PRIMARY_ACTIVE_BUTTON }]}>Add Attachment</Text>
      </TouchableOpacity>

      {attachments.length > 0 && (
        <FlatList
          data={attachments}
          renderItem={renderAttachment}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.attachmentsList}
        />
      )}

      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.PRIMARY_TEXT }]}>Choose Attachment Type</Text>
            
            <TouchableOpacity style={[styles.optionButton, { backgroundColor: theme.colors.SECONDARY_BACKGROUND }]} onPress={handleTakePhoto}>
              <Camera size={24} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
              <Text style={[styles.optionText, { color: theme.colors.PRIMARY_TEXT }]}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, { backgroundColor: theme.colors.SECONDARY_BACKGROUND }]} onPress={handlePickImage}>
              <Image size={24} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
              <Text style={[styles.optionText, { color: theme.colors.PRIMARY_TEXT }]}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, { backgroundColor: theme.colors.SECONDARY_BACKGROUND }]} onPress={handlePickDocument}>
              <FileText size={24} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
              <Text style={[styles.optionText, { color: theme.colors.PRIMARY_TEXT }]}>Choose Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsPickerVisible(false)}
            >
              <Text style={[styles.cancelText, { color: theme.colors.TEXT_SECONDARY }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  attachmentsList: {
    marginTop: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    maxWidth: 150,
  },
  attachmentIcon: {
    marginRight: 6,
  },
  attachmentName: {
    fontSize: 14,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AttachmentPicker;
