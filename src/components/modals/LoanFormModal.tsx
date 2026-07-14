import { useMemo, useState } from 'react';
import { Modal } from '../Modal';
import { useBudgetStore } from '../../store/useBudgetStore';
import { getIcon } from '../../lib/icons';
import { colorClasses } from '../../lib/colors';
import { ArrowRight } from 'lucide-react';

interface LoanFormModalProps {
  open: boolean;
  onClose: () => void;
  monthKey: string;
}

export function LoanFormModal({ open, onClose, monthKey }: LoanFormModalProps) {
  const allCategories = useBudgetStore((s) => s.categories);
  const categories = useMemo(() => allCategories.filter((c) => !c.archived), [allCategories]);
  const addLoan = useBudgetStore((s) => s.addLoan);

  const [fromId, setFromId] = useState<string>('');
  const [toId, setToId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  function reset() {
    setFromId('');
    setToId('');
    setAmount('');
    setReason('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    if (!value || value <= 0 || !fromId || !toId || fromId === toId) return;
    addLoan({
      fromCategoryId: fromId,
      toCategoryId: toId,
      amount: value,
      reason: reason.trim() || 'Без причини',
      createdMonth: monthKey,
      createdDate: new Date().toISOString(),
    });
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Позичити між категоріями">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Звідки</span>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="rounded-2xl bg-white/70 border border-white/70 px-3 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">Оберіть категорію</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <ArrowRight size={18} className="text-ink-faint mt-5 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Куди</span>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="rounded-2xl bg-white/70 border border-white/70 px-3 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">Оберіть категорію</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fromId && toId && fromId === toId && (
          <div className="text-xs font-medium text-coral-600">Категорії мають бути різні.</div>
        )}

        <div className="flex items-center justify-center gap-3 py-1">
          {[fromId, toId].map((id, idx) => {
            const cat = categories.find((c) => c.id === id);
            if (!cat) return <div key={idx} className="w-11 h-11 rounded-2xl bg-ink/5" />;
            const Icon = getIcon(cat.icon);
            const c = colorClasses(cat.color);
            return (
              <div key={idx} className={`grid place-items-center w-11 h-11 rounded-2xl ${c.bgSoft}`}>
                <Icon size={20} className={c.text} />
              </div>
            );
          })}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Сума (zł)</span>
          <input
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-3 text-xl font-bold text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Причина</span>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Напр. не вистачило на ремонт машини"
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <button
          type="submit"
          disabled={!fromId || !toId || fromId === toId}
          className="mt-1 rounded-2xl bg-brand-500 text-white font-semibold py-3.5 shadow-glass-sm active:scale-[0.98] transition disabled:opacity-40"
        >
          Позичити
        </button>
      </form>
    </Modal>
  );
}
