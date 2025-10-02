import { useTheme } from '@/contexts/ThemeContext';
import { Todo } from '@/types/todo';
import { getCurrentLocation } from '@/utils/location';
import { Calendar, MapIcon, MapPin, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';

interface TodoMapViewProps {
  todos: Todo[];
  visible: boolean;
  onClose: () => void;
  onTodoPress?: (todo: Todo) => void;
  showHeader?: boolean;
  useModal?: boolean; 
}

const TodoMapView: React.FC<TodoMapViewProps> = ({
  todos,
  visible,
  onClose,
  onTodoPress,
  showHeader = true,
  useModal = true,
}) => {
  const { theme } = useTheme();
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const todosWithLocation = todos.filter(
    (todo) => 
      todo.location.latitude !== undefined && 
      todo.location.longitude !== undefined
  );

  useEffect(() => {
    if (visible) {
      initializeMap();
    }
  }, [visible]);

  const initializeMap = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      if (currentLocation?.latitude && currentLocation?.longitude) {
        setRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else if (todosWithLocation.length > 0) {
        const firstTodo = todosWithLocation[0];
        if (firstTodo.location.latitude && firstTodo.location.longitude) {
          setRegion({
            latitude: firstTodo.location.latitude,
            longitude: firstTodo.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      }
    } catch (error) {
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  const getMarkerColor = (todo: Todo) => {
    if (todo.isCompleted) return '#10B981';
    const dueDate = new Date(todo.dueDate);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    if (hoursDiff < 0) return '#EF4444';
    if (hoursDiff < 24) return '#F59E0B';
    return '#3B82F6';
  };

  const handleMarkerPress = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleTodoSelect = () => {
    if (selectedTodo && onTodoPress) {
      onTodoPress(selectedTodo);
      setSelectedTodo(null);
      onClose();
    }
  };

  if (!visible && useModal) return null;

  const mapContent = (
    <View style={[styles.container, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
      {showHeader && (
        <View style={[styles.header, { backgroundColor: theme.colors.SECONDARY_BACKGROUND, borderBottomColor: theme.colors.PRIMARY_BORDER }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.PRIMARY_TEXT }]}>Tasks Map</Text>
          {useModal && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.PRIMARY_TEXT} />
            </TouchableOpacity>
          )}
        </View>
      )}

        {todosWithLocation.length === 0 ? (
          <View style={styles.emptyState}>
            <MapIcon size={64} color={theme.colors.TEXT_SECONDARY} />
            <Text style={[styles.emptyTitle, { color: theme.colors.PRIMARY_TEXT }]}>No Tasks with Location</Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.TEXT_SECONDARY }]}>
              Add locations to your tasks to see them on the map
            </Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton
          >
            {todosWithLocation.map((todo) => (
              <Marker
                key={todo.id}
                coordinate={{
                  latitude: todo.location.latitude!,
                  longitude: todo.location.longitude!,
                }}
                pinColor={getMarkerColor(todo)}
                onPress={() => handleMarkerPress(todo)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle} numberOfLines={2}>
                      {todo.title}
                    </Text>
                    <Text style={styles.calloutLocation} numberOfLines={1}>
                      📍 {todo.location.address}
                    </Text>
                    {todo.dueDate && (
                      <Text style={styles.calloutDate}>
                        📅 {formatDate(todo.dueDate)}
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}

        <View style={[styles.legend, { backgroundColor: theme.colors.SECONDARY_BACKGROUND, borderTopColor: theme.colors.PRIMARY_BORDER }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.legendText, { color: theme.colors.TEXT_SECONDARY }]}>Normal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.legendText, { color: theme.colors.TEXT_SECONDARY }]}>Due Soon</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.legendText, { color: theme.colors.TEXT_SECONDARY }]}>Overdue</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.legendText, { color: theme.colors.TEXT_SECONDARY }]}>Completed</Text>
          </View>
        </View>

        <Modal
          visible={!!selectedTodo}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedTodo(null)}
        >
          <View style={styles.modalOverlay}>
             <View style={[styles.todoModal, { backgroundColor: theme.colors.PRIMARY_BACKGROUND }]}>
              {selectedTodo && (
                <ScrollView>
                   <Text style={[styles.todoTitle, { color: theme.colors.PRIMARY_TEXT }]}>{selectedTodo.title}</Text>
                   
                   {selectedTodo.description && (
                     <Text style={[styles.todoDescription, { color: theme.colors.TEXT_SECONDARY }]}>
                       {selectedTodo.description}
                     </Text>
                   )}

                   <View style={styles.todoDetails}>
                     <View style={styles.detailRow}>
                       <MapPin size={16} color={theme.colors.TEXT_SECONDARY} />
                       <Text style={[styles.detailText, { color: theme.colors.PRIMARY_TEXT }]}>
                         {selectedTodo.location.address}
                       </Text>
                     </View>

                     {selectedTodo.dueDate && (
                       <View style={styles.detailRow}>
                         <Calendar size={16} color={theme.colors.TEXT_SECONDARY} />
                         <Text style={[styles.detailText, { color: theme.colors.PRIMARY_TEXT }]}>
                           {formatDate(selectedTodo.dueDate)}
                         </Text>
                       </View>
                     )}
                  </View>

                  <View style={styles.modalButtons}>
                    {onTodoPress && (
                       <TouchableOpacity
                         style={[styles.viewButton, { backgroundColor: theme.colors.PRIMARY_ACTIVE_BUTTON }]}
                         onPress={handleTodoSelect}
                       >
                         <Text style={styles.viewButtonText}>View Task</Text>
                       </TouchableOpacity>
                     )}
                     
                     <TouchableOpacity
                       style={[styles.closeModalButton, { backgroundColor: theme.colors.SECONDARY_BACKGROUND }]}
                       onPress={() => setSelectedTodo(null)}
                     >
                       <Text style={[styles.closeModalButtonText, { color: theme.colors.PRIMARY_TEXT }]}>Close</Text>
                     </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
    </View>
  );

  if (useModal) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        {mapContent}
      </Modal>
    );
  }

  return mapContent;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  map: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  callout: {
    minWidth: 200,
    maxWidth: 250,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutLocation: {
    fontSize: 12,
    marginBottom: 2,
  },
  calloutDate: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  todoModal: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  todoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  todoDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  todoDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TodoMapView;
