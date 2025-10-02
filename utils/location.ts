import { TodoLocation } from '@/types/todo';
import * as Location from 'expo-location';

export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
};

export const getCurrentLocation = async (): Promise<TodoLocation | null> => {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const address = reverseGeocode[0];
    const formattedAddress = address 
      ? `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''}, ${address.region || ''}`
      : `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;

    return {
      address: formattedAddress.trim(),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      isFromGeolocation: true,
    };
  } catch (error) {
    return null;
  }
};

export const geocodeAddress = async (address: string): Promise<TodoLocation | null> => {
  try {
    const geocoded = await Location.geocodeAsync(address);
    if (geocoded.length > 0) {
      const location = geocoded[0];
      return {
        address,
        latitude: location.latitude,
        longitude: location.longitude,
        isFromGeolocation: false,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getLocationSuggestions = (): string[] => [
  'Home',
  'Work',
  'Office',
  'School',
  'University',
  'Gym',
  'Hospital',
  'Shopping Mall',
  'Restaurant',
  'Library',
  'Park',
  'Coffee Shop',
  'Bank',
  'Post Office',
  'Pharmacy',
];
