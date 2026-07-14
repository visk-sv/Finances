import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useBudgetStore } from '../store/useBudgetStore';
import { getIcon } from '../lib/icons';
import { colorClasses } from '../lib/colors';
import { formatPLN, outstandingLoanAmount } from '../lib/calculations';
import { monthLabel } from '../lib/month';
import { LoanFormModal } from '../components/modals/LoanFormModal';

export function Loans() {
  const currentMonth = useBudgetStore((s) => s.currentMonth);
  const categories = useBudgetStore((s) => s.categories);
  const loans = useBudgetStore((s) => s.loans);
  const toggleLoanRepaid = useBudgetStore((s) => s.toggleLoanRepaid);
  const deleteLoan = useBudgetStore((s) => s.deleteLoan);
  const [formOpen, setFormOpen] = useState(false);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const sorted = [...loans].sort((a, b) => (a.repaid === b.repaid ? b.createdDate.localeCompare(a.createdDate) : a.repaid ? 1 : -1));
  const pending = loans.filter((l) => !l.repaid);
  const outstanding = outstandingLoanAmount(loans);

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ink">Позики</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-brand-500 text-white text-sm font-semibold px-3.5 py-2 shadow-glass-sm active:scale-95 transition"
        >
          <Plus size={16} /> Позичити
        </button>
      </div>

      {pending.length > 0 && (
        <div className="glass-strong rounded-3xl p-4 shadow-glass-sm flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-soft">Непогашено позик</span>
          <span className="text-lg font-extrabold text-coral-600 tabular-nums">{formatPLN(outstanding)}</span>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {sorted.map((loan) => {
          const from = categoryById.get(loan.fromCategoryId);
          const to = categoryById.get(loan.toCategoryId);
          if (!from || !to) return null;
          const FromIcon = getIcon(from.icon);
          const ToIcon = getIcon(to.icon);
          const fromC = colorClasses(from.color);
          const toC = colorClasses(to.color);
          return (
            <motion.div
              layout
              key={loan.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-2xl p-3.5 shadow-glass-sm ${loan.repaid ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`grid place-items-center w-10 h-10 rounded-xl ${fromC.bgSoft} shrink-0`}>
                  <FromIcon size={17} className={fromC.text} />
                </div>
                <ArrowRight size={15} className="text-ink-faint shrink-0" />
                <div className={`grid place-items-center w-10 h-10 rounded-xl ${toC.bgSoft} shrink-0`}>
                  <ToIcon size={17} className={toC.text} />
                </div>
                <div className="flex-1 min-w-0 ml-1">
                  <div className="text-sm font-bold text-ink truncate">
                    {from.name} → {to.name}
                  </div>
                  <div className="text-xs text-ink-faint truncate">{loan.reason}</div>
                </div>
                <span className="text-base font-extrabold text-ink tabular-nums shrink-0">{formatPLN(loan.amount)}</span>
              </div>

              <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-ink/8">
                <span className="text-xs text-ink-faint">
                  {monthLabel(loan.createdMonth)}
                  {loan.repaid && loan.repaidMonth && ` · погашено ${monthLabel(loan.repaidMonth)}`}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleLoanRepaid(loan.id, currentMonth)}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition active:scale-95 ${
                      loan.repaid ? 'bg-ink/6 text-ink-faint' : 'bg-mint-500 text-white'
                    }`}
                  >
                    {loan.repaid ? (
                      <>
                        <RotateCcw size={11} /> Повернути в борг
                      </>
                    ) : (
                      <>
                        <Check size={11} /> Погашено
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Видалити цю позику?')) deleteLoan(loan.id);
                    }}
                    className="grid place-items-center w-7 h-7 rounded-full text-ink-faint hover:bg-coral-500/10 hover:text-coral-600 active:scale-90 transition"
                    aria-label="Видалити"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {sorted.length === 0 && (
          <div className="glass rounded-3xl p-6 text-center text-sm text-ink-faint">
            Позик ще немає. Якщо не вистачило грошей в одній категорії — позич з іншої.
          </div>
        )}
      </div>

      <LoanFormModal open={formOpen} onClose={() => setFormOpen(false)} monthKey={currentMonth} />
    </div>
  );
}
