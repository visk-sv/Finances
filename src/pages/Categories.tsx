import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useBudgetStore } from '../store/useBudgetStore';
import { getIcon } from '../lib/icons';
import { colorClasses } from '../lib/colors';
import { CategoryFormModal } from '../components/modals/CategoryFormModal';
import type { Category } from '../types';

interface CategoryRowProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  const dragControls = useDragControls();
  const Icon = getIcon(category.icon);
  const c = colorClasses(category.color);

  return (
    <Reorder.Item
      value={category}
      dragListener={false}
      dragControls={dragControls}
      className="glass flex items-center gap-2 rounded-2xl p-3.5 shadow-glass-sm"
    >
      <button
        onPointerDown={(e) => dragControls.start(e)}
        className="grid place-items-center w-7 h-7 rounded-full text-ink-faint touch-none cursor-grab active:cursor-grabbing shrink-0"
        aria-label="Перетягнути"
      >
        <GripVertical size={16} />
      </button>

      <button onClick={onEdit} className="flex items-center gap-3 flex-1 min-w-0 text-left active:opacity-70 transition">
        <div className={`grid place-items-center w-11 h-11 rounded-2xl ${c.bgSoft} shrink-0`}>
          <Icon size={20} className={c.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink text-[15px] truncate">{category.name}</div>
          <div className="text-xs text-ink-faint">
            Типово: {category.defaultAllocationType === 'percent' ? `${category.defaultAllocationValue}% доходу` : `фіксовано, zł ${category.defaultAllocationValue}`}
          </div>
        </div>
      </button>

      <button
        onClick={onDelete}
        className="grid place-items-center w-8 h-8 rounded-full text-ink-faint hover:bg-coral-500/10 hover:text-coral-600 active:scale-90 transition shrink-0"
        aria-label="Видалити"
      >
        <Trash2 size={15} />
      </button>
    </Reorder.Item>
  );
}

export function Categories() {
  const categories = useBudgetStore((s) => s.categories);
  const deleteCategory = useBudgetStore((s) => s.deleteCategory);
  const reorderCategories = useBudgetStore((s) => s.reorderCategories);
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

      <Reorder.Group
        axis="y"
        values={active}
        onReorder={(newOrder) => reorderCategories(newOrder.map((c) => c.id))}
        className="flex flex-col gap-2.5"
      >
        {active.map((cat) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            onEdit={() => openEdit(cat)}
            onDelete={() => {
              if (confirm(`Видалити категорію «${cat.name}»?`)) deleteCategory(cat.id);
            }}
          />
        ))}
      </Reorder.Group>
      {active.length === 0 && (
        <div className="glass rounded-3xl p-6 text-center text-sm text-ink-faint">Немає категорій. Додай першу!</div>
      )}

      <CategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} category={editing} />
    </div>
  );
}
