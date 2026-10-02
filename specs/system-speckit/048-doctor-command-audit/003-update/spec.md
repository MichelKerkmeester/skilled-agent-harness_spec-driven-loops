---
title: "Feature Specification: Phase 3: update"
description: "`/doctor:update` rebuilds the spec-kit runtime databases in dependency order."
trigger_phrases:
  - "doctor update audit"
  - "/doctor:update relevance"
  - "doctor-update.yaml"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: update

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 14 |
| **Predecessor** | 002-mcp-debug-code-mode |
| **Successor** | 004-deep-loop |
| **Handoff Criteria** | `acceptance-criteria.md` shows every row Met, Waived or Superseded and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the doctor command audit. It covers `/doctor:update` alone.

**Scope Boundary**: `/doctor:update`, its route entry and `.skilled/commands/doctor/assets/doctor-update.yaml`. Mutability today: mutates.

**Dependencies**:
- A provisioned worktree, so the scripts the doctor calls can run.
- The route manifest `.skilled/commands/doctor/_routes.yaml` and its validator.

**Deliverables**:
- An inventory of everything the route and `doctor-update.yaml` name, checked against this checkout.
- One read-only or dry-run run of `/doctor:update`, with its output kept.
- One verdict, keep, fix or retire, with its evidence.
- The verdict applied to the workflow, the route and the router text.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:update` rebuilds the spec-kit runtime databases in dependency order. Its workflow, `.skilled/commands/doctor/assets/doctor-update.yaml`, was written against an earlier state of the system and names scripts, files, flags and databases that may since have moved, been renamed or been retired. Nobody has run it end to end against the current checkout, so it may report health that is not there or fail on paths that no longer exist.

### Purpose
Decide from evidence on this checkout whether `/doctor:update` is kept, fixed or retired, and leave it in that state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An inventory of everything the route and `doctor-update.yaml` name, checked against this checkout.
- One read-only or dry-run run of `/doctor:update`, with its output kept.
- One verdict, keep, fix or retire, with its evidence.
- The verdict applied to the workflow, the route and the router text.

### Out of Scope
- Other doctor targets, which have their own phases.
- Changes to the subsystem the doctor inspects; defects there become findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/doctor-update.yaml` | Modify or Delete | Apply the verdict |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Only when the verdict changes the route, its flags or its menu text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:update` route and `doctor-update.yaml` name, each marked present, moved or missing with the command that showed it. |
| REQ-002 | `/doctor:update` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. |
| REQ-003 | `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | After the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator who runs `/doctor:update` sees results that match this checkout.
- **SC-002**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A run changes runtime state | High | Run only the read-only or dry-run form, or point it at a disposable copy |
| Risk | A retired target is still named in docs | Med | Search the repository for the target name before closing |
| Dependency | Scripts the doctor calls | The run cannot complete | Record the missing script as a finding; it is part of the verdict |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The command finishes its checks without a network call it did not already make.

### Security
- **NFR-S01**: No secret value is printed to the run log or the report.

### Reliability
- **NFR-R01**: A missing script or database is reported by name, never as a pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A runtime database that a fresh worktree has not built yet: reported as not built, not as missing code.

### Error Scenarios
- A script the workflow calls has moved: recorded in `scratch/reality-check.md` with its new path.

### State Transitions
- The phase stops part way: `scratch/reality-check.md` and the run log let the next session resume.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One command, its workflow and route |
| Risk | 10/25 | A doctor run can touch runtime state |
| Research | 8/20 | Every named path is checked |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None yet. Findings from the inventory go to `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---


