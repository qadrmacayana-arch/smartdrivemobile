import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingScreenProps {
  onFinish: () => void;
}

export function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [progress, setProgress] = useState(15);
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const brandScale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(brandScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          Animated.timing(screenOpacity, {
            toValue: 0,
            duration: 350,
            delay: 250,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) onFinish();
          });
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [brandScale, onFinish, screenOpacity]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
          <View style={styles.menuLines}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <View style={styles.smallLogo}>
          <Text style={styles.smallLogoText}>SD</Text>
        </View>
        <View style={styles.environmentPill}>
          <Text style={styles.environmentText}>0. Loading / Splash Screen</Text>
          <ChevronDown size={14} color="#6D28D9" />
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.brandMarkWrap, { transform: [{ scale: brandScale }] }]}>
          <LinearGradient
            colors={['#6D28D9', '#7C3AED', '#D946EF']}
            style={styles.brandMark}
          >
            <Text style={styles.brandMarkText}>SD</Text>
          </LinearGradient>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v2.4</Text>
          </View>
        </Animated.View>

        <Text style={styles.title}>SmartDrive<Text style={styles.titleAccent}>™</Text></Text>
        <Text style={styles.tagline}>Pioneering Connected Vehicle Rentals</Text>
        <Text style={styles.institution}>Technological Institute of the Philippines • QC{'\n'}Campus</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.loadingText}>Initializing Fleet &amp; Engine (100%)...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.complianceText}>RA 10713 Privacy &amp; LTFRB Compliance Secured</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FD',
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLines: { gap: 3 },
  menuLine: {
    width: 17,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#6D28D9',
  },
  smallLogo: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#C026D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  smallLogoText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  environmentPill: {
    height: 25,
    minWidth: 126,
    marginLeft: 'auto',
    paddingHorizontal: 9,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  environmentText: {
    color: '#6D28D9',
    fontSize: 8,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandMarkWrap: {
    position: 'relative',
    marginBottom: 19,
  },
  brandMark: {
    width: 74,
    height: 74,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  versionBadge: {
    position: 'absolute',
    right: -4,
    bottom: -6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#FACC15',
  },
  versionText: {
    color: '#713F12',
    fontSize: 8,
    fontWeight: '900',
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  titleAccent: {
    color: '#7C3AED',
    fontSize: 10,
    verticalAlign: 'top',
  },
  tagline: {
    color: '#6D28D9',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  institution: {
    color: '#94A3B8',
    fontSize: 8,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 7,
  },
  progressTrack: {
    width: '72%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DDD6FE',
    overflow: 'hidden',
    marginTop: 18,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#C026D3',
  },
  loadingText: {
    color: '#7C3AED',
    fontFamily: 'monospace',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 19,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 47,
  },
  complianceText: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 9,
  },
});
