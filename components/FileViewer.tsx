import { useTheme } from '@/contexts/ThemeContext';
import { TodoAttachment } from '@/types/todo';
import * as FileSystem from 'expo-file-system/legacy';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface FileViewerProps {
  attachment: TodoAttachment | null;
  visible: boolean;
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  attachment,
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const [fileExists, setFileExists] = useState(true);

  useEffect(() => {
    if (attachment) {
      setFileExists(true);
    }
  }, [attachment]);

  const checkFileExists = async (uri: string): Promise<boolean> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.exists;
    } catch (error) {
      return false;
    }
  };

  const openExternalFile = async (uri: string, fileName: string) => {
    try {

      const exists = await checkFileExists(uri);
      if (!exists) {
        setFileExists(false);
        Alert.alert(
          'File not found',
          `The file "${fileName}" could not be found. It may have been moved or deleted.`,
          [{ text: 'OK' }]
        );
        return;
      }

      if (Platform.OS === 'android') {
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert(
            'Sharing not available',
            'File opening is not available on this device.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        await Sharing.shareAsync(uri, {
          mimeType: getMimeType(attachment?.type || 'other'),
          dialogTitle: `Open ${fileName}`,
        });
        
      } else {
        const canOpen = await Linking.canOpenURL(uri);
        if (!canOpen) {
          Alert.alert(
            'Cannot open file',
            `No application found to open "${fileName}". Please install an appropriate app.`,
            [{ text: 'OK' }]
          );
          return;
        }
        await Linking.openURL(uri);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      Alert.alert(
        'Error opening file',
        `Unable to open "${fileName}". ${errorMessage}\n\nTry installing an app that can open ${attachment?.type || 'this file type'} files.`,
        [
          { text: 'OK' },
          { 
            text: 'Try again', 
            onPress: () => openExternalFile(uri, fileName)
          }
        ]
      );
    }
  };

  const getMimeType = (fileType: string): string => {
    switch (fileType) {
      case 'pdf':
        return 'application/pdf';
      case 'document':
        return 'application/msword';
      case 'image':
        return 'image/*';
      default:
        return '*/*';
    }
  };


  if (!attachment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
          <View style={[styles.header, { borderBottomColor: theme.colors.PRIMARY_BORDER }]}>
            <View style={styles.fileInfo}>
              <Text style={[styles.fileName, { color: theme.colors.PRIMARY_TEXT }]} numberOfLines={1}>
                {attachment.name}
              </Text>
              <Text style={[styles.fileType, { color: theme.colors.TEXT_SECONDARY }]}>
                {attachment.type.toUpperCase()} • {Math.round((attachment.size || 0) / 1024)} KB
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.PRIMARY_TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            maximumZoomScale={3}
            minimumZoomScale={1}
          >
            <View style={styles.fileContainer}>
              <View style={[styles.fileIcon, { backgroundColor: theme.colors.SECONDARY_BACKGROUND }]}>
                <Text style={[styles.fileIconText, { color: theme.colors.PRIMARY_TEXT }]}>
                  {attachment.type === 'image' ? '🖼️' :
                   attachment.type === 'pdf' ? '📄' : 
                   attachment.type === 'document' ? '📝' : 
                   '📁'}
                </Text>
              </View>
              <Text style={[styles.fileTitle, { color: theme.colors.PRIMARY_TEXT }]}>
                {attachment.name}
              </Text>
              <Text style={[styles.fileDescription, { color: theme.colors.TEXT_SECONDARY }]}>
                {attachment.type.toUpperCase()} • {Math.round((attachment.size || 0) / 1024)} KB
              </Text>
              <Text style={[styles.fileNote, { color: theme.colors.TEXT_SECONDARY }]}>
                {Platform.OS === 'android' 
                  ? `Tap to open ${attachment.type === 'image' ? 'image' : 'file'} - you may see app selection dialog`
                  : attachment.type === 'image' 
                    ? 'Tap to open image in your gallery or photo viewer'
                    : 'Tap to open file with the appropriate app'
                }
              </Text>
              <TouchableOpacity
                style={[styles.openButton, { backgroundColor: theme.colors.PRIMARY_ACTIVE_BUTTON }]}
                onPress={() => openExternalFile(attachment.uri, attachment.name)}
              >
                <Text style={styles.openButtonText}>
                  {attachment.type === 'image' ? '🖼️ Open Image' : '📂 Open File'}
                </Text>
              </TouchableOpacity>
              
              {!fileExists && (
                <View style={[styles.warningContainer, { backgroundColor: theme.colors.WARNING_COLOR + '20', borderColor: theme.colors.WARNING_COLOR }]}>
                  <Text style={[styles.warningText, { color: theme.colors.WARNING_COLOR }]}>
                    ⚠️ File may have been moved or deleted
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  fileInfo: {
    flex: 1,
    marginRight: 16,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileType: {
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  fileIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fileIconText: {
    fontSize: 48,
  },
  fileTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  fileDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  fileNote: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  openButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  warningContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default FileViewer;
