---
title: "Implementation Plan: Launcher Test-Bootstrap Guard"
description: "Guard buildIfNeeded against a real npm ci/build under vitest; verify node_modules survives the launcher test."
trigger_phrases:
  - "launcher bootstrap guard plan"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Launcher Test-Bootstrap Guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node (CJS) |
| **Framework** | mk-skill-advisor launcher |
| **Testing** | Vitest |

### Overview

Add a single guard at the top of `buildIfNeeded` so it throws before any `npm ci` / build when `process.env.VITEST` is set. Vitest sets that in every worker; production never does, so production bootstrap is unchanged. Verify by running the launcher test and confirming `node_modules` is untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause located (`buildIfNeeded` `npm ci` line)
- [x] Guard mechanism chosen (`process.env.VITEST`)

### Definition of Done
- [x] Launcher test runs without wiping `node_modules`
- [x] `validate.sh --strict` exits clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-fast guard at the destructive boundary. `buildIfNeeded` is the only path to the real `npm ci`; guarding its entry under vitest covers every test file at once.

### Key Components

- **buildIfNeeded**: throws under vitest before the `npm ci` / build.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Guard
- [x] Add the `process.env.VITEST` guard before the install/build in `buildIfNeeded`

### Phase 2: Verify
- [x] Run the launcher test; confirm `node_modules` dir count is unchanged and no teardown hang
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioural | node_modules survives the test | before/after `find node_modules` count |
| Structural | Packet conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `process.env.VITEST` in vitest workers | External | Green | No guard signal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a real production launcher session is somehow blocked by the guard.
- **Procedure**: revert the single guard block; it keys only on `VITEST`, so production is not a plausible trigger.
<!-- /ANCHOR:rollback -->
