---
title: "Feature Specification: Phase 18: epic-docs-alignment"
description: "Bring the playbooks, feature catalogs, READMEs, doctor docs and release changelogs in line with what the spec-folder tooling epic shipped, per a 26-finding docs audit."
trigger_phrases:
  - "epic docs alignment"
  - "doctor update compat docs"
  - "phrase lint env reference"
  - "upgrade legacy playbook scenarios"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: epic-docs-alignment

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
| **Phase** | 18 of 18 |
| **Predecessor** | 017-heal-cli-and-compat-yaml-simplification |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row Met, and `validate.sh --strict` passes on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the spec-folder tooling packet. It updates the documentation around the features phases 16 and 17 shipped.

**Scope Boundary**: The 26 findings in `scratch/audit-findings.md` (F01 to F26). Documentation only: no code, test or workflow behavior changes.

**Dependencies**:
- Phases 16 and 17 are shipped to main, so the documented behavior is fixed.

**Deliverables**:
- Every finding fixed, or recorded as not holding with the evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A read-only audit on 2026-10-09 found the docs around the epic's features behind the code: a playbook expects 12 hook gates where there are 13, five surfaces list `/doctor:update` without `compat`, the env reference lacks `SPECKIT_SKIP_PHRASE_LINT`, `--layout-map` is undocumented, and no feature catalog entry or playbook scenario covers the new upgrade, heal, era-report and phrase-lint tooling. The release changelogs mention none of it.

### Purpose
Every doc an operator or tester reads describes what the code does now.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Findings F01 to F25 in `scratch/audit-findings.md`, across playbooks, feature catalogs, READMEs, references, the env reference, `.env.example` and the doctor docs.
- F26: one entry each in `.skilled/changelog/skilled/v4.0.0.4.md` and the system-spec-kit `changelog/v2.7.0.0.md`.

### Out of Scope
- Code, tests and workflows. A doc that disagrees with the code is fixed in the doc.
- Doc gaps that predate the epic and touch no epic feature, beyond what a finding names.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Files named in F01 to F26 | Modify | One fix per finding |
| New feature-catalog entries and playbook scenarios for F02 and F09 | Create | Coverage for the compat action and the upgrade, heal, era-report, phrase-lint and anchor-nesting features |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | F01 is fixed: the hook-gate playbook expects 13 gates |
| REQ-002 | Every P1 finding (F02 to F10) is fixed, each claim checked against the code line it describes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every P2 finding (F11 to F25) is fixed or recorded as not holding with evidence |
| REQ-004 | F26: both release changelogs carry an entry for the epic |
| REQ-005 | Every changed doc passes the doc validators that apply to it, and no new doc names removed behavior |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 26 findings closed, each with the file it changed.
- **SC-002**: A fresh reviewer finds no remaining mismatch between the changed docs and the code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A doc fix describes the code wrongly | Med | Each lane checks every claim against the code line before writing, and a fresh review checks the result |
| Risk | Two lanes edit one file | Med | Lanes own disjoint file sets, and the catalog and playbook lane runs after the doctor lane |
| Dependency | Phases 16 and 17 on main | Low | Shipped and green |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No change, documentation only.

### Security
- **NFR-S01**: No secret or token appears in any doc example.

### Reliability
- **NFR-R01**: Every command a playbook scenario gives runs as written.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A finding that does not hold on reading: recorded with the evidence, not "fixed".

### Error Scenarios
- A doc validator rejects a new scenario or entry: fixed to the template, never bypassed.

### State Transitions
- A finding needs a code change to be true: out of scope, recorded as a follow-up.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 30 doc files, new catalog entries and scenarios |
| Risk | 4/25 | Documentation only |
| Research | 4/20 | The audit is done |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose the folder, full scope and changelog entries on 2026-10-09.
<!-- /ANCHOR:questions -->

---


