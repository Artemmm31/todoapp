import { STORAGE_KEY } from "@/constants/storage";
import { Todo } from "@/types/todo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
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
      console.log(e);
    }
  };
  const onAddTodo = (todo: Omit<Todo, "id" | "isCompleted">) => {
    setTodos([
      ...todos,
      {
        id: Date.now(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        ...todo,
      },
    ]);
  };
  const onDeleteTodo = (id: Todo["id"]) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onCheckTodo = (id: Todo["id"]) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };
  const onUpdateTodo = (id: Todo["id"], updated: Partial<Todo>) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, ...updated } : todo))
    );
  };

  const completedTodos = todos.filter((todo) => todo.isCompleted);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTodos();
    }
  }, [todos]);

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
