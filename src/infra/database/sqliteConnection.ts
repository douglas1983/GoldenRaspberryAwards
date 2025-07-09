import Database from 'better-sqlite3';

let db: Database.Database;

export const setupDatabase = async () => {
  db = new Database(':memory:');
  db.prepare(`
    CREATE TABLE IF NOT EXISTS awards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      title TEXT,
      studios TEXT,
      producers TEXT,
      winner BOOLEAN
    )
  `).run();
};

export const getDb = () => db;
