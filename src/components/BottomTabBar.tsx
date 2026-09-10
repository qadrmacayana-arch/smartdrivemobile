import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Car,
  LayoutDashboard,
  Home,
  Settings,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type BottomTab = 'Home' | 'Rent' | 'Dashboard' | 'Settings';

interface BottomTabBarProps {
  activeTab: BottomTab;
  onTabPress: (tab: BottomTab) => void;
}

const tabs: Array<{ label: BottomTab; icon: typeof Home }> = [
  { label: 'Home', icon: Home },
  { label: 'Rent', icon: Car },
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Settings', icon: Settings },
];

function TabItem({
  active,
  icon: Icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: typeof Home;
  label: BottomTab;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(active ? 1 : 0.96)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: active ? 1 : 0.96,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [active, scale]);

  return (
    <TouchableOpacity
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.tab}
      activeOpacity={0.8}
    >
      {active ? (
        <Animated.View style={[styles.tabContent, styles.activePill, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={['#7C3AED', '#A855F7', '#C026D3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientFill}
          >
            <Icon size={19} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={[styles.label, styles.activeLabel]}>{label}</Text>
          </LinearGradient>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.tabContent, { transform: [{ scale }] }]}>
          <Icon size={19} color="#6B6384" strokeWidth={2} />
          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.label}
            active={activeTab === tab.label}
            icon={tab.icon}
            label={tab.label}
            onPress={() => onTabPress(tab.label)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E3DDF2',
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    minWidth: 48,
    minHeight: 44,
    paddingHorizontal: 7,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  activePill: {
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientFill: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  label: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
    color: '#6B6384',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
});
