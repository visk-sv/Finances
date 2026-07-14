import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useBudgetStore } from '../store/useBudgetStore';
import { getIcon } from '../lib/icons';
import { colorClasses } from '../lib/colors';
import { CategoryFormModal } from '../components/modals/CategoryFormModal';
import type { Category } from '../types';

export function Categories() {
  const categories = useBudgetStore((s) => s.categories);
  const deleteCategory = useBudgetStore((s) => s.deleteCategory);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const active = categories.filter((c) => !c.archived);

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ink">Категорії</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-full bg-brand-500 text-white text-sm font-semibold px-3.5 py-2 shadow-glass-sm active:scale-95 transition"
        >
          <Plus size={16} /> Нова
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {active.map((cat) => {
          const Icon = getIcon(cat.icon);
          const c = colorClasses(cat.color);
          return (
            <motion.div
              layout
              key={cat.id}
              role="button"
              tabIndex={0}
              onClick={() => openEdit(cat)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openEdit(cat);
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass flex items-center gap-3 rounded-2xl p-3.5 text-left shadow-glass-sm active:scale-[0.99] transition cursor-pointer"
            >
              <div className={`grid place-items-center w-11 h-11 rounded-2xl ${c.bgSoft} shrink-0`}>
                <Icon size={20} className={c.text} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-ink text-[15px] truncate">{cat.name}</div>
                <div className="text-xs text-ink-faint">
                  Типово: {cat.defaultAllocationType === 'percent' ? `${cat.defaultAllocationValue}% доходу` : `фіксовано, zł ${cat.defaultAllocationValue}`}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Видалити категорію «${cat.name}»?`)) deleteCategory(cat.id);
                }}
                className="grid place-items-center w-8 h-8 rounded-full text-ink-faint hover:bg-coral-500/10 hover:text-coral-600 active:scale-90 transition shrink-0"
                aria-label="Видалити"
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          );
        })}
        {active.length === 0 && (
          <div className="glass rounded-3xl p-6 text-center text-sm text-ink-faint">Немає категорій. Додай першу!</div>
        )}
      </div>

      <CategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} category={editing} />
    </div>
  );
}
