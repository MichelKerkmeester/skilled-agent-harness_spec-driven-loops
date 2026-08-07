

---
title: "Wire worktree-guard into the Claude SessionStart hook chain"
description: "worktree-guard.sh (built in packet 035 but dormant) is now the second step in the Claude SessionStart hook chain, so top-level sessions landing on the shared main checkout receive a one-line stderr warning."
trigger_phrases:
  - "sessionstart worktree guard"
  - "worktree-guard hook wiring"
  - "035 backstop sessionstart"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/006-sessionstart-worktree-guard` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening`

### Summary

The `worktree-guard.sh` backstop script from packet 035 was wired into a live hook chain for the first time. It is now the second step in the Claude `SessionStart` hook chain, running after `session-prime.js`. The guard detects when a top-level session is running on the shared `main` checkout instead of an isolated worktree and prints a one-line stderr warning. It is non-fatal (always exits 0) and stays silent for isolated worktrees, orchestrated children (`AI_SESSION_CHILD=1`), and when `SPECKIT_WORKTREE_GUARD=off`.

### Added

- Worktree-guard wired as second SessionStart hook step so the 035 backstop runs on every top-level Claude session that lands on shared main.

### Changed

- None.

### Fixed

- None.

### Verification

- JSON validity - PASS (node require() parses)
- SessionStart structure - PASS (2 hooks: session-prime[0], worktree-guard[1], guard timeout 3)
- Additive scope - PASS (diff +5/-0, only the SessionStart inner array changed)
- Packet strict-validate - PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.claude/settings.local.json` | Modified | Append worktree-guard.sh as the 2nd SessionStart hook step |

### Follow-Ups

- Gemini SessionStart, OpenCode event startup, and Codex hooks.json do not yet run the guard. They are deferred, the guard contract is documented centrally in `bin/README` and can be wired into each when it is the active surface.
- The guard only WARNS, it cannot relocate an already-started session into a worktree. True isolation still requires the launch alias (`worktree-session.sh`), which is operator-machine and environment-specific and out of scope here.
- `.claude/settings.local.json` is tracked in this repo. Operators who maintain a divergent local copy must merge the SessionStart change manually.
