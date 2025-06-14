import React from 'react';
import { Todo } from '../services/todoService';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, description: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onUpdate }) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet. Create your first todo above!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <h2>Your Todos ({todos.length})</h2>
      <div className="todo-items">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;