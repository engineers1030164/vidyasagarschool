import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, UserCheck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  
  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // In a real app, this would call an API to create the account
    Alert.alert(
      'Sign Up Successful', 
      'Your account will be created in a production version. For now, please use the demo accounts to sign in.',
      [
        { 
          text: 'OK', 
          onPress: () => router.push('/sign-in') 
        }
      ]
    );
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started with SchoolConnect</Text>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.roleSelector}>
          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'student' && styles.roleButtonActive
              ]}
              onPress={() => setRole('student')}
            >
              <User 
                size={24} 
                color={role === 'student' ? Colors.white : Colors.primary[600]} 
              />
              <Text 
                style={[
                  styles.roleButtonText,
                  role === 'student' && styles.roleButtonTextActive
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'teacher' && styles.roleButtonActive
              ]}
              onPress={() => setRole('teacher')}
            >
              <UserCheck 
                size={24} 
                color={role === 'teacher' ? Colors.white : Colors.primary[600]} 
              />
              <Text 
                style={[
                  styles.roleButtonText,
                  role === 'teacher' && styles.roleButtonTextActive
                ]}
              >
                Teacher
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <User size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
          
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
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
          
          <TouchableOpacity
            style={[globalStyles.buttonPrimary, styles.signUpButton]}
            onPress={handleSignUp}
          >
            <Text style={globalStyles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/sign-in')}>
            <Text style={styles.signInLink}>Sign In</Text>
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
  roleSelector: {
    marginBottom: SPACING.xl,
  },
  roleLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[600],
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    flex: 1,
  },
  roleButtonActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  roleButtonText: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary[600],
    marginLeft: SPACING.sm,
  },
  roleButtonTextActive: {
    color: Colors.white,
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
  signUpButton: {
    marginTop: SPACING.md,
    height: 56,
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
  signInLink: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.primary[600],
  },
});