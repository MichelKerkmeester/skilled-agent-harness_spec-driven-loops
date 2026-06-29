---
title: "Subsystem: Testing — Hermetic Isolation and Record-Replay"
description: "Deep-loop-runtime tests share real HOME directories, live database paths, and temp dirs, so they cannot run in parallel and any state/lock/crash-resume change risks corrupting real data. There is also no record-replay harness to regression-test convergence behavior across code changes."
trigger_phrases:
  - "hermetic test isolation"
  - "record replay cassette"
  - "007 testing"
  - "deep loop runtime tests"
  - "spawn-cjs test helper"
  - "convergence regression tests"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/008-testing"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored subsystem parent spec for 007-testing"
    next_safe_action: "Execute child phase 001-hermetic-test-isolation first (global dependency floor)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
      - ".opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Subsystem: Testing — Hermetic Isolation and Record-Replay

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-ux-observability-automation |
| **Successor** | None |
| **Handoff Criteria** | Both child phases pass `validate.sh --strict`; hermetic isolation (001) must pass before record-replay (002) is planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the 156-agent-loops-improved subsystem groups.

**Scope Boundary**: Test infrastructure only — `spawn-cjs.ts` helper, integration test scaffold, and convergence-script vitest. No changes to production runtime code.

**Dependencies**:
- **001-hermetic-test-isolation is the global dependency floor** (research §6): every state/lock/crash-resume/fan-out change across all subsystems needs hermetic tests first. This child phase is therefore a prerequisite for reliable testing of any other subsystem's changes, regardless of phase ordering.
- 002-record-replay-cassette-harness: depends on 001 (hermetic env must exist before cassette can record cleanly).

**Deliverables**:
- `spawn-cjs.ts` updated with hermetic HOME/temp-dir isolation helper (001).
- Record-replay `recordScriptRun()` / `replayScriptRun()` added to the test helper (002).

**Changelog**:
- When each child phase closes, refresh the matching file in `../changelog/` using parent packet number plus the child folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Tests for `loop-lock.ts`, `atomic-state.ts`, and `fanout-pool.cjs` share real `HOME`/`database/` paths and temp dirs, preventing parallel execution and risking real-data corruption. There is no way to regression-test convergence-script behavior after a code change without re-running the full live loop, making convergence math changes risky to ship.

### Purpose
Establish the hermetic test foundation (isolated HOME/DB/temp per test, shared helper) and build a record-replay cassette harness for normalized dispatch envelopes so convergence changes are verified deterministically before landing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `spawn-cjs.ts`: shared hermetic helper isolating HOME, runtime DB paths, temp dirs, and child env per test
- Record-replay `recordScriptRun()` / `replayScriptRun()` in `spawn-cjs.ts` capturing normalized dispatch envelopes
- Convergence-script integration test (`convergence-script.vitest.ts`) using the cassette harness
- Fan-out unit test (`fanout-run.vitest.ts`) wired to hermetic helper

### Out of Scope
- Changes to production runtime code — test infrastructure only
- End-to-end live loop replay — cassette covers script-level dispatch envelopes, not full MCP sessions

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | Modify | Add hermetic HOME/temp-dir + child-env isolation; add `recordScriptRun` / `replayScriptRun` |
| `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` | Modify | Wire record-replay cassette; pin convergence-change regression baseline |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | Wire hermetic helper; enable parallel execution |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detail lives in child phase specs; 001 must complete before 002 is planned | 001 child spec passes `validate.sh --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Both child phases reach Status: Complete | `validate.sh --recursive` on this folder exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both child phase specs pass `validate.sh --strict` with zero errors
- **SC-002**: Hermetic helper confirmed to prevent real HOME/database/ writes in test runs
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hermetic helper misses a path that still writes to real HOME | High — defeats the isolation goal | Audit all `database/` and `~` usages in test target before implementation |
| Dependency | Record-replay cassette depends on hermetic isolation existing | Medium — unclean HOME corrupts recorded fixtures | Enforce hard dependency: 001 must be complete before 002 plan is authored |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the hermetic helper use OS temp dirs (`os.tmpdir()`) or fixture-scoped directories committed to the repo?
- Should cassette fixtures be redacted by default (stripping real paths/tokens) or raw with a separate redaction pass?
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

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-hermetic-test-isolation/` | Shared `spawn-cjs.ts` helper: isolate HOME/runtime-DB/temp-dir/child-env per test; enable parallel vitest runs (**global dependency floor** for all state/lock/crash-resume changes) | Draft |
| 2 | `002-record-replay-cassette-harness/` | `recordScriptRun()` / `replayScriptRun()` capturing normalized dispatch envelopes; convergence-script regression baseline | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-hermetic-test-isolation | 002-record-replay-cassette-harness | Hermetic helper merges; fanout-run.vitest.ts passes in parallel | `vitest run` exits 0 with no real-path writes |
<!-- /ANCHOR:phase-map -->
