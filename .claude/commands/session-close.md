---
description: End-of-session hygiene check — audit CLAUDE.md, AGENTS.md, SKILL.md files, and the memory system against their own real purpose.
---

Run an end-of-session hygiene pass over this project's own configuration.
This replaces a generic "make sure everything's updated" — check each piece
against what it's actually *for*, and report "nothing needed here" as a
valid, expected outcome for any item, not a gap to fill with padding.

Go file by file:

1. **`AGENTS.md`** — did this session establish, change, or violate-and-
   correct any hard, always-true rule (money/safety, commit discipline,
   anything that must never happen)? If yes, add or fix that one rule. If
   no, leave it alone — don't add situational or one-off notes here.
2. **`CLAUDE.md`** — did the project's map change (new top-level directory,
   moved file, new pointer worth knowing)? Update only the map. If the file
   is approaching ~200 lines, check whether that's true rule content or
   something that belongs in a referenced doc instead. Never duplicate a
   rule that's already in `AGENTS.md`.
3. **`SKILL.md` files** (`.claude/skills/*/SKILL.md`) — did this session
   reveal that an installed Skill's process is wrong, incomplete, or that a
   new repeated process should become a Skill (or a hook, or a slash
   command — see `claude-antigravity-setup`'s criteria)? Fix or add only
   what's now confirmed by this session's real experience, not speculative
   future needs.
4. **Memory system** (`~/.claude/projects/<this-project>/memory/`) — did
   this session learn a fact, decision, or piece of feedback that isn't
   derivable by reading the code or git history, and that a future session
   would need? Save it as the right memory type (user/feedback/project/
   reference), update `MEMORY.md`'s index, and update or remove any memory
   this session found to be stale or wrong. Don't save what's already
   obvious from the repo.

For each of the four, state explicitly what changed and why, or state
explicitly that nothing needed to change and why that's correct (e.g. "no
new hard rule surfaced this session" is a complete, sufficient answer — do
not invent a rule just to have something to write).
