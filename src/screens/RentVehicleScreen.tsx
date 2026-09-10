import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Users, Gauge, Fuel, ChevronRight, Heart, SlidersHorizontal, Sparkles } from 'lucide-react-native';
import { FLEET_VEHICLES, VehicleItem } from '../constants/vehicles';
import { VehicleImage } from '../components/VehicleImage';

interface RentVehicleScreenProps {
  vehicles: VehicleItem[];
  onSelectVehicle: (vehicle: VehicleItem) => void;
  onBookVehicle: (vehicle: VehicleItem) => void;
}

export function RentVehicleScreen({ vehicles, onSelectVehicle, onBookVehicle }: RentVehicleScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Cars' | 'Motorcycles' | 'Recreational'>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['All', 'Cars', 'Motorcycles', 'Recreational'] as const;
  const subCategories = selectedCategory === 'Cars'
    ? ['All Cars', 'Electric', 'Luxury Sedan', 'SUV']
    : selectedCategory === 'Motorcycles'
      ? ['All Motorcycles', 'Commuter Scooters', 'Maxi-Scooters', 'Underbones']
      : selectedCategory === 'Recreational'
        ? ['All RVs', 'Motorhomes', 'Conversion Vans', 'Travel Trailers']
        : [];

  const fleetList = vehicles.length > 0 ? vehicles : FLEET_VEHICLES;

  const filtered = fleetList.filter(v => {
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                          v.type.toLowerCase().includes(search.toLowerCase());
    const matchesSub = selectedSubCategory === 'All' ||
      selectedSubCategory.startsWith('All ') ||
      v.type.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
      v.name.toLowerCase().includes(selectedSubCategory.toLowerCase());
    return matchesCat && matchesSearch && matchesSub;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      <View style={styles.intro}>
        <View style={styles.introIcon}><Sparkles size={20} color="#FFFFFF" /></View>
        <Text style={styles.eyebrow}>SMARTDRIVE FLEET</Text>
        <Text style={styles.pageTitle}>Your next adventure starts here.</Text>
        <Text style={styles.pageDescription}>Carefully curated cars and motorcycles for every Philippine journey.</Text>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color="#94A3B8" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by vehicle name or model..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterHeading}><Text style={styles.filterTitle}>Browse the fleet</Text><SlidersHorizontal size={16} color="#7C3AED" /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            onPress={() => {
              setSelectedCategory(cat);
              setSelectedSubCategory('All');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {subCategories.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subChipScroll}>
        {subCategories.map((subCategory) => (
          <TouchableOpacity key={subCategory} style={[styles.subChip, (selectedSubCategory === subCategory || (selectedSubCategory === 'All' && subCategory.startsWith('All '))) && styles.subChipActive]} onPress={() => setSelectedSubCategory(subCategory)}>
            <Text style={[styles.subChipText, (selectedSubCategory === subCategory || (selectedSubCategory === 'All' && subCategory.startsWith('All '))) && styles.subChipTextActive]}>{subCategory}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>}

      <View style={styles.resultsRow}><Text style={styles.countText}>{filtered.length} vehicles available</Text><Text style={styles.sortText}>Curated for you</Text></View>

      {selectedCategory === 'All' && !search && <View style={styles.topPicksSection}>
        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Top 3 Picks ✨</Text><Text style={styles.sectionSubtitle}>A quick shortlist for every kind of journey.</Text></View></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {fleetList.slice(0, 3).map((item) => (
            <TouchableOpacity key={item.id} style={styles.pickCard} onPress={() => onSelectVehicle(item)} activeOpacity={0.9}>
              <VehicleImage uri={item.image} style={styles.pickImage} label={item.name} />
              <View style={styles.pickOverlay}><Text style={styles.pickLabel}>TOP PICK</Text><Text style={styles.pickName} numberOfLines={1}>{item.name}</Text><Text style={styles.pickPrice}>₱{item.price.toLocaleString()} / day</Text></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>}

      {/* VEHICLES LIST */}
      {filtered.length === 0 && <View style={styles.emptyState}><Search size={24} color="#A78BFA" /><Text style={styles.emptyTitle}>No vehicles found</Text><Text style={styles.emptyText}>Try another vehicle name or category.</Text></View>}
      {filtered.map((item) => (
        <View key={item.id} style={styles.card}>
          <TouchableOpacity onPress={() => onSelectVehicle(item)} activeOpacity={0.9}>
            <VehicleImage uri={item.image} style={styles.cardImg} label={item.name} />
          </TouchableOpacity>
          
          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Text style={styles.categoryPill}>{item.category === 'Recreational' ? 'RECREATIONAL' : item.category.toUpperCase()}</Text>
              <Text style={styles.priceText}>
                ₱{item.price.toLocaleString()} <Text style={styles.perDay}>/day</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
              <Heart size={17} color={favorites.includes(item.id) ? '#C026D3' : '#94A3B8'} fill={favorites.includes(item.id) ? '#C026D3' : 'transparent'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSelectVehicle(item)}>
              <Text style={styles.vehicleName}>{item.name}</Text>
            </TouchableOpacity>

            <Text style={styles.vehicleType}>{item.type}</Text>

            {/* SPECS BADGES */}
            <View style={styles.specsRow}>
              <View style={styles.specBadge}>
                <Users size={12} color="#64748B" />
                <Text style={styles.specText}>{item.specs.seats} Seats</Text>
              </View>
              <View style={styles.specBadge}>
                <Gauge size={12} color="#64748B" />
                <Text style={styles.specText} numberOfLines={1}>{item.specs.transmission}</Text>
              </View>
              <View style={styles.specBadge}>
                <Fuel size={12} color="#64748B" />
                <Text style={styles.specText} numberOfLines={1}>{item.specs.fuel}</Text>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.btnRow}>
              <TouchableOpacity 
                style={styles.detailsBtn} 
                onPress={() => onSelectVehicle(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.detailsBtnText} numberOfLines={1}>Specs & Features</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bookBtn} 
                onPress={() => onBookVehicle(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.bookBtnText} numberOfLines={1}>Rent Now</Text>
                <ChevronRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FC' },
  content: { padding: 16, paddingBottom: 30 },
  intro: { borderRadius: 22, padding: 18, marginBottom: 14, overflow: 'hidden', backgroundColor: '#4C1D95' },
  introIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 12 },
  eyebrow: { color: '#E9D5FF', fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  pageTitle: { color: '#FFFFFF', fontSize: 24, lineHeight: 29, fontWeight: '900', marginTop: 6 },
  pageDescription: { color: '#E9D5FF', fontSize: 11, lineHeight: 17, marginTop: 7 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 15,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A' },
  filterHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, marginBottom: 8 },
  filterTitle: { color: '#0F172A', fontSize: 15, fontWeight: '900' },
  chipScroll: { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 5 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED', shadowColor: '#7C3AED', shadowOpacity: 0.2, shadowRadius: 5, elevation: 2 },
  chipText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  chipTextActive: { color: '#FFFFFF' },
  subChipScroll: { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 10 },
  subChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, backgroundColor: '#F3E8FF', marginRight: 7 },
  subChipActive: { backgroundColor: '#DDD6FE' },
  subChipText: { fontSize: 10, color: '#7C3AED', fontWeight: '800' },
  subChipTextActive: { color: '#4C1D95' },
  resultsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  countText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  sortText: { fontSize: 10, color: '#A21CAF', fontWeight: '800' },
  topPicksSection: { marginBottom: 16 },
  sectionHeader: { marginBottom: 9 },
  sectionTitle: { color: '#0F172A', fontSize: 16, fontWeight: '900' },
  sectionSubtitle: { color: '#64748B', fontSize: 10, marginTop: 3 },
  pickCard: { width: 190, height: 145, borderRadius: 17, overflow: 'hidden', marginRight: 10, backgroundColor: '#4C1D95' },
  pickImage: { width: '100%', height: '100%' },
  pickOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 11, backgroundColor: 'rgba(30, 13, 65, 0.82)' },
  pickLabel: { color: '#E9D5FF', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  pickName: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', marginTop: 3 },
  pickPrice: { color: '#F5D0FE', fontSize: 10, fontWeight: '700', marginTop: 3 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImg: { width: '100%', height: 180 },
  cardBody: { padding: 16, position: 'relative' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  categoryPill: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    backgroundColor: '#FAE8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  favoriteButton: { position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 11, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#4C1D95', shadowOpacity: 0.12, shadowRadius: 5, elevation: 2 },
  priceText: { flexShrink: 0, fontSize: 18, fontWeight: '900', color: '#0F172A' },
  perDay: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  vehicleName: { fontSize: 16, fontWeight: '900', color: '#0F172A', marginTop: 6 },
  vehicleType: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 12 },
  specsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 10 },
  detailsBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FAE8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: { color: '#7C3AED', fontWeight: '800', fontSize: 12 },
  bookBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4C1D95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bookBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  emptyState: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF', marginTop: 8 },
  emptyTitle: { color: '#4C1D95', fontSize: 15, fontWeight: '900', marginTop: 8 },
  emptyText: { color: '#64748B', fontSize: 11, marginTop: 4, textAlign: 'center' },
});
