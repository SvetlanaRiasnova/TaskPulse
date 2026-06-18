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
      title: title,
      description: description || '',
      completed: 0,
      message: '✅ Задача успешно создана!'
    });
  });
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
  const id = req.params.id;
  const query = `SELECT * FROM tasks WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.starus(500).json({ error: err.message})
    } 
    if (!row) {
      return res.status(404).json({ error: 'Задача не найдена'});
    }
    res.json(row);
  });
});

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const{ title, description, completed} = req.body;

  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({ error: 'Не переданы поля для обновления'})
  }

  let query = 'UPDATE tasks SET ';
  const params = [];
  const updates = [];

  if (title !== undefined) {
    updates.push('title = ?');
    params.push(title);
  }

  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }

  if (completed !== undefined) {
    updates.push('completed = ?');
    params.push(completed);
  }

  query += updates.join(', ');
  query += ' WHERE id = ?';
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message}); 
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Задача не найдена'})
    }

    res.json({
      id: parseInt(id),
      title: title !== undefined ? title : undefined,
      description: description !== undefined ? description : undefined,
      completed: completed !== undefined ? completed : undefined,
      message: '✅ Задача обновлена'
    })
  })
})

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const query =  `DELETE FROM tasks WHERE id = ?`;

  db.run( query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message});
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Задача не найдена'});
    }

    res.json({ message: '🗑️ Задача удалена'});
  })

})

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log(`🔹 Эндпоинт /ping доступен для проверки`);
})