import type { SQLiteDatabase } from 'expo-sqlite';
import type { Account, Item, NotebookTotals } from '../types/notebook';

const generateId = (prefix: string = 'id'): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;

export const notebookRepository = {
  async getAccounts(db: SQLiteDatabase): Promise<Account[]> {
    return await db.getAllAsync<Account>(
      'SELECT id, name, created_at FROM accounts ORDER BY created_at ASC;'
    );
  },

  async createAccount(db: SQLiteDatabase, name: string): Promise<Account> {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('El nombre de la cuenta no puede estar vacío');
    }
    const newAccount: Account = {
      id: generateId('acc'),
      name: trimmed,
      created_at: Date.now(),
    };

    await db.runAsync(
      'INSERT INTO accounts (id, name, created_at) VALUES (?, ?, ?);',
      newAccount.id,
      newAccount.name,
      newAccount.created_at
    );

    return newAccount;
  },

  async deleteAccount(db: SQLiteDatabase, accountId: string): Promise<void> {
    await db.runAsync('DELETE FROM accounts WHERE id = ?;', accountId);
  },

  async renameAccount(db: SQLiteDatabase, accountId: string, newName: string): Promise<void> {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await db.runAsync('UPDATE accounts SET name = ? WHERE id = ?;', trimmed, accountId);
  },

  async getItemsByAccount(db: SQLiteDatabase, accountId: string): Promise<Item[]> {
    return await db.getAllAsync<Item>(
      'SELECT id, account_id, concept, amount, is_paid, created_at FROM items WHERE account_id = ? ORDER BY created_at ASC;',
      accountId
    );
  },

  async addItem(
    db: SQLiteDatabase,
    accountId: string,
    concept: string,
    amount: number
  ): Promise<Item> {
    const trimmedConcept = concept.trim();
    if (!trimmedConcept) {
      throw new Error('Debes escribir un concepto');
    }
    const validAmount = isNaN(amount) || amount < 0 ? 0 : amount;

    const newItem: Item = {
      id: generateId('item'),
      account_id: accountId,
      concept: trimmedConcept,
      amount: validAmount,
      is_paid: 0,
      created_at: Date.now(),
    };

    await db.runAsync(
      'INSERT INTO items (id, account_id, concept, amount, is_paid, created_at) VALUES (?, ?, ?, ?, ?, ?);',
      newItem.id,
      newItem.account_id,
      newItem.concept,
      newItem.amount,
      newItem.is_paid,
      newItem.created_at
    );

    return newItem;
  },

  async toggleItemPaid(db: SQLiteDatabase, itemId: string): Promise<void> {
    await db.runAsync(
      'UPDATE items SET is_paid = CASE WHEN is_paid = 1 THEN 0 ELSE 1 END WHERE id = ?;',
      itemId
    );
  },

  async deleteItem(db: SQLiteDatabase, itemId: string): Promise<void> {
    await db.runAsync('DELETE FROM items WHERE id = ?;', itemId);
  },

  async clearAccountItems(db: SQLiteDatabase, accountId: string): Promise<void> {
    await db.runAsync('DELETE FROM items WHERE account_id = ?;', accountId);
  },

  async getTotalsByAccount(db: SQLiteDatabase, accountId: string): Promise<NotebookTotals> {
    const row = await db.getFirstAsync<{ total_pending: number; total_paid: number }>(
      `SELECT 
        COALESCE(SUM(CASE WHEN is_paid = 0 THEN amount ELSE 0 END), 0) AS total_pending,
        COALESCE(SUM(CASE WHEN is_paid = 1 THEN amount ELSE 0 END), 0) AS total_paid
       FROM items
       WHERE account_id = ?;`,
      accountId
    );

    return {
      totalPending: row ? Number(row.total_pending) : 0,
      totalPaid: row ? Number(row.total_paid) : 0,
    };
  },
};
