import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { useKnapsack } from '../hooks/useKnapsack';
import { cn } from '../utils/cn';

const COLORS = [
  'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-rose-500',
  'bg-amber-500', 'bg-fuchsia-500', 'bg-lime-500', 'bg-violet-500'
];

export function FractionalKnapsack() {
  const { items, capacidade, setCapacidade, addItem, removeItem, result } = useKnapsack();
  
  const [nome, setNome] = useState('');
  const [peso, setPeso] = useState('');
  const [valor, setValor] = useState('');

  const currentTotalWeight = result.resultado.reduce((acc, item) => acc + (item.peso * item.fracao), 0);
  const isFull = currentTotalWeight >= capacidade && capacidade > 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !peso || !valor) return;
    addItem({
      nome,
      peso: parseFloat(peso),
      valor: parseFloat(valor)
    });
    setNome('');
    setPeso('');
    setValor('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-4 sm:p-6 text-slate-200">
      
      {/* Esquerda: Controles */}
      <div className="flex-1 space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
            <Package className="w-5 h-5" /> Configuração da Mochila
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Capacidade Total</label>
            <input
              type="number"
              value={capacidade}
              onChange={(e) => setCapacidade(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-lg"
            />
          </div>

          <form onSubmit={handleAddItem} className="space-y-4">
            <h3 className="text-sm font-medium text-slate-400">Adicionar Item</h3>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nome (ex: Ouro)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="col-span-3 sm:col-span-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
              />
              <input
                type="number"
                placeholder="Peso"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="col-span-3 sm:col-span-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-mono"
              />
              <input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="col-span-3 sm:col-span-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-3 rounded-xl transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </form>
        </div>

        {/* Lista de Itens Disponíveis */}
        <div className="glass-panel p-6 rounded-2xl h-64 overflow-y-auto custom-scrollbar">
          <h3 className="text-sm font-medium text-slate-400 mb-4 sticky top-0 bg-slate-900/90 py-1 backdrop-blur-md z-10">Itens Disponíveis</h3>
          <AnimatePresence>
            {items.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-sm text-center py-8">
                Nenhum item adicionado.
              </motion.p>
            )}
            {[...items].sort((a, b) => b.valor / b.peso - a.valor / a.peso).map((item) => {
              const originalIdx = items.findIndex(it => it.id === item.id);
              const razao = item.valor / item.peso;
              return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl mb-2 text-sm border border-slate-800/50",
                  "bg-slate-800/20 hover:bg-slate-800/50 transition-colors"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", COLORS[originalIdx % COLORS.length])} />
                  <span className="font-semibold">{item.nome}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
                  <span>P: {item.peso}</span>
                  <span>V: {item.valor}</span>
                  <div className="flex flex-col items-center">
                    <span className="text-emerald-300 font-black bg-emerald-500/20 px-2.5 py-1 rounded-md text-xs border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] flex animate-pulse-slow">
                      Razão V/P: {razao.toFixed(1)}
                    </span>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-rose-400 hover:text-rose-300 transition-colors p-1 relative z-10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>
      </div>

      {/* Direita: Visualização */}
      <div className="flex-1 space-y-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
              Visualização
            </h2>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Lucro Otimo</p>
              <p className="text-3xl font-black font-mono text-emerald-400">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={result.total}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    ${result.total.toFixed(2)}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
          </div>

          <div className="relative mb-8">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
              <span>0</span>
              <span>Capacidade: {capacidade}</span>
            </div>
            
            {/* Mochila Bar */}
            <div className="h-16 bg-slate-950 rounded-2xl border border-slate-700/50 overflow-hidden relative flex shadow-inner">
              {capacidade > 0 ? (
                <AnimatePresence>
                  {result.resultado.map((rItem, i) => {
                    const originalIdx = items.findIndex(it => it.id === rItem.id);
                    const widthPercent = ((rItem.peso * rItem.fracao) / capacidade) * 100;
                    
                    return (
                      <motion.div
                        key={rItem.id}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${widthPercent}%`, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                        className={cn(
                          "h-full flex items-center justify-center border-r border-slate-900/20",
                          COLORS[originalIdx % COLORS.length]
                        )}
                        title={`${rItem.nome}: ${rItem.fracao < 1 ? (rItem.fracao * 100).toFixed(0) + '%' : '100%'} (Peso: ${(rItem.peso * rItem.fracao).toFixed(1)})`}
                      >
                        {widthPercent > 10 && (
                          <span className="text-xs font-bold text-white/90 drop-shadow-md">
                            {rItem.fracao < 1 ? `${(rItem.fracao * 100).toFixed(0)}%` : rItem.nome}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
                  Capacidade inválida
                </div>
              )}
            </div>
            
            {isFull && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -right-3 -top-3 bg-emerald-500 text-white rounded-full p-1 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </div>

          <div className="flex-1 mt-4 border-t border-slate-800/50 pt-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Ordem Escolhida (Guloso)</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {result.resultado.length === 0 && (
                  <p className="text-slate-500 text-sm text-center">Nenhum item na mochila.</p>
                )}
                {result.resultado.map((rItem, i) => {
                  const originalIdx = items.findIndex(it => it.id === rItem.id);
                  return (
                    <motion.div
                      key={rItem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-8 rounded-full", COLORS[originalIdx % COLORS.length])} />
                        <div>
                          <p className="text-sm font-bold text-slate-200">{rItem.nome}</p>
                          <p className="text-[10px] text-slate-500 font-mono italic">
                            {rItem.fracao < 1 ? `Fração: ${(rItem.fracao).toFixed(2)}` : 'Inteiro'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right font-mono text-xs text-slate-400 flex flex-col items-end">
                        <span>+ ${ (rItem.valor * rItem.fracao).toFixed(2) }</span>
                        <span className="text-[10px] text-slate-600">peso: {(rItem.peso * rItem.fracao).toFixed(1)}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
