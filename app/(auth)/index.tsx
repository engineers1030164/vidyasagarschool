import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { BookOpen, BookOpenCheck, School } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Redirect to app if already signed in
    if (isSignedIn) {
      router.replace('/(app)/');
    }
  }, [isSignedIn, router]);

  return (
    <LinearGradient
      colors={[Colors.primary[700], Colors.primary[900]]}
      style={styles.container}
    >
      <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.logoContainer}>
        <School color={Colors.white} size={80} />
        <Text style={styles.appName}>Vidya Sagar School</Text>
        <Text style={styles.tagline}>Connecting students, teachers, and parents</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.featureCards}>
        <View style={styles.featureCard}>
          <BookOpen color={Colors.primary[600]} size={32} />
          <Text style={styles.featureTitle}>Learn</Text>
          <Text style={styles.featureDescription}>Access school resources and track progress</Text>
        </View>
        
        <View style={styles.featureCard}>
          <BookOpenCheck color={Colors.secondary[600]} size={32} />
          <Text style={styles.featureTitle}>Connect</Text>
          <Text style={styles.featureDescription}>Communicate with teachers and classmates</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(900).duration(800)} style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[globalStyles.buttonPrimary, styles.button]}
          onPress={() => router.push('/sign-in')}
        >
          <Text style={globalStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/sign-up')}
        >
          <Text style={styles.secondaryButtonText}>Create an Account</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.white,
    marginTop: SPACING.md,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[200],
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  featureCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.xl,
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  featureTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginTop: SPACING.sm,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginBottom: SPACING.xl,
  },
  button: {
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
  },
});