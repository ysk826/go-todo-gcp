import React, { useState } from 'react';

interface TodoFormProps {
  onSubmit: (title: string, description: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todo-form-container">
      <h2>Add New Todo</h2>
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            disabled={isSubmitting}
            className="title-input"
          />
        </div>
        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            disabled={isSubmitting}
            className="description-input"
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;