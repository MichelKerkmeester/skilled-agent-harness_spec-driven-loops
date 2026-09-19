---
title: "Feature Specification: Phase 10: review-remediation"
description: "Close all six deep-review findings on the sk-communication clarity program: confirm the three already-fixed items and add the three still-open code items."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-adjacent-surface-rules |
| **Successor** | None |
| **Handoff Criteria** | Every finding carries a verdict and an owner, read from the tasks file and the review report side by side |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Remediate the deep review findings on the communication clarity program specification.

**Scope Boundary**: The six findings from `review/program-review/lineages/sonnet5-xhigh/review-report.md`, both the two P1 findings and the four P2 findings. Three findings are already fixed at the source and this phase confirms that from the file. Three findings need one small code change each: a direct test file, a comment, and a doc comment.

**Dependencies**:
- Phase 9's completion, since the review scoped the whole program including phase 9.
- The review report and the implementation summary's Deep Review section, which record the conductor's adjudication against each finding.

**Deliverables**:
- Confirmed evidence that F003 (goal row), F004 (stale acceptance frontmatter), and F006 (playbook scenario) are fixed.
- A new `test/fidelity/semantics.test.ts` covering `compareClaimCoverage` directly, closing the review's coverage gap even though the specific claim it made about missing tests was refuted.
- A durable comment in `validator.ts` at the no-op guard, explaining why the checks array is shorter on that path.
- A doc comment on `AcceptedProjection` in `projection.ts`, naming the outcome type it is filled from.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A five-iteration deep review of the whole sk-communication clarity program returned a CONDITIONAL verdict with two P1 findings and four P2 findings. Three findings point at real gaps against the packet's own stated bar. Two findings are informational and were left unaddressed on the surface even after the conductor recorded a verdict. One finding claimed a coverage gap that a later read of the test suite refuted, but the review's placement argument for a direct unit test still holds.

### Purpose
Every one of the six findings carries a verdict and either confirmed evidence of a fix or a landed code change, so the review's CONDITIONAL verdict can close.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirming F003, F004, and F006 are fixed, by reading the exact files the review cited.
- Adding `test/fidelity/semantics.test.ts` with three cases against `compareClaimCoverage` (F005).
- Adding a durable comment in `validator.ts` at the no-op guard (F001).
- Adding a doc comment on `AcceptedProjection` in `projection.ts` (F002).

### Out of Scope
- Wiring a producer for `AcceptedProjection` - no orchestrator layer constructs it today, and that remains a separate, unrequested change.
- Restoring the five `passed()` markers on the no-op path - the accepted fidelity outcome's shape does not change, only the explanation next to the guard.
- Any change to `test/config/copy-editing-instruction.test.ts` - those existing tests stay as they are.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/cli-communication-projection/test/fidelity/semantics.test.ts` | Create | Direct unit tests for `compareClaimCoverage` |
| `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts` | Modify | One comment at the no-op guard, no behavior change |
| `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/projection.ts` | Modify | One doc comment on `AcceptedProjection`, no field change |
| `../goal.md` | Confirm only | F003 row already ticked |
| `../006-reply-shape-rules/acceptance-criteria.md` | Confirm only | F004 frontmatter already Complete/100 |
| `../008-decision-and-handoff-rules/acceptance-criteria.md` | Confirm only | F004 frontmatter already Complete/100 |
| `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` | Confirm only | F006 scenario COMM-010 already present |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The `goal.md` completion row for F003 reads ticked, and the same file's LOG table agrees with it |
| REQ-004 | `test/fidelity/semantics.test.ts` exists and calls `compareClaimCoverage` directly for a dropped claim, a reworded claim, and an unrelated sentence drop |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Every closed child under this packet reads `Status: Complete` and `completion_pct: 100` with no stale blockers in its acceptance-criteria frontmatter |
| REQ-003 | `manual-testing-playbook.md` carries scenario COMM-010 with a feature file, and both hub leaf manifests pass the freshness gate |
| REQ-005 | `validator.ts` carries a comment at the no-op guard explaining why the checks array is shorter there, with the accepted fidelity outcome unchanged |
| REQ-006 | `AcceptedProjection`'s doc comment in `projection.ts` names `AcceptedFidelityOutcome` as the type a producer would fill it from |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six findings from the review report carry a verdict in this phase's tasks, each traced to a file and line.
- **SC-002**: The package gate (`npm run check` in `cli-communication-projection`) passes with the new test file added, from the final state.
- **SC-003**: No bracketed placeholder or ephemeral finding label lands in any comment. Comment hygiene stays a hard block.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The review report and the implementation summary's Deep Review section | Without both, a finding's verdict cannot be traced | Both are read in full before any requirement is marked Met |
| Risk | A new test asserts internal shape instead of the documented contract | A brittle test that breaks on unrelated refactors | The three cases assert only the public return of `compareClaimCoverage`: null or the `CLAIM_OMITTED` shape |
| Risk | The no-op guard comment drifts into restating history rather than present behavior | Violates the comment-hygiene hard block this program itself enforces | The comment states only why the current guard is shaped this way, no packet or finding id |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The new test file adds test time only, no runtime code path changes.
- **NFR-P02**: The two comments add no bytes to any emitted artifact. They are source-only.

### Security
- **NFR-S01**: Not applicable, no auth or credential surface in scope.
- **NFR-S02**: Nothing added here relaxes the comment-hygiene hard block or any verification standard.

### Reliability
- **NFR-R01**: The accepted fidelity outcome's fields and values are unchanged by this phase.
- **NFR-R02**: `AcceptedProjection`'s shape is unchanged. Only its doc comment gains a sentence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the reworded-claim test case keeps every source word present, so `compareClaimCoverage` returns null with zero omitted claims.
- Maximum length: not applicable, the new tests use short synthetic sentences.
- Invalid format: not applicable, no parser or schema change in scope.

### Error Scenarios
- External service failure: not applicable, no network call in scope.
- Network timeout: not applicable.
- Concurrent access: not applicable, the three code items touch no shared or process-wide state.

### State Transitions
- Partial completion: the three confirm items and the three code items are independent. Either group can close alone.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three confirm reads, one new test file, two one-line comments |
| Risk | 6/25 | No behavior change anywhere. The only risk is a badly worded comment |
| Research | 4/20 | The review report and the implementation summary already name every file and line |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- /ANCHOR:questions -->

---
