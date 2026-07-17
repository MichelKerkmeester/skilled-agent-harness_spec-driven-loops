---
title: "Implementation Summary: Runtime Defect Fixes [system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes/implementation-summary]"
description: "Four live defects fixed and smoke-verified: code-graph plugin bridge restored, Codex hooks rewired to their adapters, two doc corrections; orphan sweep verified as a no-op."
trigger_phrases:
  - "runtime defect fixes result"
  - "bridge repair complete"
  - "026 008 summary"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/008-runtime-defect-fixes"
    last_updated_at: "2026-06-06T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All four fixes applied and smoke-verified"
    next_safe_action: "Commit alongside the 028 program work"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-runtime-defect-fixes |
| **Completed** | 2026-06-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three of four defect fixes shipped; the fourth was attempted, smoke-verified, and deliberately REVERTED after a fresh-model review. Codex sessions now run the purpose-built Codex hook adapters (SessionStart + UserPromptSubmit) instead of Claude's scripts, and the unsupported PreCompact registration was removed entirely (the hook contract lists Codex compaction as unsupported). The backwards DB-path note in `.codex/config.toml` and the Gemini catalog's shim-vs-implementation confusion are corrected. The bridge import fix worked mechanically (exit 0, correct transport payload) but the review caught that a runnable bridge calls `initializeDb()`/`sessionManager.init()` directly against the daemon-owned memory DB — the dual-writer incident class — so it was reverted; the bridge stays inert until the 028 code-index phase delivers the IPC-backed transport.

The planned orphan-launcher sweep ended as a verified NO-OP: parent-process classification showed all 9 running launchers belong to live sessions (six Claude sessions, one OpenCode TUI — including a 1-day-7-hour session still open). The launcher-lifecycle fix for true owner-exit orphans stays with the 028 skill-advisor workstream.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| mk-code-graph-bridge.mjs | Unchanged (fix reverted on review) | Dual-writer hazard; IPC-backed fix owned by 028 |
| .codex/hooks.json | Modified | SessionStart/UserPromptSubmit → codex adapters; PreCompact removed |
| .codex/config.toml | Modified | DB-path note corrected |
| gemini-hook.md (skill-advisor catalog) | Modified | Implementation/shim rows corrected |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verify-first: each defect was reproduced live (missing import targets listed, hook commands grepped, launcher parent PIDs classified) before its minimal fix, then smoke-tested immediately (bridge `--minimal` run, both codex adapters fed sample stdin).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Revert the bridge fix despite a passing smoke | A runnable bridge initializes the memory DB directly in a second process — the exact corruption class the daemon's single-writer lease exists to prevent; broken-and-inert is safer than working-and-racy |
| Remove Codex PreCompact instead of keeping the shared script | hook_system.md lists Codex compaction as unsupported; the registration was dead weight with a wrong-envelope script behind it |
| Document the cross-skill borrow in the bridge instead of restructuring | The 028 code-index phase 3 replaces this bridge path with the CLI-backed one; minimal fix now, proper transport later |
| Sweep as no-op rather than killing old launchers | Every launcher's parent is a live session; launchers ARE those sessions' MCP transports — killing them breaks working sessions |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bridge smoke then review | Smoke PASSED mechanically, but fresh gpt-5.5 xhigh review flagged P0 dual-writer (direct DB init outside the launcher lease) → fix REVERTED; bridge inert by choice |
| Codex session-start smoke | PASS — valid envelope, 466-byte additionalContext |
| Codex user-prompt-submit smoke | PASS — valid JSON fail-open envelope |
| hooks.json parses | PASS |
| Sweep safety (REQ-004) | PASS — zero kills; all 9 launcher parents classified as live sessions |
| Packet strict validation | PASS (run at reconciliation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The OpenCode code-graph plugin remains non-functional (bridge inert by deliberate choice) until the 028 code-index runtime-integration phase delivers the IPC-backed transport — its README accurately documents the non-functional state.
2. Codex UPS smoke returned a fail-open empty envelope (advisor brief content depends on daemon availability at call time) — correct contract behavior, but a live Codex session should confirm brief content post-rewiring.
<!-- /ANCHOR:limitations -->
