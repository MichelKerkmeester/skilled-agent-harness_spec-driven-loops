---
title: "Feature Specification: Phase 3: packet-scaffold [template:level-3/spec.md]"
description: "A skill package built to the create-skill templates at the placement phase 1 chose, empty of ported content. Getting the shape right before the content arrives means the packaging gate fails against an empty shell rather than against 26,500 lines."
trigger_phrases:
  - "scaffold chart skill package"
  - "create-skill template conformance"
  - "skill root metadata"
  - "package skill check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: packet-scaffold

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Build the package shape and prove it passes the packaging gate while it is still empty. The metadata contract differs between a hub mode and a standalone root, which is why this phase waits on phase 1 rather than running beside it.

**Key Decisions**: Which root metadata files belong, given the placement, and where the manual testing playbook directory sits

**Critical Dependencies**: Phase 1's placement verdict

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
| **Phase** | 3 of 6 |
| **Predecessor** | 002-translation-and-voice |
| **Successor** | 004-native-chart-build |
| **Handoff Criteria** | The empty package passes `package_skill.py --check --strict` with a PASS, and the root metadata matches the contract for its class |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Bring the lieflat-charts skill into this repository as sk-create-chart specification.

**Scope Boundary**: Shape only. No ported template, script or asset arrives in this phase.

**Dependencies**:
- Phase 1's placement verdict, which decides the metadata class
- The create-skill templates, which are the authority on the shape

**Deliverables**:
- The package directories and their entry documents
- Root metadata matching the class the placement implies
- A passing packaging check against the empty shell

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The source has its own document conventions. They are reasonable and they are not ours, so a direct copy produces a package that looks finished and fails every gate the repository runs.

The metadata contract is also class-dependent in a way that is easy to get backwards. A `graph-metadata.json` is required at both a parent-hub root and a standalone root. A `description.json`, a `mode-registry.json` and a `hub-router.json` are hub-only and forbidden on a standalone root. Building the wrong set means the packaging gate fails for a reason that reads like a missing file rather than like a wrong shape.

### Purpose

An empty package in the right shape, proven by the gate that will judge it when it is full.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The package directory tree at the placement phase 1 chose
- Entry documents built from the create-skill templates rather than adapted from the source
- Root metadata matching the class, hub or standalone, and nothing outside that class
- A packaging check that passes while the package is still empty

### Out of Scope

- Ported content. Phase 4 owns that, and mixing the two hides which one broke the gate
- Routing registration. Phase 5 owns that, and a package that is not yet built cannot be routed to
- The manual testing playbook's content. Phase 6 owns it. This phase creates the directory it lives in

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The skill package root and its subdirectories | Create | The shape, from the create-skill templates |
| `graph-metadata.json` at the package root | Create | Required at both hub and standalone roots |
| Hub-only metadata, if and only if the placement is a hub mode | Create | Forbidden on a standalone root, so this depends on phase 1 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `package_skill.py --check --strict` reports PASS against the empty package. |
| REQ-002 | Root metadata matches the contract for the class the placement implies, with no file from the other class present. |
| REQ-003 | Every entry document derives from a create-skill template, not from the source's equivalent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The directory tree leaves a named home for every disposition phase 1 marked as port or adapt. |
| REQ-005 | The changelog directory exists with a first entry, so the version story starts at adoption rather than at the first later edit. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` prints PASS.
- **SC-002**: `ci-skill-root-metadata.cjs` reports no violation for the new root.
- **SC-003**: Every port or adapt row from phase 1 has a destination directory that exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1's placement verdict | Building before it lands means building the wrong metadata class | Do not start until the decision record exists |
| Risk | Source conventions copied in because they look close enough | Medium. The package passes a reading and fails a gate | Build from the templates, then compare to the source, never the reverse |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. No runtime path is added in this phase.

### Security
- **NFR-S01**: Not applicable.

### Reliability
- **NFR-R01**: The packaging gate is the reliability check, and it runs against an empty shell so its failures are legible.

---

## 8. EDGE CASES

### Data Boundaries
- A directory with no content yet still needs whatever marker the packaging gate expects, or it does not survive to phase 4.
- A source directory with no template equivalent gets a decision rather than a silent creation.

### Error Scenarios
- The packaging gate fails for a reason that names a file: check the class before adding the file, since the fix may be to remove one.
- The placement verdict is ambiguous in practice: stop and raise it rather than picking the shape that is easier to build.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: package shape and root metadata. No content. |
| Risk | 10/25 | Auth: N, API: N, Breaking: N. A wrong shape is cheap here and expensive later. |
| Research | 6/20 | The templates are the authority and they exist. |
| Multi-Agent | 4/15 | Workstreams: 1. |
| Coordination | 10/15 | Dependencies: reads phase 1, feeds phases 4 through 6. |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Wrong metadata class built, hub files on a standalone root or the reverse | H | M | Read the metadata contract before writing any of them |
| R-002 | Entry documents adapted from the source instead of built from templates | M | H | Build first, compare second |
| R-003 | A destination directory is missing and phase 4 improvises one | M | M | Reconcile the tree against phase 1's port and adapt rows |

---

## 11. USER STORIES

### US-001: A shape that passes before it is full (Priority: P0)

**As a** phase 4 implementer, **I want** the package to already pass its gate when empty, **so that** a failure after migration points at content rather than at shape.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The right metadata class (Priority: P1)

**As a** phase 5 implementer, **I want** root metadata that matches the placement, **so that** routing has something valid to register.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Does the manual testing playbook directory sit at the package root or under a shared location, given the placement?
- Does the changelog start at the adoption version or continue the source's numbering?
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
