import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PiggyBank, HandCoins, CheckCircle2 } from 'lucide-react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatPLN, monthAllocatedTotal, monthTotalIncome, outstandingLoanAmount } from '../lib/calculations';
import { averageIncome, categoryBreakdown, recentMonthsSeries, transferredProgress } from '../lib/stats';
import { monthLabel } from '../lib/month';
import { IncomeTrendChart } from '../components/charts/IncomeTrendChart';
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart';
import { StatTile } from '../components/StatTile';

export function Stats() {
  const currentMonth = useBudgetStore((s) => s.currentMonth);
  const months = useBudgetStore((s) => s.months);
  const categories = useBudgetStore((s) => s.categories);
  const loans = useBudgetStore((s) => s.loans);

  const month = months[currentMonth];
  const totalIncome = monthTotalIncome(month);
  const allocatedTotal = monthAllocatedTotal(categories, month, totalIncome);
  const remaining = totalIncome - allocatedTotal;

  const series = useMemo(() => recentMonthsSeries(months, categories, 6, currentMonth), [months, categories, currentMonth]);
  const breakdown = useMemo(() => categoryBreakdown(month, categories), [month, categories]);
  const avgIncome = useMemo(() => averageIncome(series), [series]);
  const outstanding = outstandingLoanAmount(loans);
  const transferred = transferredProgress(month, categories);
  const transferredShare = transferred.total > 0 ? transferred.done / transferred.total : 0;

  return (
    <div className="flex flex-col gap-4 px-4 pt-3 pb-6">
      <h1 className="text-xl font-extrabold text-ink">Статистика</h1>

      <div className="grid grid-cols-2 gap-2.5">
        <StatTile
          label="Середній дохід"
          value={formatPLN(avgIncome)}
          icon={<TrendingUp size={13} />}
        />
        <StatTile
          label={remaining < 0 ? 'Перевитрата' : 'Залишок місяця'}
          value={formatPLN(Math.abs(remaining))}
          accent={remaining < 0 ? 'text-coral-600' : 'text-mint-600'}
          icon={<PiggyBank size={13} />}
        />
        <StatTile
          label="Непогашені позики"
          value={formatPLN(outstanding)}
          accent={outstanding > 0 ? 'text-coral-600' : 'text-ink'}
          icon={<HandCoins size={13} />}
        />
        <StatTile
          label="Перекинуто в банк"
          value={`${transferred.done} / ${transferred.total}`}
          icon={<CheckCircle2 size={13} />}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-4 shadow-glass">
        <span className="text-sm font-bold text-ink">Дохід за 6 місяців</span>
        <IncomeTrendChart data={series} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-4 shadow-glass">
        <span className="text-sm font-bold text-ink">Розподіл — {monthLabel(currentMonth)}</span>
        <div className="mt-2">
          <CategoryBreakdownChart data={breakdown} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-4 shadow-glass-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-ink">Перекинуто коштів у банк</span>
          <span className="text-sm font-bold text-brand-600 tabular-nums">{Math.round(transferredShare * 100)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-brand-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-brand-500"
            initial={{ width: 0 }}
            animate={{ width: `${transferredShare * 100}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
