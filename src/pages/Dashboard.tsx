import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { useBudgetStore } from '../store/useBudgetStore';
import { categoryFigures, formatPLN, monthAllocatedTotal, monthTotalIncome } from '../lib/calculations';
import { CategoryCard } from '../components/CategoryCard';
import { AddIncomeModal } from '../components/modals/AddIncomeModal';
import { AllocationModal } from '../components/modals/AllocationModal';
import { incomeSourceMeta } from '../lib/incomeSources';
import type { Category } from '../types';

export function Dashboard() {
  const currentMonth = useBudgetStore((s) => s.currentMonth);
  const month = useBudgetStore((s) => s.months[s.currentMonth]);
  const categories = useBudgetStore((s) => s.categories);
  const loans = useBudgetStore((s) => s.loans);
  const toggleTransferred = useBudgetStore((s) => s.toggleTransferred);
  const removeIncome = useBudgetStore((s) => s.removeIncome);

  const [incomeOpen, setIncomeOpen] = useState(false);
  const [showIncomeList, setShowIncomeList] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const totalIncome = monthTotalIncome(month);
  const allocatedTotal = monthAllocatedTotal(month, totalIncome);
  const remaining = totalIncome - allocatedTotal;

  const activeCategories = useMemo(() => categories.filter((c) => !c.archived), [categories]);
  const incomes = month?.incomes ?? [];
  const allocations = month?.allocations ?? [];

  const editingAllocation = editingCategory
    ? allocations.find((a) => a.categoryId === editingCategory.id) ?? { categoryId: editingCategory.id, type: editingCategory.defaultAllocationType, value: editingCategory.defaultAllocationValue, transferred: false }
    : null;

  return (
    <div className="flex flex-col gap-4 px-4 pt-3 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-5 shadow-glass"
      >
        <span className="text-xs font-semibold text-ink-faint uppercase tracking-wide">Дохід за місяць</span>
        <div className="text-3xl font-extrabold text-ink mt-1 tabular-nums">{formatPLN(totalIncome)}</div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 h-2 rounded-full bg-ink/8 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-brand-500"
              initial={{ width: 0 }}
              animate={{ width: totalIncome > 0 ? `${Math.min(100, (allocatedTotal / totalIncome) * 100)}%` : '0%' }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2.5 text-sm">
          <span className="text-ink-soft">Розподілено: <b className="text-ink">{formatPLN(allocatedTotal)}</b></span>
          <span className={remaining < 0 ? 'text-coral-600 font-semibold' : 'text-mint-600 font-semibold'}>
            {remaining < 0 ? 'Перевитрата' : 'Залишок'}: {formatPLN(Math.abs(remaining))}
          </span>
        </div>

        <button
          onClick={() => setIncomeOpen(true)}
          className="w-full mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-brand-500 text-white font-semibold py-3 shadow-glass-sm active:scale-[0.98] transition"
        >
          <Plus size={18} /> Додати надходження
        </button>

        {incomes.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowIncomeList((v) => !v)}
              className="w-full flex items-center justify-between text-xs font-semibold text-ink-faint py-1"
            >
              <span>{incomes.length} {incomes.length === 1 ? 'надходження' : 'надходжень'} цього місяця</span>
              <ChevronDown size={14} className={`transition-transform ${showIncomeList ? 'rotate-180' : ''}`} />
            </button>
            {showIncomeList && (
              <div className="flex flex-col gap-1.5 mt-1.5">
                {incomes.map((i) => {
                  const meta = incomeSourceMeta(i.source);
                  const Icon = meta.icon;
                  return (
                    <div key={i.id} className="flex items-center gap-2.5 rounded-2xl bg-white/50 px-3 py-2">
                      <div className="grid place-items-center w-8 h-8 rounded-full bg-white/70 shrink-0">
                        <Icon size={14} className="text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink truncate">{i.label}</div>
                        {i.note && <div className="text-xs text-ink-faint truncate">{i.note}</div>}
                      </div>
                      <span className="text-sm font-bold text-ink tabular-nums shrink-0">{formatPLN(i.amount)}</span>
                      <button
                        onClick={() => removeIncome(currentMonth, i.id)}
                        className="grid place-items-center w-7 h-7 rounded-full text-ink-faint hover:bg-coral-500/10 hover:text-coral-600 active:scale-90 transition shrink-0"
                        aria-label="Видалити"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-3">
        {activeCategories.map((cat) => {
          const alloc = allocations.find((a) => a.categoryId === cat.id) ?? {
            categoryId: cat.id,
            type: cat.defaultAllocationType,
            value: cat.defaultAllocationValue,
            transferred: false,
          };
          const figures = categoryFigures(alloc, totalIncome, loans, currentMonth, cat.id);
          return (
            <CategoryCard
              key={cat.id}
              category={cat}
              allocation={alloc}
              figures={figures}
              totalIncome={totalIncome}
              onToggleTransferred={() => toggleTransferred(currentMonth, cat.id)}
              onEdit={() => setEditingCategory(cat)}
            />
          );
        })}
        {activeCategories.length === 0 && (
          <div className="glass rounded-3xl p-6 text-center text-sm text-ink-faint">
            Немає категорій. Додай їх у вкладці «Категорії».
          </div>
        )}
      </div>

      <AddIncomeModal open={incomeOpen} onClose={() => setIncomeOpen(false)} monthKey={currentMonth} />
      <AllocationModal
        open={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        monthKey={currentMonth}
        category={editingCategory}
        totalIncome={totalIncome}
        currentType={editingAllocation?.type ?? 'percent'}
        currentValue={editingAllocation?.value ?? 0}
      />
    </div>
  );
}
