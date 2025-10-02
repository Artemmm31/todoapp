import { TodoAttachment } from '@/types/todo';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

export const requestMediaPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
};

export const pickImage = async (): Promise<TodoAttachment | null> => {
  try {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: asset.fileName || `image_${Date.now()}.jpg`,
        uri: asset.uri,
        type: 'image',
        size: fileInfo.exists ? fileInfo.size : undefined,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const takePhoto = async (): Promise<TodoAttachment | null> => {
  try {
    const hasPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (hasPermission.status !== 'granted') {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        uri: asset.uri,
        type: 'image',
        size: fileInfo.exists ? fileInfo.size : undefined,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const pickDocument = async (): Promise<TodoAttachment | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileExtension = asset.name.split('.').pop()?.toLowerCase();
      
      let fileType: TodoAttachment['type'] = 'other';
      if (fileExtension === 'pdf') {
        fileType = 'pdf';
      } else if (['doc', 'docx', 'txt', 'rtf'].includes(fileExtension || '')) {
        fileType = 'document';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
        fileType = 'image';
      }

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: asset.name,
        uri: asset.uri,
        type: fileType,
        size: asset.size,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const deleteAttachment = async (attachment: TodoAttachment): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(attachment.uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(attachment.uri);
    }
  } catch (error) {
  }
};

export const formatFileSize = (bytes: number | undefined): string => {
  if (!bytes) return 'Unknown size';
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};
