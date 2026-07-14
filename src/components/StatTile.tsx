import type { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: string;
  accent?: string;
  icon?: ReactNode;
}

export function StatTile({ label, value, accent = 'text-ink', icon }: StatTileProps) {
  return (
    <div className="glass rounded-2xl p-3.5 shadow-glass-sm flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-ink-faint">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <span className={`text-lg font-extrabold tabular-nums ${accent}`}>{value}</span>
    </div>
  );
}
