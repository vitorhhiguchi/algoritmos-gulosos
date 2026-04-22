import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '../utils/cn';

// --- Dados Mockados Estáticos ---
const NODES = [
  { id: 'A', x: 50, y: 150 },
  { id: 'B', x: 200, y: 50 },
  { id: 'C', x: 200, y: 250 },
  { id: 'D', x: 350, y: 100 },
  { id: 'E', x: 450, y: 200 },
];

const EDGES = [
  { id: 'A-B', n1: 'A', n2: 'B', weight: 4 },
  { id: 'A-C', n1: 'A', n2: 'C', weight: 2 },
  { id: 'B-C', n1: 'B', n2: 'C', weight: 1 },
  { id: 'B-D', n1: 'B', n2: 'D', weight: 5 },
  { id: 'C-D', n1: 'C', n2: 'D', weight: 8 },
  { id: 'C-E', n1: 'C', n2: 'E', weight: 10 },
  { id: 'D-E', n1: 'D', n2: 'E', weight: 2 },
];

// Tipagem dos Steps
type StepInfo = {
  log: string;
  activeNodes: string[];           // Nós que mudam de cor (amarelo, etc)
  activeEdges: { id: string, status: 'cyan' | 'emerald' | 'rose' | 'slate' }[];
};

type AlgorithmSteps = Record<'dijkstra' | 'prim' | 'kruskal', StepInfo[]>;

const STEPS: AlgorithmSteps = {
  dijkstra: [
    { log: "Iniciando no nó A. Menor distância conhecida a partir de A: 0.", activeNodes: ['A'], activeEdges: [] },
    { log: "Aresta mais próxima de A é para C (peso 2). Menor distância conhecida a partir de A: 2 (Destino C).", activeNodes: ['A', 'C'], activeEdges: [{ id: 'A-C', status: 'cyan' }] },
    { log: "A partir de C, vemos B via B-C (2+1 = 3) que é melhor que A-B (4). Menor distância conhecida a partir de A: 3 (Destino B).", activeNodes: ['A', 'C', 'B'], activeEdges: [{ id: 'A-C', status: 'cyan' }, { id: 'B-C', status: 'cyan' }] },
    { log: "A partir de B, vemos D (3+5 = 8). C-D era 2+8=10. Menor distância conhecida a partir de A: 8 (Destino D).", activeNodes: ['A', 'C', 'B', 'D'], activeEdges: [{ id: 'A-C', status: 'cyan' }, { id: 'B-C', status: 'cyan' }, { id: 'B-D', status: 'cyan' }] },
    { log: "A partir de D, exploramos E (8+2 = 10). C-E era 2+10=12. Menor distância conhecida a partir de A: 10 (Destino E). Fim.", activeNodes: ['A', 'C', 'B', 'D', 'E'], activeEdges: [{ id: 'A-C', status: 'cyan' }, { id: 'B-C', status: 'cyan' }, { id: 'B-D', status: 'cyan' }, { id: 'D-E', status: 'cyan' }] },
  ],
  prim: [
    { log: "Iniciando AGM pelo nó A.", activeNodes: ['A'], activeEdges: [] },
    { log: "Explorando vizinhos da árvore atual (A). Aresta mais barata: A-C (peso 2).", activeNodes: ['A', 'C'], activeEdges: [{ id: 'A-C', status: 'emerald' }] },
    { log: "Explorando vizinhos da árvore atual (A, C). Aresta mais barata: B-C (peso 1).", activeNodes: ['A', 'C', 'B'], activeEdges: [{ id: 'A-C', status: 'emerald' }, { id: 'B-C', status: 'emerald' }] },
    { log: "Explorando vizinhos da árvore atual (A, C, B). Arestas disp: A-B(4), B-D(5), C-D(8), C-E(10). Aresta mais barata repete ciclo (A-B)? Não, A-B causa ciclo. Pegamos B-D (peso 5).", activeNodes: ['A', 'C', 'B', 'D'], activeEdges: [{ id: 'A-C', status: 'emerald' }, { id: 'B-C', status: 'emerald' }, { id: 'B-D', status: 'emerald' }] },
    { log: "Explorando vizinhos da árvore atual (A,C,B,D). Aresta mais barata: D-E (peso 2). Todos os nós conectados! Fim.", activeNodes: ['A', 'C', 'B', 'D', 'E'], activeEdges: [{ id: 'A-C', status: 'emerald' }, { id: 'B-C', status: 'emerald' }, { id: 'B-D', status: 'emerald' }, { id: 'D-E', status: 'emerald' }] },
  ],
  kruskal: [
    { log: "Ordenando todas as arestas pelo peso. Nenhuma aresta selecionada.", activeNodes: [], activeEdges: [] },
    { log: "Aresta global mais barata avaliada: B-C (peso 1). Adicionada à AGM.", activeNodes: ['B', 'C'], activeEdges: [{ id: 'B-C', status: 'emerald' }] },
    { log: "Aresta global mais barata avaliada: A-C (peso 2). Adicionada à AGM.", activeNodes: ['A', 'B', 'C'], activeEdges: [{ id: 'B-C', status: 'emerald' }, { id: 'A-C', status: 'emerald' }] },
    { log: "Aresta global mais barata avaliada: D-E (peso 2). Adicionada à AGM.", activeNodes: ['A', 'B', 'C', 'D', 'E'], activeEdges: [{ id: 'B-C', status: 'emerald' }, { id: 'A-C', status: 'emerald' }, { id: 'D-E', status: 'emerald' }] },
    { log: "Aresta global avaliada: A-B (peso 4). Forma um ciclo (A-C-B-A)! Descartada.", activeNodes: ['A', 'B', 'C', 'D', 'E'], activeEdges: [{ id: 'B-C', status: 'emerald' }, { id: 'A-C', status: 'emerald' }, { id: 'D-E', status: 'emerald' }, { id: 'A-B', status: 'rose' }] },
    { log: "Aresta global avaliada: B-D (peso 5). Adicionada à AGM. AGM Concluída!", activeNodes: ['A', 'B', 'C', 'D', 'E'], activeEdges: [{ id: 'B-C', status: 'emerald' }, { id: 'A-C', status: 'emerald' }, { id: 'D-E', status: 'emerald' }, { id: 'A-B', status: 'rose' }, { id: 'B-D', status: 'emerald' }] },
  ]
};

