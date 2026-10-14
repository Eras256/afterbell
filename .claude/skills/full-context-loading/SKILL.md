---
name: full-context-loading
description: >
  How every answer in this project should already reflect the full
  stack of available context — this project's CLAUDE.md/AGENTS.md,
  persistent memory, this project's own hand-built skills, Claude's
  global skills, and any installed community/network skill packages —
  without re-reading everything on every turn or bloating token usage.
  Covers what already loads automatically for free, what the actual
  discipline fix is (checking what exists before answering from
  scratch), what NOT to do (force full preload of every skill body),
  and a live inventory of what exists in this project so a fresh
  session doesn't have to rediscover it. Use at the start of a new
  session, when asked "do you have full context," or whenever an
  answer risks being generic instead of grounded in what this project
  already knows.
---

# Full context loading — every answer grounded, without re-reading everything

## What already loads automatically, every session, at zero extra cost

No action needed for these — verify they're actually true for this
project, then treat them as given:

- **`CLAUDE.md` (and any file it imports, e.g. `AGENTS.md`)** — injected
  as project instructions automatically at session start. This is where
  this project's hard rules and file map should already live.
- **The persistent memory system**, if this project has one — its
  index file (commonly `MEMORY.md`) loads automatically every session;
  the full content of any individual memory entry loads only when
  read. Check the index before answering something it might already
  cover — don't re-derive a fact memory already has.
- **Every installed Skill's name + description** — Claude Code shows
  this list automatically at session start, at a cost of tens of tokens
  per skill. The **full body** of a skill loads only when a task
  matches its description (via the `Skill` tool) or is loaded here
  explicitly. **This is already the token-saving mechanism this project
  needs — it does not need to be rebuilt.**

## The real fix: actively check before answering, don't wait to be told

The gap this skill exists to close isn't a missing preload — it's a
session answering a non-trivial request as if none of the above
existed, when a quick check would have surfaced something directly
relevant. Before answering anything beyond a trivial or purely
conversational request, run this check:

1. **Does an available Skill's description match this task?** If yes,
   invoke it (`Skill` tool) instead of reasoning from scratch what it
   already documents.
2. **Does this project's memory index name something relevant?** Read
   that entry before asserting a fact "from nothing" — a past
   correction, a verified figure, a standing decision may already be
   there.
3. **Does a playbook or reusable-process doc this project actually
   has** (only if one exists — don't assume a `playbooks/` folder
   exists just because another project has one) **already cover this
   kind of task?**
4. **Is there a community/network skill package installed** that's more
   current than what's in memory or in a hand-built skill? Skill
   packages get updated independently of this project's own memory.

This is a discipline to apply every time, not a one-time setup step —
don't answer from a blank slate what an already-available resource
already covers.

## What NOT to do — don't force full preload

Loading every skill's entire body and every memory entry into context
on every session start would cost real tokens for content irrelevant
to most requests — this directly fights the goal of not wasting
tokens, not serves it. The name+description-only preload already IS
the correct mechanism for exactly this tradeoff: cheap awareness that
something exists, full cost only when it's actually used. Don't try to
route around it by dumping full content somewhere it'll be re-read
every turn.

## Inventory — what exists in THIS project right now

- **Claude's own global skills** (`~/.claude/skills/`) — this machine
  also hosts other, unrelated projects, so most entries there (Stellar-
  specific skills, agent personas, SCF-submission helpers) don't apply
  to Afterbell. The one confirmed relevant here: `branding-pack`
  (generic, network-agnostic asset-pack generator).
- **This project's own hand-built skills** (`.claude/skills/` in this
  repo, verified 2026-09-18): `claude-antigravity-setup` (tooling
  setup), `mexico-legal-check` (regtech posture — operator is Mexico-
  based), `teammate-commit-identity` (team is 2 people, both with repo
  access), `full-context-loading` (this file), `grants-track-record`,
  `hackathon-fit-check`, `public-claim-verify`, `repo-security-sweep`,
  `doc-accuracy-audit`, `portfolio-funding-rollup`.
- **Community/network skill packages installed** — the Solana package,
  verified 2026-09-18 as real, not archived, recently active, and
  byte-identical to the upstream repos at verification time:
  `solana-dev` (`solana-foundation/solana-dev-skill`, official, pushed
  2026-09-09) and `helius`/`meteora`/`pumpfun`/`pyth`/
  `solana-agent-kit`/`surfpool`/`vulnhunter`/`zz-code-recon`
  (`sendaifun/skills`, community, pushed 2026-07-31). A second,
  separate copy of the same package lives at `.agents/skills/` in this
  repo (gitignored, tracked by `skills-lock.json`) for a different
  tool's own skill discovery — Claude Code itself only reads
  `.claude/skills/`, which is why both copies exist.
- **Playbooks or reusable-process docs** — none exist in this project;
  no `playbooks/` folder or equivalent.
- **Persistent memory** — `~/.claude/projects/-home-vaiosvaios-afterbell/memory/`,
  indexed by `MEMORY.md` there. No name collision: `docs/` holds only
  the submission draft and panel-review checklist, not a second memory
  index.

**Verify your `.gitignore` isn't silently hiding your `SKILL.md` files
from git — a real bug found in this project (2026-09-18): an exact-path
rule, `.claude/skills/teammate-commit-identity/`, excluded that one
skill from version control even though it was a real, non-symlink copy
with clean, generic content — meaning it would not have survived a
fresh clone or reached the second teammate at all. Removed from
`.gitignore` once confirmed there was no reason to keep it hidden.
Confirm with `git ls-files` or `git check-ignore -v <path>` on each real
`SKILL.md` — don't just read `.gitignore` and assume nothing narrow or
wide in it is a problem.** A deliberate exclusion (a private folder kept
out of a public repo on purpose, one identity-sensitive skill excluded
by exact path for a real content reason) is a different, legitimate
case — the test is whether tracking matches what you actually intended,
verified, not assumed from the rule's mere existence.

## Verifying anything date-sensitive — always fresh, never from training memory

A memory entry or a skill's own text can be stale by the time it's
read. When a task needs external, current information (a price, a
version, a legal deadline, a repo's live state), verify it live via
WebSearch/WebFetch/`gh api`/`npm view` on the day it's asked, every
time — regardless of how confidently a prior memory or skill states it.

## Related

`hackathon-fit-check` and `grants-track-record` (before treating the
Stocklana bounty, or any future program, as worth entering), `doc-
accuracy-audit` (before the submission draft in `docs/` cites anything
as fact), `repo-security-sweep` (this repo is public — periodic hygiene
matters more here than in a private repo).
