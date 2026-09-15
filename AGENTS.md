# AGENTS.md — hard rules for Afterbell

Read natively by Antigravity (since v1.20.5) and imported into `CLAUDE.md` via
`@AGENTS.md` so Claude Code sees the same rules regardless of which tool is
reading. These are the only hard, always-true rules for this repo — anything
situational or explanatory lives in `README.md` or `docs/`, not here.

## Money and mainnet safety

- Scripts that can move real funds (`packages/agent/src/scripts/02-launch-pool.ts`
  and anything like it) default to dry-run/simulation. A real `--send` only
  runs after the user's explicit approval of the amount and the simulated
  output — never infer approval from an earlier approval of a different run.
- `secrets/` (wallet keypairs, `*.keypair.json`) is never committed, never
  printed in full, never pasted into a commit message, PR, or issue.
- This project does not custody third-party funds. Don't write submission
  copy, code comments, or docs that could be read as implying otherwise.

## Commit / PR / findings discipline

- The AI co-authorship trailer is never hidden or omitted on any real commit
  or PR.
- Any finding (bug, vuln, audit flag) is documented with a confirmed root
  cause — which code path actually executes it vs. which is loaded-but-never
  -invoked — not a vague "found a problem." See the `npm audit` reachability
  writeup at github.com/Eras256/afterbell/issues/1 for the bar.

## Submission / panel-review discipline (Stocklana bounty)

- Team is 2 people, both with full repo access. State this explicitly in any
  submission text ("equipo de 2, ambos con acceso al código") — don't leave
  bus-factor implicit.
- Every deliverable the bounty scope names gets its own line item in
  submission text, with its own evidence, not folded into a general
  description.

## Content brought in from other projects

- Any checklist, playbook, or skill adapted from a sibling project (this
  account works across several) must be localized before it's trusted here:
  replace that project's names, teams, and specifics with Afterbell's own
  before using it to inform a real decision or submission. A cross-project
  reference is fine as a citation of where a pattern came from; it must not
  be left describing another project's team or facts as if they were ours.
