import type { Category, Loan, MonthData } from '../types';
import { allocationBaseAmount, monthAllocatedTotal, monthTotalIncome, resolveAllocation } from './calculations';
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
  categories: Category[],
  count: number,
  endKey: string = toMonthKey(new Date()),
): MonthSeriesPoint[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) keys.push(shiftMonth(endKey, -i));

  return keys.map((key) => {
    const month = months[key];
    const income = monthTotalIncome(month);
    const allocated = monthAllocatedTotal(categories, month, income);
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
  const totalIncome = monthTotalIncome(month);
  return categories
    .filter((c) => !c.archived)
    .map((c) => {
      const amount = allocationBaseAmount(resolveAllocation(c, month), totalIncome);
      return { categoryId: c.id, name: c.name, icon: c.icon, color: c.color, amount };
    })
    .filter((v) => v.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function transferredProgress(month: MonthData | undefined, categories: Category[]): { done: number; total: number } {
  const active = categories.filter((c) => !c.archived);
  const done = active.filter((c) => resolveAllocation(c, month).transferred).length;
  return { done, total: active.length };
}

export function averageIncome(series: MonthSeriesPoint[]): number {
  const withIncome = series.filter((s) => s.income > 0);
  if (withIncome.length === 0) return 0;
  return withIncome.reduce((sum, s) => sum + s.income, 0) / withIncome.length;
}

export function totalLoanedAllTime(loans: Loan[]): number {
  return loans.reduce((sum, l) => sum + l.amount, 0);
}
