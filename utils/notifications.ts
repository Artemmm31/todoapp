import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const scheduleNotification = async (
  title: string,
  body: string,
  dueDate: string
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const dueDateObj = new Date(dueDate);
    const notificationTime = new Date(dueDateObj.getTime() - 30 * 60 * 1000);

    if (notificationTime <= new Date()) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Task Reminder',
        body: `"${title}" is due in 30 minutes`,
        data: { taskTitle: title },
      },
      trigger: {
        date: notificationTime,
      },
    });

    return notificationId;
  } catch (error) {
    return null;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
  }
};

export const updateNotification = async (
  oldNotificationId: string | undefined,
  title: string,
  dueDate: string
): Promise<string | null> => {
  if (oldNotificationId) {
    await cancelNotification(oldNotificationId);
  }
  return await scheduleNotification(title, '', dueDate);
};
