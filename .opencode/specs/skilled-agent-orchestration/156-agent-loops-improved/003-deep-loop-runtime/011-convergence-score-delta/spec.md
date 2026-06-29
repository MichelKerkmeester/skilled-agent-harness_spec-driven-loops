---
title: "Convergence Score-Delta and Improvement-Effect Signal"
description: "Compute and surface scoreDelta (current minus prior snapshot score) in convergence.cjs so operators can detect loops that generate novel findings without actually improving."
trigger_phrases:
  - "convergence score delta"
  - "improvement effect signal"
  - "loop score improvement"
  - "convergence prior snapshot delta"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/003-deep-loop-runtime/011-convergence-score-delta"
    last_updated_at: "2026-06-28T14:02:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-convergence-score-delta"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Convergence Score-Delta and Improvement-Effect Signal

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
| **Phase** | 11 of 18 |
| **Predecessor** | 010-fixed-rate-overrun-accounting |
| **Successor** | 012-observation-threshold-guard |
| **Handoff Criteria** | `scoreDelta` computed and included in convergence output; null-guarded on first iteration; opt-in `improvementEffect` trace gate wired |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the deep-loop-runtime recs specification.

**Scope Boundary**: Changes confined to `convergence.cjs`; snapshot data structure is read-only from existing `createSnapshot()` output; no changes to the Bayesian scoring engine or upstream state files.

**Dependencies**:
- `createSnapshot()` must already return a numeric `score` field on the snapshot object; assumes existing snapshot schema is stable.

**Deliverables**:
- `scoreDelta = score - priorSnapshot.score` computed before `createSnapshot()` in `convergence.cjs` and included in convergence output.
- Null-guard: when `priorSnapshot` is absent (first iteration), `scoreDelta` is `null` and the output notes "no prior snapshot".
- Optional `improvementEffect` trace (helped/hurt summary) exposed behind an opt-in trace gate flag.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The convergence signal reports current novelty but carries no signal for whether the loop is actually improving across iterations; a run can generate novel findings while scores plateau at the same value each iteration. There is no mechanism to detect "looping without improving" — the operator cannot distinguish a productive run from one that is cycling without gain.

### Purpose
Surface `scoreDelta` in convergence output so operators and automated stop-conditions can detect score plateaus and distinguish improving runs from ones that cycle without measurable gain.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `priorSnapshot.score` before calling `createSnapshot()` in `convergence.cjs`.
- Compute `scoreDelta = score - priorSnapshot.score`; guard with null-check and emit `scoreDelta: null` on the first iteration.
- Include `scoreDelta` in the convergence output object and log line.
- Add opt-in `improvementEffect` trace gate: when enabled, emit a brief helped/hurt summary alongside `scoreDelta`.

### Out of Scope
- Causal per-target `outcome_score_delta` — deferred; requires target-level attribution tracking that is a deep-rewrite variant not feasible in a quick-win pass.
- Changes to the Bayesian scoring engine or snapshot storage format.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | Compute `scoreDelta` from prior snapshot before `createSnapshot()`; add opt-in `improvementEffect` trace gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `convergence.cjs` computes `scoreDelta = score - priorSnapshot.score` and includes it in convergence output on every iteration after the first | Unit test with two consecutive snapshots (scores 0.4 and 0.6) asserts `scoreDelta === 0.2` in the output object |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | First-iteration output emits `scoreDelta: null` without throwing; opt-in `improvementEffect` trace gate is present and off by default | Unit test with no prior snapshot asserts `scoreDelta === null`; integration test with trace gate disabled produces no `improvementEffect` field in output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After 5 iterations where score does not change, the convergence output for iterations 2–5 each shows `scoreDelta: 0`; a downstream stop-condition rule can read this field to halt a plateau run.
- **SC-002**: Iteration 1 convergence output contains `scoreDelta: null` and no runtime error, confirming the null-guard is effective.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `priorSnapshot` absent on the first iteration causes a runtime error if not null-guarded before computing delta | Med | Explicit null-check before subtraction; emit `scoreDelta: null` and log "no prior snapshot" on first iteration |
| Evidence | `external/kasper/src/evaluate.ts:308,345`; `state.ts:378,381`; `handlers.ts:283-292` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iters 9, 22)

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
