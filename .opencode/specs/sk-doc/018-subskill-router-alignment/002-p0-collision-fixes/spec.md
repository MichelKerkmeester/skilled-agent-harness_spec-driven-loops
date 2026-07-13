---
title: "Feature Specification: P0 Collision Fixes"
description: "Move existing-document audit and validation ownership out of README and flowchart authoring and into create-quality-control."
trigger_phrases:
  - "sk-doc quality collision"
  - "readme flowchart routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-subskill-router-alignment/002-p0-collision-fixes"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped quality ownership across three packet sources"
    next_safe_action: "Use phase 003 trigger and handoff evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-p0-collision-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: P0 Collision Fixes

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

Separate artifact authoring validation from standalone existing-document quality work. README and flowchart creators retain same-request validation while quality control becomes the explicit owner of audit, validation, scoring, and optimization over existing markdown.
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Branch** | `wt/goalAB-skdoc` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-audit-and-fix-map |
| **Successor** | 003-p1-trigger-scoping-and-handoffs |
| **Handoff Criteria** | Both quality queries route only to `create-quality-control`; README and flowchart authoring queries remain covered |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Align sk-doc subskill routing triggers, sibling handoffs, and generated hub registries specification.

**Scope Boundary**: Trigger and handoff sections of `create-readme`, `create-flowchart`, and `create-quality-control` only.

**Dependencies**:
- Completed phase 001 map and baseline.

**Deliverables**:
- Three P0 source changes with no artifact workflow removal.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
README and flowchart packets advertised standalone audit or validation actions even though `create-quality-control` owns existing-document quality work. Regenerating from those sources would reintroduce collisions even when current JSON happened to favor quality control.

### Purpose
Make quality-action ownership explicit without weakening README or flowchart authoring coverage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove README audit trigger ownership.
- Scope flowchart validation to flowcharts authored or edited in the same request.
- Add explicit existing README/flowchart quality ownership to quality control.

### Out of Scope
- Removing packet-local validators, because validation remains part of each authoring workflow.
- Changing validator scripts, which are outside scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-readme/SKILL.md` | Modify | P0-01 trigger/handoff scope |
| `.opencode/skills/sk-doc/create-flowchart/SKILL.md` | Modify | P0-02 validation scope |
| `.opencode/skills/sk-doc/create-quality-control/SKILL.md` | Modify | P0-03 quality ownership |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove public `audit readmes` trigger | Given README source, when inspected, then audit phrase is absent |
| REQ-002 | Keep README authoring triggers | Given `generate a readme`, when replayed, then README wins |
| REQ-003 | Scope flowchart validation to same-request authoring | Given flowchart source, when read, then standalone existing-doc validation is excluded |
| REQ-004 | Keep flowchart authoring triggers | Given `create a flowchart`, when replayed, then flowchart wins |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Add explicit existing README quality ownership | Given quality source, when read, then existing README audit is included |
| REQ-006 | Add explicit existing flowchart quality ownership | Given quality source, when read, then existing flowchart validation is included |
| REQ-007 | Route quality queries to quality control | Given both quality queries, when replayed, then quality control wins |
| REQ-008 | Preserve packet-local validation workflows | Given authored artifacts, when delivered, then their local validators remain documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both quality queries resolve to `create-quality-control`.
- **SC-002**: README and flowchart creation queries still resolve to their creator packets.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 fix map | Source edit order would be ungrounded | Map was written first |
| Risk | Over-narrowing author validation | Medium | Retain same-request validation language and scripts |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- Existing quality queries must resolve deterministically.
- Creator packet delivery gates must remain intact.
- Edits must stay within trigger and handoff boundaries.

## 8. EDGE CASES

- “Validate the flowchart I just created” stays in the creator workflow.
- “Validate this existing document” routes to quality control.
- README inventory scripts remain internal post-authoring checks, not public audit triggers.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---:|---|
| Scope | 12/25 | Three packet contracts |
| Risk | 18/25 | P0 collision ownership |
| Research | 8/20 | Existing source and router evidence |
| Total | 38/70 | Level 3 due routing impact |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Creator loses validation | Low | High | Preserve same-request wording and scripts |
| Quality collision remains | Low | High | Replay both quality queries |

## 11. USER STORIES

### Documentation Reviewer
**Given** an existing markdown document, **when** audit or validation is requested, **then** quality control owns the work.

### Artifact Author
**Given** a README or flowchart created in the request, **when** delivery validation runs, **then** the creator packet keeps responsibility.

### Supporting Documents

- `plan.md` defines the target-state boundary.
- `decision-record.md` records central quality ownership.
- `../001-audit-and-fix-map/plan.md` defines P0-01 through P0-03.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
