import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, CircleHelp as HelpCircle, Phone, Mail, MessageSquare, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const contactOptions = [
    {
      id: 'phone',
      title: 'Call Support',
      description: 'Speak with our support team',
      icon: Phone,
      action: () => Linking.openURL('tel:+1-555-123-4567'),
      value: '+1 (555) 123-4567',
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email',
      icon: Mail,
      action: () => Linking.openURL('mailto:support@schoolconnect.com'),
      value: 'support@schoolconnect.com',
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageSquare,
      action: () => Alert.alert('Live Chat', 'Live chat feature will be available soon!'),
      value: 'Available 9 AM - 5 PM',
    },
  ];

  const faqItems = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login screen and tap "Forgot Password". Enter your email address and follow the instructions sent to your email.',
    },
    {
      id: '2',
      question: 'How can I view my child\'s grades?',
      answer: 'Parents can view their child\'s grades by logging into their parent account and navigating to the "Academic Records" section. All current grades and progress reports are available there.',
    },
    {
      id: '3',
      question: 'How do I update my contact information?',
      answer: 'Go to your Profile tab, then tap "Personal Information". You can edit your contact details there and save the changes.',
    },
    {
      id: '4',
      question: 'Can I receive notifications for assignments?',
      answer: 'Yes! Go to Profile > Notification Settings to customize which notifications you want to receive, including assignment reminders and due dates.',
    },
    {
      id: '5',
      question: 'How do I track the school bus?',
      answer: 'Use the "Track" tab to see real-time bus locations. Select your bus route to see the current location and estimated arrival time.',
    },
    {
      id: '6',
      question: 'How can I communicate with teachers?',
      answer: 'Use the "Messages" tab to send direct messages to your teachers. You can also view announcements and participate in class discussions.',
    },
  ];

  const quickLinks = [
    {
      title: 'User Guide',
      description: 'Complete guide to using SchoolConnect',
      action: () => Alert.alert('User Guide', 'User guide will open in your browser.'),
    },
    {
      title: 'Privacy Policy',
      description: 'Learn about our privacy practices',
      action: () => Alert.alert('Privacy Policy', 'Privacy policy will open in your browser.'),
    },
    {
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      action: () => Alert.alert('Terms of Service', 'Terms of service will open in your browser.'),
    },
    {
      title: 'Report a Bug',
      description: 'Help us improve by reporting issues',
      action: () => router.push('/(app)/feedback'),
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
          
          <Text style={styles.headerTitle}>Help & Support</Text>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.welcomeCard}>
            <HelpCircle size={48} color={Colors.primary[600]} />
            <Text style={styles.welcomeTitle}>How can we help you?</Text>
            <Text style={styles.welcomeDescription}>
              Find answers to common questions or get in touch with our support team.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.contactCard}>
            <Text style={styles.sectionTitle}>Contact Support</Text>
            {contactOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.contactOption}
                  onPress={option.action}
                >
                  <View style={styles.contactIcon}>
                    <IconComponent size={24} color={Colors.primary[600]} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>{option.title}</Text>
                    <Text style={styles.contactDescription}>{option.description}</Text>
                    <Text style={styles.contactValue}>{option.value}</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[400]} />
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.faqCard}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {faqItems.map((item) => (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(item.id)}
                >
                  <Text style={styles.faqQuestionText}>{item.question}</Text>
                  <ChevronDown
                    size={20}
                    color={Colors.neutral[600]}
                    style={[
                      styles.faqChevron,
                      expandedFAQ === item.id && styles.faqChevronExpanded
                    ]}
                  />
                </TouchableOpacity>
                {expandedFAQ === item.id && (
                  <Animated.View entering={FadeInDown.duration(300)} style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </Animated.View>
                )}
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.quickLinksCard}>
            <Text style={styles.sectionTitle}>Quick Links</Text>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickLinkItem}
                onPress={link.action}
              >
                <View style={styles.quickLinkInfo}>
                  <Text style={styles.quickLinkTitle}>{link.title}</Text>
                  <Text style={styles.quickLinkDescription}>{link.description}</Text>
                </View>
                <ExternalLink size={20} color={Colors.neutral[400]} />
              </TouchableOpacity>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Emergency Contact</Text>
            <Text style={styles.emergencyDescription}>
              For urgent school-related emergencies, please contact the school directly:
            </Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => Linking.openURL('tel:+1-555-SCHOOL')}
            >
              <Phone size={20} color={Colors.white} />
              <Text style={styles.emergencyButtonText}>Call School Office</Text>
            </TouchableOpacity>
            <Text style={styles.emergencyHours}>Available 24/7 for emergencies</Text>
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
  welcomeCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  welcomeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[700],
    textAlign: 'center',
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.md,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  contactDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  contactValue: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[600],
  },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  faqQuestionText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    flex: 1,
    marginRight: SPACING.sm,
  },
  faqChevron: {
    transform: [{ rotate: '0deg' }],
  },
  faqChevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswer: {
    paddingBottom: SPACING.md,
    paddingRight: SPACING.lg,
  },
  faqAnswerText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  quickLinksCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  quickLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  quickLinkInfo: {
    flex: 1,
  },
  quickLinkTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  quickLinkDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
  },
  emergencyCard: {
    backgroundColor: Colors.error[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error[200],
  },
  emergencyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.error[800],
    marginBottom: SPACING.sm,
  },
  emergencyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.error[700],
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error[600],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  emergencyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
    marginLeft: SPACING.sm,
  },
  emergencyHours: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.error[600],
  },
});