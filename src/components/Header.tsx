import { Wallet } from 'lucide-react';
import { MonthSwitcher } from './MonthSwitcher';

export function Header() {
  return (
    <header className="sticky top-0 z-30 glass px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="grid place-items-center w-8 h-8 rounded-xl bg-brand-500 text-white shadow-glass-sm">
          <Wallet size={16} />
        </div>
        <span className="font-extrabold text-ink text-base">Гроші</span>
      </div>
      <MonthSwitcher />
    </header>
  );
}
