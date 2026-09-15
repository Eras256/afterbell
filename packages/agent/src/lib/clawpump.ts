/**
 * Clawpump Agent MCP integration point.
 *
 * This satisfies the "using clawpump" half of the Stocknized Agent bounty:
 * Afterbell registers as an autonomous agent on Clawpump (its own
 * Clawpump-provisioned wallet, discoverable via their Agent MCP), separate
 * from the team wallet that owns the Meteora DBC pool created in
 * 02-launch-pool.ts. The stock-paired liquidity itself lives on Meteora
 * DBC directly, since Clawpump's public launch endpoints (checked Sept
 * 2026) don't expose a custom quote-mint parameter.
 *
 * BLOCKED on a human step: an API key from https://clawpump.tech/dashboard/api
 * (format `cpk_...`), which requires signing in with a wallet in a browser.
 * Set it as CLAWPUMP_API_KEY once obtained.
 *
 * Once we have the key:
 *   npx @clawpump/agents --claude   (wires the Agent MCP into this environment)
 *   then call the `create_agent` MCP tool with { name, persona, model } to
 *   provision the Afterbell agent + its Clawpump wallet.
 */

export const CLAWPUMP_API_KEY = process.env.CLAWPUMP_API_KEY ?? null;

export function assertClawpumpConfigured(): string {
  if (!CLAWPUMP_API_KEY) {
    throw new Error(
      'CLAWPUMP_API_KEY not set. Get one at https://clawpump.tech/dashboard/api and add it to .env'
    );
  }
  return CLAWPUMP_API_KEY;
}
