---
title: "Feature Specification: Phase 4: content-migration [template:level-3/spec.md]"
description: "Fifty-one chart and report templates, a colour system, two validators and the examples move into the package built by phase 3. The proof they survived the move is the source's own validator running green from the new path."
trigger_phrases:
  - "migrate chart templates"
  - "port colour presets"
  - "lieflat validate.mjs"
  - "content migration proof"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: content-migration

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The templates, the colour system, the scripts and the examples cross over. Relative paths are the danger, since a template that resolves its colour tokens by a path that no longer exists fails silently in a browser rather than loudly in a check.

**Key Decisions**: Whether the source's validators are ported as they are or adapted to the new layout

**Critical Dependencies**: Phase 3's package shape, and phase 2's translated documents

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-packet-scaffold |
| **Successor** | 005-routing-integration |
| **Handoff Criteria** | Every ported template renders, and the source's own `validate.mjs` runs green from the new location |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Bring the lieflat-charts skill into this repository as sk-create-chart specification.

**Scope Boundary**: Move and repath. The templates' visual output is not redesigned, and the source's logic is not improved.

**Dependencies**:
- Phase 3's package, which is where these files land
- Phase 2's translations, which replace the source's authored documents
- Phase 1's dispositions, which decide what moves at all

**Deliverables**:
- The ported templates, colour system, scripts and examples
- A repath record naming every reference that had to change
- A green run of the source's validator from the new path

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This is the phase where the adoption either keeps what makes the source worth adopting or quietly loses it. Fifty-one templates across three chart families depend on a colour system and on each other by relative path. Move the files without tracing those references and the templates still open, still look like charts, and render with the wrong colours or no data.

The source ships two of its own checks, a validator and a smoke script. They are the cheapest available proof that the move preserved behaviour, and they only work if they are ported too and pointed at the new layout.

### Purpose

Every ported file works from its new home, proven by the source's own checks rather than by inspection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The chart and report templates marked port by phase 1
- The colour system, meaning the presets and the token module
- The source's validator and smoke script, adapted only as far as the new layout requires
- The examples, and whichever documentation imagery phase 1 decided to keep
- Every relative reference that the move invalidated

### Out of Scope

- Redesigning any chart. The visual language is the reason for the adoption
- Fixing the source's logic. Anything that looks wrong is raised as a finding, because a fix buried in a migration cannot be reviewed on its own
- Adding templates. The set is what the source had

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The package's template directory | Create | The ported chart and report templates |
| The package's colour system files | Create | Presets and tokens, ported as they are |
| The package's scripts directory | Create | The source's validator and smoke script, repathed |
| specs/sk-doc/051-sk-create-chart/004-content-migration/research/repath-record.md | Create | Every reference the move invalidated, and what it became |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every file phase 1 marked port or adapt exists at its destination, and the count reconciles. |
| REQ-002 | The source's `validate.mjs` runs from the new path and exits 0. |
| REQ-003 | Every relative reference broken by the move is fixed and recorded, with none left resolving outside the package. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The smoke script runs from the new path, or its failure is recorded with the reason it does not apply. |
| REQ-005 | Anything in the source that looks wrong is raised as a finding rather than fixed here. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.mjs` exits 0 from the new location, and its output is read rather than only its status.
- **SC-002**: A grep for references that resolve outside the package returns nothing.
- **SC-003**: The ported file count matches phase 1's port and adapt rows exactly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The source's own validators | If they do not port, the cheapest proof of a clean move is gone | Adapt them minimally, and record what changed |
| Risk | A template renders but renders wrong | High. Nothing fails, and the loss is only visible to a human looking at a chart | Run the validator, and open a representative template per family |
| Risk | A relative path resolves by accident during migration and breaks after cleanup | Medium | Record every repath, and re-run the validator after the last file moves |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A template opens in a browser without an install step, which is a property of the source worth keeping.

### Security
- **NFR-S01**: Ported third-party code runs only inside the checks this phase runs. Nothing from the source is wired into a runtime path here.

### Reliability
- **NFR-R01**: The validator is the reliability check, and it runs after the last file moves rather than during.

---

## 8. EDGE CASES

### Data Boundaries
- A template that references an asset phase 1 dropped needs a decision, not a silent broken link.
- A colour preset referenced by name rather than by path still breaks if the module moved. Names hide the dependency.

### Error Scenarios
- The validator fails after the move: fix the path, do not weaken the validator.
- A template cannot be made to work from the new layout: stop and raise it, because that is evidence the layout is wrong.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: around 60 ported, 51 of them templates. LOC: roughly 25,000. |
| Risk | 16/25 | Auth: N, API: N, Breaking: N for the repository, high for the ported content itself. |
| Research | 8/20 | Tracing references, not investigating a design. |
| Multi-Agent | 8/15 | Workstreams: templates, colour system and scripts are separable. |
| Coordination | 10/15 | Dependencies: reads three earlier phases, feeds two later ones. |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A template renders with the wrong colours and nothing reports it | H | M | Validator run, plus one opened template per family |
| R-002 | The source's validators are dropped as awkward and inspection replaces them | H | M | Porting them is a P0 requirement, not a convenience |
| R-003 | The migration quietly fixes something in the source | M | M | Findings get raised, and the diff is read before staging |

---

## 11. USER STORIES

### US-001: Charts that still work (Priority: P0)

**As a** user of the adopted skill, **I want** the templates to behave as they did upstream, **so that** the adoption gained a capability rather than a folder.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Proof rather than inspection (Priority: P1)

**As a** reviewer, **I want** the source's own checks to run green from the new path, **so that** I can believe the move without reading 51 templates.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Are the source's validators ported as they are, or adapted to the new layout? Adapting them weakens them as evidence, and not adapting them may make them unrunnable.
- If a template depends on documentation imagery that phase 1 dropped, does the asset come back or does the template lose the reference?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
