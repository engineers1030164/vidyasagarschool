import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, Send, Users, CheckSquare, Square, Megaphone } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AudienceOption {
  id: string;
  label: string;
  description: string;
  count: number;
  selected: boolean;
}

export default function BroadcastMessageScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [audienceOptions, setAudienceOptions] = useState<AudienceOption[]>([
    {
      id: 'students',
      label: 'All Students',
      description: 'Send to all students in the school',
      count: 1250,
      selected: true,
    },
    {
      id: 'teachers',
      label: 'All Teachers',
      description: 'Send to all teaching staff',
      count: 85,
      selected: true,
    },
    {
      id: 'parents',
      label: 'All Parents',
      description: 'Send to all parent accounts',
      count: 980,
      selected: false,
    },
    {
      id: 'staff',
      label: 'Administrative Staff',
      description: 'Send to non-teaching staff',
      count: 45,
      selected: false,
    },
  ]);

  const toggleAudience = (id: string) => {
    setAudienceOptions(options =>
      options.map(option =>
        option.id === id ? { ...option, selected: !option.selected } : option
      )
    );
  };

  const getSelectedAudience = () => {
    return audienceOptions.filter(option => option.selected);
  };

  const getTotalRecipients = () => {
    return getSelectedAudience().reduce((total, option) => total + option.count, 0);
  };

  const handleSendBroadcast = async () => {
    const selectedAudience = getSelectedAudience();
    
    if (selectedAudience.length === 0) {
      Alert.alert('Error', 'Please select at least one audience group');
      return;
    }

    if (!messageTitle.trim() || !messageContent.trim()) {
      Alert.alert('Error', 'Please fill in both title and message content');
      return;
    }

    const totalRecipients = getTotalRecipients();
    
    Alert.alert(
      'Confirm Broadcast',
      `Are you sure you want to send this message to ${totalRecipients} recipients?\n\nAudience: ${selectedAudience.map(a => a.label).join(', ')}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Broadcast',
          style: 'default',
          onPress: async () => {
            setIsSending(true);
            
            try {
              // In a real app, this would send the broadcast via API
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              Alert.alert(
                'Broadcast Sent!',
                `Your message has been successfully sent to ${totalRecipients} recipients.`,
                [
                  {
                    text: 'Send Another',
                    onPress: () => {
                      setMessageTitle('');
                      setMessageContent('');
                    }
                  },
                  {
                    text: 'Done',
                    onPress: () => router.back()
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to send broadcast. Please try again.');
            } finally {
              setIsSending(false);
            }
          },
        },
      ]
    );
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
          
          <Text style={styles.headerTitle}>Broadcast Message</Text>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.infoCard}>
            <Megaphone size={48} color={Colors.error[600]} />
            <Text style={styles.infoTitle}>School-wide Broadcast</Text>
            <Text style={styles.infoDescription}>
              Send important announcements to multiple groups at once. Use this feature for urgent notifications, school-wide updates, or general announcements.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.audienceCard}>
            <Text style={styles.cardTitle}>Select Audience</Text>
            <Text style={styles.cardSubtitle}>Choose who should receive this message</Text>
            
            {audienceOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.audienceOption}
                onPress={() => toggleAudience(option.id)}
              >
                <View style={styles.audienceLeft}>
                  {option.selected ? (
                    <CheckSquare size={24} color={Colors.primary[600]} />
                  ) : (
                    <Square size={24} color={Colors.neutral[400]} />
                  )}
                  
                  <View style={styles.audienceInfo}>
                    <Text style={styles.audienceLabel}>{option.label}</Text>
                    <Text style={styles.audienceDescription}>{option.description}</Text>
                  </View>
                </View>
                
                <View style={styles.audienceCount}>
                  <Users size={16} color={Colors.neutral[600]} />
                  <Text style={styles.audienceCountText}>{option.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {getSelectedAudience().length > 0 && (
              <View style={styles.totalRecipients}>
                <Text style={styles.totalRecipientsText}>
                  Total Recipients: {getTotalRecipients().toLocaleString()}
                </Text>
              </View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.messageCard}>
            <Text style={styles.cardTitle}>Message Content</Text>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Message Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter broadcast title"
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
                placeholder="Type your broadcast message here..."
                value={messageContent}
                onChangeText={setMessageContent}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                placeholderTextColor={Colors.neutral[400]}
                maxLength={1000}
              />
              <Text style={styles.characterCount}>{messageContent.length}/1000</Text>
            </View>
          </Animated.View>

          {getSelectedAudience().length > 0 && messageTitle.trim() && messageContent.trim() && (
            <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.previewCard}>
              <Text style={styles.cardTitle}>Broadcast Preview</Text>
              <View style={styles.previewContent}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewFrom}>From: {user?.name} (Principal)</Text>
                  <Text style={styles.previewTo}>
                    To: {getSelectedAudience().map(a => a.label).join(', ')}
                  </Text>
                  <Text style={styles.previewRecipients}>
                    Recipients: {getTotalRecipients().toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.previewMessage}>
                  <Text style={styles.previewTitle}>{messageTitle}</Text>
                  <Text style={styles.previewText}>{messageContent}</Text>
                </View>
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.broadcastButton,
                (getSelectedAudience().length === 0 || !messageTitle.trim() || !messageContent.trim() || isSending) && styles.broadcastButtonDisabled
              ]}
              onPress={handleSendBroadcast}
              disabled={getSelectedAudience().length === 0 || !messageTitle.trim() || !messageContent.trim() || isSending}
            >
              <Send size={20} color={Colors.white} />
              <Text style={styles.broadcastButtonText}>
                {isSending ? 'Sending Broadcast...' : 'Send Broadcast'}
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
  audienceCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  messageCard: {
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
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginBottom: SPACING.md,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  audienceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audienceInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  audienceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  audienceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
  },
  audienceCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  audienceCountText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginLeft: 4,
  },
  totalRecipients: {
    backgroundColor: Colors.primary[50],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  totalRecipientsText: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.primary[700],
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
    minHeight: 150,
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
    marginBottom: 2,
  },
  previewRecipients: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[600],
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
  broadcastButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error[600],
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  broadcastButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  broadcastButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
    marginLeft: SPACING.sm,
  },
});