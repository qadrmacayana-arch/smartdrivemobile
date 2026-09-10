import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Wallet, Car, Compass, Calendar, Sparkles, CheckCircle2, Search, MapPin, ShieldCheck, Headphones, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile, BookingRecord } from '../types';
import { FLEET_VEHICLES, VehicleItem } from '../constants/vehicles';
import { Colors } from '../constants/colors';
import { VehicleImage } from '../components/VehicleImage';

interface LobbyScreenProps {
  user: UserProfile;
  bookings: BookingRecord[];
  vehicles: VehicleItem[];
  onNavigateRent: () => void;
  onNavigateFleet: (vehicle: VehicleItem) => void;
  onOpenDrawer: () => void;
}

export function LobbyScreen({ user, bookings, vehicles, onNavigateRent, onNavigateFleet, onOpenDrawer }: LobbyScreenProps) {
  const activeBooking = bookings[0];
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[Colors.plum, Colors.violet, Colors.accent]} style={styles.hero}>
        <Text style={styles.heroEyebrow}>SMARTDRIVE MOBILITY ✨</Text>
        <Text style={styles.heroTitle}>Premium rides.{'\n'}Unforgettable journeys.</Text>
        <Text style={styles.heroText}>Discover luxury cars, electric vehicles, and motorcycles made for your Philippine adventure.</Text>
        <TouchableOpacity style={styles.heroButton} onPress={onNavigateRent}>
          <Text style={styles.heroButtonText}>Find Your Vehicle →</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Plan your next ride</Text>
        <View style={styles.searchField}>
          <MapPin size={16} color="#7C3AED" />
          <TextInput value={pickupLocation} onChangeText={setPickupLocation} placeholder="Pick-up location" placeholderTextColor="#94A3B8" style={styles.searchInput} />
        </View>
        <View style={styles.searchField}>
          <Calendar size={16} color="#7C3AED" />
          <TextInput value={pickupDate} onChangeText={setPickupDate} placeholder="Pick-up date" placeholderTextColor="#94A3B8" style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={onNavigateRent}>
          <Search size={16} color="#FFFFFF" />
          <Text style={styles.searchButtonText}>Search Fleet</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Why choose SmartDrive?</Text>
      <Text style={styles.sectionSub}>A seamless experience from booking to return.</Text>
      <View style={styles.featureGrid}>
        {[
          ['Fully Insured', 'Peace of mind on every trip.', ShieldCheck, '#F3E8FF'],
          ['24/7 Support', 'Help whenever you need it.', Headphones, '#FCE7F3'],
          ['Premium Fleet', 'Vehicles ready for adventure.', Star, '#FEF3C7'],
        ].map(([title, subtitle, Icon, background]) => <View key={title as string} style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: background as string }]}><Icon size={19} color="#7C3AED" /></View>
          <Text style={styles.featureTitle}>{title as string}</Text>
          <Text style={styles.featureSub}>{subtitle as string}</Text>
        </View>)}
      </View>

      {/* MEMBER WALLET CARD */}
      <LinearGradient
        colors={[Colors.plum, Colors.violet, Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.walletCard}
      >
        <View style={styles.walletHeader}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user.fullName}</Text>
          </View>
          <View style={styles.tierBadge}>
            <Sparkles size={12} color="#FDE047" />
            <Text style={styles.tierText}>{user.memberTier}</Text>
          </View>
        </View>

        <View style={styles.walletDivider} />

        <View style={styles.walletFooter}>
          <View>
            <Text style={styles.walletLabel}>SR Digital Cash Wallet</Text>
            <Text style={styles.walletBalance}>₱{user.walletBalance.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.walletBtn} onPress={onOpenDrawer} activeOpacity={0.8}>
            <Wallet size={16} color="#6D28D9" />
            <Text style={styles.walletBtnText}>Wallet Perks</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* QUICK ACTIONS ROW */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={onNavigateRent} activeOpacity={0.8}>
          <View style={[styles.actionIcon, { backgroundColor: '#EDE9FE' }]}>
            <Car size={22} color="#7C3AED" />
          </View>
          <Text style={styles.actionTitle}>Rent a Vehicle</Text>
          <Text style={styles.actionSub}>Browse 5+ verified fleet</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={() => onNavigateFleet(vehicles[0] || FLEET_VEHICLES[0])} 
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
            <Compass size={22} color="#16A34A" />
          </View>
          <Text style={styles.actionTitle}>Fleet Specs</Text>
          <Text style={styles.actionSub}>Specs & Horsepower</Text>
        </TouchableOpacity>
      </View>

      {/* ACTIVE RESERVATION CARD */}
      {activeBooking && (
        <View style={styles.bookingBox}>
          <View style={styles.bookingHead}>
            <View style={styles.confirmedPill}>
              <CheckCircle2 size={12} color="#16A34A" />
              <Text style={styles.confirmedText}>Active Reservation</Text>
            </View>
            <Text style={styles.refText}>Ref: {activeBooking.id}</Text>
          </View>

          <Text style={styles.bookingVehicle}>{activeBooking.vehicleName}</Text>
          <View style={styles.bookingDatesRow}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.bookingDates}>
              {activeBooking.pickupDate} → {activeBooking.returnDate} ({activeBooking.days} Days)
            </Text>
          </View>
        </View>
      )}

      {/* FEATURED VEHICLES PREVIEW */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Fleet</Text>
        <TouchableOpacity onPress={onNavigateRent}>
          <Text style={styles.seeAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fleetScroll}>
        {(vehicles.length > 0 ? vehicles : FLEET_VEHICLES).map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.miniCard}
            onPress={() => onNavigateFleet(item)}
            activeOpacity={0.85}
          >
            <VehicleImage uri={item.image} style={styles.miniCardImg} label={item.name} />
            <View style={styles.miniCardBody}>
              <Text style={styles.miniBadge}>{item.category}</Text>
              <Text style={styles.miniTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.miniPrice}>₱{item.price.toLocaleString()} <Text style={styles.dayText}>/day</Text></Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FC' },
  content: { padding: 16, paddingBottom: 34 },
  hero: { borderRadius: 24, padding: 20, marginBottom: 14, overflow: 'hidden' },
  heroEyebrow: { color: '#E9D5FF', fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  heroTitle: { color: '#FFFFFF', fontSize: 26, lineHeight: 30, fontWeight: '900', marginTop: 8 },
  heroText: { color: '#F5D0FE', fontSize: 11, lineHeight: 17, marginTop: 8, maxWidth: 290 },
  heroButton: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10, marginTop: 14 },
  heroButtonText: { color: '#6D28D9', fontSize: 11, fontWeight: '900' },
  searchCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E9D5FF', shadowColor: '#7C3AED', shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 },
  searchTitle: { color: '#0F172A', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  searchField: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E9D5FF', backgroundColor: '#FAF8FF', marginBottom: 9 },
  searchInput: { flex: 1, color: '#0F172A', fontSize: 12 },
  searchButton: { height: 44, borderRadius: 12, backgroundColor: '#4C1D95', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 2 },
  searchButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  sectionSub: { color: '#64748B', fontSize: 11, marginTop: -5, marginBottom: 10 },
  featureGrid: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  featureCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 15, padding: 11, borderWidth: 1, borderColor: '#E9D5FF' },
  featureIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  featureTitle: { color: '#0F172A', fontSize: 11, fontWeight: '900' },
  featureSub: { color: '#64748B', fontSize: 9, lineHeight: 13, marginTop: 3 },
  walletCard: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    padding: 20,
    shadowColor: Colors.plum,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: 12, color: '#E9D5FF', fontWeight: '600' },
  userName: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', marginTop: 2 },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tierText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  walletDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16 },
  walletFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  walletLabel: { fontSize: 11, color: '#E9D5FF', fontWeight: '600' },
  walletBalance: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginTop: 2 },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  walletBtnText: { color: '#6D28D9', fontSize: 11, fontWeight: '800' },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  actionSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  bookingBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 20,
  },
  bookingHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  confirmedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  confirmedText: { color: '#16A34A', fontSize: 10, fontWeight: '800' },
  refText: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
  bookingVehicle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  bookingDatesRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  bookingDates: { fontSize: 12, color: '#64748B' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  seeAllText: { fontSize: 12, fontWeight: '800', color: '#7C3AED' },
  fleetScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  miniCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 12,
  },
  miniCardImg: { width: '100%', height: 110 },
  miniCardBody: { padding: 12 },
  miniBadge: { fontSize: 9, fontWeight: '800', color: '#6D28D9', textTransform: 'uppercase' },
  miniTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  miniPrice: { fontSize: 14, fontWeight: '900', color: '#7C3AED', marginTop: 4 },
  dayText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
});
