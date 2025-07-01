import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, Send, Users, ChevronDown, MessageSquare } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface TeacherClass {
  id: string;
  subject: string;
  className: string;
  section: string;
  studentCount: number;
}

export default function SendMessageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Mock teacher's classes
  const teacherClasses: TeacherClass[] = [
    { id: '1', subject: 'Mathematics', className: '4', section: 'D', studentCount: 28 },
    { id: '2', subject: 'Science', className: '5', section: 'A', studentCount: 32 },
    { id: '3', subject: 'Mathematics', className: '5', section: 'B', studentCount: 30 },
  ];

  // Pre-select class if coming from My Classes screen
  React.useEffect(() => {
    if (params.classId) {
      setSelectedClass(params.classId as string);
    }
  }, [params.classId]);

  const getSelectedClassInfo = () => {
    return teacherClasses.find(cls => cls.id === selectedClass);
  };

  const handleSendMessage = async () => {
    if (!selectedClass || !messageTitle.trim() || !messageContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields and select a class');
      return;
    }

    const classInfo = getSelectedClassInfo();
    if (!classInfo) {
      Alert.alert('Error', 'Selected class not found');
      return;
    }

    setIsSending(true);
    
    try {
      // In a real app, this would send the message via API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Message Sent!',
        `Your message has been sent to all ${classInfo.studentCount} students in Class ${classInfo.className}${classInfo.section}.`,
        [
          {
            text: 'Send Another',
            onPress: () => {
              setMessageTitle('');
              setMessageContent('');
              setSelectedClass('');
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
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
          
          <Text style={styles.headerTitle}>Send Message</Text>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.infoCard}>
            <MessageSquare size={48} color={Colors.primary[600]} />
            <Text style={styles.infoTitle}>Send Message to Class</Text>
            <Text style={styles.infoDescription}>
              Send announcements, homework reminders, or important updates to all students in a specific class.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.formCard}>
            <Text style={styles.cardTitle}>Message Details</Text>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Select Class *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowClassDropdown(!showClassDropdown)}
              >
                <Text style={[styles.dropdownText, !selectedClass && styles.placeholderText]}>
                  {selectedClass ? (() => {
                    const classInfo = getSelectedClassInfo();
                    return `${classInfo?.subject} - Class ${classInfo?.className}${classInfo?.section} (${classInfo?.studentCount} students)`;
                  })() : 'Select a class to send message'}
                </Text>
                <ChevronDown size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
              
              {showClassDropdown && (
                <View style={styles.dropdownMenu}>
                  {teacherClasses.map((cls) => (
                    <TouchableOpacity
                      key={cls.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedClass(cls.id);
                        setShowClassDropdown(false);
                      }}
                    >
                      <View style={styles.classDropdownItem}>
                        <Text style={styles.classDropdownTitle}>
                          {cls.subject} - Class {cls.className}{cls.section}
                        </Text>
                        <View style={styles.studentCountBadge}>
                          <Users size={14} color={Colors.neutral[600]} />
                          <Text style={styles.studentCountText}>{cls.studentCount}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Message Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter message title"
                value={messageTitle}
                onChangeText={setMessageTitle}
                placeholderTextColor={Colors.neutral[400]}
                maxLength={100}
              />
              <Text style={styles.characterCount}>{messageTitle.length}/100</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Message Content *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Type your message here..."
                value={messageContent}
                onChangeText={setMessageContent}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor={Colors.neutral[400]}
                maxLength={500}
              />
              <Text style={styles.characterCount}>{messageContent.length}/500</Text>
            </View>
          </Animated.View>

          {selectedClass && (
            <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.previewCard}>
              <Text style={styles.cardTitle}>Message Preview</Text>
              <View style={styles.previewContent}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewFrom}>From: {user?.name}</Text>
                  <Text style={styles.previewTo}>
                    To: Class {getSelectedClassInfo()?.className}{getSelectedClassInfo()?.section} Students
                  </Text>
                </View>
                
                <View style={styles.previewMessage}>
                  <Text style={styles.previewTitle}>
                    {messageTitle || 'Message Title'}
                  </Text>
                  <Text style={styles.previewText}>
                    {messageContent || 'Message content will appear here...'}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!selectedClass || !messageTitle.trim() || !messageContent.trim() || isSending) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!selectedClass || !messageTitle.trim() || !messageContent.trim() || isSending}
            >
              <Send size={20} color={Colors.white} />
              <Text style={styles.sendButtonText}>
                {isSending ? 'Sending Message...' : 'Send Message'}
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
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  infoDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[700],
    textAlign: 'center',
    lineHeight: 22,
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
    minHeight: 48,
  },
  dropdownText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    flex: 1,
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
  classDropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classDropdownTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    flex: 1,
  },
  studentCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  studentCountText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    backgroundColor: Colors.white,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    backgroundColor: Colors.white,
    minHeight: 120,
  },
  characterCount: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
    textAlign: 'right',
    marginTop: SPACING.xs,
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
    gap: SPACING.sm,
  },
  previewHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    paddingBottom: SPACING.sm,
  },
  previewFrom: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginBottom: 2,
  },
  previewTo: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
  },
  previewMessage: {
    paddingTop: SPACING.sm,
  },
  previewTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginBottom: SPACING.sm,
  },
  previewText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  actionButtons: {
    marginBottom: SPACING.xl,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  sendButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
    marginLeft: SPACING.sm,
  },
});