import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '@/components/Map';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { Bus, Navigation, Clock, Map as MapIcon } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

interface BusRoute {
  id: string;
  name: string;
  status: 'on-time' | 'delayed' | 'arrived';
  estimatedTime: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    description: string;
  };
  stops: {
    id: string;
    name: string;
    time: string;
    passed: boolean;
  }[];
}

export default function TrackScreen() {
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [showStops, setShowStops] = useState(false);
  
  const busRoutes: BusRoute[] = [
    {
      id: '1',
      name: 'Route A - North',
      status: 'on-time',
      estimatedTime: '10 min',
      currentLocation: {
        latitude: 37.7851,
        longitude: -122.4194,
        description: 'Market Street',
      },
      stops: [
        { id: 's1', name: 'Downtown Terminal', time: '7:30 AM', passed: true },
        { id: 's2', name: 'Oak Avenue', time: '7:45 AM', passed: true },
        { id: 's3', name: 'Central Park', time: '8:00 AM', passed: false },
        { id: 's4', name: 'North High School', time: '8:15 AM', passed: false },
      ],
    },
    {
      id: '2',
      name: 'Route B - East',
      status: 'delayed',
      estimatedTime: '15 min',
      currentLocation: {
        latitude: 37.7749,
        longitude: -122.4194,
        description: 'Mission Street',
      },
      stops: [
        { id: 's5', name: 'East Terminal', time: '7:30 AM', passed: true },
        { id: 's6', name: 'Pine Street', time: '7:50 AM', passed: false },
        { id: 's7', name: 'Lakeside Drive', time: '8:05 AM', passed: false },
        { id: 's8', name: 'East High School', time: '8:20 AM', passed: false },
      ],
    },
    {
      id: '3',
      name: 'Route C - South',
      status: 'arrived',
      estimatedTime: '0 min',
      currentLocation: {
        latitude: 37.7833,
        longitude: -122.4167,
        description: 'School Entrance',
      },
      stops: [
        { id: 's9', name: 'South Terminal', time: '7:15 AM', passed: true },
        { id: 's10', name: 'River Road', time: '7:30 AM', passed: true },
        { id: 's11', name: 'Main Street', time: '7:45 AM', passed: true },
        { id: 's12', name: 'South High School', time: '8:00 AM', passed: true },
      ],
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return Colors.success[500];
      case 'delayed':
        return Colors.warning[500];
      case 'arrived':
        return Colors.primary[500];
      default:
        return Colors.neutral[500];
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'On Time';
      case 'delayed':
        return 'Delayed';
      case 'arrived':
        return 'Arrived';
      default:
        return status;
    }
  };
  
  const handleRouteSelect = (route: BusRoute) => {
    setSelectedRoute(route);
    setShowStops(false);
  };
  
  const toggleStops = () => {
    setShowStops(!showStops);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bus Tracker</Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success[500] }]} />
              <Text style={styles.legendText}>On Time</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.statusDot, { backgroundColor: Colors.warning[500] }]} />
              <Text style={styles.legendText}>Delayed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.statusDot, { backgroundColor: Colors.primary[500] }]} />
              <Text style={styles.legendText}>Arrived</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.routesContainer}>
            <Text style={styles.sectionTitle}>Bus Routes</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routeCards}
            >
              {busRoutes.map((route) => (
                <TouchableOpacity 
                  key={route.id}
                  style={[
                    styles.routeCard, 
                    selectedRoute?.id === route.id && styles.selectedRouteCard
                  ]}
                  onPress={() => handleRouteSelect(route)}
                >
                  <Bus 
                    size={24} 
                    color={selectedRoute?.id === route.id ? Colors.white : Colors.primary[600]} 
                  />
                  <Text 
                    style={[
                      styles.routeName,
                      selectedRoute?.id === route.id && styles.selectedRouteText
                    ]}
                  >
                    {route.name}
                  </Text>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusColor(route.status) }
                    ]}
                  >
                    <Text style={styles.statusText}>{getStatusText(route.status)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {selectedRoute ? (
            <Animated.View 
              entering={FadeIn.duration(300)}
              style={styles.trackingContainer}
            >
              <View style={styles.mapContainer}>
                <Map
                  style={styles.map}
                  latitude={selectedRoute.currentLocation.latitude}
                  longitude={selectedRoute.currentLocation.longitude}
                >
                  {Platform.OS !== 'web' && (
                    <Marker
                      coordinate={{
                        latitude: selectedRoute.currentLocation.latitude,
                        longitude: selectedRoute.currentLocation.longitude,
                      }}
                    >
                      <View style={styles.customMarker}>
                        <Bus size={16} color={Colors.white} />
                      </View>
                    </Marker>
                  )}
                </Map>
                
                <TouchableOpacity style={styles.mapTypeButton}>
                  <MapIcon size={20} color={Colors.primary[600]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.routeDetailsContainer}>
                <View style={styles.routeDetailsHeader}>
                  <View>
                    <Text style={styles.selectedRouteName}>{selectedRoute.name}</Text>
                    <View style={styles.locationContainer}>
                      <Navigation size={14} color={Colors.neutral[600]} />
                      <Text style={styles.locationText}>
                        Current: {selectedRoute.currentLocation.description}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.etaContainer}>
                    <Clock size={16} color={Colors.neutral[600]} />
                    <Text style={styles.etaText}>ETA: {selectedRoute.estimatedTime}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.stopsToggleButton}
                  onPress={toggleStops}
                >
                  <Text style={styles.stopsToggleText}>
                    {showStops ? 'Hide Stops' : 'Show Stops'}
                  </Text>
                </TouchableOpacity>
                
                {showStops && (
                  <Animated.View 
                    entering={SlideInRight.duration(300)}
                    style={styles.stopsContainer}
                  >
                    {selectedRoute.stops.map((stop, index) => (
                      <View 
                        key={stop.id} 
                        style={[
                          styles.stopItem,
                          index === selectedRoute.stops.length - 1 && styles.lastStopItem
                        ]}
                      >
                        <View style={styles.stopTimelineContainer}>
                          <View 
                            style={[
                              styles.stopDot,
                              stop.passed && styles.passedStopDot
                            ]} 
                          />
                          {index !== selectedRoute.stops.length - 1 && (
                            <View 
                              style={[
                                styles.stopLine,
                                stop.passed && styles.passedStopLine
                              ]} 
                            />
                          )}
                        </View>
                        
                        <View style={styles.stopDetails}>
                          <Text 
                            style={[
                              styles.stopName,
                              stop.passed && styles.passedStopText
                            ]}
                          >
                            {stop.name}
                          </Text>
                          <Text 
                            style={[
                              styles.stopTime,
                              stop.passed && styles.passedStopText
                            ]}
                          >
                            {stop.time}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          ) : (
            <View style={styles.noSelectionContainer}>
              <Bus size={64} color={Colors.neutral[300]} />
              <Text style={styles.noSelectionText}>Select a bus route to track</Text>
            </View>
          )}
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.xl,
    color: Colors.neutral[900],
    marginBottom: SPACING.sm,
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  statusDot: {
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
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  routesContainer: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
    marginBottom: SPACING.sm,
  },
  routeCards: {
    paddingRight: SPACING.md,
  },
  routeCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    width: 150,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  selectedRouteCard: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[700],
  },
  routeName: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[800],
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  selectedRouteText: {
    color: Colors.white,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.white,
  },
  trackingContainer: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  mapContainer: {
    height: 200,
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderTopRightRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    backgroundColor: Colors.primary[600],
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  mapTypeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: BORDER_RADIUS.md,
    ...globalStyles.shadow,
  },
  routeDetailsContainer: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: Colors.white,
  },
  routeDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  selectedRouteName: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.lg,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  etaText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.primary[700],
    marginLeft: 4,
  },
  stopsToggleButton: {
    backgroundColor: Colors.neutral[100],
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  stopsToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
  },
  stopsContainer: {
    flex: 1,
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  lastStopItem: {
    marginBottom: 0,
  },
  stopTimelineContainer: {
    width: 24,
    alignItems: 'center',
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary[600],
    borderWidth: 2,
    borderColor: Colors.white,
  },
  passedStopDot: {
    backgroundColor: Colors.success[500],
  },
  stopLine: {
    width: 2,
    height: 30,
    backgroundColor: Colors.primary[300],
  },
  passedStopLine: {
    backgroundColor: Colors.success[300],
  },
  stopDetails: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  stopName: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[800],
  },
  stopTime: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
  },
  passedStopText: {
    color: Colors.neutral[400],
    textDecorationLine: 'line-through',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderStyle: 'dashed',
  },
  noSelectionText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[600],
    marginTop: SPACING.md,
  },
});