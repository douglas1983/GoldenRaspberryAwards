import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const setupDatabase = async (): Promise<void> => {
  if (db) return; // já inicializado

  db = await open({
    filename: ':memory:', // pode trocar para arquivo ex: './db.sqlite'
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS awards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      title TEXT,
      studios TEXT,
      producers TEXT,
      winner BOOLEAN
    )
  `);
};

export const getDb = (): Database<sqlite3.Database, sqlite3.Statement> => {
  if (!db) {
    throw new Error('Database não inicializado. Execute setupDatabase antes.');
  }
  return db;
};
