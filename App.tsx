import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme';
import { offers } from './src/data/offers';
import { deserializeSaved, savedReducer, serializeSaved } from './src/domain/saved';
import HomeScreen from './src/screens/HomeScreen';
import NearbyScreen from './src/screens/NearbyScreen';
import SavedScreen from './src/screens/SavedScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OfferScreen from './src/screens/OfferScreen';

export type RootStackParams = { Tabs: undefined; Offer: { id: string } };
export type TabParams = { Home: undefined; Nearby: undefined; Saved: undefined; Profile: undefined };
type SavedContextValue = { saved: string[]; toggle: (id: string) => void; hydrated: boolean };

const SavedContext = createContext<SavedContextValue>({ saved: [], toggle: () => {}, hydrated: false });
export const useSaved = () => useContext(SavedContext);
const Tabs = createBottomTabNavigator<TabParams>();
const Stack = createNativeStackNavigator<RootStackParams>();
const tabIcons: Record<keyof TabParams, keyof typeof Ionicons.glyphMap> = {
  Home: 'shield', Nearby: 'map', Saved: 'bookmark', Profile: 'person-circle',
};

function TabNavigator() {
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.gold,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.navy2, borderTopColor: colors.line, height: 72, paddingTop: 7, paddingBottom: 9 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarIcon: ({ color, size }) => <Ionicons name={tabIcons[route.name]} color={color} size={size} />,
    })}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Nearby" component={NearbyScreen} />
      <Tabs.Screen name="Saved" component={SavedScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  const [saved, dispatch] = useReducer(savedReducer, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem('@honor-perks/saved')
      .then(value => {
        if (active) dispatch({ type: 'replace', ids: deserializeSaved(value), validIds: offers.map(offer => offer.id) });
      })
      .catch(() => undefined)
      .finally(() => { if (active) setHydrated(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem('@honor-perks/saved', serializeSaved(saved)).catch(() => undefined);
  }, [saved, hydrated]);

  const value = useMemo(() => ({
    saved,
    hydrated,
    toggle: (id: string) => {
      if (!hydrated) return;
      dispatch({ type: 'toggle', id });
    },
  }), [saved, hydrated]);

  return (
    <SavedContext.Provider value={value}>
      <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.navy, card: colors.navy2, border: colors.line, primary: colors.gold, text: colors.cream } }}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.navy2 }, headerTintColor: colors.cream, contentStyle: { backgroundColor: colors.navy } }}>
          <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Offer" component={OfferScreen} options={{ presentation: 'modal', title: 'Offer details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SavedContext.Provider>
  );
}