type AlgoType = 'dijkstra' | 'prim' | 'kruskal';

export function GraphVisualizer() {
  const [algo, setAlgo] = useState<AlgoType>('dijkstra');
  const [step, setStep] = useState(0);

  const stepsArray = STEPS[algo];
  const currentStepInfo = step >= 0 ? stepsArray[step] : { log: '', activeNodes: [], activeEdges: [] };

  const handleNext = () => {
    if (step < stepsArray.length - 1) setStep(idx => idx + 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  const changeAlgo = (newAlgo: AlgoType) => {
    setAlgo(newAlgo);
    setStep(0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-4 sm:p-6 text-slate-200">
      
      {/* Esquerda: Visualização */}
      <div className="flex-[1.5] space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
              <Network className="w-5 h-5" /> Grafos: Dijkstra, Prim e Kruskal
            </h2>
            <div className="bg-slate-950/50 p-1 rounded-lg border border-slate-800 flex text-sm font-medium">
              {(['dijkstra', 'prim', 'kruskal'] as AlgoType[]).map((a) => (
                <button
                  key={a}
                  onClick={() => changeAlgo(a)}
                  className={cn(
                    "px-4 py-1.5 rounded-md capitalize transition-colors",
                    algo === a 
                      ? "bg-cyan-500/20 text-cyan-400" 
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full aspect-video bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
             
             {/* SVG Container para o Grafo */}
             <svg width="100%" height="100%" viewBox="0 0 500 300" className="drop-shadow-xl">
                
                {/* Linhas (Arestas) */}
                {EDGES.map(edge => {
                   const n1 = NODES.find(n => n.id === edge.n1)!;
                   const n2 = NODES.find(n => n.id === edge.n2)!;
                   const edgeState = step >= 0 ? currentStepInfo.activeEdges.find(e => e.id === edge.id) : null;
                   
                   let strokeColor = "#334155"; // slate-700 default
                   let strokeWidth = 3;
                   
                   if (edgeState) {
                      if (edgeState.status === 'cyan') strokeColor = "#22d3ee"; // cyan-400
                      if (edgeState.status === 'emerald') strokeColor = "#34d399"; // emerald-400
                      if (edgeState.status === 'rose') strokeColor = "#f43f5e"; // rose-400
                      strokeWidth = 4;
                   }

                   return (
                     <g key={edge.id}>
                       <motion.line
                         x1={n1.x} y1={n1.y}
                         x2={n2.x} y2={n2.y}
                         stroke={strokeColor}
                         strokeWidth={strokeWidth}
                         animate={{ stroke: strokeColor, strokeWidth }}
                         transition={{ duration: 0.4 }}
                       />
                       {/* Box com o Peso da aresta */}
                       <rect 
                         x={(n1.x + n2.x) / 2 - 12} 
                         y={(n1.y + n2.y) / 2 - 12} 
                         width={24} height={24} 
                         rx={6} 
                         fill="#0f172a" 
                         stroke="#334155" 
                         strokeWidth={1.5}
                       />
                       <text 
                         x={(n1.x + n2.x) / 2} 
                         y={(n1.y + n2.y) / 2} 
                         textAnchor="middle" 
                         dominantBaseline="central" 
                         fill="#cbd5e1" 
                         className="text-[10px] font-mono font-bold"
                       >
                         {edge.weight}
                       </text>
                     </g>
                   );
                })}

                {/* Círculos (Nós) */}
                {NODES.map(node => {
                  const isActive = step >= 0 && currentStepInfo.activeNodes.includes(node.id);
                  let fill = "#1e293b"; // slate-800
                  let stroke = "#475569"; // slate-600
                  
                  if (isActive) {
                    if (algo === 'dijkstra') { fill = "#eab308"; stroke = "#fde047"; } // Yellow
                    if (algo === 'prim') { fill = "#10b981"; stroke = "#6ee7b7"; } // Emerald
                    if (algo === 'kruskal') { fill = "#0ea5e9"; stroke = "#7dd3fc"; } // Sky
                  }

                  return (
                    <g key={node.id}>
                       <motion.circle
                          cx={node.x} cy={node.y}
                          r={18}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={3}
                          animate={{ fill, stroke }}
                          transition={{ duration: 0.3 }}
                       />
                       <text 
                         x={node.x} y={node.y} 
                         textAnchor="middle" 
                         dominantBaseline="central" 
                         fill={isActive ? "#0f172a" : "#f8fafc"} 
                         className="text-xs font-black"
                       >
                         {node.id}
                       </text>
                    </g>
                  );
                })}

             </svg>
          </div>

          <div className="mt-6 flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-800">
             <div className="text-sm text-slate-400">
               Passo: <span className="text-cyan-400 font-mono font-bold">{step + 1}</span> / {stepsArray.length}
             </div>
             <div className="flex gap-3">
               <button
                 onClick={handleReset}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
               >
                 <RotateCcw className="w-4 h-4" /> Resetar
               </button>
               <button
                 onClick={handleNext}
                 disabled={step >= stepsArray.length - 1}
                 className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-cyan-500/20"
               >
                 Próximo Passo <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Direita: Painel de Log */}
      <div className="flex-1 space-y-6">
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
            Log (Escolha Gulosa)
          </h2>
          
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence>
              {stepsArray.slice(0, step + 1).map((s, idx) => (
                <motion.div
                  key={`${algo}-log-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className={cn(
                    "p-4 rounded-xl text-sm border relative overflow-hidden",
                    idx === step 
                      ? "bg-slate-900 border-cyan-500/50 text-slate-200" 
                      : "bg-slate-950/50 border-slate-800/50 text-slate-400"
                  )}
                >
                  {idx === step && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
                  )}
                  <span className="font-mono text-xs text-slate-500 mr-2">[{idx}]</span>
                  {s.log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
}
