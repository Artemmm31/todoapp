import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { CheckSquare, Clock, MapPin } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.PRIMARY_ACTIVE_BUTTON,
        tabBarInactiveTintColor: theme.colors.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: theme.colors.SECONDARY_BACKGROUND,
          borderTopColor: theme.colors.PRIMARY_BORDER,
          borderTopWidth: 1,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
