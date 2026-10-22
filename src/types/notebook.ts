export interface Account {
  id: string;
  name: string;
  created_at: number;
}

export interface Item {
  id: string;
  account_id: string;
  concept: string;
  amount: number;
  is_paid: number; // 0: pendiente, 1: pagado
  created_at: number;
}

export interface NotebookTotals {
  totalPending: number;
  totalPaid: number;
}

export interface CreateAccountDTO {
  name: string;
}

export interface CreateItemDTO {
  accountId: string;
  concept: string;
  amount: number;
}
