---
title: "Feature Specification: Phase 6: ci-truth-checks"
description: "Pull requests run the feature-catalog validator and a citation check in CI. A catalog failure or a new broken citation blocks; older citation debt only reports."
trigger_phrases:
  - "ci truth checks"
  - "catalog validator in ci"
  - "citation drift gate"
  - "new broken citation blocks"
  - "phase 6 ci truth checks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: ci-truth-checks

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/110-ci-truth-checks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-silent-input-sweep |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the open ends research. It builds R1 and R2 from `../003-playbook-catalog-truth/research/research.md`, which the operator approved, with R1 made blocking for new citations only.

**Scope Boundary**: The sk-doc script-tests workflow, one new gate script beside the citation scanner, its test, and the sk-doc and v4.0.0.4 changelogs. The scanner's resolution logic stays as it is.

**Dependencies**:
- `cite-drift-scan.mjs`, whose resolver the gate reuses unchanged.
- `validate_catalog_package.py` and its fixture test, run as they are.

**Deliverables**:
- Two blocking CI jobs in `.github/workflows/sk-doc-script-tests.yml`.
- `cite-drift-gate.mjs` and its unit test.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No workflow runs the feature-catalog package validator, and its fixture test sits outside the folder the sk-doc test runner globs. No workflow runs the citation scanner either, so the 2 past-end and 219 unresolved `path:line` citations in the skills corpus grow without anyone seeing.

### Purpose
A pull request that breaks a catalog package, or adds or changes a citation so it no longer resolves, fails CI, while the older citation debt prints as one count.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A CI job that runs `validate_catalog_package.py` over all packages and its fixture test, fail-closed.
- A gate script that compares unresolved and past-end citations at the head with those at the merge base, keyed by citing file plus cited target.
- A CI job that runs the gate's test and the gate: blocking on a pull request, report-only on a push.
- One sk-doc version bump with a changelog entry, and one item in the v4.0.0.4 release notes.

### Out of Scope
- Widening what the scanner resolves (R4). A separate change does that.
- Fixing the existing broken citations (R7). They stay as reported debt.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/sk-doc-script-tests.yml` | Modify | Add the catalog and citation jobs |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs` | Create | Head-versus-base comparison of broken citations |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs` | Create | Unit test for the gate |
| `.skilled/skills/sk-doc/changelog/` and the sk-doc version surfaces | Modify | One version bump with its entry |
| `.skilled/changelog/skilled/v4.0.0.4.md` | Modify | One release-note item |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The catalog validator and its fixture test block in CI | Both run in a job with no `continue-on-error`, and both exit 0 on the current tree |
| REQ-002 | A pull request fails only on a broken citation its merge base lacks | The gate exits 1 for a branch that adds one broken citation and 0 for a branch that adds none |
| REQ-003 | Older debt reports without blocking | The gate prints `<n> older unresolved or past-end citations, not blocking` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The comparison lives in a tested script | `node --test` on the gate's test passes, and each case fails before the gate exists |
| REQ-005 | A push only reports | Without `--base` the gate prints a count and exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `actionlint` reports nothing for the edited workflow.
- **SC-002**: Local simulations show a new broken citation exits 1 and an unchanged corpus exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The scanner's exports | The gate breaks if they are renamed | The gate's test imports through the gate and runs in the same job |
| Risk | A change that shortens a cited file turns an untouched citation past-end | Med | That is a citation the change broke, so blocking it is correct |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
