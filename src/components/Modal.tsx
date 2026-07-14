import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="glass-modal relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-glass p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] max-h-[85dvh] overflow-y-auto"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink">{title}</h2>
              <button
                onClick={onClose}
                className="grid place-items-center w-8 h-8 rounded-full bg-ink/5 text-ink-soft hover:bg-ink/10 active:scale-90 transition"
                aria-label="Закрити"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
