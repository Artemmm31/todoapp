import NetInfo from '@react-native-community/netinfo';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
}

export class NetworkService {
  private static instance: NetworkService;
  private listeners: Set<(state: NetworkState) => void> = new Set();
  private currentState: NetworkState = {
    isConnected: false,
    isInternetReachable: false,
  };

  private constructor() {
    this.initializeNetworkListener();
  }

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const newState: NetworkState = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
      };
      
      const wasOffline = !this.currentState.isConnected;
      const isNowOnline = newState.isConnected;
      
      this.currentState = newState;
      this.notifyListeners(newState);
      
      if (wasOffline && isNowOnline) {
        this.triggerSync();
      }
    });
  }

  addNetworkListener(listener: (state: NetworkState) => void) {
    this.listeners.add(listener);
    listener(this.currentState);
  }

  removeNetworkListener(listener: (state: NetworkState) => void) {
    this.listeners.delete(listener);
  }

  private notifyListeners(state: NetworkState) {
    this.listeners.forEach(listener => listener(state));
  }

  getCurrentState(): NetworkState {
    return this.currentState;
  }

  isOnline(): boolean {
    return this.currentState.isConnected && this.currentState.isInternetReachable;
  }

  private triggerSync() {
  }
}
