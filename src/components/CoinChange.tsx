import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { useCoinChange } from '../hooks/useCoinChange';
import { cn } from '../utils/cn';

export function CoinChange() {
  const {
    coinsInput,
    setCoinsInput,
    targetValue,
    setTargetValue,
    greedySteps,
    optimalTotal,
    greedyTotal,
    isGreedySuccess,
  } = useCoinChange();

  const [inputCoins, setInputCoins] = useState(coinsInput);
  const [inputTarget, setInputTarget] = useState(targetValue.toString());

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCoinsInput(inputCoins);
    setTargetValue(parseInt(inputTarget) || 0);
  };

  const hasGreedyError = isGreedySuccess && greedyTotal > optimalTotal;
  const greedyFailed = !isGreedySuccess;

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-4 sm:p-6 text-slate-200">
      
      {/* Esquerda: Controles */}
      <div className="flex-1 space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
            <Coins className="w-5 h-5" /> Problema do Troco
          </h2>
          
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Moedas Disponíveis (separadas por vírgula)
              </label>
              <input
                type="text"
                value={inputCoins}
                onChange={(e) => setInputCoins(e.target.value)}
                placeholder="Ex: 1, 3, 4"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Valor do Troco
              </label>
              <input
                type="number"
                value={inputTarget}
                onChange={(e) => setInputTarget(e.target.value)}
                placeholder="Ex: 6"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono text-lg text-cyan-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              Calcular
            </button>
          </form>
        </div>

        {/* Card de Diferencial - Analise Guloso vs Otimo */}
        <div className={cn(
          "glass-panel p-6 rounded-2xl border",
          hasGreedyError ? "border-amber-500/50 bg-amber-500/5" : greedyFailed ? "border-rose-500/50 bg-rose-500/5" : "border-slate-700/50"
        )}>
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> Comparação: Guloso vs Ótimo
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 mb-1">Passos do Guloso</p>
              <p className={cn("text-3xl font-mono font-bold", hasGreedyError || greedyFailed ? "text-amber-400" : "text-cyan-400")}>
                {greedyFailed ? 'Falhou' : greedyTotal}
              </p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 mb-1">Mínimo Real (Ótimo)</p>
              <p className="text-3xl font-mono font-bold text-emerald-400">
                {optimalTotal === Infinity ? 'Sem Sol.' : optimalTotal}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {hasGreedyError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-xl flex gap-3 text-amber-200/80 text-sm"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                <p>
                  <strong>O Guloso Errou!</strong> O algoritmo escolheu a maior moeda primeiro, mas isso resultou em mais moedas ({greedyTotal}) do que a solução ideal ({optimalTotal}).
                </p>
              </motion.div>
            )}
            {greedyFailed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-xl flex gap-3 text-rose-200/80 text-sm"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                <p>
                  <strong>Solução Inválida!</strong> O algoritmo guloso não conseguiu devolver o troco exato com as moedas disponíveis.
                </p>
              </motion.div>
            )}
            {!hasGreedyError && !greedyFailed && greedyTotal > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-xl flex gap-3 text-emerald-200/80 text-sm"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <p>Neste caso, o algoritmo guloso encontrou a solução ótima!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Direita: Visualização Passo a Passo */}
      <div className="flex-1 space-y-6">
        <div className="glass-panel p-6 rounded-2xl h-full">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
            Log Passo a Passo
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence>
              {greedySteps.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-10">Calculando...</p>
              )}
              {greedySteps.map((step, idx) => (
                <motion.div
                  key={`${idx}-${step.coinPicked}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: idx * 0.4, 
                    type: "spring",
                    stiffness: 100,
                    damping: 12
                  }}
                  className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group hover:border-cyan-500/30 transition-colors"
                >
                  {/* Decorative background glow */}
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
                  
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20 z-10 shrink-0">
                    {step.coinPicked}
                  </div>
                  
                  <div className="flex-1 z-10 text-sm">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-slate-400">Pegou <strong className="text-cyan-400">{step.coinPicked}</strong></span>
                      <span className="font-mono text-slate-500 text-xs">resta: {step.remainingAfter}</span>
                    </div>
                    {/* Linha do tempo visual do restante */}
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mt-2">
                       <motion.div 
                         className="h-full bg-cyan-500"
                         initial={{ width: `${(step.remainingBefore / targetValue) * 100}%` }}
                         animate={{ width: `${(step.remainingAfter / targetValue) * 100}%` }}
                         transition={{ delay: (idx * 0.4) + 0.2, duration: 0.4, ease: "easeInOut" }}
                       />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {greedyFailed && greedySteps.length > 0 && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: greedySteps.length * 0.4 }}
                 className="text-center py-4 text-rose-400 font-mono text-sm border border-rose-500/30 rounded-xl bg-rose-500/5"
               >
                 Restou {greedySteps[greedySteps.length - 1].remainingAfter}, mas não há moedas menores para fechar o troco.
               </motion.div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
