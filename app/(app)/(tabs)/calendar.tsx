import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarComponent, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { ChevronDown, Clock, MapPin } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EventItem {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'class' | 'exam' | 'event' | 'holiday';
}

interface CalendarEvents {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    events: EventItem[];
  };
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [calendarView, setCalendarView] = useState<'month' | 'agenda'>('month');
  
  // Mock calendar data
  const calendarEvents: CalendarEvents = {
    '2025-04-01': {
      marked: true,
      dotColor: Colors.primary[600],
      events: [
        { id: '1', title: 'Math Class', time: '08:00 - 09:30', location: 'Room 101', type: 'class' },
        { id: '2', title: 'Science Lab', time: '10:00 - 11:30', location: 'Science Lab', type: 'class' },
        { id: '3', title: 'English Literature', time: '12:30 - 14:00', location: 'Room A22', type: 'class' },
      ],
    },
    '2025-04-02': {
      marked: true,
      dotColor: Colors.primary[600],
      events: [
        { id: '4', title: 'Physics Class', time: '08:00 - 09:30', location: 'Room 202', type: 'class' },
        { id: '5', title: 'History', time: '10:00 - 11:30', location: 'Room 105', type: 'class' },
      ],
    },
    '2025-04-05': {
      marked: true,
      dotColor: Colors.warning[500],
      events: [
        { id: '6', title: 'Mathematics Quiz', time: '09:00 - 10:30', location: 'Exam Hall', type: 'exam' },
      ],
    },
    '2025-04-10': {
      marked: true,
      dotColor: Colors.accent[500],
      events: [
        { id: '7', title: 'Annual Science Fair', time: '10:00 - 16:00', location: 'School Auditorium', type: 'event' },
      ],
    },
    '2025-04-15': {
      marked: true,
      dotColor: Colors.success[500],
      events: [
        { id: '8', title: 'School Holiday', time: 'All Day', location: 'N/A', type: 'holiday' },
      ],
    },
  };
  
  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString);
  };
  
  const renderEventTypeIndicator = (type: string) => {
    const colors = {
      class: Colors.primary[500],
      exam: Colors.warning[500],
      event: Colors.accent[500],
      holiday: Colors.success[500],
    };
    
    return (
      <View 
        style={[
          styles.eventTypeIndicator, 
          { backgroundColor: colors[type as keyof typeof colors] }
        ]} 
      />
    );
  };
  
  const getEventsByDate = (date: string) => {
    return calendarEvents[date]?.events || [];
  };
  
  const getMarkedDates = () => {
    const markedDates: any = {};
    
    Object.keys(calendarEvents).forEach((date) => {
      markedDates[date] = {
        marked: true,
        dotColor: calendarEvents[date].dotColor,
        selected: date === selectedDate,
        selectedColor: date === selectedDate ? Colors.primary[100] : undefined,
      };
    });
    
    // Mark the selected date even if no events
    if (!markedDates[selectedDate]) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: Colors.primary[100],
      };
    }
    
    return markedDates;
  };
  
  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  const toggleCalendarView = () => {
    setCalendarView(calendarView === 'month' ? 'agenda' : 'month');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>School Calendar</Text>
          <TouchableOpacity 
            style={styles.viewToggleButton}
            onPress={toggleCalendarView}
          >
            <Text style={styles.viewToggleText}>
              {calendarView === 'month' ? 'Agenda View' : 'Month View'}
            </Text>
            <ChevronDown size={18} color={Colors.primary[600]} />
          </TouchableOpacity>
        </View>
        
        {calendarView === 'month' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.calendarContainer}>
            <CalendarComponent
              theme={{
                backgroundColor: Colors.white,
                calendarBackground: Colors.white,
                textSectionTitleColor: Colors.neutral[700],
                selectedDayBackgroundColor: Colors.primary[600],
                selectedDayTextColor: Colors.white,
                todayTextColor: Colors.primary[600],
                dayTextColor: Colors.neutral[800],
                textDisabledColor: Colors.neutral[400],
                dotColor: Colors.primary[600],
                selectedDotColor: Colors.white,
                arrowColor: Colors.primary[600],
                monthTextColor: Colors.neutral[900],
                indicatorColor: Colors.primary[600],
                textDayFontFamily: 'Inter-Regular',
                textMonthFontFamily: 'Inter-Bold',
                textDayHeaderFontFamily: 'Inter-Medium',
              }}
              markedDates={getMarkedDates()}
              onDayPress={handleDateSelect}
              hideExtraDays={true}
              enableSwipeMonths={true}
            />
          </Animated.View>
        )}
        
        <View style={styles.eventLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary[500] }]} />
            <Text style={styles.legendText}>Class</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warning[500] }]} />
            <Text style={styles.legendText}>Exam</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.accent[500] }]} />
            <Text style={styles.legendText}>Event</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success[500] }]} />
            <Text style={styles.legendText}>Holiday</Text>
          </View>
        </View>
        
        <View style={styles.eventsContainer}>
          <Text style={styles.dateHeader}>{formatSelectedDate()}</Text>
          
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.eventsScrollContent}
          >
            {getEventsByDate(selectedDate).length > 0 ? (
              getEventsByDate(selectedDate).map((event) => (
                <TouchableOpacity key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    {renderEventTypeIndicator(event.type)}
                    <Text style={styles.eventTitle}>{event.title}</Text>
                  </View>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailItem}>
                      <Clock size={16} color={Colors.neutral[500]} />
                      <Text style={styles.eventDetailText}>{event.time}</Text>
                    </View>
                    
                    <View style={styles.eventDetailItem}>
                      <MapPin size={16} color={Colors.neutral[500]} />
                      <Text style={styles.eventDetailText}>{event.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No events scheduled for this day</Text>
              </View>
            )}
          </ScrollView>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.xl,
    color: Colors.neutral[900],
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.primary[50],
  },
  viewToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[600],
    marginRight: SPACING.xs,
  },
  calendarContainer: {
    paddingBottom: SPACING.sm,
  },
  eventLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    backgroundColor: Colors.neutral[50],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[700],
  },
  eventsContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  dateHeader: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[800],
    marginBottom: SPACING.md,
  },
  eventsScrollContent: {
    paddingBottom: SPACING.lg,
  },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eventTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  eventTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
    flex: 1,
  },
  eventDetails: {
    marginLeft: SPACING.lg,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  eventDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginLeft: SPACING.xs,
  },
  noEventsContainer: {
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderStyle: 'dashed',
  },
  noEventsText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
});