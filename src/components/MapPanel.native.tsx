import React, { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import type { OfferWithDistance } from '../domain/distance';

type Coordinate = { latitude: number; longitude: number };

export default function MapPanel({ offers, onSelect, user }: {
  offers: OfferWithDistance[];
  onSelect: (id: string) => void;
  user?: Coordinate;
}) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (user) {
      mapRef.current?.animateToRegion({ ...user, latitudeDelta: 0.16, longitudeDelta: 0.16 }, 500);
    }
  }, [user]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{ latitude: 44.972, longitude: -93.156, latitudeDelta: 0.16, longitudeDelta: 0.16 }}
      showsUserLocation={Boolean(user)}
    >
      {offers.map(offer => (
        <Marker
          key={offer.id}
          coordinate={{ latitude: offer.lat, longitude: offer.lng }}
          title={offer.name}
          description={`${offer.discount} · ${offer.distanceMiles.toFixed(1)} mi`}
          pinColor="#D8B25A"
          onCalloutPress={() => onSelect(offer.id)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({ map: { height: 260, borderRadius: 18, overflow: 'hidden' } });
