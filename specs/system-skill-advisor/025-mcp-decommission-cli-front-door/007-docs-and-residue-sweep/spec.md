---
title: "Feature Specification: Phase 7: docs-and-residue-sweep"
description: "Bring every advisor document to current reality and sweep until no live surface describes an MCP server that no longer exists"
trigger_phrases:
  - "advisor docs sweep"
  - "advisor residue sweep"
  - "advisor architecture rewrite"
  - "retired tool id sweep"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 7: docs-and-residue-sweep

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The package documents itself as an MCP server across its architecture, README, skill routing, feature catalog, playbook and install guide, and retired tool ids appear in dozens of files that mix live instruction with historical evidence. This phase rewrites the documents to describe what ships and sweeps the rest until only reasoned exemptions remain.

**Key Decisions**: Documents describe what ships, not what changed; historical evidence is preserved and listed

**Critical Dependencies**: Phase 006, so the documents describe the final tree and the final directory name

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-runtime-package-rename |
| **Successor** | 008-verification-and-closeout |
| **Handoff Criteria** | No live instruction surface presents the advisor as an MCP server or names a retired tool id |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the skill advisor MCP decommission specification.

**Scope Boundary**: Documentation and the residue sweep. No code changes; a code defect found here is raised, not fixed in place.

**Dependencies**:
- Phase 006, so documents describe the final directory name.
- Phase 001 for the classification of live surface versus historical evidence.

**Deliverables**:
- Architecture, README, SKILL.md, install guide, feature catalog and manual-testing playbook describing the CLI front door.
- An env reference and example carrying no flag that served only the transport.
- A residue sweep report with zero live hits and every exemption reasoned.
- Routing instructions showing a working CLI invocation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Documentation that describes a removed transport is worse than no documentation: it sends a reader to a surface that will not answer. The advisor's architecture document opens by calling the package a standalone MCP server, its topology diagram draws an MCP transport entrypoint, its decision records accept a standalone MCP server boundary, and its install guide configures one per runtime. Retired tool ids appear across dozens of files, and most of those are live instruction rather than history.

### Purpose
Leave every live surface describing the CLI front door, and every historical record intact and labelled as history.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ARCHITECTURE.md, README.md, SKILL.md, INSTALL-GUIDE.md and the repository install guides.
- The feature catalog and the manual-testing playbook.
- The env reference and the env example.
- Every live instruction surface naming a retired tool id.
- A residue sweep with a reasoned exemption list.

### Out of Scope
- Historical evidence: changelogs, dated benchmark reports, negative-guard tests and this packet's own documents.
- Code changes. A defect found during the sweep is raised as a finding.
- Other skills' documentation, except where it names an advisor tool id.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modify | Topology and diagram regenerated from the tree |
| `.opencode/skills/system-skill-advisor/README.md` | Modify | Package overview without an MCP server |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modify | Routing instructions naming the CLI |
| `.opencode/skills/system-skill-advisor/INSTALL-GUIDE.md` | Modify | Bootstrap without per-runtime MCP registration |
| `.opencode/skills/system-skill-advisor/feature-catalog/` | Modify | Per-capability detail on the CLI surface |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/` | Modify | Operator scenarios against the CLI |
| `.env.example`, `ENV-REFERENCE.md` | Modify | Transport-only flags removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Architecture, README, SKILL.md, install guide, feature catalog and playbook describe the CLI front door and no MCP server |
| REQ-002 | The env reference and example carry no flag that served only the removed transport |
| REQ-003 | The residue sweep reports zero live hits |
| REQ-004 | Every exemption is listed with a written reason |
| REQ-005 | The routing instructions show a working CLI invocation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every changed document passes its own documentation gate |
| REQ-007 | The architecture diagram and topology are regenerated from the tree rather than edited around |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The residue sweep reports zero live hits.
- **SC-002**: The invocation printed in the routing instructions runs and returns a recommendation.
- **SC-003**: No changed document describes a capability the tree does not have.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A rewritten document that still describes an older tree | High | Verify each claim against the tree, not against the previous version of the document |
| Risk | Historical evidence swept away with live surface | Medium | Classify before editing; exemptions are listed, not silent |
| Risk | An invocation printed but never run | Medium | Run every command a document tells a reader to run |
| Dependency | Phase 006 rename | Documents must name the final directory | Do not start before the rename lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every rewritten document describes the shipped state, verified against the tree rather than against an earlier document.

---

## 8. EDGE CASES

### Sweep boundaries
- A string appearing in a changelog or a dated benchmark report: historical evidence, exempt, and listed as such.
- A string appearing in a negative-guard test that asserts the surface is gone: exempt, and listed.
- A string in this packet's own documents: exempt, and listed.

---

## 9. COMPLEXITY ASSESSMENT

Documentation phase. The cost is breadth rather than depth, and the failure mode is a document that reads correct but describes a tree that no longer exists.

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
