---
title: "Feature Specification: Phase 6: goal-conformance-check"
description: "This phase defines a read-only goal conformance check and fixtures for binding coverage, placeholders, criterion count and parent budget."
trigger_phrases:
  - "goal conformance check"
  - "phase binding row coverage"
  - "goal template placeholder check"
  - "goal completion criteria count"
  - "goal corpus report"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: goal-conformance-check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 005-budget-and-chat-slice-handoff |
| **Successor** | 007-hub-routing-integration |
| **Handoff Criteria** | The check catches each claimed defect. Each negative fixture fails for its named reason and the positive fixture passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Own the goal conformance check and fixtures, plus a read-only live-corpus count report. Do not edit existing goal files or the system-spec-kit validator.

**Dependencies**:
- Phase 001 must record whether this phase ships a mode-local checker or prepares a system-spec-kit amendment note (specs/sk-doc/060-create-goal-mode/spec.md:157).
- Phase 005 must satisfy the incoming cut-fixture and chat-slice handoff before this phase starts (specs/sk-doc/060-create-goal-mode/spec.md:146).

**Deliverables**:
- Four goal checks with one named negative control per check and one positive fixture.
- A read-only live-corpus report with scanned-goal and per-check counts.
- A strict validation run and a handoff record for phase 007.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The current validator measures the durable-slice budget and checks that listed binding rows resolve, but it returns when the binding anchor is absent and does not compare rows with phase children on disk (.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080). The goal template calls for three to seven completion criteria, and the audit found a phase-007 child without a binding row, a child objective that still contains the template placeholder and a criterion that requires opening another file (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:99-105; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:39-45).

### Purpose
Give sk-create-goal a conformance check that exposes each named gap and reports live-corpus counts without changing goal files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Add the planned checker at .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs if phase 001 selects the mode-local route; the repo-rule checker provides the standalone CHECKS and per-check result pattern (.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:435-465).
- Check that every direct phase child on disk has a matching row inside the parent goal's BINDING table, with row-level matching so a mention elsewhere cannot satisfy coverage (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:66; specs/sk-doc/z_archive/040-create-repo-rules/009-hub-routing-guardrails/implementation-summary.md:85-88,104).
- Reject template placeholders in the objective, decision cells and completion criteria, and reject a completion-criteria count below three or above seven (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,57,99-105; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:39-45).
- Measure the parent durable slice by calling extractDurableSlice and resolveGoalBudget from goal-slice.cjs (.skilled/hooks/goal/lib/goal-slice.cjs:59-63,277-285,431-446).
- Keep one positive fixture and six named negative controls under .skilled/skills/sk-doc/sk-create-goal/scripts/tests/fixtures/. Run a read-only scan over active specs goals and report counts without repairing files.

### Out of Scope
- Changing system-spec-kit, its goal template or validator. The parent packet leaves those contracts unchanged and routes possible gaps as amendments (specs/sk-doc/060-create-goal-mode/spec.md:94-99).
- Rewriting existing goal documents or correcting live-corpus findings (specs/sk-doc/060-create-goal-mode/spec.md:97).
- Changing goal runtime state, command routing or the authoring mode outside its conformance-check deliverable (specs/sk-doc/060-create-goal-mode/spec.md:90-98).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs | Create, if phase 001 selects the local route | Read-only checks for binding coverage, placeholders, criterion count and parent budget |
| .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs | Create | Exercise one valid fixture and six named negative controls |
| .skilled/skills/sk-doc/sk-create-goal/scripts/tests/fixtures/goal-fixtures.cjs | Create | Hold the positive packet and six isolated defect cases |
| specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/plan.md | Modify only for the phase 001 branch | Record the selected local-check or amendment-note route |
| specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/tasks.md | Modify at execution | Mark completed tasks with their observed command evidence |
| specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/acceptance-criteria.md | Modify at execution | Record evidence and status for each closure criterion |
| specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/goal.md | Modify at closeout | Add progress evidence without changing the phase objective or criteria |
| specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md | Modify at closeout | Reconcile the phase status with the completed evidence |
| specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/implementation-summary.md | Modify at closeout | Record the selected route, observed fixture results and live-corpus counts |
| .skilled/skills/sk-doc/sk-create-goal/SKILL.md and .skilled/skills/sk-doc/sk-create-goal/references/README.md | Modify | Tell the author to run `scripts/check-goal.cjs` before handing off a goal, and list the checker in the index. Operator-approved amendment, 2026-09-26. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Compare every direct phase child directory containing spec.md with rows in the parent goal's BINDING table. A phase identifier mentioned outside that table must not count as a binding row (.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080; specs/sk-doc/z_archive/040-create-repo-rules/009-hub-routing-guardrails/implementation-summary.md:85-88,104). |
| REQ-002 | Reject the goal template's unfilled objective, decision and completion-criterion placeholders in their named sections (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,57,103-105; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:39-45). |
| REQ-003 | Require three through seven completion-criteria bullets, inclusive (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:99-105). |
| REQ-004 | Measure a parent goal's durable slice and configured limit through goal-slice.cjs exports. Do not add a second slice extractor or apply the parent budget to phase-child goals (.skilled/hooks/goal/lib/goal-slice.cjs:59-63,277-285,297-299,380-382,431-446). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Run the selected check over active specs goals without modifying them and report scanned-goal, phase-parent and per-check finding counts. |
| REQ-006 | Follow phase 001's ownership decision. If it selects a validator amendment, record the requested amendment in this phase's existing planning or closeout document and retain the fixture cases; do not edit the system-spec-kit validator (specs/sk-doc/060-create-goal-mode/spec.md:94-99,157). |
| REQ-007 | `SKILL.md` tells the author to run `scripts/check-goal.cjs <packet>` before handing off a goal, and `references/README.md` lists the checker, so the check is part of the workflow. |

