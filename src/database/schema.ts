import type { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  // Configuración de rendimiento e integridad
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY NOT NULL,
      account_id TEXT NOT NULL,
      concept TEXT NOT NULL,
      amount REAL NOT NULL,
      is_paid INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_items_account ON items(account_id);
    CREATE INDEX IF NOT EXISTS idx_items_paid ON items(account_id, is_paid);
  `);

  // Semilla inicial si no hay cuentas registradas
  const countRow = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM accounts;'
  );

  if (!countRow || countRow.count === 0) {
    const now = Date.now();
    await db.runAsync(
      'INSERT INTO accounts (id, name, created_at) VALUES (?, ?, ?);',
      'acc-default',
      'Hoja',
      now
    );
  } else {
    // Si ya existía la cuenta por defecto con el nombre 'Kevin', actualizarla a 'Hoja'
    await db.runAsync(
      "UPDATE accounts SET name = 'Hoja' WHERE name = 'Kevin' AND id = 'acc-default';"
    );
  }
}
