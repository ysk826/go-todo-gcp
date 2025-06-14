import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const todoService = {
  // 全てのTodoを取得
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  // IDでTodoを取得
  getTodoById: async (id: number): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // 新しいTodoを作成
  createTodo: async (title: string, description: string): Promise<Todo> => {
    const data: CreateTodoRequest = { title, description };
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  // Todoを更新
  updateTodo: async (id: number, updates: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, updates);
    return response.data;
  },

  // Todoを削除
  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // サーバーからエラーレスポンスがあった場合
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.error || 'API request failed');
    } else if (error.request) {
      // リクエストが送信されたが、レスポンスが返ってこない場合
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      // その他のエラー
      console.error('Error:', error.message);
      throw error;
    }
  }
);