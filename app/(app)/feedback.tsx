import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, MessageSquare, Star, Send, ThumbsUp, CircleAlert as AlertCircle, Lightbulb, Paperclip, Image as ImageIcon, FileText, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AttachedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  size: string;
  uri?: string;
}

export default function FeedbackScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'general', name: 'General Feedback', icon: MessageSquare, color: Colors.primary[600] },
    { id: 'suggestion', name: 'Suggestion', icon: Lightbulb, color: Colors.warning[600] },
    { id: 'compliment', name: 'Compliment', icon: ThumbsUp, color: Colors.success[600] },
    { id: 'issue', name: 'Report Issue', icon: AlertCircle, color: Colors.error[600] },
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!', 
        'Your feedback has been submitted successfully. We appreciate your input and will review it carefully.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setFeedback('');
              setRating(0);
              setAttachedFiles([]);
              handleBackPress();
            }
          }
        ]
      );
    }, 1500);
  };

  const handleImageUpload = () => {
    // Simulate image picker
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Simulate adding image from camera
            const newFile: AttachedFile = {
              id: Date.now().toString(),
              name: `camera_image_${Date.now()}.jpg`,
              type: 'image',
              size: '2.3 MB',
              uri: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=600'
            };
            setAttachedFiles([...attachedFiles, newFile]);
          }
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Simulate adding image from gallery
            const newFile: AttachedFile = {
              id: Date.now().toString(),
              name: `gallery_image_${Date.now()}.jpg`,
              type: 'image',
              size: '1.8 MB',
              uri: 'https://images.pexels.com/photos/3783525/pexels-photo-3783525.jpeg?auto=compress&cs=tinysrgb&w=600'
            };
            setAttachedFiles([...attachedFiles, newFile]);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePDFUpload = () => {
    // Simulate PDF picker
    Alert.alert(
      'Upload PDF',
      'Select a PDF document',
      [
        {
          text: 'Choose File',
          onPress: () => {
            // Simulate adding PDF
            const newFile: AttachedFile = {
              id: Date.now().toString(),
              name: `document_${Date.now()}.pdf`,
              type: 'pdf',
              size: '856 KB'
            };
            setAttachedFiles([...attachedFiles, newFile]);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(attachedFiles.filter(file => file.id !== fileId));
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={star <= rating ? Colors.warning[500] : Colors.neutral[300]}
              fill={star <= rating ? Colors.warning[500] : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderAttachedFile = (file: AttachedFile) => {
    return (
      <View key={file.id} style={styles.attachedFileItem}>
        <View style={styles.fileIconContainer}>
          {file.type === 'image' ? (
            <ImageIcon size={20} color={Colors.primary[600]} />
          ) : (
            <FileText size={20} color={Colors.error[600]} />
          )}
        </View>
        
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
          <Text style={styles.fileSize}>{file.size}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.removeFileButton}
          onPress={() => removeFile(file.id)}
        >
          <X size={16} color={Colors.neutral[500]} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <ArrowLeft size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Feedback & Suggestions</Text>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.introCard}>
            <MessageSquare size={48} color={Colors.primary[600]} />
            <Text style={styles.introTitle}>We Value Your Feedback</Text>
            <Text style={styles.introDescription}>
              Your thoughts and suggestions help us improve SchoolConnect. 
              Please share your experience, report issues, or suggest new features.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.categoryCard}>
            <Text style={styles.sectionTitle}>Feedback Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive,
                      { borderColor: category.color }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent 
                      size={24} 
                      color={selectedCategory === category.id ? Colors.white : category.color} 
                    />
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextActive,
                      { color: selectedCategory === category.id ? Colors.white : category.color }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.ratingCard}>
            <Text style={styles.sectionTitle}>Rate Your Experience</Text>
            <Text style={styles.ratingDescription}>
              How would you rate your overall experience with SchoolConnect?
            </Text>
            {renderStars()}
            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating === 1 && "We're sorry to hear that. Please tell us how we can improve."}
                {rating === 2 && "We appreciate your feedback. How can we do better?"}
                {rating === 3 && "Thank you for your feedback. What can we improve?"}
                {rating === 4 && "Great! We're glad you're enjoying the app. Any suggestions?"}
                {rating === 5 && "Excellent! We're thrilled you love SchoolConnect!"}
              </Text>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.feedbackCard}>
            <Text style={styles.sectionTitle}>Your Feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..."
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={Colors.neutral[400]}
            />
            
            <View style={styles.inputFooter}>
              <Text style={styles.characterCount}>
                {feedback.length}/500 characters
              </Text>
            </View>

            <View style={styles.attachmentSection}>
              <Text style={styles.attachmentTitle}>Attachments (Optional)</Text>
              
              <View style={styles.uploadButtons}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleImageUpload}
                >
                  <ImageIcon size={20} color={Colors.primary[600]} />
                  <Text style={styles.uploadButtonText}>Upload Image</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handlePDFUpload}
                >
                  <FileText size={20} color={Colors.error[600]} />
                  <Text style={styles.uploadButtonText}>Upload PDF</Text>
                </TouchableOpacity>
              </View>

              {attachedFiles.length > 0 && (
                <View style={styles.attachedFilesContainer}>
                  <Text style={styles.attachedFilesTitle}>Attached Files:</Text>
                  {attachedFiles.map(renderAttachedFile)}
                </View>
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.submitSection}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!feedback.trim() || isSubmitting) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!feedback.trim() || isSubmitting}
            >
              <Send size={20} color={Colors.white} />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.privacyNote}>
              Your feedback is anonymous and will be used to improve our services.
            </Text>
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
  introCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  introTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  introDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[700],
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryCard: {
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    backgroundColor: Colors.white,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  ratingCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  ratingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  starButton: {
    padding: SPACING.xs,
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[600],
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  feedbackCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...globalStyles.shadow,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    minHeight: 120,
    maxLength: 500,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  characterCount: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
  },
  attachmentSection: {
    marginTop: SPACING.md,
  },
  attachmentTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.sm,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flex: 1,
    marginHorizontal: SPACING.xs,
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginLeft: SPACING.xs,
  },
  attachedFilesContainer: {
    marginTop: SPACING.sm,
  },
  attachedFilesTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginBottom: SPACING.sm,
  },
  attachedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  fileSize: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[600],
  },
  removeFileButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
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
  privacyNote: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});