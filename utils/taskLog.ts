import { TaskLog, TaskLogAction, TaskLogEntry } from '@/types/taskLog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASK_LOG_STORAGE_KEY = '@todo_app_task_log';

export const getTaskLog = async (): Promise<TaskLog> => {
  try {
    const logData = await AsyncStorage.getItem(TASK_LOG_STORAGE_KEY);
    if (logData) {
      const parsedLog = JSON.parse(logData);
      return Array.isArray(parsedLog.entries) ? parsedLog : { entries: [] };
    }
    return { entries: [] };
  } catch (error) {
    return { entries: [] };
  }
};

export const saveTaskLog = async (log: TaskLog): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASK_LOG_STORAGE_KEY, JSON.stringify(log));
  } catch (error) {
  }
};

export const addLogEntry = async (
  taskId: number,
  taskTitle: string,
  action: TaskLogAction,
  details?: string,
  previousValue?: any,
  newValue?: any
): Promise<void> => {
  try {
    const log = await getTaskLog();
    
    const newEntry: TaskLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      taskId,
      taskTitle,
      action,
      timestamp: new Date().toISOString(),
      details,
      previousValue,
      newValue,
    };

    log.entries.unshift(newEntry); 
    
    if (log.entries.length > 1000) {
      log.entries = log.entries.slice(0, 1000);
    }

    await saveTaskLog(log);
  } catch (error) {
  }
};

export const getActionDisplayName = (action: TaskLogAction): string => {
  const actionNames: Record<TaskLogAction, string> = {
    created: 'Created',
    updated: 'Updated',
    completed: 'Completed',
    uncompleted: 'Marked as incomplete',
    deleted: 'Deleted',
    attachment_added: 'Added attachment',
    attachment_removed: 'Removed attachment',
    location_updated: 'Updated location',
  };
  
  return actionNames[action];
};

export const getActionIcon = (action: TaskLogAction): string => {
  const actionIcons: Record<TaskLogAction, string> = {
    created: '➕',
    updated: '✏️',
    completed: '✅',
    uncompleted: '↩️',
    deleted: '🗑️',
    attachment_added: '📎',
    attachment_removed: '📎',
    location_updated: '📍',
  };
  
  return actionIcons[action];
};

export const getActionColor = (action: TaskLogAction): string => {
  const actionColors: Record<TaskLogAction, string> = {
    created: '#10B981',
    updated: '#3B82F6',
    completed: '#10B981',
    uncompleted: '#F59E0B',
    deleted: '#EF4444',
    attachment_added: '#8B5CF6',
    attachment_removed: '#EF4444',
    location_updated: '#06B6D4',
  };
  
  return actionColors[action];
};

export const clearTaskLog = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TASK_LOG_STORAGE_KEY);
  } catch (error) {
  }
};

export const formatLogTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    return timestamp;
  }
};
