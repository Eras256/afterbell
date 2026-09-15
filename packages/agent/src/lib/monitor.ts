import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import { XSTOCKS } from './stocks.js';

export interface HoldingSnapshot {
  symbol: keyof typeof XSTOCKS;
  mint: string;
  tokenProgram: string;
  amountUi: number;
  priceUsd: number | null;
  valueUsd: number | null;
}

export interface PortfolioSnapshot {
  owner: string;
  solBalance: number;
  holdings: HoldingSnapshot[];
  totalValueUsd: number | null;
  fetchedAt: string;
}

async function detectTokenProgram(connection: Connection, mint: PublicKey): Promise<PublicKey> {
  const info = await connection.getAccountInfo(mint);
  if (!info) throw new Error(`Mint not found on chain: ${mint.toBase58()}`);
  if (info.owner.equals(TOKEN_2022_PROGRAM_ID)) return TOKEN_2022_PROGRAM_ID;
  return TOKEN_PROGRAM_ID;
}

async function getHoldingAmount(
  connection: Connection,
  owner: PublicKey,
  mint: PublicKey,
  tokenProgram: PublicKey
): Promise<number> {
  const ata = await getAssociatedTokenAddress(mint, owner, false, tokenProgram);
  try {
    const account = await getAccount(connection, ata, 'confirmed', tokenProgram);
    const mintInfo = await connection.getParsedAccountInfo(mint);
    const decimals =
      mintInfo.value && 'parsed' in mintInfo.value.data ? mintInfo.value.data.parsed.info.decimals : 6;
    return Number(account.amount) / 10 ** decimals;
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) return 0;
    throw err;
  }
}

/**
 * Jupiter price lookup, batched into one request. Non-fatal on failure.
 *
 * Uses `/price/v3`, not `/price/v2` -- v2 returns 404 as of Sept 2026 (Jupiter
 * retired it). v3's response is also a flat `{ [mint]: { usdPrice, ... } }`
 * map with no `data` wrapper, unlike v2's shape -- confirmed directly against
 * the live endpoint, not assumed from old docs.
 */
async function getPricesUsd(mints: PublicKey[]): Promise<Record<string, number | null>> {
  const ids = mints.map((m) => m.toBase58()).join(',');
  const prices: Record<string, number | null> = {};
  for (const m of mints) prices[m.toBase58()] = null;

  try {
    const res = await fetch(`https://api.jup.ag/price/v3?ids=${ids}`);
    const json = (await res.json()) as Record<string, { usdPrice?: number }>;
    for (const [mint, entry] of Object.entries(json)) {
      prices[mint] = typeof entry.usdPrice === 'number' ? entry.usdPrice : null;
    }
  } catch {
    // price lookup is best-effort; leave nulls
  }
  return prices;
}

export async function getPortfolioSnapshot(
  connection: Connection,
  owner: PublicKey
): Promise<PortfolioSnapshot> {
  const solLamports = await connection.getBalance(owner);
  const symbols = Object.keys(XSTOCKS) as (keyof typeof XSTOCKS)[];
  const mints = symbols.map((s) => XSTOCKS[s]);
  const prices = await getPricesUsd(mints);

  const holdings: HoldingSnapshot[] = [];
  for (const symbol of symbols) {
    const mint = XSTOCKS[symbol];
    const tokenProgram = await detectTokenProgram(connection, mint);
    const amountUi = await getHoldingAmount(connection, owner, mint, tokenProgram);
    const priceUsd = prices[mint.toBase58()] ?? null;
    holdings.push({
      symbol,
      mint: mint.toBase58(),
      tokenProgram: tokenProgram.toBase58(),
      amountUi,
      priceUsd,
      valueUsd: priceUsd !== null ? amountUi * priceUsd : null,
    });
  }

  const allPriced = holdings.every((h) => h.valueUsd !== null);
  const totalValueUsd = allPriced ? holdings.reduce((sum, h) => sum + (h.valueUsd ?? 0), 0) : null;

  return {
    owner: owner.toBase58(),
    solBalance: solLamports / LAMPORTS_PER_SOL,
    holdings,
    totalValueUsd,
    fetchedAt: new Date().toISOString(),
  };
}
