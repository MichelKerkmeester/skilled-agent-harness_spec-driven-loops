---
title: "Implementation Summary: Launcher Test-Bootstrap Guard"
description: "Guarded the launcher bootstrap against a real npm ci under vitest — the suite no longer wipes node_modules or hangs."
trigger_phrases:
  - "launcher bootstrap guard summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/020-launcher-test-bootstrap-guard"
    last_updated_at: "2026-08-15T15:19:29Z"
    last_updated_by: "claude-code"
    recent_action: "Guarded launcher bootstrap against real npm ci under vitest; suite no longer wipes node_modules"
    next_safe_action: "IPC-bridge owner reconciles the createChildEnv fixture drift"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Launcher Test-Bootstrap Guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-launcher-test-bootstrap-guard |
| **Completed** | 2026-08-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single fail-fast guard in the advisor launcher's `buildIfNeeded`: when `process.env.VITEST` is set, it throws before the `npm ci` / build instead of running them. `npm ci` deletes and reinstalls `node_modules`, so a test path that reached `buildIfNeeded` against the real `mcp-server` was emptying the dependency tree mid-suite and hanging vitest teardown. The guard makes that impossible; production is unaffected because `VITEST` is never set there.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Throw in `buildIfNeeded` under vitest before any real install/build |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The destructive path was located statically (`buildIfNeeded` → `npm ci` at line 1189) rather than reproduced, because reproducing the wipe is itself destructive on a shared tree. A single `process.env.VITEST` guard was added before the install/build. Verification ran the launcher test once with a `node_modules` dir-count captured before and after — the count was identical (441→441) and `node_modules/.bin/vitest` survived, proving the guard prevents the wipe and un-hangs the suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Guard on `process.env.VITEST` | Vitest sets it in every worker; production never does, so one check covers all test files with zero production impact |
| Throw rather than no-op | A test reaching the real bootstrap is a mistake to surface; well-written tests pre-stage artifacts via `configureLauncherPathsForTesting` |
| Leave the `createChildEnv` fixture drift to its owner | The 3 residual failures are a stale-fixture issue (`SPECKIT_IPC_SOCKET_DIR` newly derived by the IPC bridge); it is a security test and belongs to the IPC-bridge change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Notes |
|-------|--------|-------|
| node_modules survives | Pass | `441` dirs before and after; `node_modules/.bin/vitest` intact |
| No teardown hang | Pass | launcher test exits 0; 18 tests run to completion (was hanging) |
| Guard is not the cause of residuals | Pass | The 3 remaining failures are `createChildEnv` `.toEqual` mismatches (extra `SPECKIT_IPC_SOCKET_DIR`), not the guard throw |
| Scope | Pass | one file changed under `.opencode/bin/` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **3 launcher-bootstrap tests still fail** on a separate `createChildEnv` drift — the launcher now derives `SPECKIT_IPC_SOCKET_DIR` for the child env and the `.toEqual` fixtures predate it. Left for the IPC-bridge owner; not force-fixed because it is a security ("no leak") test.
2. **The guard throws rather than mocks** — a test that genuinely needs built artifacts must pre-stage them in its temp sandbox.
<!-- /ANCHOR:limitations -->
