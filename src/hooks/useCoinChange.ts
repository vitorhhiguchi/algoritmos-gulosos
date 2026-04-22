import { useState, useMemo } from 'react';

export type CoinChangeStep = {
  coinPicked: number;
  remainingBefore: number;
  remainingAfter: number;
};

export function useCoinChange() {
  const [coinsInput, setCoinsInput] = useState<string>('1, 3, 4');
  const [targetValue, setTargetValue] = useState<number>(6);

  const coins = useMemo(() => {
    return coinsInput
      .split(',')
      .map((c) => parseInt(c.trim(), 10))
      .filter((c) => !isNaN(c) && c > 0);
  }, [coinsInput]);

  const result = useMemo(() => {
    if (coins.length === 0 || targetValue <= 0) {
      return { greedySteps: [], optimalCoins: [], greedyTotal: 0, optimalTotal: 0, error: false };
    }

    // --- GREEDY ALG ---
    const sortedCoins = [...coins].sort((a, b) => b - a);
    const greedySteps: CoinChangeStep[] = [];
    let currentTarget = targetValue;
    
    for (const coin of sortedCoins) {
      while (currentTarget >= coin) {
        const after = currentTarget - coin;
        greedySteps.push({
          coinPicked: coin,
          remainingBefore: currentTarget,
          remainingAfter: after,
        });
        currentTarget = after;
      }
    }

    // Se o target for 0 no final, encontrou solucao exata, caso contrario o greedy falhou.
    const isGreedySuccess = currentTarget === 0;

    // --- OPTIMAL ALG (DP) ---
    const dp = Array(targetValue + 1).fill(Infinity);
    const coinUsed = Array(targetValue + 1).fill(-1);
    dp[0] = 0;

    for (let i = 1; i <= targetValue; i++) {
      for (const coin of coins) {
        if (i - coin >= 0 && dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
          coinUsed[i] = coin;
        }
      }
    }

    const optimalCoins: number[] = [];
    if (dp[targetValue] !== Infinity) {
      let curr = targetValue;
      while (curr > 0) {
        optimalCoins.push(coinUsed[curr]);
        curr -= coinUsed[curr];
      }
    }

    return {
      greedySteps,
      optimalCoins,
      greedyTotal: isGreedySuccess ? greedySteps.length : Infinity,
      optimalTotal: dp[targetValue] !== Infinity ? optimalCoins.length : Infinity,
      isGreedySuccess
    };
  }, [coins, targetValue]);

  return {
    coinsInput,
    setCoinsInput,
    targetValue,
    setTargetValue,
    ...result,
  };
}
