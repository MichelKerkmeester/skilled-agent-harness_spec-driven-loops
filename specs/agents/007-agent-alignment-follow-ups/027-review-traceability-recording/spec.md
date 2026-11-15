---
title: "Feature Specification: Phase 27: review-traceability-recording"
description: "Review iterations rarely record traceability results the coverage gate can read: the prompt's own example shows an empty object, and many results use `protocol` instead of `protocolId`. This phase fixes the example and makes the reducer accept the shapes iterations already write."
trigger_phrases:
  - "review traceability recording"
  - "phase 27 review traceability recording"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 27: review-traceability-recording

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 29 |
| **Predecessor** | 026-closeout-run-identity |
| **Successor** | 028-review-scope-recording |
| **Handoff Criteria** | The prompt shows the result shape, the reducer folds `protocol` results into `protocolId`, a recorded run's coverage count is compared before and after, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the agent alignment follow-ups. It closes one follow-up phase 25 recorded.

**Scope Boundary**: The iteration prompt pack, the reducer's traceability rollup and the state schema doc. The coverage rule itself does not change.

**Dependencies**:
- Phase 24's terminal gates, whose coverage gate reads the rollup

**Deliverables**:
- A prompt example that shows `results[]` keyed by `protocolId`
- A reducer rollup that accepts the observed variants
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The coverage gate passes only when each core protocol (`spec_code`, `checklist_evidence`) has a completed result in the registry's traceability rollup, which reads only `traceabilityChecks.results[]` keyed by `protocolId`. The prompt pack every iteration renders shows `"traceabilityChecks":{}`, so iterations invent their own shape. A census of 2,247 recorded review iterations found 789 with no `traceabilityChecks`, 837 with no `results` array, and 437 results keyed `protocol`. Recent runs mostly record a map of protocol to status, flat or nested under `core` and `overlay`, which the rollup ignores: none of the 12 most recent reviews with three or more iterations passes coverage.

### Purpose
A review that runs its core protocols records them in a shape the coverage gate reads.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '"traceabilityChecks":{}' .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl
1
(census of specs/**/review state logs, 2026-11-15: 2,247 iterations, 789 without traceabilityChecks, 837 without results, 437 results keyed protocol)
(re-reduce of the 12 most recent reviews: coverage passes in 0)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the empty example in `prompt-pack-iteration.md.tmpl` with a `results[]` example keyed by `protocolId`, and tell the iteration to record each core protocol it ran, and to record a core protocol that does not apply to the target as `notApplicable` with `applicable: false`.
- Make the reducer read the recorded shapes (a `results[]` array keyed `protocol` or `protocolId`, a protocol-to-status map, and that map under `core` and `overlay`), take a missing gate class from the contract, fold the status spellings into `notApplicable`, and keep a later `pending` or `deferred` result from replacing an executed one.
- Re-reduce copies of about ten recorded packets and report the coverage gate before and after.

### Out of Scope
- Loosening the coverage rule: a `hard` protocol at `partial` or `fail` still fails coverage.
- The agent definitions; the prompt pack is the contract each iteration receives, CLI lineages included.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | Result example and instruction |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Accept `protocol` and the status spellings |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/traceability-rollup.vitest.ts` | Create | Each shape, status parsing and one case through the coverage gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A core protocol result recorded in any observed shape counts toward coverage. | Tests cover each shape, and a run recording the `core` map with both core protocols passing clears `traceability-incomplete` in `terminal-gates.cjs` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The prompt shows the result shape and asks for each core protocol. | The rendered prompt holds a `protocolId` example and no `"traceabilityChecks":{}` |
| REQ-003 | The status spellings fold to one value. | `n/a`, `not-applicable` and `notApplicable` count in `summary.notApplicable` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new tests.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Recorded runs still FAIL on partial hard protocols | Medium | That is the rule working; the before and after count reports it |
| Dependency | The compiled review contract embeds the prompt pack path | Low | Recompile and run the drift check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


