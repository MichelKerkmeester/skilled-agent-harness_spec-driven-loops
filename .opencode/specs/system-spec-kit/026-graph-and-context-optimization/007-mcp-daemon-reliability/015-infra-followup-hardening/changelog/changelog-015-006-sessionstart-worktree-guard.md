# Changelog , , ,  006: Wire worktree-guard into the Claude SessionStart hook chain

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.claude/settings.local.json` to append worktree-guard.sh as the 2nd SessionStart hook step
- SessionStart chain now runs session-prime.js first (memory-context priming, unchanged), then bash .opencode/bin/worktree-guard.sh (timeout 3)
- Guard is non-fatal (always exits 0) and stays silent for isolated worktrees, orchestrated children (AI_SESSION_CHILD=1), and when SPECKIT_WORKTREE_GUARD=off

## Why
Packet 035 created worktree-guard.sh but never wired it into the live Claude hook chain. The guard existed but was dormant. Wiring it warns operators when a top-level session is running directly on the shared main checkout instead of an isolated worktree.

## Verification
- JSON validity: PASS , , ,  node require() parses
- SessionStart structure: PASS , , ,  2 hooks: session-prime[0], worktree-guard[1], guard timeout 3
- Additive scope: PASS , , ,  diff +5/-0, only the SessionStart inner array changed
- Packet strict-validate: PASS
