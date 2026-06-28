---
title: "Convergence Observation-Threshold Actionability Guard"
description: "Add a configurable min_observations guard to convergence.cjs that blocks STOP decisions and promotion triggers until a finding has been confirmed N times, preventing premature convergence on noise."
trigger_phrases:
  - "observation threshold guard"
  - "convergence min observations"
  - "single-observation premature stop"
  - "convergence actionability boundary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/012-observation-threshold-guard"
    last_updated_at: "2026-06-28T14:02:01Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-observation-threshold-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Convergence Observation-Threshold Actionability Guard

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
| **Status** | Draft |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 18 |
| **Predecessor** | 011-convergence-score-delta |
| **Successor** | 013-coverage-graph-time-decay |
| **Handoff Criteria** | `min_observations` config wired in `convergence.cjs`; STOP blocked until threshold met; weak evidence recorded but not acted upon |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the deep-loop-runtime recs specification.

**Scope Boundary**: Changes confined to `convergence.cjs` (primary) and `coverage-graph-signals.ts` (signal read path); no changes to the Bayesian scoring engine, lock, or fanout modules.

**Dependencies**:
- Phase 011 score-delta work is independent but logically prior; this phase reads the same convergence output path.
- `min_observations` config value should be readable from the existing deep-loop config schema.

**Deliverables**:
- `min_observations` config field (default 2, range 1–10) wired into `convergence.cjs`.
- STOP decision and promotion triggers blocked until N confirmations of the same finding are accumulated.
- Weak evidence (below threshold) is still recorded in the convergence state but flagged as sub-threshold and not acted upon.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A single-observation finding can trigger a STOP decision or auto-promotion without any confirmation; this causes premature convergence on noise — a spurious finding from one iteration halts a run that would have produced substantially better results in subsequent iterations. There is no `min_observations` guard in the convergence path, so the actionability threshold is effectively 1 regardless of finding quality.

### Purpose
Prevent premature convergence on single-observation noise by blocking STOP decisions and promotion triggers until a configurable minimum number of confirming observations has been accumulated, while still recording weak evidence so it is not silently discarded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `min_observations` config field (integer, default 2, clamped to range 1–10) to the deep-loop config schema read by `convergence.cjs`.
- Before emitting a STOP decision or promotion trigger, check that the leading finding has been observed `>= min_observations` times; block the action if not yet met.
- Record sub-threshold findings in convergence state with a `subThreshold: true` flag so they are visible but not acted upon.
- Add `min_observations` field definition to `coverage-graph-signals.ts` signal read path.

### Out of Scope
- Per-finding observation tracking across the full ideas backlog lifecycle — deferred to §5.2 of research.md; requires a persistent finding identity store beyond the scope of this quick-win pass.
- Cross-mode guard parity (applying the same threshold to all deep-loop modes simultaneously) — cross-mode ADR needed first.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | Wire `min_observations` config; block STOP/promotion below threshold; flag sub-threshold findings |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/coverage-graph-signals.ts` | Modify | Add `min_observations` to signal read path so threshold is surfaced in graph signal output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `convergence.cjs` reads `min_observations` (default 2) and blocks STOP decisions and promotion triggers until the leading finding has `>= min_observations` confirmed observations | Unit test: config `min_observations: 3`, feed 2 confirming observations, assert STOP not emitted; feed 3rd observation, assert STOP emitted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Sub-threshold findings are recorded in convergence state with `subThreshold: true` and are not silently discarded | Convergence state file after a blocked-STOP run contains the finding entry with `subThreshold: true`; no finding is absent from the state |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `min_observations: 2` (default), a run that produces a unique finding on iteration 1 only does not STOP; the same finding confirmed on iteration 2 triggers STOP — verifiable by replaying the state file.
- **SC-002**: Setting `min_observations: 1` restores the previous single-observation-triggers-STOP behaviour (backward compat path), confirmed by unit test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Raising `min_observations` above 3 on short runs (few iterations) may prevent any convergence decision from being reached | Med | Document recommended range (1–3 for most runs); add a warning log when `min_observations > minIterations / 2` to surface the interplay |
| Evidence | `external/kasper/src/types.ts:48`; `config.ts:46`; `evaluate.ts:1675,1682`; `utils.ts:94,100` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iter 11)

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
