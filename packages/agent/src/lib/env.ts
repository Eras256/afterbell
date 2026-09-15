import 'dotenv/config';
import { Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { readFileSync } from 'node:fs';

export const MAINNET_RPC = process.env.SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com';

export function getConnection(): Connection {
  return new Connection(MAINNET_RPC, 'confirmed');
}

/**
 * Loads the team wallet keypair. Supports either:
 * - TEAM_WALLET_SECRET_KEY env var (base58-encoded secret key), or
 * - TEAM_WALLET_KEYPAIR_PATH env var pointing to a Solana CLI-style JSON keypair file.
 */
export function loadTeamWallet(): Keypair {
  const b58 = process.env.TEAM_WALLET_SECRET_KEY;
  if (b58) {
    return Keypair.fromSecretKey(bs58.decode(b58));
  }

  const path = process.env.TEAM_WALLET_KEYPAIR_PATH;
  if (path) {
    const raw = JSON.parse(readFileSync(path, 'utf-8'));
    return Keypair.fromSecretKey(Uint8Array.from(raw));
  }

  throw new Error(
    'No wallet configured. Set TEAM_WALLET_SECRET_KEY or TEAM_WALLET_KEYPAIR_PATH in .env'
  );
}
