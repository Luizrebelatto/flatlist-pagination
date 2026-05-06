import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#0066ff',
          tabBarInactiveTintColor: '#999',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Infinite Scroll',
            headerTitle: 'Infinite Scroll Pagination',
            tabBarIcon: ({ color }) => <Feather name="arrow-down" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="pagination"
          options={{
            title: 'By Number',
            headerTitle: 'Pagination by Number',
            tabBarIcon: ({ color }) => <Feather name="grid" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="offset"
          options={{
            title: 'Offset',
            headerTitle: 'Offset Pagination',
            tabBarIcon: ({ color }) => <Feather name="sliders" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="cursor"
          options={{
            title: 'Cursor',
            headerTitle: 'Cursor Pagination',
            tabBarIcon: ({ color }) => <Feather name="chevrons-right" size={28} color={color} />,
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
