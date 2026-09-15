/**
 * Read-only sanity check before we build the real launch transaction.
 * Verifies, against live mainnet state:
 *  - AAPLx mint exists and which token program owns it (SPL Token vs Token-2022)
 *  - whether Meteora DBC already has a token badge for it (i.e. it is NOT
 *    "permissionless-supported" and we'd need to pass tokenBadge)
 *  - current AAPLx price via Jupiter, so we can size migrationQuoteThreshold
 *    sensibly (Meteora's migration keepers require >= ~750 USD equivalent
 *    in the quote token for stock-quote pairs to auto-migrate)
 *
 * Signs nothing, sends nothing. Safe to run repeatedly.
 * Usage: npx tsx src/scripts/01-check-quote-mint.ts
 */
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { getConnection } from '../lib/env.js';
import { LAUNCH_QUOTE_MINT, LAUNCH_QUOTE_STOCK } from '../lib/stocks.js';

async function main() {
  const connection = getConnection();
  const client = DynamicBondingCurveClient.create(connection);

  console.log(`Checking quote mint candidate: ${LAUNCH_QUOTE_STOCK} (${LAUNCH_QUOTE_MINT.toBase58()})`);

  const accountInfo = await connection.getAccountInfo(LAUNCH_QUOTE_MINT);
  if (!accountInfo) {
    console.error('Mint account not found on mainnet. Wrong address or network.');
    process.exit(1);
  }

  const owner = accountInfo.owner;
  const isToken2022 = owner.equals(TOKEN_2022_PROGRAM_ID);
  const isLegacyToken = owner.equals(TOKEN_PROGRAM_ID);
  console.log(`Owning token program: ${owner.toBase58()}`);
  console.log(`  -> Token2022: ${isToken2022}, Legacy SPL Token: ${isLegacyToken}`);

  const badge = await client.state.getTokenBadge(LAUNCH_QUOTE_MINT);
  if (badge) {
    console.log('Token badge EXISTS for this mint -> pass deriveTokenBadgeAddress() as tokenBadge on createConfig/createPool.');
  } else {
    console.log('No token badge found. If this mint is a plain SPL token with no transfer fee, it should be usable as a quote mint without one.');
  }

  try {
    // /price/v2 returns 404 as of Sept 2026 (Jupiter retired it) -- v3 is the
    // live endpoint, confirmed directly against it, not assumed from old docs.
    const res = await fetch(
      `https://api.jup.ag/price/v3?ids=${LAUNCH_QUOTE_MINT.toBase58()}`
    );
    const json = await res.json();
    console.log('Jupiter price lookup:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.log('Jupiter price lookup failed (non-fatal):', (err as Error).message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
