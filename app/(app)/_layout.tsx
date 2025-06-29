import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { Chrome as Home, Calendar, MapPin, FileText, MessageSquare, User } from 'lucide-react-native';
import { globalStyles } from '@/constants/Theme';
import { useEffect } from 'react';

export default function AppLayout() {
  const { isSignedIn, isLoading, user } = useAuth();
  
  useEffect(() => {
    console.log('AppLayout - Auth state:', { isSignedIn, isLoading, hasUser: !!user });
  }, [isSignedIn, isLoading, user]);
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('AppLayout - Showing loading state');
    return (
      <View style={[globalStyles.container, globalStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    console.log('AppLayout - User not signed in, redirecting to auth');
    return <Redirect href="/(auth)/" />;
  }
  
  console.log('AppLayout - User is signed in, showing tabs');
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.neutral[400],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarLabel: 'Track',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    height: 60,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 16,
  },
});