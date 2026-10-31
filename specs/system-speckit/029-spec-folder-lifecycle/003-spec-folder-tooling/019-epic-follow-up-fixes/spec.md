---
title: "Feature Specification: Phase 19: epic-follow-up-fixes"
description: "Close the follow-ups the spec-folder tooling epic left: the env reference duplicate that stops /doctor:env, three compat workflow gaps, Gate 3 parity coverage, tests writing into specs/, a stale sk-code manifest and small README errors."
trigger_phrases:
  - "epic follow up fixes"
  - "doctor env duplicate variable"
  - "compat resume dirty check"
  - "cli tests write into specs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: epic-follow-up-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 20 |
| **Predecessor** | 018-epic-docs-alignment |
| **Successor** | 020-deep-review-remediation |
| **Handoff Criteria** | Every acceptance row Met, and `validate.sh --strict` passes on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the spec-folder tooling packet. It closes the follow-ups phases 17 and 18 recorded.

**Scope Boundary**: Items U01 to U11 in `scratch/follow-ups.md`. The two items listed there as not actionable stay out.

**Dependencies**:
- Phases 17 and 18 are committed on this branch (017 `c098e12f7a`, 018 `f3f8583579`). Whether they are on `main` was not re-checked at closeout.

**Deliverables**:
- Every item fixed, or recorded as not real with the evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
- Status at closeout: not refreshed. The 034 parent had no `changelog/` folder when this phase closed, and the writer would have created one outside this packet's edit list. The operator later asked for one, and it now holds the generated entries for 010, 017, 018 and 019 at `specs/system-speckit/034-spec-folder-tooling/changelog/`. See implementation-summary.md, Known Limitations item 2.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The epic's builds and reviews left eleven loose ends. The most visible is that `/doctor:env` refuses to parse `ENV-REFERENCE.md` because one variable is listed twice with conflicting metadata. The compat workflow does not say how a resume treats its own owed step, and may misread two failure cases. The Gate 3 parity test misses three copies, the CLI suite writes temporary folders into the real `specs/` root, sk-code's leaf manifest is stale and a few READMEs carry wrong references.

### Purpose
Each loose end is closed with evidence, so the epic leaves nothing behind it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- U01 to U04: documentation fixes.
- U05 to U07: the compat workflow contract, its tests and the DOC-381 scenario.
- U08 to U10: Gate 3 parity coverage, CLI test isolation and the sk-code leaf manifest.
- U11: commit the 018 push receipt.

### Out of Scope
- The deleted temporary folders, which cannot be recovered.
- The ruleset bypass of the commit-template check on `main`, which is repository configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Files named in U01 to U11 in `scratch/follow-ups.md` | Modify | One fix per item |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/doctor:env`'s parse rules accept `ENV-REFERENCE.md`: no conflicting duplicate, no malformed row |
| REQ-002 | No CLI test writes under the real `specs/` root during a run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The compat workflow states how a resume treats an owed step, and each confirmed failure-handling gap is fixed with a contract assertion |
| REQ-004 | The Gate 3 parity test covers the three aligned copies and fails when one drifts |
| REQ-005 | sk-code's leaf manifest passes its generator's `--check` |
| REQ-006 | U02 to U04 and U11 are fixed, and the CLI suite shows no failure beyond 1,776 passed |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All eleven items closed with evidence.
- **SC-002**: CI on main is green after the push. Met. Every check on `079e9c34d2` succeeded (14 of 14). The CI bot commit `4669db6522` had 11 checks succeed, and its Trigger Index Rebuild was skipped by its job guard, because the commit message ends with the trailer that guard matches. The receipt is `scratch/evidence/post-push-ci.txt`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Moving a fixture out of `specs/` changes what a test proves | Med | Each changed test keeps its assertions, and the full suite reruns |
| Risk | A compat YAML change alters agent behavior | Med | Only the three named gaps change, each with a contract assertion |
| Dependency | Phases 17 and 18 on main | Low | Shipped and green |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No change to the CLI suite's run time beyond noise.

### Security
- **NFR-S01**: No secret appears in any changed file.

### Reliability
- **NFR-R01**: A CLI suite run leaves the real `specs/` tree unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An inferred item (U06, U07) proves not real on reading: recorded with the quoted lines, nothing changed.

### Error Scenarios
- The leaf manifest regenerates more than the manifest: kept only when the generator wrote it.

### State Transitions
- A resume after a partial move with uncommitted changes outside the moved paths: the owed step still runs, by the U05 decision.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 20 files across docs, a workflow, tests and one generated file |
| Risk | 8/25 | Workflow contract and test fixture changes |
| Research | 4/20 | Two inferred items to confirm |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator asked on 2026-10-09 for every follow-up to be handled, and the U05 reading is the safe default recorded in `scratch/follow-ups.md`.
<!-- /ANCHOR:questions -->

---


