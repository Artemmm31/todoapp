import MapLocationPicker from '@/components/MapLocationPicker';
import { useTheme } from '@/contexts/ThemeContext';
import { TodoLocation } from '@/types/todo';
import { geocodeAddress, getCurrentLocation, getLocationSuggestions } from '@/utils/location';
import { ChevronDown, Map, MapPin, Navigation } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface LocationPickerProps {
  location: TodoLocation;
  onLocationChange: (location: TodoLocation) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationChange,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMapPickerVisible, setIsMapPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const { theme } = useTheme();
  
  const suggestions = getLocationSuggestions();

  const handleManualInput = (text: string) => {
    onLocationChange({
      ...location,
      address: text,
      latitude: undefined,
      longitude: undefined,
      isFromGeolocation: false,
    });
  };

  const handleSuggestionSelect = async (suggestion: string) => {
    setIsDropdownVisible(false);
    setIsLoading(true);
    
    try {
      const geocoded = await geocodeAddress(suggestion);
      if (geocoded) {
        onLocationChange(geocoded);
      } else {
        onLocationChange({
          address: suggestion,
          latitude: undefined,
          longitude: undefined,
          isFromGeolocation: false,
        });
      }
    } catch (error) {
      onLocationChange({
        address: suggestion,
        latitude: undefined,
        longitude: undefined,
        isFromGeolocation: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    
    try {
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        onLocationChange(currentLocation);
      } else {
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please check your location permissions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'An error occurred while getting your location.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapLocationSelect = (mapLocation: TodoLocation) => {
    onLocationChange(mapLocation);
    setIsMapPickerVisible(false);
  };

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.suggestionItem, { borderBottomColor: theme.colors.PRIMARY_BORDER }]}
      onPress={() => handleSuggestionSelect(item)}
    >
      <MapPin size={16} color={theme.colors.TEXT_SECONDARY} />
      <Text style={[styles.suggestionText, { color: theme.colors.PRIMARY_TEXT }]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: theme.colors.SECONDARY_BACKGROUND,
          borderColor: theme.colors.PRIMARY_BORDER,
        }
      ]}>
        <MapPin size={20} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
        <TextInput
          ref={textInputRef}
          style={[styles.textInput, { color: theme.colors.PRIMARY_TEXT }]}
          placeholder="Enter location..."
          placeholderTextColor={theme.colors.TEXT_SECONDARY}
          value={location.address}
          onChangeText={handleManualInput}
          multiline={false}
        />
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownVisible(true)}
        >
          <ChevronDown size={20} color={theme.colors.TEXT_SECONDARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.SECONDARY_BACKGROUND,
              borderColor: theme.colors.PRIMARY_BORDER,
            },
            isLoading && styles.disabledButton
          ]}
          onPress={handleCurrentLocation}
          disabled={isLoading}
        >
          <Navigation size={16} color={theme.colors.PRIMARY_ACTIVE_BUTTON} />
          <Text style={[styles.actionButtonText, { color: theme.colors.PRIMARY_ACTIVE_BUTTON }]}>
            {isLoading ? 'Getting...' : 'Current'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.PRIMARY_ACTIVE_BUTTON,
              borderColor: theme.colors.PRIMARY_ACTIVE_BUTTON,
            }
          ]}
          onPress={() => setIsMapPickerVisible(true)}
        >
          <Map size={16} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
            Select on Map
          </Text>
        </TouchableOpacity>
      </View>

      {location.latitude && location.longitude && (
        <Text style={[styles.coordinatesText, { color: theme.colors.TEXT_SECONDARY }]}>
          📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          {location.isFromGeolocation && ' (GPS)'}
        </Text>
      )}

      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.PRIMARY_TEXT, borderBottomColor: theme.colors.PRIMARY_BORDER }]}>Choose Location</Text>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item}
              style={styles.suggestionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <MapLocationPicker
        visible={isMapPickerVisible}
        onClose={() => setIsMapPickerVisible(false)}
        onLocationSelect={handleMapLocationSelect}
        initialLocation={location}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    minHeight: 24,
  },
  dropdownButton: {
    padding: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  coordinatesText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 12,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
  },
});

export default LocationPicker;
