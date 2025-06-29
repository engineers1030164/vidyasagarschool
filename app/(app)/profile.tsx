import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { Bell, Moon, Lock, CircleHelp as HelpCircle, LogOut, ChevronRight, User, BookOpen, Calendar, MessageSquare, Settings, Shield, FileText, Heart } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              console.log('Logout button pressed, calling signOut...');
              
              await signOut();
              console.log('SignOut completed, navigating to auth...');
              
              // Force navigation to auth screen
              router.replace('/(auth)/');
              
              // Additional fallback navigation
              setTimeout(() => {
                router.replace('/(auth)/');
              }, 100);
              
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handlePersonalInfo = () => {
    router.push('/(app)/personal-info');
  };

  const handleAcademicRecords = () => {
    router.push('/(app)/academic-records');
  };

  const handleScheduleTimetable = () => {
    // Navigate to calendar tab
    router.push('/(app)/calendar');
  };

  const handleFeedback = () => {
    router.push('/(app)/feedback');
  };

  const handlePrivacySecurity = () => {
    router.push('/(app)/privacy-security');
  };

  const handleHelpSupport = () => {
    router.push('/(app)/help-support');
  };

  const handleEditProfile = () => {
    router.push('/(app)/edit-profile');
  };

  const handleNotificationSettings = () => {
    router.push('/(app)/notification-settings');
  };

  // Show loading state if auth is loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.replace('/(auth)/')}
          >
            <Text style={styles.retryButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/(app)/app-settings')}
          >
            <Settings size={24} color={Colors.neutral[700]} />
          </TouchableOpacity>
        </View>
        
        <Animated.View 
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.profileCard}
        >
          <Image 
            source={{ uri: user?.avatar }} 
            style={styles.avatar}
          />
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>
              {user?.role === 'student' ? `Student - Grade ${user?.class}${user?.section}` : user?.role}
            </Text>
            
            {user?.role === 'student' && (
              <View style={styles.idBadge}>
                <Text style={styles.idText}>ID: {user?.studentId}</Text>
              </View>
            )}
            
            {user?.role === 'teacher' && (
              <View style={styles.idBadge}>
                <Text style={styles.idText}>ID: {user?.teacherId}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {user?.role === 'student' && (
          <Animated.View 
            entering={FadeInUp.duration(500).delay(200)}
            style={styles.statsCard}
          >
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => router.push('/(app)/attendance-details')}
            >
              <Text style={styles.statValue}>92%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </TouchableOpacity>
            
            <View style={styles.statDivider} />
            
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => router.push('/(app)/grade-details')}
            >
              <Text style={styles.statValue}>A-</Text>
              <Text style={styles.statLabel}>Avg. Grade</Text>
            </TouchableOpacity>
            
            <View style={styles.statDivider} />
            
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => router.push('/(app)/ranking-details')}
            >
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        <Animated.View 
          entering={FadeInUp.duration(500).delay(300)}
          style={styles.actionsContainer}
        >
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handlePersonalInfo}
          >
            <View style={styles.menuItemIcon}>
              <User size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>Personal Information</Text>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          {user?.role === 'student' && (
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleAcademicRecords}
            >
              <View style={[styles.menuItemIcon, { backgroundColor: Colors.secondary[600] }]}>
                <BookOpen size={20} color={Colors.white} />
              </View>
              <Text style={styles.menuItemText}>Academic Records</Text>
              <ChevronRight size={20} color={Colors.neutral[400]} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleScheduleTimetable}
          >
            <View style={[styles.menuItemIcon, { backgroundColor: Colors.accent[600] }]}>
              <Calendar size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>Schedule & Timetable</Text>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleFeedback}
          >
            <View style={[styles.menuItemIcon, { backgroundColor: Colors.success[600] }]}>
              <MessageSquare size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>Feedback & Suggestions</Text>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>

          {user?.role === 'student' && (
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(app)/reports')}
            >
              <View style={[styles.menuItemIcon, { backgroundColor: Colors.warning[600] }]}>
                <FileText size={20} color={Colors.white} />
              </View>
              <Text style={styles.menuItemText}>Reports & Analytics</Text>
              <ChevronRight size={20} color={Colors.neutral[400]} />
            </TouchableOpacity>
          )}
        </Animated.View>
        
        <Animated.View 
          entering={FadeInUp.duration(500).delay(400)}
          style={styles.actionsContainer}
        >
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleNotificationSettings}
          >
            <View style={[styles.menuItemIcon, { backgroundColor: Colors.warning[600] }]}>
              <Bell size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>Notification Settings</Text>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <View style={styles.menuItem}>
            <View style={[styles.menuItemIcon, { backgroundColor: Colors.neutral[700] }]}>
              <Moon size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[300] }}
              thumbColor={darkMode ? Colors.primary[600] : Colors.neutral[100]}
            />
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInUp.duration(500).delay(500)}
          style={styles.actionsContainer}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handlePrivacySecurity}
          >
            <View style={[styles.menuItemIcon, { backgroundColor: Colors.error[600] }]}>
              <Shield size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>Privacy & Security</Text>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleHelpSupport}
          >
            <View style={[styles.menuItemIcon, { backgroundColor: Colors.primary[400] }]}>
              <HelpCircle size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('About', 'SchoolConnect v1.0.0\n\nA comprehensive school management application designed to connect students, teachers, and parents.\n\nDeveloped with ❤️ for better education.')}
          >
            <View style={[styles.menuItemIcon, { backgroundColor: Colors.secondary[400] }]}>
              <Heart size={20} color={Colors.white} />
            </View>
            <Text style={styles.menuItemText}>About SchoolConnect</Text>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity 
          style={[
            styles.logoutButton,
            (isLoggingOut || isLoading) && styles.logoutButtonDisabled
          ]}
          onPress={handleLogout}
          disabled={isLoggingOut || isLoading}
        >
          <LogOut size={20} color={Colors.error[600]} />
          <Text style={styles.logoutText}>
            {isLoggingOut ? 'Logging Out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>SchoolConnect v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.xl,
    color: Colors.neutral[900],
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: Colors.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...globalStyles.shadow,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.primary[100],
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  userRole: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  idBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  idText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.xs,
    color: Colors.primary[700],
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: Colors.primary[50],
    borderRadius: BORDER_RADIUS.md,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[600],
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
    backgroundColor: Colors.neutral[50],
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[600],
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.neutral[300],
    alignSelf: 'center',
  },
  actionsContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.error[200],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.error[50],
  },
  logoutButtonDisabled: {
    opacity: 0.6,
    backgroundColor: Colors.neutral[100],
    borderColor: Colors.neutral[300],
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.error[600],
    marginLeft: SPACING.sm,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[600],
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.lg,
    color: Colors.error[600],
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
  },
});