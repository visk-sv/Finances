import type { CategoryAllocation, Loan, MonthData } from '../types';

export function monthTotalIncome(month: MonthData | undefined): number {
  if (!month) return 0;
  return month.incomes.reduce((sum, i) => sum + i.amount, 0);
}

export function allocationBaseAmount(alloc: CategoryAllocation, totalIncome: number): number {
  if (alloc.type === 'percent') return (totalIncome * alloc.value) / 100;
  return alloc.value;
}

/** Loans lent out of this category, created in this month (reduces category funds until repaid). */
export function loansOutThisMonth(loans: Loan[], monthKey: string, categoryId: string): number {
  return loans
    .filter((l) => l.createdMonth === monthKey && l.fromCategoryId === categoryId)
    .reduce((sum, l) => sum + l.amount, 0);
}

/** Loans borrowed into this category, created in this month (adds funds, is a debt owed). */
export function loansInThisMonth(loans: Loan[], monthKey: string, categoryId: string): number {
  return loans
    .filter((l) => l.createdMonth === monthKey && l.toCategoryId === categoryId)
    .reduce((sum, l) => sum + l.amount, 0);
}

/** Repayments received back into this category in this month (loans originally lent by it). */
export function repaymentsReceivedThisMonth(loans: Loan[], monthKey: string, categoryId: string): number {
  return loans
    .filter((l) => l.repaid && l.repaidMonth === monthKey && l.fromCategoryId === categoryId)
    .reduce((sum, l) => sum + l.amount, 0);
}

export interface CategoryFigures {
  allocated: number;
  loanedOut: number;
  loanedIn: number;
  repaymentsReceived: number;
  netAvailable: number;
}

export function categoryFigures(
  alloc: CategoryAllocation,
  totalIncome: number,
  loans: Loan[],
  monthKey: string,
  categoryId: string,
): CategoryFigures {
  const allocated = allocationBaseAmount(alloc, totalIncome);
  const loanedOut = loansOutThisMonth(loans, monthKey, categoryId);
  const loanedIn = loansInThisMonth(loans, monthKey, categoryId);
  const repaymentsReceived = repaymentsReceivedThisMonth(loans, monthKey, categoryId);
  const netAvailable = allocated - loanedOut + loanedIn + repaymentsReceived;
  return { allocated, loanedOut, loanedIn, repaymentsReceived, netAvailable };
}

export function monthAllocatedTotal(month: MonthData | undefined, totalIncome: number): number {
  if (!month) return 0;
  return month.allocations.reduce((sum, a) => sum + allocationBaseAmount(a, totalIncome), 0);
}

export function outstandingLoanAmount(loans: Loan[]): number {
  return loans.filter((l) => !l.repaid).reduce((sum, l) => sum + l.amount, 0);
}

export const PLN = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 2,
});

export function formatPLN(value: number): string {
  return PLN.format(Number.isFinite(value) ? value : 0);
}
