import { useState, useMemo } from 'react';

export type Item = {
  id: string;
  peso: number;
  valor: number;
  nome: string;
};

export type KnapsackResultItem = Item & {
  fracao: number;
};

export function useKnapsack() {
  const [items, setItems] = useState<Item[]>([]);
  const [capacidade, setCapacidade] = useState<number>(50);

  const addItem = (item: Omit<Item, 'id'>) => {
    setItems((prev) => [...prev, { ...item, id: Math.random().toString(36).substring(7) }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const result = useMemo(() => {
    // Clonamos para não mutar o array original no sort
    const sortedItems = [...items].sort((a, b) => b.valor / b.peso - a.valor / a.peso);

    let currentCapacidade = capacidade;
    let total = 0;
    const resultado: KnapsackResultItem[] = [];

    for (const item of sortedItems) {
      if (currentCapacidade === 0) break;

      if (currentCapacidade >= item.peso) {
        currentCapacidade -= item.peso;
        total += item.valor;
        resultado.push({ ...item, fracao: 1 });
      } else {
        const fracao = currentCapacidade / item.peso;
        total += item.valor * fracao;
        resultado.push({ ...item, fracao });
        currentCapacidade = 0;
        break;
      }
    }

    return { total, resultado };
  }, [items, capacidade]);

  return {
    items,
    capacidade,
    setCapacidade,
    addItem,
    removeItem,
    result,
  };
}
