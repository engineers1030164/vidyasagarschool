import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, BookOpen, Award, TrendingUp, Calendar, Download } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AcademicRecordsScreen() {
  const router = useRouter();
  const [selectedTerm, setSelectedTerm] = useState('current');

  const academicTerms = [
    { id: 'current', name: 'Current Term', year: '2024-25' },
    { id: 'term1', name: 'Term 1', year: '2024-25' },
    { id: 'term2', name: 'Term 2', year: '2023-24' },
    { id: 'term3', name: 'Term 3', year: '2023-24' },
  ];

  const subjects = [
    { name: 'Mathematics', grade: 'A-', percentage: 85, credits: 4 },
    { name: 'Science', grade: 'A', percentage: 92, credits: 4 },
    { name: 'English Literature', grade: 'B+', percentage: 78, credits: 3 },
    { name: 'History', grade: 'B+', percentage: 88, credits: 3 },
    { name: 'Art & Craft', grade: 'A', percentage: 95, credits: 2 },
    { name: 'Physical Education', grade: 'A', percentage: 90, credits: 2 },
  ];

  const achievements = [
    { title: 'Science Fair Winner', date: '2024-03-15', description: 'First place in school science fair' },
    { title: 'Math Olympiad', date: '2024-02-20', description: 'Regional level participation' },
    { title: 'Perfect Attendance', date: '2024-01-31', description: 'No absences in January 2024' },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return Colors.success[600];
    if (grade.startsWith('B')) return Colors.primary[600];
    if (grade.startsWith('C')) return Colors.warning[600];
    return Colors.error[600];
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
          
          <Text style={styles.headerTitle}>Academic Records</Text>
          
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={24} color={Colors.primary[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.termSelector}>
            <Text style={styles.sectionTitle}>Academic Term</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {academicTerms.map((term) => (
                <TouchableOpacity
                  key={term.id}
                  style={[
                    styles.termButton,
                    selectedTerm === term.id && styles.termButtonActive
                  ]}
                  onPress={() => setSelectedTerm(term.id)}
                >
                  <Text style={[
                    styles.termButtonText,
                    selectedTerm === term.id && styles.termButtonTextActive
                  ]}>
                    {term.name}
                  </Text>
                  <Text style={[
                    styles.termYear,
                    selectedTerm === term.id && styles.termYearActive
                  ]}>
                    {term.year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Term Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3.7</Text>
                <Text style={styles.statLabel}>GPA</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5/30</Text>
                <Text style={styles.statLabel}>Class Rank</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>87.6%</Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.subjectsCard}>
            <Text style={styles.sectionTitle}>Subject Grades</Text>
            {subjects.map((subject, index) => (
              <View key={index} style={styles.subjectItem}>
                <View style={styles.subjectInfo}>
                  <BookOpen size={20} color={Colors.neutral[600]} />
                  <View style={styles.subjectDetails}>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <Text style={styles.subjectCredits}>{subject.credits} Credits</Text>
                  </View>
                </View>
                
                <View style={styles.subjectGrades}>
                  <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(subject.grade) }]}>
                    <Text style={styles.gradeText}>{subject.grade}</Text>
                  </View>
                  <Text style={styles.percentageText}>{subject.percentage}%</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.achievementsCard}>
            <Text style={styles.sectionTitle}>Achievements & Awards</Text>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Award size={20} color={Colors.warning[600]} />
                </View>
                <View style={styles.achievementDetails}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <View style={styles.achievementDate}>
                    <Calendar size={14} color={Colors.neutral[500]} />
                    <Text style={styles.achievementDateText}>{achievement.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Academic Progress</Text>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <TrendingUp size={20} color={Colors.success[600]} />
                <Text style={styles.progressTitle}>Overall Improvement</Text>
              </View>
              <Text style={styles.progressDescription}>
                Your academic performance has improved by 12% compared to the previous term. 
                Keep up the excellent work!
              </Text>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <BookOpen size={20} color={Colors.primary[600]} />
                <Text style={styles.progressTitle}>Strengths</Text>
              </View>
              <Text style={styles.progressDescription}>
                Excellent performance in Science and Art. Strong analytical and creative skills.
              </Text>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <TrendingUp size={20} color={Colors.warning[600]} />
                <Text style={styles.progressTitle}>Areas for Improvement</Text>
              </View>
              <Text style={styles.progressDescription}>
                Focus on English Literature comprehension and writing skills.
              </Text>
            </View>
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
  downloadButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.md,
  },
  termSelector: {
    marginBottom: SPACING.lg,
  },
  termButton: {
    backgroundColor: Colors.neutral[100],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    alignItems: 'center',
    minWidth: 100,
  },
  termButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  termButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
  },
  termButtonTextActive: {
    color: Colors.white,
  },
  termYear: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  termYearActive: {
    color: Colors.white,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  summaryStats: {
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
  subjectsCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectDetails: {
    marginLeft: SPACING.sm,
  },
  subjectName: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  subjectCredits: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[600],
  },
  subjectGrades: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  gradeText: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.sm,
    color: Colors.white,
  },
  percentageText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
  },
  achievementsCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  achievementItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.warning[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginBottom: 4,
  },
  achievementDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementDateText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...globalStyles.shadow,
  },
  progressItem: {
    marginBottom: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  progressTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginLeft: SPACING.sm,
  },
  progressDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
});