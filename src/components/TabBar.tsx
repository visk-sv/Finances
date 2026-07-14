import { motion } from 'framer-motion';
import { Wallet, Tags, ArrowLeftRight, PieChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Tab = 'dashboard' | 'categories' | 'loans' | 'stats';

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Огляд', icon: Wallet },
  { id: 'categories', label: 'Категорії', icon: Tags },
  { id: 'loans', label: 'Позики', icon: ArrowLeftRight },
  { id: 'stats', label: 'Статистика', icon: PieChart },
];

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="sticky bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div className="glass-strong flex items-center justify-around rounded-[1.75rem] shadow-glass px-1.5 py-1.5">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-[1.25rem] transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-highlight"
                  className="absolute inset-0 bg-brand-500/12 rounded-[1.25rem]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 2}
                className={`relative transition-colors ${isActive ? 'text-brand-600' : 'text-ink-faint'}`}
              />
              <span className={`relative text-[11px] font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-ink-faint'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
