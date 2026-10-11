---
title: "Feature Specification: Phase 6: runtime-libraries-and-tests"
description: "The deep-loop runtime still ships ledger schemas, reducers and sealed-artifact libraries for both lanes, and its gateway, authority order and census list both modes. This phase deletes the lane libraries and edits everything that names them."
trigger_phrases:
  - "runtime libraries and tests"
  - "phase 6 runtime libraries and tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: runtime-libraries-and-tests

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | worktree branch from sk-git's allocator |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 10 |
| **Predecessor** | 005-skill-packet-and-registry |
| **Successor** | 007-advisor-and-cross-skill-wiring |
| **Handoff Criteria** | The runtime vitest suite passes with no new failure against baseline. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 005

**Deliverables**:
- Delete the `agent-improvement-*`, `model-benchmark-*` and `deep-improvement-common-*` libraries and their lane tests
- Edit the gateway, authority order, census, adjudication, legacy projections, `dark-ledger-adapter.ts` and the runtime validators
- Edit the remaining tests, runtime docs, catalog and playbook pages
- Drop every improvement-host row, including the stale `skill-benchmark` rows, from both plugin guard tests

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nine runtime libraries exist only for the improvement lanes, and the append gateway, `AUTHORITY_FLIP_MODE_ORDER`, the write-set census, blinded adjudication and legacy projections all list the two modes. Both OpenCode plugin guard tests also accept a `skill-benchmark` mode the registry has not listed since that lane was retired.

### Purpose
The runtime knows research, review and council only, and its full test suite passes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the `agent-improvement-*`, `model-benchmark-*` and `deep-improvement-common-*` libraries and their lane tests
- Edit the gateway, authority order, census, adjudication, legacy projections, `dark-ledger-adapter.ts` and the runtime validators
- Edit the remaining tests, runtime docs, catalog and playbook pages
- Drop every improvement-host row, including the stale `skill-benchmark` rows, from both plugin guard tests

### Out of Scope
- Advisor - phase 007

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (84 files) | Delete/Modify | The exact file list this phase owns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The nine lane libraries are gone. Verified by: `ls runtime/lib` shows none of them |
| REQ-002 | The runtime suite passes. Verified by: `npm test` in `runtime/` exits 0 against the captured baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Plugin guard tests pass with three modes. Verified by: both `.opencode/plugins/tests/*guard*.test.cjs` exit 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime vitest suite passes with no new failure against baseline.
- **SC-002**: The runtime validators report no drift.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 005 | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | A shared helper in a common library is used by a surviving mode | H | DeepSeek checks importers before deleting; the suite run catches a missed import |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek work unit carries one change set, short enough to finish in one dispatch.

### Security
- **NFR-S01**: Every dispatch names banned operations and allowed write paths and runs in the worktree.

### Reliability
- **NFR-R01**: Each work unit has a tree snapshot to roll back to.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Generated files are never hand-edited; phase 010 regenerates them.

### Error Scenarios
- A work unit writes outside its list: restore the snapshot and re-dispatch with the brief corrected.
- DevPass hits its limit: fall back to Cline at `xhigh`, then wait for the reset.

### State Transitions
- Partial phase: `tasks.md` marks each finished work unit with its snapshot hash.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Shared contracts; reversible by snapshot |
| Research | 3/20 | Done in phase 001 |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Decisions are in `../002-removal-plan/decision-record.md`.
<!-- /ANCHOR:questions -->

---
