---
title: "Hermetic Test Isolation (HOME/Temp-Dir + Child Env)"
description: "Deep-loop-runtime tests for loop-lock, atomic-state, and fanout-pool share real HOME directories, live database paths, and system temp dirs: tests cannot run in parallel and any state/lock/crash-resume change risks corrupting real operator data."
trigger_phrases:
  - "hermetic test isolation"
  - "001 hermetic test isolation"
  - "spawn-cjs helper"
  - "test isolation home dir"
  - "vitest parallel isolation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/007-testing/001-hermetic-test-isolation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 001-hermetic-test-isolation (global dependency floor)"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Hermetic Test Isolation (HOME/Temp-Dir + Child Env)

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-record-replay-cassette-harness |
| **Handoff Criteria** | `validate.sh --strict` passes; hermetic helper confirmed to prevent real HOME/database/ writes; fanout-run.vitest.ts passes in parallel |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 1 of 2 within `007-testing`.

**GLOBAL DEPENDENCY FLOOR (research §6)**: This leaf is the prerequisite for reliable testing of every other subsystem's changes. Every state/lock/crash-resume/fan-out change across 002-deep-loop-runtime, 003-deep-loop-workflows, and 006-ux-observability-automation needs hermetic tests before the implementation can be safely validated. This phase should be executed before any other subsystem's tests are written or run.

**Scope Boundary**: `spawn-cjs.ts` test helper and wired test files (`fanout-run.vitest.ts`). No production runtime changes.

**Dependencies**:
- No blocking dependency. This is the first phase and the global foundation.
- 002-record-replay-cassette-harness depends on this phase being complete first.

**Deliverables**:
- `spawn-cjs.ts` shared helper: `createHermeticEnv()` isolating HOME, runtime DB paths, temp dirs, and child env per test
- `fanout-run.vitest.ts` wired to hermetic helper, confirmed to run in parallel without real-path writes

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-testing-001`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Tests for `loop-lock.ts`, `atomic-state.ts`, and `fanout-pool.cjs` share real `HOME`, `database/`, and system temp directories because there is no shared hermetic helper. Tests cannot run in parallel without cross-contaminating each other's lock files and state databases, and any test that writes to these paths risks corrupting real operator data. This makes it unsafe to add tests for the many state/lock/crash-resume changes planned in subsystem 002.

### Purpose
Add a `createHermeticEnv()` shared helper to `spawn-cjs.ts` that isolates HOME, runtime DB paths, temp dirs, and child env per test, so `loop-lock.ts`, `atomic-state.ts`, and `fanout-pool.cjs` tests never touch real paths and can run fully in parallel under vitest.

> **Reference**: `external/loop-cli-main/src/config/paths.ts:5-8`; `tests/background-cli.test.ts:13-23`; `tests/projects.test.ts:102-114` — `testHarness.createTempDir()` provides per-test isolated HOME/config/data directories and injects them into child process env, enabling fully parallel test execution. (Research: research.md §5.6, iters 42, 39)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `createHermeticEnv(testId: string): HermeticEnv` helper in `spawn-cjs.ts` returning isolated HOME, DB path, temp dir
- Child env injection: `process.env` overrides in spawned child processes (HOME, database path, temp)
- Cleanup: `hermeticEnv.cleanup()` to delete the temp tree after each test
- Wire `fanout-run.vitest.ts` to use `createHermeticEnv` per test; confirm parallel runs pass
- Audit of all `database/` and `~` path references in test targets to ensure coverage

### Out of Scope
- Changes to production runtime code — test infrastructure only
- End-to-end live loop replay — cassette harness is a separate leaf (002)
- New test cases beyond wiring the existing `fanout-run.vitest.ts` to the helper (002 and other subsystems add tests separately)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | Modify | Add `createHermeticEnv()` with HOME/DB/temp-dir isolation and child-env injection |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | Wire to `createHermeticEnv` per test; verify parallel execution |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `createHermeticEnv()` provides a unique isolated HOME and DB path per test that does not overlap with any other concurrent test | Two tests running in parallel with `createHermeticEnv` never write to the same path; confirmed by inspecting temp dir structure |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `fanout-run.vitest.ts` passes with `--reporter=verbose --pool=threads` (full parallel) without touching real HOME or `database/` | `vitest run --pool=threads tests/unit/fanout-run.vitest.ts` exits 0; no writes to real `~/.` paths verified by file-system audit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `vitest run` on `fanout-run.vitest.ts` in thread-pool mode exits 0 with no real-path writes; hermetic temp dirs are cleaned up after each test
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hermetic helper misses a hard-coded path that still writes to real HOME | High — defeats the isolation goal | Audit every `database/`, `~`, and `os.homedir()` reference in test targets before implementation; grep is mandatory |
| Risk | Temp dir cleanup fails on test error, leaving orphaned directories | Low — cosmetic; doesn't break correctness | Use `afterEach` with a finally block to ensure cleanup; track dirs in a registry |
| Dependency | 002-record-replay-cassette-harness depends on this phase | Hard — cassette cannot record cleanly without isolation | 001 must reach Status: Complete before 002 plan is authored |

> **Note**: Tagged `easy/quick-win` in research §3 rank 1 and §5.6. This is the global dependency floor: every state/lock/crash-resume/fan-out change in other subsystems needs this first. P1 priority reflects that status. (Research: research.md §5.6, iters 42, 39; §6 dependency order)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the hermetic helper use `os.tmpdir()` per test or a fixed `tests/fixtures/hermetic/` directory committed to the repo (the latter enables deterministic path auditing)?
- Should cleanup be automatic in `afterEach` or opt-in via `hermeticEnv.cleanup()` to allow debugging failed tests with their temp dirs intact?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
