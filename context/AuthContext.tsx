import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User types
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  class?: string;
  section?: string;
  grade?: string;
  studentId?: string;
  teacherId?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Mock user data for demo purposes
const mockUsers = {
  'student@example.com': {
    id: '1',
    name: 'Siddh Salgia',
    email: 'siddhsalgia@example.com',
    role: 'student' as UserRole,
    avatar: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=600',
    class: '4',
    section: 'D',
    grade: 'A',
    studentId: 'S-12559',
  },
  'teacher@example.com': {
    id: '2',
    name: 'Mrs. Harshal Yamgar',
    email: 'teacher@example.com',
    role: 'teacher' as UserRole,
    avatar: 'https://images.pexels.com/photos/3783525/pexels-photo-3783525.jpeg?auto=compress&cs=tinysrgb&w=600',
    teacherId: 'T12345',
  },
  'admin@example.com': {
    id: '3',
    name: 'Bhavna Pujari',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    avatar: 'https://images.pexels.com/photos/5212665/pexels-photo-5212665.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
};

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSignedIn: false,
  signIn: async () => {},
  signOut: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on component mount
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          console.log('Loaded user from storage:', userData);
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo, we're using mock data
      const mockUser = mockUsers[email as keyof typeof mockUsers];
      
      if (!mockUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, validate password here
      // For demo, any password works
      
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      console.log('User signed in:', mockUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    console.log('Starting sign out process...');
    setIsLoading(true);
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      console.log('User data removed from storage');
      
      // Clear user state
      setUser(null);
      console.log('User state cleared');
      
      // Additional cleanup if needed
      await AsyncStorage.clear(); // Clear all stored data for a clean logout
      console.log('All storage cleared');
      
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('Sign out process completed');
    }
  };

  const contextValue = {
    user,
    isLoading,
    isSignedIn: !!user,
    signIn,
    signOut,
  };

  console.log('Auth context state:', { 
    hasUser: !!user, 
    isLoading, 
    isSignedIn: !!user 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};