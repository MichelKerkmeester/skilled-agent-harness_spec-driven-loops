---
title: "Feature Specification: Phase 16: iteration-state-record-contract"
description: "Make `iteration` the canonical iteration-number field on deep-loop iteration records, so a record that follows the contract passes the fan-out validator and renders correctly in every reducer."
trigger_phrases:
  - "iteration state record contract"
  - "run versus iteration field"
  - "iteration record field name"
  - "state jsonl iteration field"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: iteration-state-record-contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-review-confirmed-findings |
| **Successor** | None |
| **Handoff Criteria** | Both reducer suites pass with a regression test for an `iteration`-only record, and the state documents name `iteration` as required |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the deep-loop alignment review.

**Scope Boundary**: The iteration-number field on iteration records only. Event records (blocked stops, pauses, recovery, ideas, pivots) keep their own `run` field and are not touched.

**Dependencies**:
- The operator's decision, taken 2026-09-16, that `iteration` is the canonical field.

**Deliverables**:
- The review reducer's dashboard row reads the iteration number through its existing helper.
- The one command template that wrote `run` alone also writes `iteration`, with its compiled contract regenerated.
- Both state documents, and the two reference examples, name `iteration` as required and `run` as a legacy alias.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep-loop iteration records name their iteration number two ways. The fan-out runner's forced-depth validator accepts only `iteration`, while the deep-research state document told writers to use `run`. A research lane that followed the document exactly was rejected for "no integer iteration" after completing all of its work. Fixing the document alone would expose a second fault: the review reducer's dashboard row reads `run` directly, so a record carrying only `iteration` renders the word `undefined`.

### Purpose
A record that follows the documented contract passes validation and renders its number everywhere a reducer shows it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The review reducer's dashboard progress row.
- The error-path iteration record in `deep-research-auto.yaml`, and the compiled contract that records that file's hash.
- The iteration-record sections of the deep-research and deep-review state documents, and the iteration-record examples in the reducer registry and convergence reference.
- One regression test for an `iteration`-only record.

### Out of Scope
- Event records' `run` field - it names the iteration an event occurred in, and the decision concerned iteration records.
- The research reducer's `run` value on suppressed candidates - it is copied into an object nothing reads, so an `iteration`-only record breaks nothing there.
- The preference order inside `readIterationNumber()`, which prefers `run` - it only matters when a record carries both keys with different values, which no writer produces.
- The stale committed trigger index - regenerating it now adds 589 paths unrelated to this change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Dashboard progress row reads the number through `getIterationRun()` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | Regression test for an `iteration`-only record |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Modify | Error-path iteration record writes `iteration` as well as `run` |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Regenerate | Records the template's new hash |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md` | Modify | `iteration` required, `run` legacy |
| `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md` | Modify | `iteration` required, `run` legacy |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-reducer-registry.md` | Modify | Reconstructed-record example uses `iteration` |
| `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence-reference-only.md` | Modify | Reference-shape example uses `iteration` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | An iteration record carrying only `iteration` renders its number in the review dashboard progress table |
| REQ-002 | Every template that writes an iteration record writes `iteration` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The state documents name `iteration` as the required field and `run` as a legacy alias, and leave event records' `run` unchanged |
| REQ-004 | Nothing that already passed stops passing |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new regression test fails before the reducer change and passes after it.
- **SC-002**: The full deep-loop runtime suite shows no failure attributable to this change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reader still expects `run` on an iteration record | Medium | Writers keep `run` alongside `iteration` where they already wrote it, and every reader was checked |
| Risk | The template change leaves the compiled contract stale | Medium | The contract was regenerated and re-checked byte for byte against the compiler's output |
| Dependency | Another session works in this parent packet | Low | No fan-out run was active in this checkout, and none of the changed files had uncommitted edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable change; the dashboard row calls an existing constant-time helper.

### Security
- **NFR-S01**: No new input surface; the change reads a field the reducer already parses.

### Reliability
- **NFR-R01**: A record carrying only the legacy `run` still renders, because the helper falls back to it.

---

## L2: EDGE CASES

### Data Boundaries
- Record with only `iteration`: renders the number (the fixed case).
- Record with only `run`: renders the number through the helper's fallback.
- Record with neither: renders `null` instead of `undefined`; such a record is already malformed.

### Error Scenarios
- An iteration errors in a max-iterations run: its error record now carries `iteration`, so the validator counts it instead of reporting a gap.

### State Transitions
- Existing state logs written with `run` only: still read correctly by every reducer path that uses the helpers.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | One code line, one template token, four documents, one test |
| Risk | 8/25 | Shared runtime contract read by every deep-loop lane |
| Research | 10/20 | Required mapping every writer and reader of the field |
| **Total** | **24/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
