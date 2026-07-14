import type { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'housing', name: 'Житло', icon: 'Home', color: 'brand', defaultAllocationType: 'percent', defaultAllocationValue: 30 },
  { id: 'food', name: 'Їжа', icon: 'UtensilsCrossed', color: 'mint', defaultAllocationType: 'percent', defaultAllocationValue: 20 },
  { id: 'transport', name: 'Транспорт', icon: 'Car', color: 'amber', defaultAllocationType: 'percent', defaultAllocationValue: 10 },
  { id: 'health', name: "Здоров'я", icon: 'HeartPulse', color: 'coral', defaultAllocationType: 'percent', defaultAllocationValue: 5 },
  { id: 'fun', name: 'Розваги', icon: 'PartyPopper', color: 'violet', defaultAllocationType: 'percent', defaultAllocationValue: 10 },
  { id: 'savings', name: 'Заощадження', icon: 'PiggyBank', color: 'mint', defaultAllocationType: 'percent', defaultAllocationValue: 15 },
  { id: 'other', name: 'Інше', icon: 'MoreHorizontal', color: 'slate', defaultAllocationType: 'percent', defaultAllocationValue: 10 },
];
