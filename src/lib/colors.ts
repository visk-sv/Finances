import type { CategoryColor } from '../types';

export interface ColorClasses {
  bg: string;
  bgSoft: string;
  text: string;
  ring: string;
  solid: string;
}

const MAP: Record<CategoryColor, ColorClasses> = {
  brand: {
    bg: 'bg-brand-500',
    bgSoft: 'bg-brand-100',
    text: 'text-brand-700',
    ring: 'ring-brand-300',
    solid: '#6c7bfb',
  },
  mint: {
    bg: 'bg-mint-500',
    bgSoft: 'bg-mint-500/15',
    text: 'text-mint-600',
    ring: 'ring-mint-500/40',
    solid: '#33c98e',
  },
  coral: {
    bg: 'bg-coral-500',
    bgSoft: 'bg-coral-500/15',
    text: 'text-coral-600',
    ring: 'ring-coral-500/40',
    solid: '#ff6b6b',
  },
  amber: {
    bg: 'bg-amber-600',
    bgSoft: 'bg-amber-500/15',
    text: 'text-amber-600',
    ring: 'ring-amber-500/40',
    solid: '#f39c12',
  },
  violet: {
    bg: 'bg-violet-500',
    bgSoft: 'bg-violet-500/15',
    text: 'text-violet-600',
    ring: 'ring-violet-500/40',
    solid: '#8b5cf6',
  },
  slate: {
    bg: 'bg-slate-500',
    bgSoft: 'bg-slate-500/15',
    text: 'text-slate-600',
    ring: 'ring-slate-500/40',
    solid: '#64748b',
  },
};

export function colorClasses(color: CategoryColor): ColorClasses {
  return MAP[color] ?? MAP.slate;
}

export const CATEGORY_COLORS: CategoryColor[] = ['brand', 'mint', 'coral', 'amber', 'violet', 'slate'];
