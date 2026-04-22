import { useState } from 'react';
import { FractionalKnapsack } from './components/FractionalKnapsack';
import { CoinChange } from './components/CoinChange';
import { GraphVisualizer } from './components/GraphVisualizer';
import { Package, Coins, Code2, Network } from 'lucide-react';
import { cn } from './utils/cn';

function App() {
  const [activeTab, setActiveTab] = useState<'knapsack' | 'coin' | 'grafos'>('grafos');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden pt-6 pb-20">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Code2 className="text-slate-950 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
              Algoritmos Gulosos
            </h1>
            <p className="text-xs text-slate-400 font-medium">Visualizador Didático</p>
          </div>
        </div>

        {/* Custom Tab Switcher */}
        <div className="bg-slate-900/50 backdrop-blur-md p-1 rounded-full border border-slate-700/50 flex">
          <button
            onClick={() => setActiveTab('knapsack')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
              activeTab === 'knapsack' 
                ? "bg-slate-800 text-emerald-400 shadow-md" 
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            )}
          >
            <Package className="w-4 h-4" /> Mochila
          </button>
          <button
            onClick={() => setActiveTab('coin')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
              activeTab === 'coin' 
                ? "bg-slate-800 text-cyan-400 shadow-md" 
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            )}
          >
            <Coins className="w-4 h-4" /> Troco
          </button>
          <button
            onClick={() => setActiveTab('grafos')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
              activeTab === 'grafos' 
                ? "bg-slate-800 text-rose-400 shadow-md" 
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            )}
          >
            <Network className="w-4 h-4" /> Grafos
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full">
        {activeTab === 'knapsack' && <FractionalKnapsack />}
        {activeTab === 'coin' && <CoinChange />}
        {activeTab === 'grafos' && <GraphVisualizer />}
      </main>

    </div>
  );
}

export default App;
