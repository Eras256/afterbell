/**
 * Afterbell Day-1 critical path: launch the AFTERBELL token with a
 * stock-paired Meteora Dynamic Bonding Curve pool, quoted in AAPLx
 * (Apple xStock, Token-2022, mint XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp).
 *
 * This creates the DBC config and the pool in a single transaction
 * (client.partner.createConfigAndPool). Nothing else in the repo depends
 * on Clawpump for this step -- Clawpump's own launch endpoints (per their
 * public docs, checked Sept 2026) don't expose a custom quote-mint
 * parameter, so the stock-paired pool is built directly against Meteora's
 * DBC program. The Clawpump side of the "Stocknized Agent on Clawpump"
 * bounty is satisfied separately by registering this agent on Clawpump's
 * Agent MCP (see packages/agent/src/lib/clawpump.ts).
 *
 * SAFETY: dry-run by default. Builds and simulates the transaction, prints
 * every derived address, and does NOT send it unless invoked with --send.
 * Requires the team wallet (secrets/team-wallet.json) to be funded first.
 *
 * Usage:
 *   npx tsx src/scripts/02-launch-pool.ts            # dry run / simulate
 *   npx tsx src/scripts/02-launch-pool.ts --send      # actually broadcast
 */
import {
  DynamicBondingCurveClient,
  buildCurve,
  deriveTokenBadgeAddress,
  TokenType,
  TokenDecimal,
  TokenAuthorityOption,
  BaseFeeMode,
  CollectFeeMode,
  MigrationOption,
  MigrationFeeOption,
  ActivationType,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { Keypair, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConnection, loadTeamWallet } from '../lib/env.js';
import { LAUNCH_QUOTE_MINT, LAUNCH_QUOTE_STOCK } from '../lib/stocks.js';

const TOKEN_NAME = 'Afterbell';
const TOKEN_SYMBOL = 'AFTB';
const TOKEN_URI = process.env.AFTERBELL_METADATA_URI ?? 'https://afterbell.app/token-metadata.json';

const MIN_SOL_BALANCE = 0.05; // safety floor before we even simulate

async function main() {
  const send = process.argv.includes('--send');
  const connection = getConnection();
  const wallet = loadTeamWallet();
  const client = DynamicBondingCurveClient.create(connection);

  console.log(`Wallet: ${wallet.publicKey.toBase58()}`);
  const balanceLamports = await connection.getBalance(wallet.publicKey);
  const balanceSol = balanceLamports / LAMPORTS_PER_SOL;
  console.log(`Balance: ${balanceSol} SOL`);

  if (balanceSol < MIN_SOL_BALANCE) {
    throw new Error(
      `Wallet has less than ${MIN_SOL_BALANCE} SOL. Fund it before running this script${send ? ' with --send' : ''}.`
    );
  }

  const tokenBadge = deriveTokenBadgeAddress(LAUNCH_QUOTE_MINT);
  const badgeAccount = await client.state.getTokenBadge(LAUNCH_QUOTE_MINT);
  console.log(`Quote mint: ${LAUNCH_QUOTE_STOCK} (${LAUNCH_QUOTE_MINT.toBase58()})`);
  console.log(`Token badge account: ${tokenBadge.toBase58()} (exists on-chain: ${badgeAccount !== null})`);

  const curveConfig = buildCurve({
    token: {
      tokenType: TokenType.SPLToken,
      tokenBaseDecimal: TokenDecimal.SIX,
      tokenQuoteDecimal: TokenDecimal.EIGHT, // AAPLx (Token-2022) uses 8 decimals
      tokenAuthorityOption: TokenAuthorityOption.Immutable,
      totalTokenSupply: 1_000_000_000,
      leftover: 0,
    },
    fee: {
      baseFeeParams: {
        baseFeeMode: BaseFeeMode.FeeSchedulerLinear,
        feeSchedulerParam: {
          startingFeeBps: 500,
          endingFeeBps: 100,
          numberOfPeriod: 10,
          totalDuration: 3600,
        },
      },
      dynamicFeeEnabled: true,
      collectFeeMode: CollectFeeMode.QuoteToken,
      creatorTradingFeePercentage: 50,
      poolCreationFee: 0,
      enableFirstSwapWithMinFee: false,
    },
    migration: {
      migrationOption: MigrationOption.MET_DAMM_V2,
      migrationFeeOption: MigrationFeeOption.FixedBps100,
      migrationFee: { feePercentage: 0, creatorFeePercentage: 0 },
    },
    liquidityDistribution: {
      partnerLiquidityPercentage: 0,
      partnerPermanentLockedLiquidityPercentage: 100,
      creatorLiquidityPercentage: 0,
      creatorPermanentLockedLiquidityPercentage: 0,
    },
    lockedVesting: {
      totalLockedVestingAmount: 0,
      numberOfVestingPeriod: 0,
      cliffUnlockAmount: 0,
      totalVestingDuration: 0,
      cliffDurationFromMigrationTime: 0,
    },
    activationType: ActivationType.Timestamp,
    // Meteora's migration keepers require the migration quote threshold to
    // be worth >= ~750 USD in the quote token for stock-quote pairs to
    // auto-migrate. AAPLx ~$332 (Sept 2026) -> 5 AAPLx ~= $1660, safe margin.
    percentageSupplyOnMigration: 20,
    migrationQuoteThreshold: 5,
  });

  const configKeypair = Keypair.generate();
  const baseMintKeypair = Keypair.generate();

  console.log(`New config account: ${configKeypair.publicKey.toBase58()}`);
  console.log(`New AFTERBELL mint: ${baseMintKeypair.publicKey.toBase58()}`);

  const transaction = await client.partner.createConfigAndPool({
    payer: wallet.publicKey,
    config: configKeypair.publicKey,
    feeClaimer: wallet.publicKey,
    leftoverReceiver: wallet.publicKey,
    quoteMint: LAUNCH_QUOTE_MINT,
    tokenBadge: badgeAccount ? tokenBadge : undefined,
    ...curveConfig,
    preCreatePoolParam: {
      baseMint: baseMintKeypair.publicKey,
      name: TOKEN_NAME,
      symbol: TOKEN_SYMBOL,
      uri: TOKEN_URI,
      poolCreator: wallet.publicKey,
    },
  });

  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.sign(wallet, configKeypair, baseMintKeypair);

  if (!send) {
    console.log('\nDRY RUN -- simulating only. Pass --send to actually broadcast.');
    const sim = await connection.simulateTransaction(transaction);
    console.log('Simulation result:', JSON.stringify(sim.value, null, 2));
    return;
  }

  console.log('\nBroadcasting to mainnet...');
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    wallet,
    configKeypair,
    baseMintKeypair,
  ]);

  console.log('\n=== LAUNCH SUCCESSFUL ===');
  console.log(`Transaction: https://solscan.io/tx/${signature}`);
  console.log(`AFTERBELL mint: ${baseMintKeypair.publicKey.toBase58()}`);
  console.log(`Config: ${configKeypair.publicKey.toBase58()}`);
  console.log('Save these addresses -- they are the hard evidence for the submission.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
