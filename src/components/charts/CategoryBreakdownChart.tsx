import { motion } from 'framer-motion';
import type { CategoryBreakdownPoint } from '../../lib/stats';
import { colorClasses } from '../../lib/colors';
import { formatPLN } from '../../lib/calculations';

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdownPoint[] }) {
  if (data.length === 0) {
    return <div className="text-sm text-ink-faint text-center py-8">Немає розподілених коштів цього місяця.</div>;
  }

  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => {
        const c = colorClasses(d.color);
        const pct = max > 0 ? (d.amount / max) * 100 : 0;
        return (
          <div key={d.categoryId} className="flex items-center gap-2.5">
            <span className="w-20 shrink-0 text-xs font-semibold text-ink-soft truncate text-right" title={d.name}>
              {d.name}
            </span>
            <div className="flex-1 h-2.5 rounded-full bg-ink/6 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${c.bg}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              />
            </div>
            <span className="text-xs font-bold text-ink tabular-nums shrink-0 w-[92px] text-right">
              {formatPLN(d.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
