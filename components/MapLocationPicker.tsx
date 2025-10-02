import { useTheme } from '@/contexts/ThemeContext';
import { TodoLocation } from '@/types/todo';
import * as Location from 'expo-location';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';

interface MapLocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: TodoLocation) => void;
  initialLocation?: TodoLocation;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  visible,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || 55.7558,
    longitude: initialLocation?.longitude || 37.6176,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [selectedCoordinate, setSelectedCoordinate] = useState<LatLng | null>(
    initialLocation?.latitude && initialLocation?.longitude
      ? {
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
        }
      : null
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleMapPress = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedCoordinate(coordinate);
  };

  const handleConfirmLocation = async () => {
    if (!selectedCoordinate) {
      Alert.alert('No location selected', 'Please tap on the map to select a location.');
      return;
    }

    setIsLoading(true);
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
      });

      const address = reverseGeocode[0];
      let formattedAddress = '';
      
      if (address) {
        const parts = [
          address.street,
          address.streetNumber,
          address.city,
          address.region,
          address.country
        ].filter(Boolean);
        formattedAddress = parts.join(', ');
      }

      if (!formattedAddress) {
        formattedAddress = `${selectedCoordinate.latitude.toFixed(6)}, ${selectedCoordinate.longitude.toFixed(6)}`;
      }

      const todoLocation: TodoLocation = {
        address: formattedAddress,
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
        isFromGeolocation: true,
      };

      onLocationSelect(todoLocation);
      onClose();
    } catch (error) {
      const todoLocation: TodoLocation = {
        address: `${selectedCoordinate.latitude.toFixed(6)}, ${selectedCoordinate.longitude.toFixed(6)}`,
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
        isFromGeolocation: true,
      };

      onLocationSelect(todoLocation);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to get your current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newCoordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setSelectedCoordinate(newCoordinate);
      setRegion({
        ...newCoordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.PRIMARY_BORDER }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.PRIMARY_TEXT }]}>
            Select Location
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.PRIMARY_TEXT} />
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={[styles.instructionsText, { color: theme.colors.TEXT_SECONDARY }]}>
            Tap on the map to select a location for your task
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            mapType="standard"
            showsUserLocation
            showsMyLocationButton={false}
            loadingEnabled={true}
          >
            {selectedCoordinate && (
              <Marker
                coordinate={selectedCoordinate}
                title="Selected Location"
                description="This is your selected location"
                pinColor={theme.mode === 'dark' ? '#60A5FA' : '#3B82F6'}
              />
            )}
          </MapView>
        </View>

        <View style={[styles.bottomActions, { backgroundColor: theme.colors.SECONDARY_BACKGROUND }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.currentLocationButton, { backgroundColor: theme.colors.TEXT_SECONDARY }]}
            onPress={getCurrentLocation}
            disabled={isLoading}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.PRIMARY_BACKGROUND }]}>
              📍 Current Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.confirmButton,
              { backgroundColor: selectedCoordinate ? theme.colors.PRIMARY_ACTIVE_BUTTON : theme.colors.TEXT_SECONDARY },
            ]}
            onPress={handleConfirmLocation}
            disabled={!selectedCoordinate || isLoading}
          >
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
              {isLoading ? 'Loading...' : 'Confirm Location'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  instructionsText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    flex: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationButton: {
    flex: 0.6,
  },
  confirmButton: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapLocationPicker;

