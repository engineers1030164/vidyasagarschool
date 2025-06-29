import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit3, Save, Camera } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Anytown, ST 12345',
    dateOfBirth: '2010-05-15',
    emergencyContact: '+1 (555) 987-6543',
    parentName: 'John Doe',
    parentEmail: 'john.doe@email.com',
  });

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    Alert.alert('Success', 'Personal information updated successfully!');
    setIsEditing(false);
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const InfoField = ({ 
    label, 
    value, 
    onChangeText, 
    icon, 
    editable = true,
    keyboardType = 'default' 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    icon: React.ReactNode;
    editable?: boolean;
    keyboardType?: any;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldIcon}>{icon}</View>
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {isEditing && editable ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

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
          
          <Text style={styles.headerTitle}>Personal Information</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? (
              <Save size={24} color={Colors.primary[600]} />
            ) : (
              <Edit3 size={24} color={Colors.primary[600]} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar }} 
                style={styles.avatar}
              />
              {isEditing && (
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={handleImagePicker}
                >
                  <Camera size={16} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.userBasicInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userRole}>
                {user?.role === 'student' ? `Student - Grade ${user?.class}${user?.section}` : user?.role}
              </Text>
              {user?.studentId && (
                <View style={styles.idBadge}>
                  <Text style={styles.idText}>ID: {user.studentId}</Text>
                </View>
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <InfoField
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              icon={<User size={20} color={Colors.primary[600]} />}
            />
            
            <InfoField
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              icon={<Mail size={20} color={Colors.primary[600]} />}
              keyboardType="email-address"
            />
            
            <InfoField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              icon={<Phone size={20} color={Colors.primary[600]} />}
              keyboardType="phone-pad"
            />
            
            <InfoField
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              icon={<Calendar size={20} color={Colors.primary[600]} />}
            />
            
            <InfoField
              label="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              icon={<MapPin size={20} color={Colors.primary[600]} />}
            />
          </Animated.View>

          {user?.role === 'student' && (
            <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              
              <InfoField
                label="Parent/Guardian Name"
                value={formData.parentName}
                onChangeText={(text) => setFormData({ ...formData, parentName: text })}
                icon={<User size={20} color={Colors.secondary[600]} />}
              />
              
              <InfoField
                label="Parent/Guardian Email"
                value={formData.parentEmail}
                onChangeText={(text) => setFormData({ ...formData, parentEmail: text })}
                icon={<Mail size={20} color={Colors.secondary[600]} />}
                keyboardType="email-address"
              />
              
              <InfoField
                label="Emergency Phone"
                value={formData.emergencyContact}
                onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
                icon={<Phone size={20} color={Colors.secondary[600]} />}
                keyboardType="phone-pad"
              />
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <InfoField
              label="Student ID"
              value={user?.studentId || 'N/A'}
              onChangeText={() => {}}
              icon={<User size={20} color={Colors.accent[600]} />}
              editable={false}
            />
            
            <InfoField
              label="Class & Section"
              value={user?.role === 'student' ? `Grade ${user?.class}${user?.section}` : 'N/A'}
              onChangeText={() => {}}
              icon={<User size={20} color={Colors.accent[600]} />}
              editable={false}
            />
          </Animated.View>

          {isEditing && (
            <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
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
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...globalStyles.shadow,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary[100],
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary[600],
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userBasicInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  userRole: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  idText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.xs,
    color: Colors.primary[700],
  },
  section: {
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
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  fieldIcon: {
    marginRight: SPACING.sm,
  },
  fieldLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
  },
  fieldValue: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
  },
  fieldInput: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary[300],
    borderRadius: BORDER_RADIUS.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    backgroundColor: Colors.neutral[100],
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[700],
  },
  saveButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    marginLeft: SPACING.sm,
    backgroundColor: Colors.primary[600],
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
  },
});