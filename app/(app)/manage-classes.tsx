import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, Plus, Save, ChevronDown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ClassData {
  id?: string;
  subject: string;
  className: string;
  section: string;
  academicYear: string;
}

export default function ManageClassesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ClassData>({
    subject: '',
    className: '',
    section: '',
    academicYear: '2024-25',
  });
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const subjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
    'Physics', 'Chemistry', 'Biology', 'History', 'Geography',
    'Computer Science', 'Physical Education', 'Art', 'Music'
  ];

  const handleSubmit = async () => {
    if (!formData.subject || !formData.className || !formData.section) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Class has been added successfully!',
        [
          {
            text: 'Add Another',
            onPress: () => {
              setFormData({
                subject: '',
                className: '',
                section: '',
                academicYear: '2024-25',
              });
            }
          },
          {
            text: 'View Classes',
            onPress: () => router.push('/(app)/my-classes')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          
          <Text style={styles.headerTitle}>Add New Class</Text>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.formCard}>
            <Text style={styles.cardTitle}>Class Information</Text>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Subject *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter subject name"
                  value={formData.subject}
                  onChangeText={(text) => setFormData({ ...formData, subject: text })}
                  placeholderTextColor={Colors.neutral[400]}
                />
              </View>
              <Text style={styles.fieldHint}>e.g., Mathematics, Science, English</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Class *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowClassDropdown(!showClassDropdown)}
              >
                <Text style={[styles.dropdownText, !formData.className && styles.placeholderText]}>
                  {formData.className ? `Class ${formData.className}` : 'Select class'}
                </Text>
                <ChevronDown size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
              
              {showClassDropdown && (
                <View style={styles.dropdownMenu}>
                  {classes.map((cls) => (
                    <TouchableOpacity
                      key={cls}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, className: cls });
                        setShowClassDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Class {cls}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Section *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowSectionDropdown(!showSectionDropdown)}
              >
                <Text style={[styles.dropdownText, !formData.section && styles.placeholderText]}>
                  {formData.section ? `Section ${formData.section}` : 'Select section'}
                </Text>
                <ChevronDown size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
              
              {showSectionDropdown && (
                <View style={styles.dropdownMenu}>
                  {sections.map((section) => (
                    <TouchableOpacity
                      key={section}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, section });
                        setShowSectionDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Section {section}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Academic Year</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Academic Year"
                  value={formData.academicYear}
                  onChangeText={(text) => setFormData({ ...formData, academicYear: text })}
                  placeholderTextColor={Colors.neutral[400]}
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.previewCard}>
            <Text style={styles.cardTitle}>Preview</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewText}>
                <Text style={styles.previewLabel}>Subject: </Text>
                {formData.subject || 'Not selected'}
              </Text>
              <Text style={styles.previewText}>
                <Text style={styles.previewLabel}>Class: </Text>
                {formData.className ? `Class ${formData.className}` : 'Not selected'}
              </Text>
              <Text style={styles.previewText}>
                <Text style={styles.previewLabel}>Section: </Text>
                {formData.section ? `Section ${formData.section}` : 'Not selected'}
              </Text>
              <Text style={styles.previewText}>
                <Text style={styles.previewLabel}>Academic Year: </Text>
                {formData.academicYear}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!formData.subject || !formData.className || !formData.section || isSubmitting) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!formData.subject || !formData.className || !formData.section || isSubmitting}
            >
              <Save size={20} color={Colors.white} />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding Class...' : 'Add Class'}
              </Text>
            </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.md,
  },
  formField: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.white,
  },
  input: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  fieldHint: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
    marginTop: SPACING.xs,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: Colors.white,
  },
  dropdownText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  placeholderText: {
    color: Colors.neutral[400],
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.white,
    marginTop: SPACING.xs,
    maxHeight: 200,
    ...globalStyles.shadow,
  },
  dropdownItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  dropdownItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  previewCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  previewContent: {
    gap: SPACING.xs,
  },
  previewText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
  },
  previewLabel: {
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[800],
  },
  actionButtons: {
    marginBottom: SPACING.xl,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  submitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
    marginLeft: SPACING.sm,
  },
});