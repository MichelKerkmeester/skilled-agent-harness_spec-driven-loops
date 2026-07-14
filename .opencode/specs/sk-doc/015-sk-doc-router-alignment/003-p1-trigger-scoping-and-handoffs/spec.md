---
title: "Feature Specification: P1 Trigger Scoping and Handoffs"
description: "Remove over-broad trigger tokens and replace every vague exclusion with exact sibling packet handoffs."
trigger_phrases:
  - "sk-doc trigger scoping"
  - "sibling packet handoffs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/003-p1-trigger-scoping-and-handoffs"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Removed broad triggers and corrected all packet handoffs"
    next_safe_action: "Use phase 004 regeneration evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-p1-trigger-scoping-and-handoffs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: P1 Trigger Scoping and Handoffs

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

Remove selector tokens that do not identify an artifact and replace vague exclusion language with exact sibling packet ids. Preserve family-specific benchmark vocabulary and valid schema/mode guidance outside trigger lines.
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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Branch** | `wt/goalAB-skdoc` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-p0-collision-fixes |
| **Successor** | 004-p2-standardization-and-regen |
| **Handoff Criteria** | Bare benchmark, generic documentation, suffix-only, and schema-only prompts cannot select a creator; all packet exclusions name sibling ids |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Align sk-doc subskill routing triggers, sibling handoffs, and generated hub registries specification.

**Scope Boundary**: Trigger lines and `When NOT to Use` handoff lists across all ten packet files.

**Dependencies**:
- Completed P0 collision scope.

**Deliverables**:
- Six P1 fixes covering broad triggers, hub scoring, and sibling handoffs.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Bare benchmark, generic documentation, command suffix, and hub-schema terms carried too little artifact intent to select a packet safely. Several exclusion lists also named artifact concepts without naming the sibling packet that owns them.

### Purpose
Require artifact-specific intent for selection and make every cross-packet boundary executable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove broad tokens from packet trigger sources and router projections.
- Remove hub identity/schema classes from per-mode scoring.
- Correct handoff lists across all ten packet files.

### Out of Scope
- Removing schema terminology from create-skill workflow content, because it remains valid authoring guidance.
- Removing command mode syntax from create-command workflow content, because only trigger ownership changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-*/SKILL.md` | Modify | Narrow triggers and exact handoffs |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Remove hub identity from per-mode classes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove bare benchmark ownership | Given `benchmark`, when replayed, then outcome is defer |
| REQ-002 | Preserve benchmark-family phrases | Given family-specific prompts, when inspected, then vocabulary remains |
| REQ-003 | Remove suffix-only command triggers | Given `:auto` or `:confirm`, when inspecting trigger source, then neither appears |
| REQ-004 | Remove generic README documentation ownership | Given `add documentation`, when replayed, then outcome is defer |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Remove hub-schema packet triggers | Given schema-only terms, when inspecting trigger source, then they are absent |
| REQ-006 | Remove hub identity from child score paths | Given router signals, when read, then no mode references `hub-identity` |
| REQ-007 | Correct all ten handoff lists | Given each exclusion list, when read, then sibling ids are exact and backticked |
| REQ-008 | Preserve workflow guidance | Given edited packet bodies, when reviewed, then valid domain terminology remains outside trigger lines |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Generic `add documentation` and bare `benchmark` both defer.
- **SC-002**: Ten of ten packet handoff sections name exact sibling packet ids.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Workstream-A benchmark contract | Family vocabulary could regress | Zero-drift and explicit preservation grep |
| Risk | Schema guidance removed from workflow body | High | Edit trigger line only; retain body guidance |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- Ambiguous generic prompts must defer under the null default.
- Family-specific benchmark prompts must retain coverage.
- Handoff targets must use exact backticked packet ids.

## 8. EDGE CASES

- Bare `benchmark` defers; `model-benchmark` selects create-benchmark.
- Bare `:auto` does not select create-command; command-authoring prompts still do.
- Hub schema terms remain in create-skill workflow guidance but not its selector line.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---:|---|
| Scope | 22/25 | Ten packet contracts plus router scoring |
| Risk | 16/25 | Coverage and handoff regressions |
| Research | 8/20 | Vocabulary ownership analysis |
| Total | 46/70 | Level 3 phased work |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Over-narrowed family route | Medium | High | Preservation grep and drift extraction |
| Incorrect sibling handoff | Medium | Medium | Ten-file handoff review |

## 11. USER STORIES

### Ambiguous Requester
**Given** a generic documentation or benchmark request, **when** the hub classifies it, **then** the hub defers for artifact intent.

### Benchmark Author
**Given** a family-specific benchmark request, **when** the hub classifies it, **then** create-benchmark retains the correct family route.

### Supporting Documents

- `plan.md` defines the six P1 changes.
- `decision-record.md` records the specificity policy.
- `../001-audit-and-fix-map/plan.md` is the frozen fix map.

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
