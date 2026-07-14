import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthSeriesPoint } from '../../lib/stats';
import { formatPLN } from '../../lib/calculations';

const INCOME_COLOR = '#6c7bfb';
const ALLOCATED_COLOR = '#1fa876';

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-2xl px-3.5 py-2.5 shadow-glass-sm text-xs">
      <div className="font-semibold text-ink mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-ink-soft">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="flex-1">{p.dataKey === 'income' ? 'Дохід' : 'Розподілено'}</span>
          <span className="font-bold text-ink tabular-nums">{formatPLN(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function IncomeTrendChart({ data }: { data: MonthSeriesPoint[] }) {
  return (
    <div>
      <div className="h-48 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INCOME_COLOR} stopOpacity={0.18} />
                <stop offset="100%" stopColor={INCOME_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(28,29,43,0.08)" strokeDasharray="0" />
            <XAxis
              dataKey="shortLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#8b8ea3', fontWeight: 600 }}
              dy={4}
            />
            <YAxis hide domain={[0, (max: number) => max * 1.15]} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(28,29,43,0.15)', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="income" stroke="none" fill="url(#incomeFill)" isAnimationActive />
            <Line
              type="monotone"
              dataKey="income"
              stroke={INCOME_COLOR}
              strokeWidth={2}
              dot={{ r: 3, fill: INCOME_COLOR, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="allocated"
              stroke={ALLOCATED_COLOR}
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={{ r: 3, fill: ALLOCATED_COLOR, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 justify-center mt-1">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <span className="w-2 h-2 rounded-full" style={{ background: INCOME_COLOR }} /> Дохід
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <span className="w-2 h-2 rounded-full" style={{ background: ALLOCATED_COLOR }} /> Розподілено
        </span>
      </div>
    </div>
  );
}
