---
title: "Implementation Summary: Wire worktree-guard into the Claude SessionStart hook chain"
description: "worktree-guard.sh is now a second non-fatal SessionStart hook step in .claude/settings.local.json, so top-level Claude sessions on shared main get warned — activating the dormant 035 backstop."
trigger_phrases:
  - "sessionstart worktree guard summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/006-sessionstart-worktree-guard"
    last_updated_at: "2026-05-31T00:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified worker JSON edit; committing"
    next_safe_action: "Commit; report"
    blockers: []
    key_files:
      - ".claude/settings.local.json"
      - ".opencode/bin/worktree-guard.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003664"
      session_id: "036-006-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Other runtimes' SessionStart equivalents (Gemini/OpenCode/Codex) are deferred — Claude is the active surface; the guard is documented centrally and can be wired into others when active."
---
# Implementation Summary: Wire worktree-guard into the Claude SessionStart hook chain

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/006-sessionstart-worktree-guard |
| **Completed** | 2026-05-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`worktree-guard.sh` (built in 035 but never wired into a live hook chain) is now the second step in the Claude `SessionStart` hook chain. The chain runs `session-prime.js` first (memory-context priming, unchanged), then `bash .opencode/bin/worktree-guard.sh` (timeout 3) — a detect-and-warn step that prints a one-line stderr warning when a top-level session is running directly on the shared `main` checkout instead of an isolated worktree. The guard is non-fatal (always exits 0) and stays silent for isolated worktrees, orchestrated children (`AI_SESSION_CHILD=1`), and when `SPECKIT_WORKTREE_GUARD=off`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.claude/settings.local.json` | Modified | Append worktree-guard.sh as the 2nd SessionStart hook step |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The JSON edit was delegated to a cli-opencode worker (edits-only, no git) with the exact before/after array shape. The Opus main loop verified against ground truth: `node require()` parses (valid JSON), `SessionStart[0].hooks` has exactly 2 entries with session-prime first and worktree-guard second (timeout 3), and the diff is +5/-0 touching only the SessionStart inner array — no other hook key changed. Because the working tree carried ~1758 parallel-session dirty files, the conductor owned the scope-guarded commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guard runs AFTER session-prime | Priming is the in-turn context step; the guard is a non-blocking warning that must not delay or interfere with priming |
| Claude SessionStart only | Claude is the active runtime; other runtimes' SessionStart equivalents are deferred + noted, with the contract documented centrally in bin/README |
| Keep it non-fatal | A startup guard must never be able to block a session; worktree-guard.sh always exits 0 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| JSON validity | PASS — node require() parses |
| SessionStart structure | PASS — 2 hooks: session-prime[0], worktree-guard[1], guard timeout 3 |
| Additive scope | PASS — diff +5/-0, only the SessionStart inner array changed |
| Packet strict-validate | PASS (confirmed at commit gate) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Claude runtime only.** Gemini `SessionStart`, OpenCode `event` startup, and Codex `hooks.json` do not yet run the guard. They are deferred — the guard's contract is documented centrally in bin/README and can be wired into each when it is the active surface.
2. **Backstop, not isolation.** The guard only WARNS; it cannot relocate an already-started session into a worktree. True isolation still requires the launch alias (`worktree-session.sh`), which is operator-machine/environment-specific (035 limitation #1) and out of scope here.
3. **Local settings file.** `.claude/settings.local.json` is tracked in this repo, so the wiring is shared; operators who maintain a divergent local copy must merge the SessionStart change.
<!-- /ANCHOR:limitations -->
