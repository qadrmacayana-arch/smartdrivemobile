import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

import { LoadingScreen } from './src/screens/LoadingScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { RentVehicleScreen } from './src/screens/RentVehicleScreen';
import { FleetInfoScreen } from './src/screens/FleetInfoScreen';
import { BookingFlowScreen } from './src/screens/BookingFlowScreen';
import { BottomTabBar, BottomTab } from './src/components/BottomTabBar';
import { AboutScreen, BookingsScreen, DashboardScreen, FaqScreen, HomeScreen, OffersScreen, SettingsScreen, SRWalletScreen } from './src/screens/ModernScreens';
import { FLEET_VEHICLES, fetchFleetVehicles, VehicleItem } from './src/constants/vehicles';
import { UserProfile, BookingRecord } from './src/types';
import { supabase } from './src/lib/supabase';

export default function App() {
  const DRIVE_REWARD_RATE = 0.05;
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'auth' | 'home' | 'lobby' | 'rent' | 'fleet' | 'about' | 'dashboard' | 'wallet' | 'booking' | 'bookings' | 'faqs' | 'offers' | 'settings'>('splash');
  const [activeTab, setActiveTab] = useState<BottomTab>('Home');
  const [authResolved, setAuthResolved] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const screenOffset = useRef(new Animated.Value(0)).current;

  // Selected Vehicle for Details or Booking
  const [fleetVehicles, setFleetVehicles] = useState<VehicleItem[]>(FLEET_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem>(FLEET_VEHICLES[0]);

  useEffect(() => {
    let isMounted = true;

    const syncFleetFromSupabase = async () => {
      const syncedVehicles = await fetchFleetVehicles();
      if (!isMounted) return;

      setFleetVehicles(syncedVehicles);
      if (syncedVehicles.length > 0) {
        setSelectedVehicle((current) => {
          if (!current || !syncedVehicles.some((vehicle) => vehicle.id === current.id)) {
            return syncedVehicles[0];
          }
          return current;
        });
      }
    };

    syncFleetFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  // User & Wallet State
  const [user, setUser] = useState<UserProfile>({
    fullName: 'Alexander Wright',
    email: 'alex.wright@smartdrive.io',
    phone: '+63 917 555 8899',
    memberTier: 'New Member',
    walletBalance: 0,
  });

  // Active Bookings List
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw new Error(`Session could not be restored: ${error.message}`);
      }

      if (data.session?.user && isMounted) {
        const authUser = data.session.user;
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError) {
          throw new Error(`Profile could not be restored: ${profileError.message}`);
        }

        setUser((previous) => ({
          ...previous,
          fullName: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || previous.fullName,
          email: authUser.email || previous.email,
          phone: profile?.phone || authUser.user_metadata?.phone || previous.phone,
          memberTier: authUser.user_metadata?.memberType || previous.memberTier,
        }));
        setHasSession(true);
      }

      if (isMounted) {
        setAuthResolved(true);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        setHasSession(false);
        setCurrentScreen('auth');
      }
    });

    void restoreSession().catch((error: unknown) => {
      if (!isMounted) return;
      setHasSession(false);
      setAuthResolved(true);
      Alert.alert(
        'Session Error',
        error instanceof Error ? error.message : 'Your saved session could not be restored. Please sign in again.',
      );
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authResolved && currentScreen === 'splash') {
      setCurrentScreen(hasSession ? 'home' : 'auth');
    }
  }, [authResolved, currentScreen, hasSession]);

  useEffect(() => {
    screenOpacity.setValue(0);
    screenOffset.setValue(10);
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(screenOffset, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentScreen, screenOffset, screenOpacity]);

  // Handle Login / Sign-up
  const handleAuthSuccess = (userData: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...userData }));
    setActiveTab('Home');
    setCurrentScreen('home');
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign Out Error', error.message);
      return;
    }
    setBookings([]);
    setActiveTab('Home');
  };

  // Open Fleet Details
  const handleViewVehicle = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setActiveTab('Rent');
    setCurrentScreen('fleet');
  };

  // Open Booking Flow (Calendar -> Info -> Payment -> Confirmation)
  const handleStartBooking = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setActiveTab('Rent');
    setCurrentScreen('booking');
  };

  // Handle Successful Booking
  const handleBookingComplete = (newBooking: BookingRecord) => {
    setBookings(prev => [newBooking, ...prev]);
    const driveReward = Math.round(newBooking.totalAmount * DRIVE_REWARD_RATE);
    setUser(prev => ({
      ...prev,
      walletBalance: Math.max(
        0,
        prev.walletBalance
          - (newBooking.paymentMethod.includes('Wallet') ? newBooking.totalAmount : 0)
          + driveReward
      )
    }));
  };

  const handleTabPress = (tab: BottomTab) => {
    setActiveTab(tab);

    if (tab === 'Home') {
      setCurrentScreen('home');
    } else if (tab === 'Rent') {
      setCurrentScreen('rent');
    } else if (tab === 'Dashboard') {
      setCurrentScreen('dashboard');
    } else if (tab === 'Settings') {
      setCurrentScreen('settings');
    }
  };

  if (!fontsLoaded) {
    return <LoadingScreen onFinish={() => undefined} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Views */}
      <Animated.View style={[styles.screenTransition, { opacity: screenOpacity, transform: [{ translateY: screenOffset }] }]}>
      {currentScreen === 'splash' && (
        <LoadingScreen onFinish={() => {
          if (authResolved) {
            setCurrentScreen(hasSession ? 'home' : 'auth');
          }
        }} />
      )}

      {currentScreen === 'auth' && (
        <AuthScreen onLoginSuccess={handleAuthSuccess} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          user={user}
          bookings={bookings}
          vehicles={fleetVehicles}
          onBrowseFleet={() => { setActiveTab('Rent'); setCurrentScreen('rent'); }}
          onViewVehicle={handleViewVehicle}
          onOpenWallet={() => {
            setActiveTab('Dashboard');
            setCurrentScreen('dashboard');
          }}
        />
      )}

      {currentScreen === 'lobby' && (
        <LobbyScreen 
          user={user}
          bookings={bookings}
          vehicles={fleetVehicles}
          onNavigateRent={() => {
            setActiveTab('Rent');
            setCurrentScreen('rent');
          }}
          onNavigateFleet={handleViewVehicle}
          onOpenDrawer={() => undefined}
        />
      )}

      {currentScreen === 'about' && <AboutScreen onBrowseFleet={() => {
        setActiveTab('Rent');
        setCurrentScreen('rent');
      }} />}
      {currentScreen === 'dashboard' && <DashboardScreen user={user} bookings={bookings} onBrowseFleet={() => {
        setActiveTab('Rent');
        setCurrentScreen('rent');
      }} onNavigate={(screen) => {
        if (screen === 'logout') {
          void handleSignOut();
          return;
        }
        setCurrentScreen(screen as typeof currentScreen);
      }} />}
      {currentScreen === 'bookings' && <BookingsScreen bookings={bookings} />}
      {currentScreen === 'faqs' && <FaqScreen />}
      {currentScreen === 'offers' && <OffersScreen />}
      {currentScreen === 'settings' && <SettingsScreen
        user={user}
        onSave={(updates) => setUser((previous) => ({ ...previous, ...updates }))}
        onDelete={() => {
          setBookings([]);
          void handleSignOut();
        }}
      />}
      {currentScreen === 'wallet' && (
        <SRWalletScreen user={user} bookings={bookings} driveRewardRate={DRIVE_REWARD_RATE} />
      )}

      {currentScreen === 'rent' && (
        <RentVehicleScreen 
          vehicles={fleetVehicles}
          onSelectVehicle={handleViewVehicle}
          onBookVehicle={handleStartBooking}
        />
      )}

      {currentScreen === 'fleet' && (
        <FleetInfoScreen 
          vehicle={selectedVehicle}
          onBook={() => setCurrentScreen('booking')}
          onBack={() => setCurrentScreen('rent')}
        />
      )}

      {currentScreen === 'booking' && (
        <BookingFlowScreen 
          vehicle={selectedVehicle}
          user={user}
          existingBookings={bookings}
          onFinishBooking={handleBookingComplete}
          onBackToLobby={() => setCurrentScreen('home')}
        />
      )}
      </Animated.View>

      {currentScreen !== 'splash' && currentScreen !== 'auth' && (
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      )}

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5FC',
  },
  screenTransition: {
    flex: 1,
  },
});
