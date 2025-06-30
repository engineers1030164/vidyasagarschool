import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ChevronDown, BookOpen, CircleCheck as CheckCircle2, Activity, FileText, HeartPulse, Brain, Calendar, Plus, Eye, Clock, AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type ReportType = 'academic' | 'attendance' | 'health';

interface LeaveApplication {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export default function ReportsScreen() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('academic');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showAppliedLeaves, setShowAppliedLeaves] = useState(false);
  
  const screenWidth = Dimensions.get('window').width - (SPACING.md * 2);
  
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'academic':
        return <AcademicReport screenWidth={screenWidth} />;
      case 'attendance':
        return <AttendanceReport screenWidth={screenWidth} showLeaveForm={showLeaveForm} setShowLeaveForm={setShowLeaveForm} showAppliedLeaves={showAppliedLeaves} setShowAppliedLeaves={setShowAppliedLeaves} />;
      case 'health':
        return <HealthReport screenWidth={screenWidth} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports</Text>
          
          <View style={styles.reportTypeSelector}>
            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                selectedReport === 'academic' && styles.selectedReportTypeButton
              ]}
              onPress={() => setSelectedReport('academic')}
            >
              <BookOpen 
                size={16} 
                color={selectedReport === 'academic' ? Colors.white : Colors.neutral[700]} 
              />
              <Text
                style={[
                  styles.reportTypeText,
                  selectedReport === 'academic' && styles.selectedReportTypeText
                ]}
              >
                Academic
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                selectedReport === 'attendance' && styles.selectedReportTypeButton
              ]}
              onPress={() => setSelectedReport('attendance')}
            >
              <CheckCircle2 
                size={16} 
                color={selectedReport === 'attendance' ? Colors.white : Colors.neutral[700]} 
              />
              <Text
                style={[
                  styles.reportTypeText,
                  selectedReport === 'attendance' && styles.selectedReportTypeText
                ]}
              >
                Attendance
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                selectedReport === 'health' && styles.selectedReportTypeButton
              ]}
              onPress={() => setSelectedReport('health')}
            >
              <HeartPulse 
                size={16} 
                color={selectedReport === 'health' ? Colors.white : Colors.neutral[700]} 
              />
              <Text
                style={[
                  styles.reportTypeText,
                  selectedReport === 'health' && styles.selectedReportTypeText
                ]}
              >
                Health
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.reportContainer}
          >
            {renderReportContent()}
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function LeaveApplicationForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (leave: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => void }) {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);

  const leaveTypes = [
    'Sick Leave',
    'Personal Leave',
    'Family Emergency',
    'Medical Appointment',
    'Religious Holiday',
    'Other'
  ];

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    onSubmit({
      leaveType,
      startDate,
      endDate,
      message: message.trim()
    });

    // Reset form
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setMessage('');
    onClose();
  };

  return (
    <View style={styles.leaveFormContainer}>
      <View style={styles.leaveFormHeader}>
        <Text style={styles.leaveFormTitle}>Apply for Leave</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Leave Type *</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}
        >
          <Text style={[styles.dropdownText, !leaveType && styles.placeholderText]}>
            {leaveType || 'Select leave type'}
          </Text>
          <ChevronDown size={20} color={Colors.neutral[600]} />
        </TouchableOpacity>
        
        {showLeaveTypeDropdown && (
          <View style={styles.dropdownMenu}>
            {leaveTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setLeaveType(type);
                  setShowLeaveTypeDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Start Date *</Text>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
          placeholderTextColor={Colors.neutral[400]}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>End Date *</Text>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
          placeholderTextColor={Colors.neutral[400]}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Message *</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Please provide reason for leave..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          placeholderTextColor={Colors.neutral[400]}
        />
        <Text style={styles.characterCount}>{message.length}/500</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.applyButton,
          (!leaveType || !startDate || !endDate || !message.trim()) && styles.applyButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!leaveType || !startDate || !endDate || !message.trim()}
      >
        <Text style={styles.applyButtonText}>Apply Leave</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppliedLeavesList({ leaves, onClose }: { leaves: LeaveApplication[]; onClose: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return Colors.success[500];
      case 'rejected':
        return Colors.error[500];
      case 'pending':
        return Colors.warning[500];
      default:
        return Colors.neutral[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={16} color={Colors.success[500]} />;
      case 'rejected':
        return <AlertCircle size={16} color={Colors.error[500]} />;
      case 'pending':
        return <Clock size={16} color={Colors.warning[500]} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.appliedLeavesContainer}>
      <View style={styles.appliedLeavesHeader}>
        <Text style={styles.appliedLeavesTitle}>Applied Leaves</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.leavesList}>
        {leaves.length === 0 ? (
          <View style={styles.noLeavesContainer}>
            <Text style={styles.noLeavesText}>No leave applications found</Text>
          </View>
        ) : (
          leaves.map((leave) => (
            <View key={leave.id} style={styles.leaveItem}>
              <View style={styles.leaveItemHeader}>
                <Text style={styles.leaveItemType}>{leave.leaveType}</Text>
                <View style={styles.leaveItemStatus}>
                  {getStatusIcon(leave.status)}
                  <Text style={[styles.leaveItemStatusText, { color: getStatusColor(leave.status) }]}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.leaveItemDates}>
                <Calendar size={14} color={Colors.neutral[500]} />
                <Text style={styles.leaveItemDatesText}>
                  {leave.startDate} to {leave.endDate}
                </Text>
              </View>
              
              <Text style={styles.leaveItemMessage} numberOfLines={2}>
                {leave.message}
              </Text>
              
              <Text style={styles.leaveItemAppliedDate}>
                Applied on: {leave.appliedDate}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function AttendanceReport({ screenWidth, showLeaveForm, setShowLeaveForm, showAppliedLeaves, setShowAppliedLeaves }: { 
  screenWidth: number; 
  showLeaveForm: boolean; 
  setShowLeaveForm: (show: boolean) => void;
  showAppliedLeaves: boolean;
  setShowAppliedLeaves: (show: boolean) => void;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState('Current Term');
  const [appliedLeaves, setAppliedLeaves] = useState<LeaveApplication[]>([
    {
      id: '1',
      leaveType: 'Sick Leave',
      startDate: '2025-01-20',
      endDate: '2025-01-22',
      message: 'I am suffering from fever and need rest for recovery.',
      status: 'approved',
      appliedDate: '2025-01-18'
    },
    {
      id: '2',
      leaveType: 'Family Emergency',
      startDate: '2025-01-25',
      endDate: '2025-01-25',
      message: 'Family emergency requires immediate attention.',
      status: 'pending',
      appliedDate: '2025-01-24'
    }
  ]);
  
  // Attendance data for the chart
  const attendanceData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [
      {
        data: [100, 95, 98, 92, 97, 100],
        color: () => Colors.primary[600],
        strokeWidth: 2,
      },
    ],
  };
  
  // Detailed attendance records
  const attendanceRecords = [
    { id: '1', date: 'Jan 15, 2025', status: 'present', note: '' },
    { id: '2', date: 'Jan 14, 2025', status: 'present', note: '' },
    { id: '3', date: 'Jan 13, 2025', status: 'present', note: '' },
    { id: '4', date: 'Jan 12, 2025', status: 'absent', note: 'Medical appointment' },
    { id: '5', date: 'Jan 11, 2025', status: 'present', note: '' },
    { id: '6', date: 'Jan 10, 2025', status: 'late', note: 'Bus delay - 15 min' },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return Colors.success[500];
      case 'absent':
        return Colors.error[500];
      case 'late':
        return Colors.warning[500];
      default:
        return Colors.neutral[500];
    }
  };
  
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const handleLeaveSubmit = (leave: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveApplication = {
      ...leave,
      id: Date.now().toString(),
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    
    setAppliedLeaves([newLeave, ...appliedLeaves]);
    Alert.alert('Success', 'Leave application submitted successfully!');
  };

  if (showLeaveForm) {
    return (
      <LeaveApplicationForm
        onClose={() => setShowLeaveForm(false)}
        onSubmit={handleLeaveSubmit}
      />
    );
  }

  if (showAppliedLeaves) {
    return (
      <AppliedLeavesList
        leaves={appliedLeaves}
        onClose={() => setShowAppliedLeaves(false)}
      />
    );
  }

  return (
    <View style={styles.reportContent}>
      <View style={styles.periodSelector}>
        <Text style={styles.periodLabel}>Period:</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodButtonText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color={Colors.neutral[700]} />
        </TouchableOpacity>
      </View>

      <View style={styles.leaveActionsContainer}>
        <TouchableOpacity
          style={styles.leaveActionButton}
          onPress={() => setShowLeaveForm(true)}
        >
          <Plus size={20} color={Colors.white} />
          <Text style={styles.leaveActionButtonText}>Apply Leave</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.leaveActionButton, styles.viewLeavesButton]}
          onPress={() => setShowAppliedLeaves(true)}
        >
          <Eye size={20} color={Colors.primary[600]} />
          <Text style={[styles.leaveActionButtonText, styles.viewLeavesButtonText]}>View Applied</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Attendance Rate (%)</Text>
        <LineChart
          data={attendanceData}
          width={screenWidth - (SPACING.md * 2)}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
          yAxisSuffix="%"
        />
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Attendance Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Present</Text>
            <Text style={styles.summaryValue}>96%</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Absent</Text>
            <Text style={styles.summaryValue}>2%</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Late</Text>
            <Text style={styles.summaryValue}>2%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.recordsContainer}>
        <Text style={styles.sectionTitle}>Recent Attendance</Text>
        
        {attendanceRecords.map((record) => (
          <View key={record.id} style={styles.recordItem}>
            <View style={styles.recordLeft}>
              <Text style={styles.recordDate}>{record.date}</Text>
              {record.note !== '' && (
                <Text style={styles.recordNote}>{record.note}</Text>
              )}
            </View>
            
            <View 
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(record.status) }
              ]}
            >
              <Text style={styles.statusText}>{getStatusText(record.status)}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.downloadButton}>
        <FileText size={16} color={Colors.white} />
        <Text style={styles.downloadButtonText}>Download Full Report</Text>
      </TouchableOpacity>
    </View>
  );
}

function AcademicReport({ screenWidth }: { screenWidth: number }) {
  const [selectedPeriod, setSelectedPeriod] = useState('Current Term');
  
  // Academic performance data
  const performanceData = {
    labels: ['Math', 'Science', 'English', 'History', 'Art'],
    datasets: [
      {
        data: [85, 92, 78, 88, 95],
        color: () => Colors.primary[600],
        strokeWidth: 2,
      },
      {
        data: [80, 85, 75, 82, 90],
        color: () => Colors.neutral[400],
        strokeWidth: 2,
      },
    ],
    legend: ['Current', 'Previous'],
  };
  
  // Subject grades data
  const subjectsData = [
    { id: '1', subject: 'Mathematics', grade: 'A-', percentage: 85, trend: 'up' },
    { id: '2', subject: 'Science', grade: 'A', percentage: 92, trend: 'up' },
    { id: '3', subject: 'English', grade: 'B+', percentage: 78, trend: 'down' },
    { id: '4', subject: 'History', grade: 'B+', percentage: 88, trend: 'stable' },
    { id: '5', subject: 'Art', grade: 'A', percentage: 95, trend: 'up' },
  ];
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <Activity size={16} color={Colors.success[500]} />;
      case 'down':
        return <Activity size={16} color={Colors.error[500]} style={{ transform: [{ rotate: '180deg' }] }} />;
      case 'stable':
        return <Activity size={16} color={Colors.neutral[500]} style={{ transform: [{ rotate: '90deg' }] }} />;
      default:
        return null;
    }
  };
  
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return Colors.success[600];
    if (grade.startsWith('B')) return Colors.primary[600];
    if (grade.startsWith('C')) return Colors.warning[600];
    return Colors.error[600];
  };
  
  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <View style={styles.reportContent}>
      <View style={styles.periodSelector}>
        <Text style={styles.periodLabel}>Period:</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodButtonText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color={Colors.neutral[700]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Performance Overview</Text>
        <LineChart
          data={performanceData}
          width={screenWidth - (SPACING.md * 2)}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
          yAxisSuffix="%"
        />
      </View>
      
      <View style={styles.subjectsContainer}>
        <Text style={styles.sectionTitle}>Subject Grades</Text>
        
        {subjectsData.map((item) => (
          <View key={item.id} style={styles.subjectItem}>
            <View style={styles.subjectLeft}>
              <Brain size={20} color={Colors.neutral[600]} />
              <Text style={styles.subjectName}>{item.subject}</Text>
            </View>
            
            <View style={styles.subjectRight}>
              <Text 
                style={[
                  styles.subjectGrade,
                  { color: getGradeColor(item.grade) }
                ]}
              >
                {item.grade}
              </Text>
              <Text style={styles.subjectPercentage}>{item.percentage}%</Text>
              {getTrendIcon(item.trend)}
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Term Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>GPA</Text>
            <Text style={styles.summaryValue}>3.7</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rank</Text>
            <Text style={styles.summaryValue}>5/30</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg. Score</Text>
            <Text style={styles.summaryValue}>87.6%</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.downloadButton}>
        <FileText size={16} color={Colors.white} />
        <Text style={styles.downloadButtonText}>Download Full Report</Text>
      </TouchableOpacity>
    </View>
  );
}

function HealthReport({ screenWidth }: { screenWidth: number }) {
  // Health metrics data
  const bmiData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [
      {
        data: [19.2, 19.3, 19.5, 19.8, 20.1, 20.2],
        color: () => Colors.secondary[600],
        strokeWidth: 2,
      },
    ],
  };
  
  // Health records
  const healthRecords = [
    { 
      id: '1', 
      type: 'Medical Checkup', 
      date: 'Jan 5, 2025', 
      notes: 'Annual health checkup - All normal, no concerns', 
    },
    { 
      id: '2', 
      type: 'Vaccination', 
      date: 'Dec 10, 2024', 
      notes: 'Flu vaccination administered', 
    },
    { 
      id: '3', 
      type: 'Physical Fitness', 
      date: 'Nov 15, 2024', 
      notes: 'School fitness test - Above average in running and flexibility', 
    },
  ];
  
  const healthMetrics = {
    height: '5\'7"',
    weight: '130 lbs',
    bmi: '20.2',
    bloodType: 'O+',
    allergies: 'None',
    medications: 'None',
  };
  
  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
  };

  return (
    <View style={styles.reportContent}>
      <View style={styles.healthMetricsContainer}>
        <Text style={styles.sectionTitle}>Health Metrics</Text>
        <View style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Height</Text>
              <Text style={styles.metricValue}>{healthMetrics.height}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Weight</Text>
              <Text style={styles.metricValue}>{healthMetrics.weight}</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>BMI</Text>
              <Text style={styles.metricValue}>{healthMetrics.bmi}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Blood Type</Text>
              <Text style={styles.metricValue}>{healthMetrics.bloodType}</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Allergies</Text>
              <Text style={styles.metricValue}>{healthMetrics.allergies}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Medications</Text>
              <Text style={styles.metricValue}>{healthMetrics.medications}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>BMI Tracking</Text>
        <LineChart
          data={bmiData}
          width={screenWidth - (SPACING.md * 2)}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      
      <View style={styles.healthRecordsContainer}>
        <Text style={styles.sectionTitle}>Health Records</Text>
        
        {healthRecords.map((record) => (
          <View key={record.id} style={styles.healthRecordItem}>
            <View style={styles.healthRecordHeader}>
              <View style={styles.healthRecordType}>
                <HeartPulse size={16} color={Colors.secondary[600]} />
                <Text style={styles.healthRecordTypeText}>{record.type}</Text>
              </View>
              <Text style={styles.healthRecordDate}>{record.date}</Text>
            </View>
            
            <Text style={styles.healthRecordNotes}>{record.notes}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={[styles.downloadButton, { backgroundColor: Colors.secondary[600] }]}>
        <FileText size={16} color={Colors.white} />
        <Text style={styles.downloadButtonText}>Download Medical Report</Text>
      </TouchableOpacity>
    </View>
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.xl,
    color: Colors.neutral[900],
    marginBottom: SPACING.md,
  },
  reportTypeSelector: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  reportTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: Colors.neutral[100],
    marginRight: SPACING.sm,
  },
  selectedReportTypeButton: {
    backgroundColor: Colors.primary[600],
  },
  reportTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginLeft: SPACING.xs,
  },
  selectedReportTypeText: {
    color: Colors.white,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  reportContainer: {
    padding: SPACING.md,
  },
  reportContent: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  periodLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[700],
    marginRight: SPACING.sm,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  periodButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[800],
    marginRight: SPACING.xs,
  },
  leaveActionsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  leaveActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    justifyContent: 'center',
  },
  viewLeavesButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  leaveActionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.white,
    marginLeft: SPACING.xs,
  },
  viewLeavesButtonText: {
    color: Colors.primary[600],
  },
  leaveFormContainer: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.md,
    ...globalStyles.shadow,
  },
  leaveFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  leaveFormTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[600],
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
  dateInput: {
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
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    backgroundColor: Colors.white,
    minHeight: 100,
  },
  characterCount: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  applyButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  applyButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  applyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
  },
  appliedLeavesContainer: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.md,
    ...globalStyles.shadow,
    maxHeight: '80%',
  },
  appliedLeavesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  appliedLeavesTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
  },
  leavesList: {
    flex: 1,
  },
  noLeavesContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  noLeavesText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[500],
  },
  leaveItem: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  leaveItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  leaveItemType: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  leaveItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaveItemStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
  leaveItemDates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  leaveItemDatesText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginLeft: SPACING.xs,
  },
  leaveItemMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginBottom: SPACING.sm,
  },
  leaveItemAppliedDate: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  chartTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.md,
  },
  chart: {
    borderRadius: BORDER_RADIUS.md,
    paddingRight: SPACING.md,
  },
  subjectsContainer: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.sm,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  subjectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectName: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginLeft: SPACING.sm,
  },
  subjectRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectGrade: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    marginRight: SPACING.sm,
  },
  subjectPercentage: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginRight: SPACING.sm,
  },
  summaryContainer: {
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[900],
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.neutral[300],
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary[600],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.white,
    marginLeft: SPACING.sm,
  },
  recordsContainer: {
    marginBottom: SPACING.lg,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  recordLeft: {
    flex: 1,
  },
  recordDate: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
  },
  recordNote: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.xs,
    color: Colors.white,
  },
  healthMetricsContainer: {
    marginBottom: SPACING.md,
  },
  metricsCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  metricItem: {
    width: '48%',
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
  },
  healthRecordsContainer: {
    marginBottom: SPACING.lg,
  },
  healthRecordItem: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  healthRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  healthRecordType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthRecordTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginLeft: SPACING.xs,
  },
  healthRecordDate: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
  },
  healthRecordNotes: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginTop: SPACING.xs,
  },
});