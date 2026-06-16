const sqlite3 = require('sqlite3').verbose();

// Открываем базу данных с обработкой ошибки подключения
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('✅ Подключение к базе данных установлено');
  }
});

db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,           
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
  if (err) {
    console.error('❌ Ошибка при создании таблицы:', err.message);
  } else {
    console.log('✅ Таблица "tasks" готова к работе!');
  }
});

module.exports = db;