import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle2, Shield, Zap, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { VehicleItem } from '../constants/vehicles';
import { VehicleImage } from '../components/VehicleImage';

interface FleetInfoScreenProps {
  vehicle: VehicleItem;
  onBook: () => void;
  onBack: () => void;
}

export function FleetInfoScreen({ vehicle, onBook, onBack }: FleetInfoScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* VEHICLE SHOWCASE IMAGE */}
      <View style={styles.imgWrap}>
        <VehicleImage uri={vehicle.image} style={styles.heroImg} label={vehicle.name} />
        <View style={styles.badgeOverlay}>
          <Text style={styles.badgeText}>{vehicle.category}</Text>
        </View>
      </View>

      {/* HEADER SPECS */}
      <View style={styles.headerBox}>
        <View>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.type}>{vehicle.type}</Text>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.priceVal}>₱{vehicle.price.toLocaleString()}</Text>
          <Text style={styles.perDay}>per day</Text>
        </View>
      </View>

      <Text style={styles.desc}>{vehicle.description}</Text>

      {/* TECHNICAL METRICS GRID */}
      <Text style={styles.sectionHeading}>Performance & Specs</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Transmission</Text>
          <Text style={styles.metricVal}>{vehicle.specs.transmission}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Fuel / Power</Text>
          <Text style={styles.metricVal}>{vehicle.specs.fuel}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Seating</Text>
          <Text style={styles.metricVal}>{vehicle.specs.seats} Persons</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Horsepower</Text>
          <Text style={styles.metricVal}>{vehicle.specs.power}</Text>
        </View>
      </View>

      {/* INCLUDED PERKS CHECKLIST */}
      <Text style={styles.sectionHeading}>Included Equipment & Perks</Text>
      <View style={styles.featuresBox}>
        {vehicle.features.map((feat, i) => (
          <View key={i} style={styles.featureRow}>
            <CheckCircle2 size={16} color="#16A34A" />
            <Text style={styles.featureText}>{feat}</Text>
          </View>
        ))}
      </View>

      {/* INSURANCE CALLOUT */}
      <View style={styles.insuranceBox}>
        <Shield size={20} color="#7C3AED" />
        <View style={{ flex: 1 }}>
          <Text style={styles.insTitle}>Comprehensive Insurance Included</Text>
          <Text style={styles.insSub}>24/7 Roadside Assistance and zero-deductible coverage included with every reservation.</Text>
        </View>
      </View>

      {/* BOOK BUTTON */}
      <TouchableOpacity style={styles.bookBtn} onPress={onBook} activeOpacity={0.85}>
        <Text style={styles.bookBtnText}>Proceed to Reservation (₱{vehicle.price.toLocaleString()}/day)</Text>
        <ChevronRight size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FC' },
  content: { padding: 16, paddingBottom: 38 },
  imgWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  heroImg: { width: '100%', height: 220 },
  badgeOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: { fontSize: 20, fontWeight: '900', color: '#0F172A', maxWidth: 220 },
  type: { fontSize: 13, color: '#64748B', marginTop: 2 },
  priceTag: { alignItems: 'flex-end' },
  priceVal: { fontSize: 22, fontWeight: '900', color: '#7C3AED' },
  perDay: { fontSize: 11, color: '#64748B' },
  desc: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 18 },
  sectionHeading: { fontSize: 15, fontWeight: '900', color: '#0F172A', marginBottom: 10, marginTop: 4 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 14,
    padding: 12,
  },
  metricLabel: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  metricVal: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  featuresBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 18,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  insuranceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FAE8FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 20,
  },
  insTitle: { fontSize: 13, fontWeight: '800', color: '#86198F' },
  insSub: { fontSize: 11, color: '#86198F', marginTop: 2, lineHeight: 16 },
  bookBtn: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  bookBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
});
