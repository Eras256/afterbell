/**
 * Generates a new team wallet keypair for the hackathon demo and writes it to
 * secrets/team-wallet.json (gitignored). Does not touch the network.
 *
 * Usage: npx tsx src/scripts/00-generate-wallet.ts
 */
import { Keypair } from '@solana/web3.js';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../../../../secrets/team-wallet.json');

if (existsSync(outPath)) {
  console.error(`Refusing to overwrite existing wallet at ${outPath}`);
  process.exit(1);
}

const keypair = Keypair.generate();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(Array.from(keypair.secretKey)));

console.log('New team wallet generated.');
console.log('Public key (fund this address with SOL on mainnet):');
console.log(keypair.publicKey.toBase58());
console.log(`Secret key saved to: ${outPath}`);
console.log('This file is gitignored. Never commit it or share it.');
