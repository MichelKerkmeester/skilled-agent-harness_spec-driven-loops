---
title: "Feature Specification: Phase 3: review-remediation"
description: "The deep review of the modes research packet returned CONDITIONAL with 2 P1 and 14 P2 findings. This phase applies the confirmed fixes to the research closure documents and to the sk-code-quality and sk-code-review folders."
trigger_phrases:
  - "review remediation"
  - "phase 3 review remediation"
  - "sk-code modes research review fixes"
  - "extension floors sk-code-review"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: review-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-review-mode-research |
| **Successor** | None |
| **Handoff Criteria** | Recursive strict validation of the parent prints `RESULT: PASSED`, and the sk-code-review canary and every sk-code-quality and sk-code-review test suite exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-code quality and review modes research packet. It applies the deep review recorded in `../review/review-report.md`.

**Scope Boundary**: the closure documents of phases 1 and 2, the parent `spec.md` and `goal.md`, and the content of `.skilled/skills/sk-code/sk-code-quality/` and `.skilled/skills/sk-code/sk-code-review/`. The hub routing files and `sk-code-ci/` are out of scope.

**Dependencies**:
- Phases 1 and 2 are closed.
- `../review/review-report.md` exists.

**Deliverables**:
- ADR-003 in both research phases, and the acceptance, task and goal rows re-closed against it and against ADR-002.
- The quality playbook root rebuilt from the sk-doc template, the review playbook census fixed, COMPONENT headers on four Python scripts, and an Extension Floors section pinned by the review canary.

**Changelog**:
- The parent packet keeps no `changelog/` folder, so this phase records its changes in `implementation-summary.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep review found that the goal files and acceptance rows of the research phases close against counts and a boundary they no longer state. AC-009 closed as Met against a scope that no ADR recorded. It also found skill-side defects: the quality playbook root fails the playbook validator, the review playbook states two scenario counts, four Python scripts lack the COMPONENT header, and the review mode has no single list of the floors an extension may not lower.

### Purpose

Every closure document in the packet agrees with ADR-002 and ADR-003, and the two modes pass the sk-doc and sk-code-skilled checks the review named.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Review findings S-P1-01, S-P1-02 and S-P2-01 to S-P2-12.
- The Extension Floors section and its pinned-copy assertion that section 7a of the report marks Ready now.
- Removing the phrase "Webflow-only standard" from the quality playbook scenario.
- The quality P0 floor split the operator chose on 2026-10-25, recorded as ADR-001 in `decision-record.md`, which closes research rank 1.

### Out of Scope

- S-P2-13, the CI path keywords in the hub router, which another worker owns.
- S-P2-14, which waits on an operator ruling about surface-only routing.
- The review profile, which the operator ruled out on 2026-10-25, recorded as ADR-002 in `decision-record.md`.
- Any hub routing file (`ROUTER.md`, `hub-router.json`, `graph-metadata.json`, `leaf-manifest.json`) and `sk-code-ci/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../goal.md`, `../spec.md` | Modify | D7 marks D3 and D4 superseded, criteria amended, phase 3 bound, open question answered, handoff row fixed |
| `../00{1,2}-*/goal.md` | Modify | D4 marks the parent D3 and D4 superseded, criteria amended and ticked |
| `../00{1,2}-*/decision-record.md` | Modify | ADR-003 added |
| `../00{1,2}-*/acceptance-criteria.md` | Modify | Status Complete, AC-003 to AC-005 at fifteen, AC-009 Superseded by ADR-003 |
| `../00{1,2}-*/tasks.md` | Modify | CHK-031, CHK-032 and the 001 CHK-050 evidence |
| `../00{1,2}-*/implementation-summary.md` | Modify | Limitations and verification rows |
| `../00{1,2}-*/research/research.md` | Modify | ROUTER.md tags re-anchored, envelope premise corrected, anchor note added |
| `../002-review-mode-research/spec.md` | Modify | Envelope premise corrected |
| `../scratch/commit-message*.txt` | Delete | Four used commit drafts |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modify | Rebuilt from the sk-doc playbook template |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Modify | Retired names, the unit-test claim and the Webflow phrase removed |
| `.skilled/skills/sk-code/sk-code-quality/scripts/{check-comment-hygiene,check-dist-staleness,ceiling-report}.sh`, `scripts/hooks/claude-posttooluse.sh` | Modify | COMPONENT header after the shebang |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `README.md`, `changelog/v1.3.0.0.md` | Modify, Create | The P0 floor split into the universal baseline and a `.js` or `.css` overlay |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` | Modify | Hand-typed scenario counts replaced by the derived census |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | `### Extension Floors` in section 4 |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`, `check-rule-copies.test.sh`, `README.md` | Modify | Pinned-copy assertion for the floors, one drift test, README rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The goal criteria and acceptance rows of the packet name the counts and the boundary ADR-002 and ADR-003 set | Every criterion in the three research goals is ticked with evidence, and AC-009 in both phases reads Superseded with ADR-003 |
| REQ-002 | Recursive strict validation passes | `validate.sh specs/sk-code/014-code-modes-research --recursive --strict` prints `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The quality playbook root passes the playbook validator | `validate_document.py --type playbook` prints `VALID` |
| REQ-004 | The review playbook carries no hand-typed census | `validate-playbook-package.cjs` reports 0 warnings for `sk-code-review` |
| REQ-005 | The four Python entrypoints carry the COMPONENT header | `verify_alignment_drift.py --check-exact-headers` reports no finding for them |
| REQ-006 | The extension floors are listed once and pinned | `check-rule-copies.js` exits 0 and its test suite fails a reworded floor |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validation of the parent prints `RESULT: PASSED`.
- **SC-002**: The review canary, its test suite and the four sk-code-quality test suites exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Another worker edits the hub routing files at the same time | Med | This phase touches no hub routing file and runs no generator that writes one |
| Risk | Header lines shift source-tag anchors in the research synthesis | Low | Each research References section states that those anchors read against `ee8c7e6f24` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. S-P2-14 stays with the operator.
<!-- /ANCHOR:questions -->

---
