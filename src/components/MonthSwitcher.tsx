import { ChevronLeft, ChevronRight } from 'lucide-react';
import { monthLabel, shiftMonth } from '../lib/month';
import { useBudgetStore } from '../store/useBudgetStore';

export function MonthSwitcher() {
  const currentMonth = useBudgetStore((s) => s.currentMonth);
  const setCurrentMonth = useBudgetStore((s) => s.setCurrentMonth);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrentMonth(shiftMonth(currentMonth, -1))}
        className="grid place-items-center w-8 h-8 rounded-full text-ink-soft hover:bg-ink/5 active:scale-90 transition"
        aria-label="Попередній місяць"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-sm font-semibold text-ink min-w-[9ch] text-center tabular-nums">
        {monthLabel(currentMonth)}
      </span>
      <button
        onClick={() => setCurrentMonth(shiftMonth(currentMonth, 1))}
        className="grid place-items-center w-8 h-8 rounded-full text-ink-soft hover:bg-ink/5 active:scale-90 transition"
        aria-label="Наступний місяць"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
