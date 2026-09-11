---
title: "Feature Specification: Hardening research"
description: "Five research iterations on deepseek-v4.1-flash at max, one angle each, that found what makes the shipped goal system more robust, better integrated, easier to operate and smaller, and the do-now set that was then built."
trigger_phrases:
  - "goal unification hardening"
  - "goal hardening research"
  - "goal integration seams"
  - "goal overengineering review"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hardening research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-retirement-docs-and-verification |
| **Successor** | None |
| **Handoff Criteria** | Research synthesis exists; do-now rows built and green; do-next rows recorded as backlog |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Goal unification hardening research specification.

**Scope Boundary**: Research over the shipped packet plus the second review pass, then the small certain changes both named.

**Dependencies**:
- 007-retirement-docs-and-verification Complete

**Deliverables**:
- `research/lineages/deepseek/research.md` with the five charter tables
- The do-now set implemented with tests
- The do-next set recorded as the follow-up backlog

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet shipped green, but a first review already showed the unit tests missed real defects. The operator asked for a deeper look at four things at once: robustness, integration seams, operator experience, and what was built that nothing needs.

### Purpose
A ranked, cited list of changes split into do now, do next and do not, with the do-now group built and the rest recorded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One five-iteration cli-pi research lineage, one angle per iteration, stop policy max-iterations
- A second five-iteration review lineage in phase 007 over the same surfaces
- Implementation of the twelve do-now rows minus two deferred with reasons, plus the review's reproduced defects

### Out of Scope
- The do-next rows - each needs a decision, a harness or an injection-shape change
- Reopening any of the eight frozen decisions - the charter forbids it and nothing required it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Charter, lineage, synthesis |
| `.opencode/hooks/goal/lib/goal-slice.cjs`, `goal-core.cjs`, `bin/goal.cjs` | Modify | Do-now rows 1, 3, 5, 7, 10, 11 and review F101, F106 |
| `.opencode/plugins/opencode-goal.js` | Modify | Do-now row 6 and review F103, F105, F106 |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modify | Do-now rows 2 and 10, review F102 |
| `.opencode/commands/speckit/assets/*.yaml`, `save.md` | Modify | Do-now rows 4 and 8, review F104 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five research iterations complete, one per charter angle | State ledger ends at iteration 5 with maxIterationsReached |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every do-now row is built with a test or deferred with a stated reason | Tests green; deferred rows named in the summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/lineages/deepseek/research.md` carries the five charter tables with resolving citations
- **SC-002**: Hook, plugin and validator suites pass after the do-now changes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A do-now row hides a decision | Wrong default shipped | The synthesis flagged row 4; it was built on the frozen D1 and stays reversible in YAML |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which of the two Devin UserPromptSubmit hooks the host keeps when both write additionalContext (review F107; recorded in DV-022 for the next live run)
<!-- /ANCHOR:questions -->

---


