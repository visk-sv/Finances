import { motion } from 'framer-motion';
import { Check, Pencil, ArrowDownRight, ArrowUpRight, Undo2 } from 'lucide-react';
import { getIcon } from '../lib/icons';
import { colorClasses } from '../lib/colors';
import { formatPLN } from '../lib/calculations';
import type { Category, CategoryAllocation } from '../types';
import type { CategoryFigures } from '../lib/calculations';

interface CategoryCardProps {
  category: Category;
  allocation: CategoryAllocation;
  figures: CategoryFigures;
  totalIncome: number;
  onToggleTransferred: () => void;
  onEdit: () => void;
}

export function CategoryCard({ category, allocation, figures, totalIncome, onToggleTransferred, onEdit }: CategoryCardProps) {
  const Icon = getIcon(category.icon);
  const c = colorClasses(category.color);
  const shareOfIncome = totalIncome > 0 ? figures.allocated / totalIncome : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-4 shadow-glass-sm"
    >
      <div className="flex items-start gap-3">
        <div className={`grid place-items-center w-11 h-11 rounded-2xl ${c.bgSoft} shrink-0`}>
          <Icon size={20} className={c.text} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-ink text-[15px] truncate">{category.name}</span>
            <button
              onClick={onEdit}
              className="grid place-items-center w-7 h-7 rounded-full text-ink-faint hover:bg-ink/5 active:scale-90 transition shrink-0"
              aria-label="Редагувати"
            >
              <Pencil size={14} />
            </button>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-ink tabular-nums">{formatPLN(figures.netAvailable)}</span>
            <span className="text-xs text-ink-faint">
              {allocation.type === 'percent' ? `${allocation.value}% доходу` : 'фіксовано'}
            </span>
          </div>

          {(figures.loanedOut > 0 || figures.loanedIn > 0 || figures.repaymentsReceived > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {figures.loanedOut > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-coral-600 bg-coral-500/10 rounded-full px-2 py-0.5">
                  <ArrowUpRight size={12} /> позичено {formatPLN(figures.loanedOut)}
                </span>
              )}
              {figures.loanedIn > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-mint-600 bg-mint-500/10 rounded-full px-2 py-0.5">
                  <ArrowDownRight size={12} /> отримано {formatPLN(figures.loanedIn)}
                </span>
              )}
              {figures.repaymentsReceived > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 bg-brand-500/10 rounded-full px-2 py-0.5">
                  <Undo2 size={12} /> повернено {formatPLN(figures.repaymentsReceived)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-1.5 rounded-full bg-ink/8 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${c.bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, shareOfIncome * 100)}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          />
        </div>
        <button
          onClick={onToggleTransferred}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shrink-0 transition active:scale-95 ${
            allocation.transferred ? 'bg-mint-500 text-white' : 'bg-ink/6 text-ink-faint'
          }`}
        >
          <span
            className={`grid place-items-center w-3.5 h-3.5 rounded-full border ${
              allocation.transferred ? 'border-white' : 'border-ink-faint'
            }`}
          >
            {allocation.transferred && <Check size={10} strokeWidth={3.5} />}
          </span>
          {allocation.transferred ? 'Перекинуто' : 'Перекинути'}
        </button>
      </div>
    </motion.div>
  );
}
