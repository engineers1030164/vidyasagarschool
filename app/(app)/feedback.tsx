import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, MessageSquare, Star, Send, ThumbsUp, CircleAlert as AlertCircle, Lightbulb } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function FeedbackScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'general', name: 'General Feedback', icon: MessageSquare, color: Colors.primary[600] },
    { id: 'suggestion', name: 'Suggestion', icon: Lightbulb, color: Colors.warning[600] },
    { id: 'compliment', name: 'Compliment', icon: ThumbsUp, color: Colors.success[600] },
    { id: 'issue', name: 'Report Issue', icon: AlertCircle, color: Colors.error[600] },
  ];

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
              router.back();
            }
          }
        ]
      );
    }, 1500);
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
  },
  characterCount: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
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