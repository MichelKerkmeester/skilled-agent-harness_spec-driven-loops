---
title: "Feature Specification: Launcher Test-Bootstrap Guard"
description: "The advisor launcher ran a real `npm ci` during tests, deleting node_modules and hanging the whole suite. Guard the bootstrap so it can never run under vitest; production is unaffected."
trigger_phrases:
  - "launcher npm ci wipes node_modules"
  - "advisor suite teardown hang"
  - "launcher bootstrap test guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/020-launcher-test-bootstrap-guard"
    last_updated_at: "2026-08-15T15:19:29Z"
    last_updated_by: "claude-code"
    recent_action: "Guarded launcher bootstrap against real npm ci under vitest; suite no longer wipes node_modules"
    next_safe_action: "IPC-bridge owner reconciles the createChildEnv SPECKIT_IPC_SOCKET_DIR fixture drift"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Launcher Test-Bootstrap Guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`mk-skill-advisor-launcher.cjs buildIfNeeded()` runs `npm ci` when advisor build artifacts look stale. Under a test run, a launcher code path reaches `buildIfNeeded` against the real `mcp-server`, so `npm ci` **deletes and reinstalls `node_modules`** mid-suite — which empties the dependency tree, breaks every subsequent test, and hangs vitest teardown (the full `vitest run` never completes, exit 130).

### Purpose

Make it impossible for a test run to trigger the real `npm ci` / build, so the suite can run to completion and never wipes a live `node_modules`. Production launcher behavior must be unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A guard in `buildIfNeeded` that refuses the real `npm ci` / build when running under vitest (`process.env.VITEST`).

### Out of Scope

- The `createChildEnv` fixture drift: `createChildEnv` now derives `SPECKIT_IPC_SOCKET_DIR` from the IPC bridge, and 3 launcher-bootstrap `.toEqual` fixtures predate it. That is a separate stale-fixture issue owned by the IPC-bridge change, not this guard.
- Changing production bootstrap behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Guard `buildIfNeeded` against a real install/build under vitest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A test run can never trigger the real `npm ci` / build | `buildIfNeeded` throws before any npm call when `process.env.VITEST` is set |
| REQ-002 | Running the launcher test leaves `node_modules` intact | `node_modules` dir count is identical before and after `tests/launcher-bootstrap.vitest.ts` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Production bootstrap is unaffected | The guard keys only on `process.env.VITEST`, which production never sets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tests/launcher-bootstrap.vitest.ts` runs to completion (18 tests) without wiping `node_modules`. (Met — 441→441 dirs, vitest bin survives.)
- **SC-002**: The teardown hang is gone. (Met — exit 0, no hang.)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The guard blocks a test that legitimately needs artifacts | Low | Well-written tests pre-stage artifacts via `configureLauncherPathsForTesting`; the throw surfaces any that don't |
| Risk | Verifying the fix could itself wipe `node_modules` | Medium | The guard prevents the wipe; verified with a before/after dir-count check |
| Dependency | `process.env.VITEST` is set in vitest workers | Green | Vitest sets it in every worker; production never does |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the 3 `createChildEnv` fixtures be updated to include the launcher-derived `SPECKIT_IPC_SOCKET_DIR`? Deferred to the IPC-bridge owner — it is a security test and the fixture change must be made with confidence the var is intended (it is launcher-derived, not a parent passthrough).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Sibling packet**: `019-code-graph-retirement-drift`
