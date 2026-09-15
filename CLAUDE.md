@AGENTS.md

# Afterbell — map

Autonomous agent trading a small xStocks basket after-hours, launching a
stock-paired token via a Meteora Dynamic Bonding Curve pool. Built for the
Stocklana combined bounty (Solana Foundation): Best Use of Meteora DBC +
Stocknized Agent on Clawpump. Deadline 2026-09-18. Full context in
[README.md](README.md).

Hard rules are in `AGENTS.md` (imported above) — this file is only a map, not
a second copy of the rules.

## Where things live

- `packages/agent/src/lib/` — RPC connection, wallet, xStocks addresses,
  Clawpump integration.
- `packages/agent/src/scripts/` — `00` generates the wallet, `01` validates
  the quote mint (read-only), `02` launches the pool (dry-run by default).
- `secrets/` — team wallet keypair. Gitignored, never committed.
- `docs/` — submission draft and panel-review prep for the bounty.
- Persistent memory (facts/decisions that survive this session, not
  derivable from the code): `~/.claude/projects/-home-vaiosvaios-afterbell/memory/`,
  indexed by `MEMORY.md` there.

## Session hygiene

At the end of a substantial work session, run `/session-close` — it audits
`CLAUDE.md`/`AGENTS.md`, this repo's `SKILL.md` files, and the memory system
each against their own actual purpose, instead of a generic "make sure it's
updated" pass.
