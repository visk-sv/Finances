import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { useBudgetStore } from '../../store/useBudgetStore';
import { getIcon } from '../../lib/icons';
import { colorClasses } from '../../lib/colors';
import { formatPLN } from '../../lib/calculations';
import type { Category } from '../../types';

interface AllocationModalProps {
  open: boolean;
  onClose: () => void;
  monthKey: string;
  category: Category | null;
  totalIncome: number;
  currentType: 'percent' | 'fixed';
  currentValue: number;
}

export function AllocationModal({ open, onClose, monthKey, category, totalIncome, currentType, currentValue }: AllocationModalProps) {
  const upsertAllocation = useBudgetStore((s) => s.upsertAllocation);
  const [type, setType] = useState<'percent' | 'fixed'>(currentType);
  const [value, setValue] = useState(String(currentValue));

  useEffect(() => {
    if (open) {
      setType(currentType);
      setValue(String(currentValue));
    }
  }, [open, currentType, currentValue]);

  if (!category) return null;
  const Icon = getIcon(category.icon);
  const c = colorClasses(category.color);
  const numeric = parseFloat(value.replace(',', '.')) || 0;
  const preview = type === 'percent' ? (totalIncome * numeric) / 100 : numeric;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    upsertAllocation(monthKey, category.id, { type, value: numeric });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Налаштувати категорію">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className={`grid place-items-center w-11 h-11 rounded-2xl ${c.bgSoft}`}>
            <Icon size={20} className={c.text} />
          </div>
          <span className="font-bold text-ink text-base">{category.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-ink/5">
          {(['percent', 'fixed'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                type === t ? 'bg-white shadow-glass-sm text-ink' : 'text-ink-soft'
              }`}
            >
              {t === 'percent' ? 'Відсоток' : 'Фіксована сума'}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">
            {type === 'percent' ? 'Відсоток від доходу (%)' : 'Сума (zł)'}
          </span>
          <input
            autoFocus
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-3 text-xl font-bold text-ink outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700 font-medium">
          {type === 'percent'
            ? `${numeric || 0}% від доходу ≈ ${formatPLN(preview)}`
            : `Фіксовано: ${formatPLN(preview)}`}
        </div>

        <button
          type="submit"
          className="mt-1 rounded-2xl bg-brand-500 text-white font-semibold py-3.5 shadow-glass-sm active:scale-[0.98] transition"
        >
          Зберегти
        </button>
      </form>
    </Modal>
  );
}
