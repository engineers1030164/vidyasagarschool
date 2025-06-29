import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(app)/');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login information
  const loginWithDemo = async (userType: 'student' | 'teacher' | 'admin') => {
    setIsLoading(true);
    try {
      const demoCredentials = {
        student: { email: 'student@example.com', password: 'password' },
        teacher: { email: 'teacher@example.com', password: 'password' },
        admin: { email: 'admin@example.com', password: 'password' },
      };
      
      const credentials = demoCredentials[userType];
      await signIn(credentials.email, credentials.password);
      router.replace('/(app)/');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with demo account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={Colors.neutral[700]} size={24} />
        </TouchableOpacity>
        
        <Animated.View entering={FadeInDown.duration(500)} style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to SchoolConnect</Text>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Mail size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={Colors.neutral[400]}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.neutral[500]} />
              ) : (
                <Eye size={20} color={Colors.neutral[500]} />
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Reset Password', 'Password reset functionality will be implemented in the next version.')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[globalStyles.buttonPrimary, styles.signInButton, isLoading && styles.disabledButton]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={globalStyles.buttonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo Accounts</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: Colors.primary[100] }]}
              onPress={() => loginWithDemo('student')}
              disabled={isLoading}
            >
              <Text style={[styles.demoButtonText, { color: Colors.primary[700] }]}>Student</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: Colors.secondary[100] }]}
              onPress={() => loginWithDemo('teacher')}
              disabled={isLoading}
            >
              <Text style={[styles.demoButtonText, { color: Colors.secondary[700] }]}>Teacher</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: Colors.accent[100] }]}
              onPress={() => loginWithDemo('admin')}
              disabled={isLoading}
            >
              <Text style={[styles.demoButtonText, { color: Colors.accent[700] }]}>Admin</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.md,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  headerContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.neutral[900],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[600],
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    height: 56,
    backgroundColor: Colors.neutral[50],
  },
  inputIcon: {
    marginLeft: SPACING.md,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    paddingHorizontal: SPACING.md,
    color: Colors.neutral[900],
  },
  passwordToggle: {
    padding: SPACING.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[600],
  },
  signInButton: {
    marginTop: SPACING.md,
    height: 56,
  },
  disabledButton: {
    backgroundColor: Colors.neutral[400],
  },
  demoSection: {
    marginBottom: SPACING.xl,
  },
  demoTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[700],
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  demoButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: SPACING.md,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[600],
  },
  signUpLink: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.primary[600],
  },
});