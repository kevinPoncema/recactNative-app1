import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';
import type { Account, Item, NotebookTotals } from '../types/notebook';
import { notebookRepository } from '../database/repository';

export function useNotebook() {
  const db = useSQLiteContext();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [totals, setTotals] = useState<NotebookTotals>({ totalPending: 0, totalPaid: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar cuentas
  const loadAccounts = useCallback(async () => {
    try {
      const list = await notebookRepository.getAccounts(db);
      setAccounts(list);
      setActiveAccountId((current) => {
        if (current && list.some((a) => a.id === current)) {
          return current;
        }
        return list.length > 0 ? list[0].id : null;
      });
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
    }
  }, [db]);

  // Cargar renglones y totales de la cuenta activa
  const loadSheetData = useCallback(async (accountId: string) => {
    try {
      const [itemList, currentTotals] = await Promise.all([
        notebookRepository.getItemsByAccount(db, accountId),
        notebookRepository.getTotalsByAccount(db, accountId),
      ]);
      setItems(itemList);
      setTotals(currentTotals);
    } catch (error) {
      console.error('Error al cargar datos de la libreta:', error);
    }
  }, [db]);

  // Inicialización de cuentas
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const list = await notebookRepository.getAccounts(db);
        if (isMounted) {
          setAccounts(list);
          if (list.length > 0) {
            setActiveAccountId(list[0].id);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error al inicializar libreta:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [db]);

  // Sincronizar datos al cambiar la cuenta activa
  useEffect(() => {
    let isMounted = true;
    const syncActiveAccount = async () => {
      if (!activeAccountId) {
        return;
      }
      try {
        const [itemList, currentTotals] = await Promise.all([
          notebookRepository.getItemsByAccount(db, activeAccountId),
          notebookRepository.getTotalsByAccount(db, activeAccountId),
        ]);
        if (isMounted) {
          setItems(itemList);
          setTotals(currentTotals);
        }
      } catch (error) {
        console.error('Error al cargar datos de la cuenta activa:', error);
      }
    };

    syncActiveAccount();

    return () => {
      isMounted = false;
    };
  }, [activeAccountId, db]);

  // Acciones de cuenta
  const createAccount = async (name: string): Promise<Account | null> => {
    try {
      const newAcc = await notebookRepository.createAccount(db, name);
      await loadAccounts();
      setActiveAccountId(newAcc.id);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      return newAcc;
    } catch (err) {
      console.error('Error al crear cuenta:', err);
      return null;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      await notebookRepository.deleteAccount(db, accountId);
      const remaining = accounts.filter((a) => a.id !== accountId);
      setAccounts(remaining);
      if (activeAccountId === accountId) {
        setActiveAccountId(remaining.length > 0 ? remaining[0].id : null);
      }
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
    }
  };

  // Acciones de renglones
  const addItem = async (concept: string, amount: number) => {
    if (!activeAccountId) return;
    try {
      await notebookRepository.addItem(db, activeAccountId, concept, amount);
      await loadSheetData(activeAccountId);
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    } catch (err) {
      console.error('Error al agregar ítem:', err);
    }
  };

  const toggleItemPaid = async (itemId: string) => {
    if (!activeAccountId) return;
    try {
      // Feedback táctil inmediato
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}

      // Actualización optimista de UI
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, is_paid: it.is_paid === 1 ? 0 : 1 } : it))
      );

      await notebookRepository.toggleItemPaid(db, itemId);
      await loadSheetData(activeAccountId);
    } catch (err) {
      console.error('Error al alternar estado pagado:', err);
      if (activeAccountId) await loadSheetData(activeAccountId);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!activeAccountId) return;
    try {
      setItems((prev) => prev.filter((it) => it.id !== itemId));
      await notebookRepository.deleteItem(db, itemId);
      await loadSheetData(activeAccountId);
      try {
        await Haptics.selectionAsync();
      } catch {}
    } catch (err) {
      console.error('Error al borrar ítem:', err);
      if (activeAccountId) await loadSheetData(activeAccountId);
    }
  };

  const clearSheet = async () => {
    if (!activeAccountId) return;
    try {
      await notebookRepository.clearAccountItems(db, activeAccountId);
      await loadSheetData(activeAccountId);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
    } catch (err) {
      console.error('Error al vaciar hoja:', err);
    }
  };

  const activeAccount = accounts.find((a) => a.id === activeAccountId) || null;

  return {
    accounts,
    activeAccount,
    items,
    totals,
    isLoading,
    selectAccount: (accId: string) => setActiveAccountId(accId),
    createAccount,
    deleteAccount,
    addItem,
    toggleItemPaid,
    deleteItem,
    clearSheet,
  };
}
