export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    PRIMARY_BACKGROUND: string;
    SECONDARY_BACKGROUND: string;
    PRIMARY_TEXT: string;
    TEXT_SECONDARY: string;
    PRIMARY_ACTIVE_BUTTON: string;
    PRIMARY_BORDER: string;
    SUCCESS_COLOR: string;
    ERROR_COLOR: string;
    WARNING_COLOR: string;
    CARD_BACKGROUND: string;
    SHADOW_COLOR: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    PRIMARY_BACKGROUND: '#F8FAFC',
    SECONDARY_BACKGROUND: '#FFFFFF',
    PRIMARY_TEXT: '#1E293B',
    TEXT_SECONDARY: '#64748B',
    PRIMARY_ACTIVE_BUTTON: '#4F46E5',
    PRIMARY_BORDER: '#E2E8F0',
    SUCCESS_COLOR: '#10B981',
    ERROR_COLOR: '#EF4444',
    WARNING_COLOR: '#F59E0B',
    CARD_BACKGROUND: '#FFFFFF',
    SHADOW_COLOR: '#000000',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    PRIMARY_BACKGROUND: '#0F172A',
    SECONDARY_BACKGROUND: '#1E293B',
    PRIMARY_TEXT: '#F1F5F9',
    TEXT_SECONDARY: '#94A3B8',
    PRIMARY_ACTIVE_BUTTON: '#5B21B6',
    PRIMARY_BORDER: '#334155',
    SUCCESS_COLOR: '#059669',
    ERROR_COLOR: '#DC2626',
    WARNING_COLOR: '#D97706',
    CARD_BACKGROUND: '#1E293B',
    SHADOW_COLOR: '#000000',
  },
};
