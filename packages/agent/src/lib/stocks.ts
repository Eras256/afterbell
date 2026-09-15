import { PublicKey } from '@solana/web3.js';

/**
 * xStocks (Backed Finance) tokenized equities on Solana. Mint addresses
 * confirmed against public Solana explorers/aggregators, Sept 2026.
 */
export const XSTOCKS = {
  AAPLx: new PublicKey('XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp'),
  TSLAx: new PublicKey('XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB'),
  GOOGLx: new PublicKey('XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN'),
  NVDAx: new PublicKey('Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh'),
  AMZNx: new PublicKey('Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg'),
} as const;

export const LAUNCH_QUOTE_STOCK = 'AAPLx' as const;
export const LAUNCH_QUOTE_MINT = XSTOCKS[LAUNCH_QUOTE_STOCK];
