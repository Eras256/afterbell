---
name: claude-antigravity-setup
description: >
  Configure a project's Claude Code + Antigravity tooling correctly: right
  size and split for CLAUDE.md vs AGENTS.md, when to reach for a Skill vs a
  hook vs a subagent, and how the persistent memory system fits in. Use when
  setting up tooling for a new or existing project, when CLAUDE.md has grown
  too large or stale, or when deciding whether a repeated process belongs in
  a Skill, a hook, or a slash command.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# Claude Code + Antigravity project setup

Generic tool-configuration guidance — not specific to any one project or
stack. Applies wherever this Skill is installed.

## The six pieces, and when each one is the right tool

- **`CLAUDE.md`** — loads in full every session. Hard, always-true rules and
  a short map only. Anthropic's own guidance is to keep it well under ~200
  lines; past that, compliance degrades ("context rot"). If it's grown past
  that, the fix is not deletion — move anything that isn't a hard rule out to
  a referenced file (README, docs/, a playbook), keep only the map here.
- **`AGENTS.md`** — Antigravity reads this natively (since v1.20.5). Whether
  Claude Code itself reads it natively is genuinely version-dependent and
  worth re-checking rather than assuming either way. The version-agnostic fix
  is a `@AGENTS.md` import at the very top of `CLAUDE.md` (Claude Code's real
  import syntax), so the same hard rules reach both tools regardless.
  `AGENTS.md` holds the hard rules; `CLAUDE.md` never repeats them, only
  imports and maps.
- **External memory** (`~/.claude/projects/<project>/memory/`, indexed by
  `MEMORY.md` there) — on-demand, not loaded every session, and survives
  moving or deleting the project folder since it lives outside the repo.
  Holds facts/decisions/feedback that aren't derivable by reading the code —
  see that directory's own guidance for the four memory types (user,
  feedback, project, reference) and what NOT to save there.
- **Skills** (`SKILL.md` + YAML frontmatter, optional scripts/resources) —
  on-demand, description-matched. A shared, de facto format: Antigravity has
  its own Skills system (since v1.14.2) using the identical structure, so a
  Skill written for one generally works unchanged in the other. Use for a
  process that's triggered by description-matching a request, not by a fixed
  event.
- **Hooks** (`settings.json`) — deterministic, fire on tool events, can't
  hallucinate or be skipped. Use for anything that must happen every time a
  specific event occurs, not just when a Skill's description happens to
  match.
- **Subagents** — isolated context, parallel work. Use to keep a large
  exploratory or repetitive task from bloating the main conversation's
  context, not as a substitute for a Skill or hook.

## Install checklist for a new project

1. Measure `CLAUDE.md`'s real size — line count can understate it badly if
   content isn't word-wrapped; measure tokens/words if line count looks
   deceptively small.
2. If it needs trimming: move anything not a hard-always-true rule to a
   referenced file. Decide what stays by relevance to a future session, not
   by recency — an old but still-live operational gotcha stays; a
   chronological changelog moves to its own file.
3. Create or update `AGENTS.md` with the hard rules (money/safety rules,
   commit/PR discipline, anything that must never be violated). Never
   duplicate these back into `CLAUDE.md`.
4. Add `@AGENTS.md` as the first line of `CLAUDE.md`.
5. Confirm the actually-installed Claude Code version before trusting either
   claim about native `AGENTS.md` support — don't assume from memory.
6. For each repeated manual process in the project (a review checklist, a
   compliance check, an end-of-session audit): decide Skill vs. hook vs.
   slash command using the criteria above, and install it as that — not as
   another paragraph bolted onto `CLAUDE.md`.
7. Install `/session-close` (this project's own copy, adapted to what it
   actually has — see `.claude/commands/session-close.md`) as the end-of-
   session hygiene check.
8. Confirm the external memory directory exists and has a `MEMORY.md` index;
   most projects using Claude Code already have this from normal use.

## Adopting this pattern from another project

Never `cp` a `SKILL.md`, playbook, or config file's bytes directly from
another project's repo into this one — even a sibling project using the
identical pattern. Projects in the same portfolio are not meant to be
byte-identical; divergence in wording and specifics is the expected, correct
state. When a pattern is worth bringing over, treat the other project's copy
as a reference to understand the convention, then write this project's own
version by hand from that understanding — replacing every project-specific
name, team, deliverable, and fact with this project's own before it's
trusted for anything real.

If a live peer session for the source project is reachable, messaging it to
confirm identity or cross-check specifics is fine as a bonus — but don't
block the install on a reply. Peer sessions are ephemeral: a `claude
--continue` restart gives a session a new identity, so a message sent to one
instance may never reach anything after the restart. Proceed from the
written reference memory/files if no reply lands in reasonable time.
