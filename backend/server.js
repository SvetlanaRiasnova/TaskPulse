const express = require('express');
const cors = require('cors');
const db = require('./database')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 Сервер TaskPulse работает!')
})
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/tasks', (req, res) => {
    const query = `SELECT * FROM  tasks ORDER BY id DESC`;

    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/tasks/:id', (req, res) => {

})
// Ручка для создания задачи (POST /tasks)
// Сюда мы будем отправлять данные из Vue, чтобы сохранить задачу в БД
app.post('/tasks', (req, res) => {
  console.log('📦 Тело запроса:', req.body);
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Поле "title" обязательно для заполнения' });
  }

  const query = `INSERT INTO tasks (title, description) VALUES (?, ?)`;

  db.run(query, [title, description || ''], function(err) {

    if (err) {

      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      title,
      description: description || '',
      completed: 0,
      message: '✅ Задача успешно создана!'
    });
  });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log(`🔹 Эндпоинт /ping доступен для проверки`);
})