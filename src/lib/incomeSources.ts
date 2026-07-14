import { Banknote, Gift, ShoppingBag, Sparkles, type LucideIcon } from 'lucide-react';
import type { IncomeSource } from '../types';

export const INCOME_SOURCES: { id: IncomeSource; label: string; icon: LucideIcon }[] = [
  { id: 'salary', label: 'Зарплата', icon: Banknote },
  { id: 'gift', label: 'Подарунок', icon: Gift },
  { id: 'sale', label: 'Продаж', icon: ShoppingBag },
  { id: 'other', label: 'Інше', icon: Sparkles },
];

export function incomeSourceMeta(source: IncomeSource) {
  return INCOME_SOURCES.find((s) => s.id === source) ?? INCOME_SOURCES[3];
}
