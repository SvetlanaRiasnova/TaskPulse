import { defineStore } from "pinia";
import { ref } from 'vue';

import { taskApi } from "@/api/tasks";
import type { Task } from '@/types/task';

export const useTaskStore = defineStore('tasks', () => {

  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const loadingFetch = ref(false);
  const loadingGetOne = ref(false);
  const loadingAdd = ref(false);
  const loadingUpdate = ref(false);
  const loadingDelete = ref(false);

  const fetchTasks = async () => {
    loadingFetch.value = true;
    try {
      const res = await taskApi.getAll();
      tasks.value = res.data;
    } catch (error) {
      console.error('Ошибка загрузки задач', error);
    } finally {
      loadingFetch.value = false;
    };
  };

  const getOne = async (id: number) => {
    loadingGetOne.value = true;
    try{
      const res = await taskApi.getById(id);
      currentTask.value = res.data;
    } catch (error) {
      console.error('Ошибка получения задачи', error);
      currentTask.value = null;
    } finally {
      loadingGetOne.value = false;
    };
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    loadingAdd.value = true;
    try {
      const res = await taskApi.create(task);
      tasks.value.push(res.data);
    } catch (error) {
      console.error('Ошибка создания задачи', error);
    } finally {
      loadingAdd.value = false
    };
  };

  const updateTask = async(id: number, updated: Partial<Task>) => {
    loadingUpdate.value = true;
    try {
      const res = await taskApi.update(id, updated);
      const index = tasks.value.findIndex(t => t.id === id);
      if (index !== -1) tasks.value[index] = res.data;
    } catch (error) {
      console.error('Ошибка обновления задачи', error);
    } finally {
      loadingUpdate.value = false;
    }
  };

  const deleteTask = async (id: number) => {
    loadingDelete.value = true;
    try {
      const res = await taskApi.delete(id);
      tasks.value = tasks.value.filter(t => t.id !== id);
    } catch (error) {
      console.error('Ошбика при удалении задачи', error);
    } finally {
      loadingDelete.value = false;
    };
  };

  return { tasks, currentTask, loadingAdd, loadingDelete, loadingFetch, loadingGetOne, loadingUpdate, fetchTasks, getOne, updateTask, addTask, deleteTask }
});
