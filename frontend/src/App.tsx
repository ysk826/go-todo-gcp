import React, { useState, useEffect } from 'react';
import './App.css';
import { todoService, Todo } from './services/todoService';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getAllTodos();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (title: string, description: string) => {
    try {
      const newTodo = await todoService.createTodo(title, description);
      setTodos([...todos, newTodo]);
      setError('');
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await todoService.updateTodo(id, {
        completed: !todo.completed
      });
      
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  const handleUpdateTodo = async (id: number, title: string, description: string) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, {
        title,
        description
      });
      
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App</h1>
        <p>Go + React + TypeScript + MySQL</p>
      </header>
      
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        
        <TodoForm onSubmit={handleCreateTodo} />
        
        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}
      </main>
    </div>
  );
};

export default App;