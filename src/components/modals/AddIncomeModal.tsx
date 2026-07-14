import { useState } from 'react';
import { Modal } from '../Modal';
import { INCOME_SOURCES } from '../../lib/incomeSources';
import type { IncomeSource } from '../../types';
import { useBudgetStore } from '../../store/useBudgetStore';

interface AddIncomeModalProps {
  open: boolean;
  onClose: () => void;
  monthKey: string;
}

export function AddIncomeModal({ open, onClose, monthKey }: AddIncomeModalProps) {
  const addIncome = useBudgetStore((s) => s.addIncome);
  const [source, setSource] = useState<IncomeSource>('salary');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  function reset() {
    setSource('salary');
    setLabel('');
    setAmount('');
    setNote('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    if (!value || value <= 0) return;
    addIncome(monthKey, {
      source,
      amount: value,
      label: label.trim() || INCOME_SOURCES.find((s) => s.id === source)!.label,
      date: new Date().toISOString(),
      note: note.trim() || undefined,
    });
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Додати надходження">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-2">
          {INCOME_SOURCES.map((s) => {
            const Icon = s.icon;
            const active = s.id === source;
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => setSource(s.id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition ${
                  active ? 'bg-brand-500 border-brand-500 text-white shadow-glass-sm' : 'bg-white/60 border-white/70 text-ink-soft'
                }`}
              >
                <Icon size={18} />
                <span className="text-[11px] font-medium">{s.label}</span>
              </button>
            );
          })}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Сума (zł)</span>
          <input
            autoFocus
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-3 text-xl font-bold text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Назва (необов'язково)</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Напр. Зарплата за липень"
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Нотатка</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Деталі..."
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <button
          type="submit"
          className="mt-1 rounded-2xl bg-brand-500 text-white font-semibold py-3.5 shadow-glass-sm active:scale-[0.98] transition"
        >
          Додати
        </button>
      </form>
    </Modal>
  );
}
