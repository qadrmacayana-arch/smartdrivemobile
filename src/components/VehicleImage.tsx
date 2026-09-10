import React, { useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, View } from 'react-native';
import { FALLBACK_VEHICLE_IMAGE } from '../constants/vehicles';

interface VehicleImageProps {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  label?: string;
}

export function VehicleImage({ uri, style, label = 'Vehicle image' }: VehicleImageProps) {
  const [imageUri, setImageUri] = useState(uri);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  useEffect(() => {
    setImageUri(uri);
    setFallbackFailed(false);
  }, [uri]);

  const handleError = () => {
    if (imageUri !== FALLBACK_VEHICLE_IMAGE) {
      setImageUri(FALLBACK_VEHICLE_IMAGE);
      return;
    }
    setFallbackFailed(true);
  };

  return (
    <View style={[styles.container, style]}>
      {imageUri && !fallbackFailed ? (
        <Image
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={handleError}
        />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.icon}>🚘</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#EDE9FE',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4C1D95',
  },
  icon: {
    fontSize: 30,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
});
