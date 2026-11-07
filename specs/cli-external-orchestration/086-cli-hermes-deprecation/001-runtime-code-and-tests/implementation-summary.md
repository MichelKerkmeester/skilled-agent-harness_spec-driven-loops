---
title: "Implementation Summary"
description: "Hermes is gone from every runtime code path: no executor kind, fan-out adapter, relaunch adapter, dispatch rule or launcher arm still knows it, and every other executor behaves as before."
trigger_phrases:
  - "remove cli-hermes executor code"
  - "hermes runtime removal tests"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/086-cli-hermes-deprecation/001-runtime-code-and-tests"
    last_updated_at: "2026-11-07T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Completed phase 1: runtime-code-and-tests"
    next_safe_action: "Proceed to phase 002 docs and registries"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-086-001-runtime-code-and-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove cli-hermes completely with no backup"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-runtime-code-and-tests |
| **Status** | Complete |
| **Completed** | 2026-11-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Hermes is gone from every runtime code path: no executor kind, fan-out adapter, relaunch adapter, dispatch rule or launcher arm still knows it, and every other executor behaves as before.

### Phase 1: runtime-code-and-tests

You can no longer select `cli-hermes` anywhere. The executor config rejects it, the fan-out builder has no adapter for it, and the launcher no longer defines a `hermes` shell function, so a new shell starts without one. Tests that froze roster sizes now expect one fewer runtime.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts` | Modify | Drop the executor kind and its tables |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Drop the Hermes adapter, env and availability probe |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | Modify | Drop Hermes as a seat executor |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/**` | Modify/Delete | Delete the Hermes shim and suite, shrink the matrix to 8 subjects |
| `.skilled/hooks/session-relaunch/hermes/` | Delete | The Hermes relaunch adapter |
| `.skilled/hooks/session-relaunch/lib/*.cjs`, `.skilled/hooks/shared/hook-flags.*` | Modify | Drop Hermes from runtime lists |
| `.skilled/hooks/dispatch/lib/*.mjs` | Modify | Drop Hermes dispatch rules and audit shapes |
| `.skilled/bin/skilled-loop`, `skilled-loop-shell.sh` | Modify | Drop the launcher arm and shell function |
| `.skilled/scripts/git-hooks/pre-commit`, `orphan-mcp-sweeper.sh` | Modify | Drop Hermes mirror checks and process patterns |
| `.skilled/commands/doctor/scripts/**` | Modify | Drop Hermes from the integrate, surface, check and git-setup scripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The hooks, launcher and git-hooks area went to one Claude agent. The deep-loop area went to four DeepSeek V4.1 Flash max workers on OpenCode Go, each with a short brief naming its allowed files, after the operator asked for DeepSeek workers only. Two workers were refused for provider capacity and retried one at a time. Every worker's claim was rechecked by rerunning its tests and reading its diff.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove outright, no deprecation stubs | The operator asked for complete deprecation with no backup; git history is the backup |
| Keep the Pi cache optimizer's Hermes model labels | They describe the Nous Hermes model family, not this runtime |
| Keep the captured Devin transcript fixture text | It is recorded transcript data; editing it would corrupt the fixture |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted deep-loop suites | PASS, 433 passed and 8 skipped (baseline 466 passed, 2 failed) |
| Council orchestrator test | PASS, 19/19 (baseline 21/21; 2 Hermes-only tests removed) |
| Session relaunch | PASS, 813/813 (baseline 869/869) |
| Hooks vitest | PASS, 483/483 (baseline 482 of 483) |
| Dispatch rule checks | PASS, 47/47 (baseline 50/50) |
| Pre-commit tests | PASS, 157 passed, 0 failed (baseline 159, 0 failed) |
| Deep-loop typecheck | PASS, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full deep-loop suite keeps one failure.** `deep-research-ledger-schema.vitest.ts` fails on main as well; this change did not cause it.
2. **One residue is kept on purpose.** `decision-capture` keeps a captured Devin transcript that mentions Hermes as text.
<!-- /ANCHOR:limitations -->

---
