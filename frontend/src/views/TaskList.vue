<template>
  <div>
    <h1>Мои задачи</h1>
    <button @click="store.fetchTasks">Обновить</button>
    <div v-if="store.loading">Загрузка...</div>
    <ul v-else>
      <li v-for="task in store.tasks" :key="task.id">
        <input type="checkbox" :checked="task.completed" @change="toggleTask(task)" />
        {{ task.title }}
        <button @click="store.deleteTask(task.id)">🗑️</button>
      </li>
    </ul>
    <input v-model="newTitle" placeholder="Новая задача" />
    <button @click="createTask">Добавить</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';

const store = useTaskStore(); // подключаем хранилище
const newTitle = ref(''); // реактивная переменная для поля ввода

const toggleTask = (task: any) => {
  store.updateTask(task.id, { completed: !task.completed });
};

const createTask = () => {
  if (!newTitle.value.trim()) return;
  store.addTask({ title: newTitle.value, description: '', completed: false });
  newTitle.value = ''; // очищаем поле
};

onMounted(() => {
  store.fetchTasks(); // загружаем задачи сразу при загрузке страницы
});
</script>
