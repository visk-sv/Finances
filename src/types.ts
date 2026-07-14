export type AllocationType = 'percent' | 'fixed';

export type CategoryColor =
  | 'brand'
  | 'mint'
  | 'coral'
  | 'amber'
  | 'violet'
  | 'slate';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: CategoryColor;
  defaultAllocationType: AllocationType;
  defaultAllocationValue: number;
  archived?: boolean;
}

export type IncomeSource = 'salary' | 'gift' | 'sale' | 'other';

export interface IncomeEntry {
  id: string;
  source: IncomeSource;
  label: string;
  amount: number;
  date: string;
  note?: string;
}

export interface CategoryAllocation {
  categoryId: string;
  type: AllocationType;
  value: number;
  transferred: boolean;
}

export interface Loan {
  id: string;
  fromCategoryId: string;
  toCategoryId: string;
  amount: number;
  reason: string;
  createdMonth: string;
  createdDate: string;
  repaid: boolean;
  repaidMonth?: string;
  repaidDate?: string;
}

export interface MonthData {
  key: string;
  incomes: IncomeEntry[];
  allocations: CategoryAllocation[];
}
