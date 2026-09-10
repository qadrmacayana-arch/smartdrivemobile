import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Home, Car, Compass, Wallet, LayoutDashboard, Star, Settings, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onOpenReviews: () => void;
}

export function SideMenu({ isOpen, onClose, user, currentScreen, onNavigate, onOpenReviews }: SideMenuProps) {
  const drawerX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (isOpen) {
      drawerX.setValue(-300);
      Animated.spring(drawerX, {
        toValue: 0,
        tension: 70,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerX, isOpen]);

  const navLinks = [
    { id: 'lobby', label: 'Lobby Dashboard', icon: Home },
    { id: 'rent', label: 'Rent a Vehicle', icon: Car },
    { id: 'fleet', label: 'Fleet Catalog & Specs', icon: Compass },
    { id: 'dashboard', label: 'Driving Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'SR Wallet', icon: Wallet },
  ];

  return (
    <Modal visible={isOpen} animationType="none" transparent>
      <View style={styles.overlay}>
        {/* DRAWER CONTAINER */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerX }] }]}>
          
          {/* USER PROFILE HEADER */}
          <LinearGradient colors={['#312E81', '#6D28D9', '#A21CAF']} style={styles.profileHeader}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.fullName.charAt(0)}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.tierPill}>
              <Text style={styles.tierText}>⭐ {user.memberTier}</Text>
            </View>
          </LinearGradient>

          {/* WALLET MINI WIDGET */}
          <View style={styles.walletBox}>
            <View>
              <Text style={styles.walletLabel}>SR Wallet Balance</Text>
              <Text style={styles.walletVal}>₱{user.walletBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.walletBadge}>
              <Text style={styles.walletBadgeText}>VIP 15% OFF</Text>
            </View>
          </View>

          {/* NAVIGATION LINKS */}
          <ScrollView style={styles.linksScroll}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentScreen === link.id;
              return (
                <TouchableOpacity
                  key={link.id}
                  style={[styles.linkItem, isActive && styles.linkItemActive]}
                  onPress={() => onNavigate(link.id)}
                  activeOpacity={0.7}
                >
                  <Icon size={18} color={isActive ? '#7C3AED' : '#64748B'} />
                  <Text style={[styles.linkText, isActive && styles.linkTextActive]}>{link.label}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.linkItem} onPress={onOpenReviews} activeOpacity={0.7}>
              <Star size={18} color="#EAB308" />
              <Text style={styles.linkText}>Customer Reviews</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* LOGOUT */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => onNavigate('logout')}
            activeOpacity={0.8}
          >
            <LogOut size={16} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out Account</Text>
          </TouchableOpacity>

        </Animated.View>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  backdrop: { flex: 1 },
  drawer: {
    width: 300,
    backgroundColor: '#FFFFFF',
    height: '100%',
    padding: 18,
    justifyContent: 'space-between',
  },
  profileHeader: {
    backgroundColor: '#A21CAF',
    margin: -20,
    padding: 20,
    paddingTop: 30,
    marginBottom: 14,
  },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 16, fontWeight: '900', color: '#FFFFFF', marginTop: 12 },
  email: { fontSize: 11, color: '#E9D5FF', marginTop: 2 },
  tierPill: {
    backgroundColor: '#FDE047',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  tierText: { fontSize: 10, fontWeight: '900', color: '#854D0E' },
  walletBox: {
    backgroundColor: '#FAE8FF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 16,
  },
  walletLabel: { fontSize: 10, color: '#64748B', fontWeight: '700' },
  walletVal: { fontSize: 16, fontWeight: '900', color: '#6D28D9', marginTop: 2 },
  walletBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  walletBadgeText: { fontSize: 9, fontWeight: '800', color: '#16A34A' },
  linksScroll: { flex: 1 },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  linkItemActive: { backgroundColor: '#FAE8FF' },
  linkText: { fontSize: 12, fontWeight: '800', color: '#334155' },
  linkTextActive: { color: '#7C3AED', fontWeight: '800' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    marginTop: 10,
  },
  logoutText: { color: '#DC2626', fontWeight: '800', fontSize: 12 },
});
