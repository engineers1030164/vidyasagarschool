import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { Bell, CheckCircle2, BookOpen, Bus, FileText, Plus, Users, MessageSquare } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Mock data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Assignment Graded',
      message: 'Your Math assignment has been graded',
      time: '2h ago',
      read: false,
    },
    {
      id: '2',
      title: 'School Event',
      message: 'Science Fair registration is now open',
      time: '5h ago',
      read: false,
    },
    {
      id: '3',
      title: 'Attendance Alert',
      message: 'You were marked absent on Friday',
      time: '1d ago',
      read: true,
    },
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Math Assignment',
      subject: 'Mathematics',
      dueDate: 'Today',
      completed: false,
    },
    {
      id: '2',
      title: 'Science Project',
      subject: 'Science',
      dueDate: 'Tomorrow',
      completed: false,
    },
    {
      id: '3',
      title: 'English Essay',
      subject: 'English',
      dueDate: 'Friday',
      completed: true,
    },
  ]);
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const getTodayDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // Quick actions based on user role
  const getQuickActions = () => {
    const commonActions = [
      {
        icon: CheckCircle2,
        color: Colors.secondary[600],
        bgColor: Colors.secondary[100],
        text: 'Attendance',
        onPress: () => router.push('/(app)/(tabs)/reports'),
      },
      {
        icon: Bus,
        color: Colors.success[600],
        bgColor: Colors.success[100],
        text: 'Bus Track',
        onPress: () => router.push('/(app)/(tabs)/track'),
      },
    ];

    if (user?.role === 'student') {
      return [
        {
          icon: FileText,
          color: Colors.accent[600],
          bgColor: Colors.accent[100],
          text: 'Reports',
          onPress: () => router.push('/(app)/(tabs)/reports'),
        },
        ...commonActions,
      ];
    }

    if (user?.role === 'teacher') {
      return [
        {
          icon: Plus,
          color: Colors.primary[600],
          bgColor: Colors.primary[100],
          text: 'Add Class',
          onPress: () => router.push('/(app)/manage-classes'),
        },
        {
          icon: Users,
          color: Colors.accent[600],
          bgColor: Colors.accent[100],
          text: 'My Classes',
          onPress: () => router.push('/(app)/my-classes'),
        },
        {
          icon: MessageSquare,
          color: Colors.warning[600],
          bgColor: Colors.warning[100],
          text: 'Send Message',
          onPress: () => router.push('/(app)/send-message'),
        },
        ...commonActions,
      ];
    }

    if (user?.role === 'admin') {
      return [
        {
          icon: MessageSquare,
          color: Colors.error[600],
          bgColor: Colors.error[100],
          text: 'Broadcast',
          onPress: () => router.push('/(app)/broadcast-message'),
        },
        {
          icon: Users,
          color: Colors.accent[600],
          bgColor: Colors.accent[100],
          text: 'Manage Users',
          onPress: () => router.push('/(app)/manage-users'),
        },
        ...commonActions,
      ];
    }

    return commonActions;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.date}>{getTodayDate()}</Text>
          </View>
          
          <View style={styles.profileContainer}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell color={Colors.neutral[700]} size={24} />
              {getUnreadCount() > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{getUnreadCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Image 
                source={{ uri: user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
                style={styles.profileImage} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              {getQuickActions().map((action, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.quickActionItem}
                  onPress={action.onPress}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
                    <action.icon color={action.color} size={24} />
                  </View>
                  <Text style={styles.quickActionText}>{action.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
          
          {user?.role === 'student' && (
            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {tasks.map((task, index) => (
                <TouchableOpacity 
                  key={task.id}
                  style={[
                    styles.taskItem,
                    task.completed && styles.taskCompleted,
                  ]}
                  onPress={() => toggleTaskCompletion(task.id)}
                >
                  <View style={styles.taskLeftSection}>
                    <View style={[
                      styles.checkboxContainer,
                      task.completed && styles.checkboxCompleted
                    ]}>
                      {task.completed && (
                        <CheckCircle2 
                          color={Colors.white} 
                          size={16}
                        />
                      )}
                    </View>
                    
                    <View style={styles.taskDetails}>
                      <Text style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted
                      ]}>
                        {task.title}
                      </Text>
                      <Text style={styles.taskSubject}>{task.subject}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.taskDueDate}>
                    <Text style={styles.taskDueDateText}>{task.dueDate}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
          
          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {notifications.map((notification) => (
              <TouchableOpacity 
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.notificationUnread
                ]}
                onPress={() => markNotificationAsRead(notification.id)}
              >
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                
                {!notification.read && (
                  <View style={styles.unreadIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
          
          {user?.role === 'student' && (
            <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>This Month</Text>
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: Colors.primary[50] }]}>
                  <View style={[styles.statIconContainer, { backgroundColor: Colors.primary[100] }]}>
                    <CheckCircle2 color={Colors.primary[600]} size={20} />
                  </View>
                  <Text style={styles.statValue}>92%</Text>
                  <Text style={styles.statLabel}>Attendance</Text>
                </View>
                
                <View style={[styles.statCard, { backgroundColor: Colors.secondary[50] }]}>
                  <View style={[styles.statIconContainer, { backgroundColor: Colors.secondary[100] }]}>
                    <FileText color={Colors.secondary[600]} size={20} />
                  </View>
                  <Text style={styles.statValue}>8/10</Text>
                  <Text style={styles.statLabel}>Assignments</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>
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
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[600],
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.xl,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[500],
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error[500],
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: SPACING.md,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[800],
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[600],
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  taskCompleted: {
    backgroundColor: Colors.neutral[50],
    borderColor: Colors.neutral[200],
  },
  taskLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: Colors.primary[600],
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  taskTitleCompleted: {
    color: Colors.neutral[400],
    textDecorationLine: 'line-through',
  },
  taskSubject: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
  },
  taskDueDate: {
    backgroundColor: Colors.neutral[100],
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.full,
  },
  taskDueDateText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[700],
  },
  notificationItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  notificationUnread: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[100],
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  notificationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginBottom: 8,
  },
  notificationTime: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[600],
    marginLeft: SPACING.sm,
    alignSelf: 'center',
  },
  statsContainer: {
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
  },
});