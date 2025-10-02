import { STORAGE_KEY } from "@/constants/storage";
import { NetworkService } from "@/services/networkService";
import { SyncService } from "@/services/syncService";
import { Todo } from "@/types/todo";
import { cancelNotification, scheduleNotification, updateNotification } from "@/utils/notifications";
import { addLogEntry } from "@/utils/taskLog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const networkService = NetworkService.getInstance();
  const syncService = SyncService.getInstance();

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
        } else {
          setTodos([]);
        }
      } else {
        setTodos([]);
      }
    } catch (e) {
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
    }
  };
  const onAddTodo = async (todo: Omit<Todo, "id" | "isCompleted">) => {
    const newTodo: Todo = {
      ...todo,
        id: Date.now() + Math.random(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      attachments: todo.attachments || [],
      location: todo.location || { address: '' },
    };

    if (newTodo.dueDate) {
      const notificationId = await scheduleNotification(
        newTodo.title,
        newTodo.description,
        newTodo.dueDate
      );
      if (notificationId) {
        newTodo.notificationId = notificationId;
      }
    }
    
    setTodos(prevTodos => [...prevTodos, newTodo]);
    
    await addLogEntry(
      newTodo.id,
      newTodo.title,
      'created',
      `Task created with due date: ${newTodo.dueDate ? new Date(newTodo.dueDate).toLocaleDateString() : 'No due date'}`
    );
  };
  const onDeleteTodo = async (id: Todo["id"]) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (todoToDelete?.notificationId) {
      await cancelNotification(todoToDelete.notificationId);
    }
    
    setTodos(todos.filter((todo) => todo.id !== id));
    
    if (todoToDelete) {
      await addLogEntry(
        todoToDelete.id,
        todoToDelete.title,
        'deleted',
        'Task permanently deleted'
      );
    }
  };

  const onCheckTodo = async (id: Todo["id"]) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;
    
    const newCompletedStatus = !todoToUpdate.isCompleted;
    
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: newCompletedStatus } : todo
      )
    );
    
    await addLogEntry(
      todoToUpdate.id,
      todoToUpdate.title,
      newCompletedStatus ? 'completed' : 'uncompleted',
      newCompletedStatus ? 'Task marked as completed' : 'Task marked as incomplete'
    );
  };
  const onUpdateTodo = async (id: Todo["id"], updated: Partial<Todo>) => {
    const existingTodo = todos.find(todo => todo.id === id);
    if (!existingTodo) return;

    let newNotificationId = existingTodo.notificationId;

    if (updated.dueDate !== undefined || updated.title !== undefined) {
      const newTitle = updated.title || existingTodo.title;
      const newDueDate = updated.dueDate || existingTodo.dueDate;
      
      newNotificationId = await updateNotification(
        existingTodo.notificationId,
        newTitle,
        newDueDate
      ) || undefined;
    }

    setTodos(
      todos.map((todo) => 
        todo.id === id 
          ? { ...todo, ...updated, notificationId: newNotificationId || undefined }
          : todo
      )
    );
    
    const updatedFields = Object.keys(updated);
    let logDetails = `Updated: ${updatedFields.join(', ')}`;
    
    if (updated.title && updated.title !== existingTodo.title) {
      logDetails += ` | Title: "${existingTodo.title}" → "${updated.title}"`;
    }
    if (updated.dueDate && updated.dueDate !== existingTodo.dueDate) {
      const oldDate = existingTodo.dueDate ? new Date(existingTodo.dueDate).toLocaleDateString() : 'None';
      const newDate = updated.dueDate ? new Date(updated.dueDate).toLocaleDateString() : 'None';
      logDetails += ` | Due date: ${oldDate} → ${newDate}`;
    }
    
    await addLogEntry(
      existingTodo.id,
      updated.title || existingTodo.title,
      'updated',
      logDetails,
      existingTodo,
      { ...existingTodo, ...updated }
    );
  };

  const completedTodos = todos.filter((todo) => todo.isCompleted);

  useEffect(() => {
    loadTodos();
    
    networkService.getCurrentState();
    syncService.getSyncState();
  }, []);

  useEffect(() => {
    if (!isLoading && todos.length >= 0) {
      saveTodos();
    }
  }, [todos, isLoading]);

  return {
    onAddTodo,
    onDeleteTodo,
    onCheckTodo,
    onUpdateTodo,
    todos,
    completedTodos,
    isLoading,
  };
};

export default useTodo;
