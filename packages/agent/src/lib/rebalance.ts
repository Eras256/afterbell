import type { PortfolioSnapshot } from './monitor.js';

export interface RebalanceAction {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  currentWeight: number;
  targetWeight: number;
  deltaUsd: number; // positive = buy this much more, negative = sell this much
}

export interface RebalancePlan {
  generatedAt: string;
  totalValueUsd: number | null;
  actions: RebalanceAction[];
  note?: string;
}

/**
 * Pure calculation -- never touches the network or signs anything.
 * `driftBandPct` ignores small deviations so the agent doesn't churn
 * (and pay fees) chasing noise; only rebalances positions that have
 * drifted past the band.
 */
export function computeRebalancePlan(
  snapshot: PortfolioSnapshot,
  targetWeights: Record<string, number>,
  driftBandPct = 0.02
): RebalancePlan {
  if (snapshot.totalValueUsd === null) {
    return {
      generatedAt: new Date().toISOString(),
      totalValueUsd: null,
      actions: [],
      note: 'Cannot compute a rebalance plan: one or more holdings has no USD price (price feed unavailable).',
    };
  }

  const total = snapshot.totalValueUsd;
  const actions: RebalanceAction[] = snapshot.holdings.map((h) => {
    const currentWeight = total > 0 ? (h.valueUsd ?? 0) / total : 0;
    const targetWeight = targetWeights[h.symbol] ?? 0;
    const drift = currentWeight - targetWeight;
    const deltaUsd = (targetWeight - currentWeight) * total;

    let action: RebalanceAction['action'] = 'hold';
    if (Math.abs(drift) > driftBandPct) {
      action = deltaUsd > 0 ? 'buy' : 'sell';
    }

    return { symbol: h.symbol, action, currentWeight, targetWeight, deltaUsd };
  });

  return { generatedAt: new Date().toISOString(), totalValueUsd: total, actions };
}
