---
title: "Feature Specification: Phase 8: verification-and-closeout"
description: "Prove every claim from the final state, report the latency delta against the baseline, and close the packet or name what blocks it"
trigger_phrases:
  - "advisor decommission verification"
  - "advisor closeout"
  - "advisor cold boot proof"
  - "advisor latency delta"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 8: verification-and-closeout

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

This phase writes no feature code. It re-observes every claim from the final state: cold boots per runtime, the routing brief still arriving, the nine capabilities answering through the CLI, the latency delta against the phase 002 baseline, the suites, and the recursive strict validation. Anything that does not hold is reported as a blocker.

**Key Decisions**: Every claim re-observed from the final state; a green exit code with no output read is not evidence

**Critical Dependencies**: Phases 001 through 007, all complete

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-docs-and-residue-sweep |
| **Successor** | None |
| **Handoff Criteria** | Every parent completion criterion holds with evidence recorded against it, or the gap is named with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the skill advisor MCP decommission specification.

**Scope Boundary**: Verification and closeout only. No feature work, no fixes beyond what a failing check forces.

**Dependencies**:
- Every earlier phase complete, since this one proves their claims from the final state.
- Phase 002 for the baseline and the latency budget the delta is reported against.

**Deliverables**:
- Cold-boot evidence per runtime, showing no advisor MCP server and the routing brief arriving.
- The nine capabilities answering through the CLI from the final state.
- The prompt-hook latency delta per runtime against the phase 002 baseline.
- Suite and gate output, read rather than assumed.
- Recursive strict validation printing RESULT: PASSED.
- The parent goal DONE WHEN table with evidence in every row.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each earlier phase proves its own claim at the moment it makes it, on a tree that later phases keep changing. A claim proven in phase 003 and quoted in phase 008 is a claim about a tree that no longer exists. The removal also has a specific failure mode worth checking deliberately: the prompt brief could stop arriving in one runtime and nothing would fail loudly, because the advisor path is designed to degrade silently rather than block the caller.

### Purpose
Close the packet on evidence taken from the final state, or report exactly which claim does not hold and why.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cold-boot verification in every runtime the advisor serves.
- Proof that the prompt-time routing brief still arrives with no operator action.
- A live call to each of the nine capabilities through the CLI.
- The latency delta against the phase 002 baseline, per runtime.
- The advisor test suite and the repository gates.
- Recursive strict validation of the packet and reconciliation of the goal tables.

### Out of Scope
- Fixing anything beyond what a failing check forces. A defect found here is a finding, and a fix is a scoped decision.
- Re-running earlier phases' work. This phase observes; it does not redo.
- Any claim carried forward without re-observation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `008-verification-and-closeout/evidence/` | Create | Cold-boot transcripts, latency runs, suite output |
| `../goal.md` | Modify | DONE WHEN rows filled with evidence |
| `008-verification-and-closeout/implementation-summary.md` | Modify | Final state and the evidence that closes it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Recursive strict validate over the parent prints RESULT: PASSED and exits 0 |
| REQ-002 | Every runtime cold-boots with no advisor MCP server and the routing brief still arrives |
| REQ-003 | All nine capabilities answer through the CLI from the final state |
| REQ-004 | The prompt-hook latency delta against the phase 002 baseline is reported per runtime |
| REQ-005 | The advisor test suite and the repository gates run from the final state with their output read |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every phase reports its acceptance criteria closeable |
| REQ-007 | The parent goal DONE WHEN table carries evidence in every row |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every parent completion criterion has a recorded piece of evidence, or a named blocker.
- **SC-002**: The latency delta is reported as numbers whether or not it sits inside budget.
- **SC-003**: No claim in the closeout is quoted from an earlier phase rather than re-observed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A silent regression in the prompt brief | High | Check the brief per runtime explicitly; the advisor path degrades quietly by design |
| Risk | A validation run that exits 0 without validating | High | Require a printed RESULT: PASSED, and invoke through realpath so a symlinked tree cannot no-op |
| Risk | Evidence from a worktree rather than the release environment | Medium | Take the closing evidence in the checkout the work ships from |
| Dependency | Phase 002 baseline | The delta has no meaning without it | Do not report a delta against an unrecorded baseline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The reported prompt-hook latency delta is measured on the same harness as the phase 002 baseline.

### Reliability
- **NFR-R01**: Every proof is taken from the final state, in the environment the work ships to.

---

## 8. EDGE CASES

### Evidence boundaries
- A check that passes in a worktree but not in the main checkout: the main checkout is the release environment, and its result is the one that counts.
- A green exit code with no output: treated as a failed check until the output is read.

---

## 9. COMPLEXITY ASSESSMENT

Gate phase. No new code. The complexity is refusing to close on evidence that was carried forward rather than re-observed.

---

## 12. OPEN QUESTIONS

- None open at authoring time beyond those the parent spec records; anything found during planning is raised there.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Goal**: See `goal.md` for the durable directive this phase executes against
- **Parent Goal**: See `../goal.md` for the packet directive that outranks it
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
