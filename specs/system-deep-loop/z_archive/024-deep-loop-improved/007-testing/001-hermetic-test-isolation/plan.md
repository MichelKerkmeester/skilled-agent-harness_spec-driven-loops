---
title: "Implementation Plan: Hermetic Test Isolation (HOME/Temp-Dir + Child Env)"
description: "Documents the completed hermetic test environment helper and fanout-run wiring work."
trigger_phrases:
  - "hermetic test isolation"
  - "spawn-cjs helper"
  - "test isolation home dir"
  - "vitest parallel isolation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/007-testing/001-hermetic-test-isolation"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hermetic Test Isolation (HOME/Temp-Dir + Child Env)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript vitest helpers and deep-loop-runtime test files |
| **Framework** | Vitest thread-pool execution with child process helpers |
| **Storage** | Per-test temporary HOME, DB path, temp directory, and child env |
| **Testing** | Parallel vitest run, real-path write audit, strict spec validation |

### Overview
This completed work added a shared `createHermeticEnv()` helper that isolates HOME, database paths, temp directories, and child process environment per test. `fanout-run.vitest.ts` now uses the helper so parallel tests cannot touch real operator paths or cross-contaminate each other's state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: tests shared real HOME, database, and temp paths.
- [x] Success criteria measurable: parallel tests have unique temp roots and no real-path writes.
- [x] Dependencies identified: this leaf is the testing foundation for record-replay and stateful deep-loop changes.

### Definition of Done
- [x] `spawn-cjs.ts` exports `createHermeticEnv()` with isolated HOME, DB path, temp dir, and child env.
- [x] Hermetic cleanup removes per-test temp trees after each test.
- [x] `fanout-run.vitest.ts` uses a unique hermetic env per test.
- [x] Parallel vitest execution passes without touching real HOME or `database/` paths.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-test sandbox helper: every test receives a unique temp root and child environment overrides, so spawned CommonJS scripts and runtime helpers resolve paths into isolated directories.

### Key Components
- **`createHermeticEnv(testId)`**: Builds isolated HOME, database, temp, and child-env values for a test.
- **`HermeticEnv.cleanup()`**: Deletes the temp tree after the test completes.
- **Child env injection**: Ensures spawned scripts receive HOME, database path, and temp overrides.
- **`fanout-run.vitest.ts` wiring**: Applies the helper to fan-out tests that exercise state and lock behavior.

### Data Flow
Each test calls `createHermeticEnv()`, passes the generated environment into child process helpers, and runs scripts against isolated paths. After assertions complete, cleanup removes the temp tree, leaving the real HOME and project database paths untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spawn-cjs.ts` | Shared child process test helper | Add `createHermeticEnv()` and cleanup | Parallel test dirs are unique |
| Child process env | Controls script path resolution | Inject HOME, DB, and temp overrides | Spawned scripts write under temp root |
| `fanout-run.vitest.ts` | Exercises fan-out runtime behavior | Use hermetic env per test | Thread-pool run passes |
| Real operator paths | Must remain untouched | Audit hard-coded HOME/database references | No writes to real paths |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm test-infrastructure-only scope.
- [x] Audit `database/`, `~`, and home-dir references in test targets.
- [x] Confirm record-replay cassette harness depends on this isolation layer.

### Phase 2: Core Implementation
- [x] Add `createHermeticEnv(testId)` to `spawn-cjs.ts`.
- [x] Return isolated HOME, DB path, temp dir, and child env values.
- [x] Add cleanup handling for per-test temp directories.
- [x] Wire `fanout-run.vitest.ts` to use a hermetic env per test.
- [x] Ensure spawned child processes inherit the isolated environment.

### Phase 3: Verification
- [x] Verify two parallel tests use different HOME and DB paths.
- [x] Verify `fanout-run.vitest.ts` passes under vitest thread-pool mode.
- [x] Verify file-system audit finds no writes to real HOME or project `database/` paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Unique hermetic env paths and cleanup behavior | Vitest helper tests |
| Integration | `fanout-run.vitest.ts` with hermetic child env | `vitest run --pool=threads` |
| Audit | Real HOME and `database/` path avoidance | File-system path inspection |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| No predecessor leaf | Internal | Complete | This leaf establishes the testing isolation floor |
| Record-replay cassette harness | Internal successor | Complete | Cassette recording needs hermetic paths for safe fixtures |
| Production runtime changes | Out of scope | Not required | Only test helper and test wiring changed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Hermetic env still writes to real paths, cleanup leaks temp trees, or fanout tests fail under parallel execution.
- **Procedure**: Revert the `spawn-cjs.ts` helper additions and `fanout-run.vitest.ts` wiring, then disable parallel execution for affected tests until isolation is repaired.
<!-- /ANCHOR:rollback -->
