import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
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
  
  console.log('AppLayout - User is signed in, showing app stack');
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="personal-info" options={{ headerShown: false }} />
      <Stack.Screen name="academic-records" options={{ headerShown: false }} />
      <Stack.Screen name="feedback" options={{ headerShown: false }} />
      <Stack.Screen name="help-support" options={{ headerShown: false }} />
      <Stack.Screen name="privacy-security" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="notification-settings" options={{ headerShown: false }} />
      <Stack.Screen name="app-settings" options={{ headerShown: false }} />
      <Stack.Screen name="attendance-details" options={{ headerShown: false }} />
      <Stack.Screen name="grade-details" options={{ headerShown: false }} />
      <Stack.Screen name="ranking-details" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 16,
  },
});