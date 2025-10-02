import { TaskLogEntry } from '@/types/taskLog';
import { Todo } from '@/types/todo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetworkService } from './networkService';

const API_BASE_URL = 'http://10.0.2.2:3001';

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingChanges: number;
  syncError: string | null;
}

export class SyncService {
  private static instance: SyncService;
  private networkService: NetworkService;
  private syncListeners: Set<(state: SyncState) => void> = new Set();
  private syncState: SyncState = {
    isSyncing: false,
    lastSyncTime: null,
    pendingChanges: 0,
    syncError: null,
  };

  private constructor() {
    this.networkService = NetworkService.getInstance();
    this.initializeSync();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private async initializeSync() {
    const lastSync = await AsyncStorage.getItem('lastSyncTime');
    if (lastSync) {
      this.syncState.lastSyncTime = lastSync;
    }

    this.networkService.addNetworkListener((networkState) => {
      if (networkState.isConnected && networkState.isInternetReachable) {
        this.syncWhenOnline();
      }
    });

    if (this.networkService.isOnline()) {
      this.syncWhenOnline();
    }
  }

  addSyncListener(listener: (state: SyncState) => void) {
    this.syncListeners.add(listener);
    listener(this.syncState);
  }

  removeSyncListener(listener: (state: SyncState) => void) {
    this.syncListeners.delete(listener);
  }

  private notifySyncListeners() {
    this.syncListeners.forEach(listener => listener(this.syncState));
  }

  private updateSyncState(updates: Partial<SyncState>) {
    this.syncState = { ...this.syncState, ...updates };
    this.notifySyncListeners();
  }

  async syncWhenOnline() {
    if (!this.networkService.isOnline() || this.syncState.isSyncing) {
      return;
    }

    try {
      this.updateSyncState({ isSyncing: true, syncError: null });
      
      await this.syncTodos();
      await this.syncTaskLogs();
      
      const now = new Date().toISOString();
      await AsyncStorage.setItem('lastSyncTime', now);
      
      this.updateSyncState({
        isSyncing: false,
        lastSyncTime: now,
        pendingChanges: 0,
      });

    } catch (error) {
      this.updateSyncState({
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'Sync failed',
      });
    }
  }

  private async syncTodos() {
    try {
      const localTodosJson = await AsyncStorage.getItem('todos');
      const localTodos: Todo[] = localTodosJson ? JSON.parse(localTodosJson) : [];

      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const serverTodos: Todo[] = await response.json();

      const mergedTodos = this.mergeTodos(localTodos, serverTodos);

      await this.updateServerTodos(mergedTodos);

      await AsyncStorage.setItem('todos', JSON.stringify(mergedTodos));

    } catch (error) {
      throw error;
    }
  }

  private async syncTaskLogs() {
    try {
      const localLogsJson = await AsyncStorage.getItem('taskLog');
      const localLogs: TaskLogEntry[] = localLogsJson ? JSON.parse(localLogsJson) : [];

      const response = await fetch(`${API_BASE_URL}/taskLogs`);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const serverLogs: TaskLogEntry[] = await response.json();

      const mergedLogs = this.mergeTaskLogs(localLogs, serverLogs);

      await this.updateServerTaskLogs(mergedLogs);

      await AsyncStorage.setItem('taskLog', JSON.stringify(mergedLogs));

    } catch (error) {
      throw error;
    }
  }

  private mergeTodos(localTodos: Todo[], serverTodos: Todo[]): Todo[] {
    const merged = new Map<number, Todo>();
    
    serverTodos.forEach(todo => merged.set(todo.id, todo));
    
    localTodos.forEach(todo => merged.set(todo.id, todo));
    
    return Array.from(merged.values());
  }

  private mergeTaskLogs(localLogs: TaskLogEntry[], serverLogs: TaskLogEntry[]): TaskLogEntry[] {
    const merged = new Map<string, TaskLogEntry>();
    
    serverLogs.forEach(log => merged.set(log.id, log));
    
    localLogs.forEach(log => merged.set(log.id, log));
    
    return Array.from(merged.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private async updateServerTodos(todos: Todo[]) {
    const deleteResponse = await fetch(`${API_BASE_URL}/todos`, {
      method: 'DELETE',
    });

    for (const todo of todos) {
      await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
    }
  }

  private async updateServerTaskLogs(logs: TaskLogEntry[]) {
    await fetch(`${API_BASE_URL}/taskLogs`, {
      method: 'DELETE',
    });

    for (const log of logs) {
      await fetch(`${API_BASE_URL}/taskLogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });
    }
  }

  getSyncState(): SyncState {
    return this.syncState;
  }

  async forcSync() {
    if (this.networkService.isOnline()) {
      await this.syncWhenOnline();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }
}