> Acceptance criteria for these requirements live in acceptance-criteria.md,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: The positive fixture passes and each of the six negative controls fails with its named reason, including the row-removal control that leaves the phase name elsewhere in the document.
- **SC-002**: The read-only corpus run reports scanned-goal and per-check counts, and leaves corpus goal files unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 ownership decision and phase 005 incoming handoff (specs/sk-doc/060-create-goal-mode/spec.md:146,157) | Without both, implementation route or input evidence is unsettled | Keep the phase blocked at Setup until both decisions and evidence are recorded |
| Risk | A whole-document search can mask a missing binding row, as phase 009's first checker did (specs/sk-doc/z_archive/040-create-repo-rules/009-hub-routing-guardrails/implementation-summary.md:85-88,104) | The checker reports a false pass | Parse rows inside the binding table and keep a row-removal negative control |
| Risk | A new budget parser can drift from the validator's slice boundary | The checker and validator disagree on the measured size | Use goal-slice.cjs exports for slice and manifest budget (.skilled/hooks/goal/lib/goal-slice.cjs:59-63,277-285) |
| Risk | Existing corpus goals contain known defects | A live scan can report failures even when the checker works | Report counts and defect classes; never repair corpus files in this phase (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:39-45) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
### Performance
- **NFR-P01**: The live scan prints goals_scanned, phase_parents_scanned and a count for each of the four checks. No runtime target is set.
- **NFR-P02**: The checker reads the active goal corpus once per run and does not write goal files.

### Security
- **NFR-S01**: Resolve scan inputs beneath the workspace's specs directory.
- **NFR-S02**: The check has no network access and does not alter files.

### Reliability
- **NFR-R01**: An absent binding anchor is reported as missing coverage for phase children, not treated as an empty successful table.
- **NFR-R02**: A file-level read or parse error appears in the report and makes the run fail rather than disappear from the counts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
### Data Boundaries
- Empty corpus: Report goals_scanned=0 and a no-input result.
- Maximum length: Use goal-slice.cjs to measure the parent durable slice against the manifest limit (.skilled/hooks/goal/lib/goal-slice.cjs:277-285).
- Invalid format: Report a missing or malformed binding anchor as a conformance finding.

### Error Scenarios
- External service failure: Not applicable; the checker reads local files only.
- Network timeout: Not applicable; the checker makes no network requests.
- Concurrent access: If a goal changes during the scan, report the observed result and rerun on a stable tree.

### State Transitions
- Partial completion: Keep all fixture cases and report every check that ran before an error.
- Session expiry: Not applicable; the checker has no session state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One read-only checker, a seven-case fixture set and a corpus report |
| Risk | 8/25 | Main risk is a false pass if matching ignores table-row boundaries |
| Research | 6/20 | Source and corpus cases are identified in the two phase-001 audits |
| **Total** | **24/70** | **Level 2; planning estimate** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS
- Which route did phase 001 select: the mode-local checker or a system-spec-kit validator amendment? The parent spec assigns that decision to phase 001 (specs/sk-doc/060-create-goal-mode/spec.md:157).
- Has phase 005 delivered the cut fixture within budget with its criterion count unchanged and chat slice printed? That evidence is the incoming handoff (specs/sk-doc/060-create-goal-mode/spec.md:146).
<!-- /ANCHOR:questions -->

---

