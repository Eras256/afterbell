import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeRebalancePlan } from './rebalance.js';
import type { PortfolioSnapshot } from './monitor.js';

function snapshot(holdings: { symbol: string; valueUsd: number }[]): PortfolioSnapshot {
  const totalValueUsd = holdings.reduce((s, h) => s + h.valueUsd, 0);
  return {
    owner: 'TestOwner',
    solBalance: 1,
    totalValueUsd,
    fetchedAt: new Date().toISOString(),
    holdings: holdings.map((h) => ({
      symbol: h.symbol as never,
      mint: 'Mint',
      tokenProgram: 'Program',
      amountUi: 1,
      priceUsd: 1,
      valueUsd: h.valueUsd,
    })),
  };
}

test('equal-weight portfolio already at target needs no action', () => {
  const snap = snapshot([
    { symbol: 'A', valueUsd: 50 },
    { symbol: 'B', valueUsd: 50 },
  ]);
  const plan = computeRebalancePlan(snap, { A: 0.5, B: 0.5 });
  assert.equal(plan.actions.every((a) => a.action === 'hold'), true);
});

test('overweight position past the drift band gets a sell, underweight gets a buy', () => {
  const snap = snapshot([
    { symbol: 'A', valueUsd: 90 },
    { symbol: 'B', valueUsd: 10 },
  ]);
  const plan = computeRebalancePlan(snap, { A: 0.5, B: 0.5 }, 0.02);
  const a = plan.actions.find((x) => x.symbol === 'A')!;
  const b = plan.actions.find((x) => x.symbol === 'B')!;
  assert.equal(a.action, 'sell');
  assert.equal(b.action, 'buy');
  assert.equal(a.deltaUsd, -40);
  assert.equal(b.deltaUsd, 40);
});

test('small drift within the band is held, not traded', () => {
  const snap = snapshot([
    { symbol: 'A', valueUsd: 51 },
    { symbol: 'B', valueUsd: 49 },
  ]);
  const plan = computeRebalancePlan(snap, { A: 0.5, B: 0.5 }, 0.02);
  assert.equal(plan.actions.every((a) => a.action === 'hold'), true);
});

test('missing price data yields an empty, explained plan instead of a wrong one', () => {
  const snap: PortfolioSnapshot = {
    owner: 'TestOwner',
    solBalance: 1,
    totalValueUsd: null,
    fetchedAt: new Date().toISOString(),
    holdings: [],
  };
  const plan = computeRebalancePlan(snap, {});
  assert.equal(plan.actions.length, 0);
  assert.match(plan.note ?? '', /price/i);
});
