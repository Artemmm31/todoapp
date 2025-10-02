import { useTheme } from '@/contexts/ThemeContext';
import { TaskLogEntry } from '@/types/taskLog';
import {
    clearTaskLog,
    formatLogTimestamp,
    getActionColor,
    getActionDisplayName,
    getActionIcon,
    getTaskLog
} from '@/utils/taskLog';
import { Clock, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TaskHistory: React.FC = () => {
  const { theme } = useTheme();
  const [logEntries, setLogEntries] = useState<TaskLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const log = await getTaskLog();
      setLogEntries(log.entries);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all task history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearTaskLog();
            setLogEntries([]);
          },
        },
      ]
    );
  };

  const renderLogEntry = ({ item }: { item: TaskLogEntry }) => (
    <View
      style={[
        styles.logEntry,
        {
          backgroundColor: theme.colors.CARD_BACKGROUND,
          borderColor: theme.colors.PRIMARY_BORDER,
        },
      ]}
    >
      <View style={styles.logHeader}>
        <View style={styles.actionContainer}>
          <Text style={styles.actionIcon}>{getActionIcon(item.action)}</Text>
          <View style={styles.actionInfo}>
            <Text
              style={[
                styles.actionText,
                { color: getActionColor(item.action) },
              ]}
            >
              {getActionDisplayName(item.action)}
            </Text>
            <Text
              style={[
                styles.taskTitle,
                { color: theme.colors.PRIMARY_TEXT },
              ]}
              numberOfLines={1}
            >
              {item.taskTitle}
            </Text>
          </View>
        </View>
        <View style={styles.timestampContainer}>
          <Clock size={12} color={theme.colors.TEXT_SECONDARY} />
          <Text
            style={[
              styles.timestamp,
              { color: theme.colors.TEXT_SECONDARY },
            ]}
          >
            {formatLogTimestamp(item.timestamp)}
          </Text>
        </View>
      </View>
      
      {item.details && (
        <Text
          style={[
            styles.details,
            { color: theme.colors.TEXT_SECONDARY },
          ]}
        >
          {item.details}
        </Text>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Clock size={64} color={theme.colors.TEXT_SECONDARY} />
      <Text
        style={[
          styles.emptyTitle,
          { color: theme.colors.PRIMARY_TEXT },
        ]}
      >
        No History Yet
      </Text>
      <Text
        style={[
          styles.emptyDescription,
          { color: theme.colors.TEXT_SECONDARY },
        ]}
      >
        Task actions will appear here as you create, update, and complete tasks.
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.PRIMARY_BACKGROUND },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.PRIMARY_TEXT },
          ]}
        >
          Task History
        </Text>
        {logEntries.length > 0 && (
          <TouchableOpacity
            style={[
              styles.clearButton,
              {
                backgroundColor: theme.colors.ERROR_COLOR,
              },
            ]}
            onPress={handleClearHistory}
          >
            <Trash2 size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={logEntries}
        renderItem={renderLogEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.PRIMARY_ACTIVE_BUTTON]}
            tintColor={theme.colors.PRIMARY_ACTIVE_BUTTON}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logEntry: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 4,
  },
  details: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TaskHistory;
