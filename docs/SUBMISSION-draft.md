# Stocklana submission draft — panel-review prep

> Covers the first 2 items of [docs/CHECKLIST-panel-review.md](CHECKLIST-panel-review.md#para-afterbell-stocklana-bounty).
> Cross-check the deliverable list below against the actual Stocklana/Solana
> Foundation bounty listing before pasting this into the real submission —
> this repo doesn't have that official requirements text to verify against.

## 1. Bus factor — state it explicitly, don't leave it implicit

> Equipo de 2 personas, ambos con acceso completo al código (mismo repo,
> mismo historial de commits, ninguno depende exclusivamente del otro para
> continuar el proyecto).

## 2. One line per bounty deliverable — not folded into the general description

Combined bounty: **Best Use of Meteora DBC** + **Stocknized Agent on Clawpump**.

- **Meteora DBC pool, stock-paired**: AFTERBELL (AFTB) token launched via a
  Meteora Dynamic Bonding Curve pool quoted in AAPLx (Apple xStock,
  Token-2022, mint `XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp`) — not a
  SOL-denominated pool. *Evidence: transaction hash + pool link, added once
  `02-launch-pool.ts --send` runs.*
- **Clawpump Agent MCP registration**: Afterbell registered as an autonomous
  agent on Clawpump's Agent MCP, with its own Clawpump-provisioned wallet —
  deliberately separate from the team wallet that owns the Meteora DBC pool.
  *Evidence: agent ID / MCP registration confirmation, added once the
  Clawpump API key is obtained and `create_agent` is called.*
- **Architecture division documented explicitly**: the submission states in
  its own words *why* the stock-paired pool lives on Meteora DBC directly
  (Clawpump's public launch endpoints don't expose a custom quote-mint
  param) while the Clawpump side is satisfied via Agent MCP registration —
  not left for the panel to infer.
- **Autonomous after-hours agent logic**: after-hours detection + basket
  rebalancing on the team's own xStocks basket. *Status: not yet built (day
  1-2 per README) — list as in-progress, don't imply it's done.*
- **Dashboard**: minimal live view of agent state. *Status: not yet built
  (day 2-3 per README) — same caveat.*

Fill in the two "Evidence" blanks above once the wallet is funded and the
`--send` launch + Clawpump registration actually happen — don't submit with
placeholder evidence.
