import type { Category, Loan, MonthData } from '../types';
import { monthAllocatedTotal, monthTotalIncome } from './calculations';
import { monthKey as toMonthKey, monthLabel, shiftMonth } from './month';

export interface MonthSeriesPoint {
  key: string;
  label: string;
  shortLabel: string;
  income: number;
  allocated: number;
}

export function recentMonthsSeries(
  months: Record<string, MonthData>,
  count: number,
  endKey: string = toMonthKey(new Date()),
): MonthSeriesPoint[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) keys.push(shiftMonth(endKey, -i));

  return keys.map((key) => {
    const month = months[key];
    const income = monthTotalIncome(month);
    const allocated = monthAllocatedTotal(month, income);
    const full = monthLabel(key);
    return {
      key,
      label: full,
      shortLabel: full.split(' ')[0].slice(0, 3),
      income,
      allocated,
    };
  });
}

export interface CategoryBreakdownPoint {
  categoryId: string;
  name: string;
  icon: string;
  color: Category['color'];
  amount: number;
}

export function categoryBreakdown(month: MonthData | undefined, categories: Category[]): CategoryBreakdownPoint[] {
  if (!month) return [];
  const totalIncome = monthTotalIncome(month);
  return month.allocations
    .map((a) => {
      const cat = categories.find((c) => c.id === a.categoryId);
      if (!cat) return null;
      const amount = a.type === 'percent' ? (totalIncome * a.value) / 100 : a.value;
      return { categoryId: cat.id, name: cat.name, icon: cat.icon, color: cat.color, amount };
    })
    .filter((v): v is CategoryBreakdownPoint => v !== null && v.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function transferredProgress(month: MonthData | undefined): { done: number; total: number } {
  if (!month) return { done: 0, total: 0 };
  return {
    done: month.allocations.filter((a) => a.transferred).length,
    total: month.allocations.length,
  };
}

export function averageIncome(series: MonthSeriesPoint[]): number {
  const withIncome = series.filter((s) => s.income > 0);
  if (withIncome.length === 0) return 0;
  return withIncome.reduce((sum, s) => sum + s.income, 0) / withIncome.length;
}

export function totalLoanedAllTime(loans: Loan[]): number {
  return loans.reduce((sum, l) => sum + l.amount, 0);
}
