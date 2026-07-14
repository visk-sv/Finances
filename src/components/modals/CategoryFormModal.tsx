import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { useBudgetStore } from '../../store/useBudgetStore';
import { ICON_NAMES, getIcon } from '../../lib/icons';
import { CATEGORY_COLORS, colorClasses } from '../../lib/colors';
import type { AllocationType, Category, CategoryColor } from '../../types';

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

const EMPTY = {
  name: '',
  icon: 'MoreHorizontal',
  color: 'brand' as CategoryColor,
  defaultAllocationType: 'percent' as AllocationType,
  defaultAllocationValue: 10,
};

export function CategoryFormModal({ open, onClose, category }: CategoryFormModalProps) {
  const addCategory = useBudgetStore((s) => s.addCategory);
  const updateCategory = useBudgetStore((s) => s.updateCategory);

  const [name, setName] = useState(EMPTY.name);
  const [icon, setIcon] = useState(EMPTY.icon);
  const [color, setColor] = useState<CategoryColor>(EMPTY.color);
  const [type, setType] = useState<AllocationType>(EMPTY.defaultAllocationType);
  const [value, setValue] = useState(String(EMPTY.defaultAllocationValue));

  useEffect(() => {
    if (open) {
      if (category) {
        setName(category.name);
        setIcon(category.icon);
        setColor(category.color);
        setType(category.defaultAllocationType);
        setValue(String(category.defaultAllocationValue));
      } else {
        setName(EMPTY.name);
        setIcon(EMPTY.icon);
        setColor(EMPTY.color);
        setType(EMPTY.defaultAllocationType);
        setValue(String(EMPTY.defaultAllocationValue));
      }
    }
  }, [open, category]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const numeric = parseFloat(value.replace(',', '.')) || 0;
    const payload = {
      name: name.trim(),
      icon,
      color,
      defaultAllocationType: type,
      defaultAllocationValue: numeric,
    };
    if (category) {
      updateCategory(category.id, payload);
    } else {
      addCategory(payload);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={category ? 'Редагувати категорію' : 'Нова категорія'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Назва</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Напр. Спортзал"
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-3 text-base font-semibold text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Колір</span>
          <div className="flex gap-2">
            {CATEGORY_COLORS.map((cl) => {
              const c = colorClasses(cl);
              return (
                <button
                  type="button"
                  key={cl}
                  onClick={() => setColor(cl)}
                  className={`w-9 h-9 rounded-full ${c.bg} transition ${color === cl ? 'ring-2 ring-offset-2 ring-offset-white ' + c.ring : 'opacity-60'}`}
                  aria-label={cl}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Іконка</span>
          <div className="grid grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1">
            {ICON_NAMES.map((name) => {
              const Icon = getIcon(name);
              const active = icon === name;
              const c = colorClasses(color);
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => setIcon(name)}
                  className={`grid place-items-center aspect-square rounded-xl transition ${
                    active ? `${c.bgSoft} ${c.text} ring-2 ${c.ring}` : 'bg-white/50 text-ink-faint'
                  }`}
                >
                  <Icon size={17} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-ink/5">
          {(['percent', 'fixed'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                type === t ? 'bg-white shadow-glass-sm text-ink' : 'text-ink-soft'
              }`}
            >
              {t === 'percent' ? 'Відсоток' : 'Фіксована сума'}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">
            {type === 'percent' ? 'Типовий відсоток (%)' : 'Типова сума (zł)'}
          </span>
          <input
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-2xl bg-white/70 border border-white/70 px-4 py-3 text-xl font-bold text-ink outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>

        <button
          type="submit"
          className="mt-1 rounded-2xl bg-brand-500 text-white font-semibold py-3.5 shadow-glass-sm active:scale-[0.98] transition"
        >
          Зберегти
        </button>
      </form>
    </Modal>
  );
}
