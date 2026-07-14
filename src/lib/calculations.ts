import type { Category, CategoryAllocation, Loan, MonthData } from '../types';

export function monthTotalIncome(month: MonthData | undefined): number {
  if (!month) return 0;
  return month.incomes.reduce((sum, i) => sum + i.amount, 0);
}

export function allocationBaseAmount(alloc: CategoryAllocation, totalIncome: number): number {
  if (alloc.type === 'percent') return (totalIncome * alloc.value) / 100;
  return alloc.value;
}

/**
 * A month only stores an allocation entry once the user explicitly overrides it for
 * that month (via the dashboard's edit modal). Everywhere else, a category's live
 * defaults apply — so editing a category always affects every month that hasn't
 * been individually customized.
 */
export function resolveAllocation(category: Category, month: MonthData | undefined): CategoryAllocation {
  const override = month?.allocations.find((a) => a.categoryId === category.id);
  if (override) return override;
  return {
    categoryId: category.id,
    type: category.defaultAllocationType,
    value: category.defaultAllocationValue,
    transferred: false,
  };
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

export function monthAllocatedTotal(categories: Category[], month: MonthData | undefined, totalIncome: number): number {
  return categories
    .filter((c) => !c.archived)
    .reduce((sum, c) => sum + allocationBaseAmount(resolveAllocation(c, month), totalIncome), 0);
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
