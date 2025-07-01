import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, Plus, CreditCard as Edit3, Trash2, Users, MessageSquare, BookOpen } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface TeacherClass {
  id: string;
  subject: string;
  className: string;
  section: string;
  academicYear: string;
  studentCount: number;
  createdAt: string;
}

export default function MyClassesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Mock data for teacher's classes
  const [classes, setClasses] = useState<TeacherClass[]>([
    {
      id: '1',
      subject: 'Mathematics',
      className: '4',
      section: 'D',
      academicYear: '2024-25',
      studentCount: 28,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      subject: 'Science',
      className: '5',
      section: 'A',
      academicYear: '2024-25',
      studentCount: 32,
      createdAt: '2024-01-15',
    },
    {
      id: '3',
      subject: 'Mathematics',
      className: '5',
      section: 'B',
      academicYear: '2024-25',
      studentCount: 30,
      createdAt: '2024-01-20',
    },
  ]);

  const handleDeleteClass = (classId: string, className: string, subject: string) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete ${subject} for Class ${className}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setClasses(classes.filter(cls => cls.id !== classId));
            Alert.alert('Success', 'Class deleted successfully');
          },
        },
      ]
    );
  };

  const handleSendMessage = (classData: TeacherClass) => {
    router.push({
      pathname: '/(app)/send-message',
      params: {
        classId: classData.id,
        className: classData.className,
        section: classData.section,
        subject: classData.subject,
      },
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': Colors.primary[600],
      'Science': Colors.secondary[600],
      'English': Colors.accent[600],
      'Hindi': Colors.warning[600],
      'Social Studies': Colors.success[600],
    };
    return colors[subject as keyof typeof colors] || Colors.neutral[600];
  };

  const getSubjectBgColor = (subject: string) => {
    const colors = {
      'Mathematics': Colors.primary[100],
      'Science': Colors.secondary[100],
      'English': Colors.accent[100],
      'Hindi': Colors.warning[100],
      'Social Studies': Colors.success[100],
    };
    return colors[subject as keyof typeof colors] || Colors.neutral[100];
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>My Classes</Text>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(app)/manage-classes')}
          >
            <Plus size={24} color={Colors.primary[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.statsCard}>
            <Text style={styles.statsTitle}>Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{classes.length}</Text>
                <Text style={styles.statLabel}>Total Classes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
                </Text>
                <Text style={styles.statLabel}>Total Students</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {new Set(classes.map(cls => cls.subject)).size}
                </Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Text style={styles.sectionTitle}>Classes ({classes.length})</Text>
            
            {classes.length === 0 ? (
              <View style={styles.emptyState}>
                <BookOpen size={64} color={Colors.neutral[300]} />
                <Text style={styles.emptyStateTitle}>No Classes Added</Text>
                <Text style={styles.emptyStateDescription}>
                  Start by adding your first class to manage students and send messages.
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/(app)/manage-classes')}
                >
                  <Plus size={20} color={Colors.white} />
                  <Text style={styles.emptyStateButtonText}>Add First Class</Text>
                </TouchableOpacity>
              </View>
            ) : (
              classes.map((classData, index) => (
                <Animated.View 
                  key={classData.id}
                  entering={FadeInDown.duration(500).delay(300 + index * 100)}
                  style={styles.classCard}
                >
                  <View style={styles.classHeader}>
                    <View style={[
                      styles.subjectBadge, 
                      { backgroundColor: getSubjectBgColor(classData.subject) }
                    ]}>
                      <Text style={[
                        styles.subjectText,
                        { color: getSubjectColor(classData.subject) }
                      ]}>
                        {classData.subject}
                      </Text>
                    </View>
                    
                    <View style={styles.classActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleSendMessage(classData)}
                      >
                        <MessageSquare size={18} color={Colors.primary[600]} />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {
                          // Navigate to edit class
                          Alert.alert('Edit Class', 'Edit functionality will be implemented');
                        }}
                      >
                        <Edit3 size={18} color={Colors.warning[600]} />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteClass(
                          classData.id, 
                          `${classData.className}${classData.section}`, 
                          classData.subject
                        )}
                      >
                        <Trash2 size={18} color={Colors.error[600]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.classInfo}>
                    <Text style={styles.classTitle}>
                      Class {classData.className}{classData.section}
                    </Text>
                    <Text style={styles.academicYear}>
                      Academic Year: {classData.academicYear}
                    </Text>
                  </View>
                  
                  <View style={styles.classFooter}>
                    <View style={styles.studentCount}>
                      <Users size={16} color={Colors.neutral[600]} />
                      <Text style={styles.studentCountText}>
                        {classData.studentCount} students
                      </Text>
                    </View>
                    
                    <Text style={styles.createdDate}>
                      Added on {new Date(classData.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </Animated.View>
              ))
            )}
          </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...globalStyles.shadow,
  },
  statsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
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
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral[300],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[700],
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
    marginLeft: SPACING.sm,
  },
  classCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    ...globalStyles.shadow,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  subjectBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  subjectText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
  },
  classActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  classInfo: {
    marginBottom: SPACING.sm,
  },
  classTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  academicYear: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentCountText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginLeft: SPACING.xs,
  },
  createdDate: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
  },
});