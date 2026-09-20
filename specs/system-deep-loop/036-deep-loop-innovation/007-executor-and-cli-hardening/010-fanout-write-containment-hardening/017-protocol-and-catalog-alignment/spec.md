---
title: "Feature Specification: Phase 2: protocol-and-catalog-alignment"
description: "The deep-review loop protocol carries the same write-containment rules as the deep-research protocol, and the hub feature catalog names exactly the five modes the registry holds."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: protocol-and-catalog-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 19 |
| **Predecessor** | 016-command-yaml-alignment |
| **Successor** | 018-orchestrate-mirror-alignment |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the Remediate the alignment review findings specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent required both loop protocols to describe the containment model, but only the deep-research protocol did; the deep-review protocol's only containment mention was an unrelated executor flag. The hub feature catalog described seven workflow modes including an `alignment` mode that the registry never held, against a registry of five, and called the cohort of activated hubs seven where there are five.

### Purpose
Both protocols state the same containment rules, and the catalog describes the hub the registry defines.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The containment paragraph added to the deep-review protocol beside its executor section, adapted only in loop-type wording
- The catalog's mode count, mode list, improvement-lane count and hub-cohort count corrected to the registry and the compiled-routing manifest
- The deep/review compiled contract regenerated

### Out of Scope
- Runtime code - none changes
- Catalog leaf-level warnings that predate this phase - recorded, not in scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modify | Containment paragraph added, matching the deep-research protocol |
| `.opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md` | Modify | Five modes enumerated, two improvement lanes, five activated hubs |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Regenerate | Digests the edited protocol |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The deep-review loop protocol states preserve by default, the per-pass quarantine layout, the opt-in restore to baseline bytes, never-delete for untracked paths, the sibling-lineage lock exemption and advisory settlement |
| REQ-002 | The catalog's mode list and count equal the registry's five modes and its two improvement lanes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The catalog's hub-cohort count matches the compiled-routing manifest's five |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both protocols carry the containment paragraph and the catalog matches the registry
- **SC-002**: Contract drift tests and the deep-loop suite exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The two protocol paragraphs drift apart later | Low | Same wording, one adaptation; a future edit lands on both or the drift test names the contract |
| Dependency | Compiled contract regeneration | Green | Done in the same change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: The recorded contract digest equals the protocol bytes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A mode added to the registry: the catalog count is stated in place and must follow

### Error Scenarios
- Contract stale after the protocol edit: the drift test fails until recompiled

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Two documents, one contract |
| Risk | 4/25 | Documentation of shipped behaviour |
| Research | 2/20 | Findings from the alignment review |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


