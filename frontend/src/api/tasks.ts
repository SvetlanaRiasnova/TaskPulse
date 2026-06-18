import apiClient from "./client";
import type { Task } from '@/types/task';

export const taskApi = {
  getAll() {
    return apiClient.get<Task[]>('tasks');
  },
  getById(id: number) {
    return apiClient.get<Task>(`/tasks/${id}`);
  },
  create(task: Omit<Task, 'id' | 'createdAt'>) {
    return apiClient.post<Task>('/tasks', task);
  },
  update(id: number, task: Partial<Task>) {
    return apiClient.put<Task>(`/tasks/${id}`, task);
  },
  delete(id: number) {
    return apiClient.delete<Task>(`/tasks/${id}`);
  },
};
