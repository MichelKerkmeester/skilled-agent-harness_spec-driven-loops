---
title: "Coverage Graph Time-Decay Weighting"
description: "Old FINDING/SOURCE nodes exert full convergence force indefinitely; time-decay weighting reduces actionability scores of stale evidence without discarding historical coverage data."
trigger_phrases:
  - "coverage-graph time-decay"
  - "signal decay weighting"
  - "stale convergence signal"
  - "decay-days configuration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/013-coverage-graph-time-decay"
    last_updated_at: "2026-06-28T14:02:02Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-coverage-graph-time-decay"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Coverage Graph Time-Decay Weighting

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
| **Phase** | 13 of 18 |
| **Predecessor** | 012-observation-threshold-guard |
| **Successor** | 014-coverage-graph-fuzzy-merge |
| **Handoff Criteria** | `timeDecayWeight` integrated into signal ranking; unit tests pass; `decayDays=0` produces zero regression |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the deep-loop-runtime recs specification.

**Scope Boundary**: `coverage-graph-signals.ts` only — no changes to persisted state schemas or other graph layers.

**Dependencies**:
- Coverage graph signal-ranking path must be readable before implementation begins

**Deliverables**:
- `timeDecayWeight(createdAt, decayDays, now)` function wired into existing signal ranking math
- Config path: `decayDays=0` (default, no-decay); 30d example when enabled

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Old FINDING/SOURCE nodes accumulate in the coverage graph and continue to exert full convergence force long after their evidence is stale; this causes premature stop signals on runs that revisit old territory. There is no mechanism to downweight age-based signal without erasing historical coverage records. The result is that iterative deep-loop runs can converge falsely on previously explored territory that has since changed.

### Purpose
Introduce `timeDecayWeight` into signal ranking math so stale nodes contribute less convergence force without their historical coverage being discarded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `timeDecayWeight(createdAt, decayDays, now)` returning `0.5^(ageDays/decayDays)` in `coverage-graph-signals.ts`
- Wire the decay weight into existing signal ranking math (not a standalone helper only)
- Config path: `decayDays=0` disables decay (default); 30d when enabled; minimum enforcement via config validation
- Historical coverage raw counts kept unchanged; decay applies to actionability/ranking weight only

### Out of Scope
- Per-node override of decay rate — deferred; adds schema complexity without a clear current need
- UI display of decayed vs raw weights — deferred; out of backend scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modify | Add `timeDecayWeight` and wire into signal ranking math |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `timeDecayWeight(createdAt, decayDays, now)` must return `0.5^(ageDays/decayDays)`; `decayDays=0` must return 1.0 (no-decay path) | Unit test: `decayDays=0` → 1.0; `decayDays=30, age=30d` → 0.5; `decayDays=30, age=60d` → 0.25 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Decay weight must be applied inside existing signal ranking math call-site; historical coverage raw count fields in persisted state must remain unchanged | Code review: ranking call-site references `timeDecayWeight`; assertion that raw count fields are untouched before/after a decay-enabled run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `decayDays=0` (default) produces identical signal rankings to pre-patch behavior — confirmed by regression test comparing ranking output before and after the patch with the default config.
- **SC-002**: With `decayDays=30` and a node aged 30 days, its actionability rank contribution is halved relative to a same-day node of equivalent coverage — confirmed by unit test on the ranking math.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A very short decay window (< 5 days) prevents convergence signal from accumulating across iterations | Med | Enforce a minimum `decayDays` floor (e.g. 5) in config validation; reject configs below it at startup |
| Evidence | `external/kasper/src/state.ts:74,82`; `config.ts:227` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

> **Provenance:** research.md §5.1, (iter 12)

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
