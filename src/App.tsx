import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { TabBar, type Tab } from './components/TabBar';
import { Dashboard } from './pages/Dashboard';
import { Categories } from './pages/Categories';
import { Loans } from './pages/Loans';
import { Stats } from './pages/Stats';

const PAGES: Record<Tab, () => React.JSX.Element> = {
  dashboard: Dashboard,
  categories: Categories,
  loans: Loans,
  stats: Stats,
};

function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const Page = PAGES[tab];

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Page />
          </motion.div>
        </AnimatePresence>
      </main>
      <TabBar active={tab} onChange={setTab} />
    </>
  );
}

export default App;
