import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, CategoryAllocation, IncomeEntry, Loan, MonthData } from '../types';
import { DEFAULT_CATEGORIES } from '../lib/defaultCategories';
import { monthKey } from '../lib/month';

function newId(): string {
  return crypto.randomUUID();
}

function buildAllocationsForMonth(categories: Category[]): CategoryAllocation[] {
  return categories
    .filter((c) => !c.archived)
    .map((c) => ({
      categoryId: c.id,
      type: c.defaultAllocationType,
      value: c.defaultAllocationValue,
      transferred: false,
    }));
}

interface BudgetState {
  categories: Category[];
  months: Record<string, MonthData>;
  loans: Loan[];
  currentMonth: string;

  setCurrentMonth: (key: string) => void;
  ensureMonth: (key: string) => void;

  addIncome: (monthKey: string, entry: Omit<IncomeEntry, 'id'>) => void;
  removeIncome: (monthKey: string, id: string) => void;

  upsertAllocation: (monthKey: string, categoryId: string, patch: Partial<Pick<CategoryAllocation, 'type' | 'value'>>) => void;
  toggleTransferred: (monthKey: string, categoryId: string) => void;

  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addLoan: (loan: Omit<Loan, 'id' | 'repaid'>) => void;
  toggleLoanRepaid: (id: string, repaidMonth?: string) => void;
  deleteLoan: (id: string) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      months: {},
      loans: [],
      currentMonth: monthKey(new Date()),

      setCurrentMonth: (key) => {
        get().ensureMonth(key);
        set({ currentMonth: key });
      },

      ensureMonth: (key) => {
        set((state) => {
          if (state.months[key]) return state;
          return {
            months: {
              ...state.months,
              [key]: {
                key,
                incomes: [],
                allocations: buildAllocationsForMonth(state.categories),
              },
            },
          };
        });
      },

      addIncome: (mKey, entry) => {
        get().ensureMonth(mKey);
        set((state) => {
          const month = state.months[mKey];
          return {
            months: {
              ...state.months,
              [mKey]: { ...month, incomes: [...month.incomes, { ...entry, id: newId() }] },
            },
          };
        });
      },

      removeIncome: (mKey, id) => {
        set((state) => {
          const month = state.months[mKey];
          if (!month) return state;
          return {
            months: {
              ...state.months,
              [mKey]: { ...month, incomes: month.incomes.filter((i) => i.id !== id) },
            },
          };
        });
      },

      upsertAllocation: (mKey, categoryId, patch) => {
        get().ensureMonth(mKey);
        set((state) => {
          const month = state.months[mKey];
          const exists = month.allocations.some((a) => a.categoryId === categoryId);
          const allocations = exists
            ? month.allocations.map((a) => (a.categoryId === categoryId ? { ...a, ...patch } : a))
            : [...month.allocations, { categoryId, type: patch.type ?? 'percent', value: patch.value ?? 0, transferred: false }];
          return { months: { ...state.months, [mKey]: { ...month, allocations } } };
        });
      },

      toggleTransferred: (mKey, categoryId) => {
        set((state) => {
          const month = state.months[mKey];
          if (!month) return state;
          return {
            months: {
              ...state.months,
              [mKey]: {
                ...month,
                allocations: month.allocations.map((a) =>
                  a.categoryId === categoryId ? { ...a, transferred: !a.transferred } : a,
                ),
              },
            },
          };
        });
      },

      addCategory: (cat) => {
        set((state) => ({ categories: [...state.categories, { ...cat, id: newId() }] }));
      },

      updateCategory: (id, patch) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, archived: true } : c)),
        }));
      },

      addLoan: (loan) => {
        set((state) => ({ loans: [...state.loans, { ...loan, id: newId(), repaid: false }] }));
      },

      toggleLoanRepaid: (id, repaidMonth) => {
        set((state) => ({
          loans: state.loans.map((l) => {
            if (l.id !== id) return l;
            if (l.repaid) {
              const { repaidMonth: _rm, repaidDate: _rd, ...rest } = l;
              return { ...rest, repaid: false };
            }
            return {
              ...l,
              repaid: true,
              repaidMonth: repaidMonth ?? l.createdMonth,
              repaidDate: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteLoan: (id) => {
        set((state) => ({ loans: state.loans.filter((l) => l.id !== id) }));
      },
    }),
    {
      name: 'finances-budget-store',
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.ensureMonth(state.currentMonth);
      },
    },
  ),
);
