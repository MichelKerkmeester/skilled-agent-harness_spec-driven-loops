---
title: "Feature Specification: Audit and Fix Map"
description: "Audit all sk-doc packet and hub routing sources, capture the six-query baseline, and map the frozen 14 fixes before product edits."
trigger_phrases:
  - "sk-doc router audit"
  - "subskill fix map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-sk-doc-router-alignment/001-audit-and-fix-map"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed audit, baseline, and 14-fix map"
    next_safe_action: "Use phase 002 collision evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-audit-and-fix-map"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Audit and Fix Map

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

Audit all thirteen routing sources and record the six-query baseline before implementation. The phase closes only when the 14 fixes are mapped as 3 P0, 6 P1, and 5 P2 and benchmark preservation is explicit.
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
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-p0-collision-fixes |
| **Handoff Criteria** | All sources read, six queries captured, generator search complete, and 14 fixes mapped before source edits |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Align sk-doc subskill routing triggers, sibling handoffs, and generated hub registries specification.

**Scope Boundary**: Read-only audit and packet documentation; no sk-doc router source edits in this phase.

**Dependencies**:
- Workstream-A commit `3048a662e9` and its benchmark vocabulary.
- Existing packet `SKILL.md` contracts and both hub JSON files.

**Deliverables**:
- Exact 3 P0, 6 P1, and 5 P2 fix map.
- Before-state for all six routing queries.
- Generator search conclusion.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Trigger ownership was inconsistent across packet source files and router projections. Without a complete source audit, targeted changes could silently remove benchmark-family vocabulary or replace one collision with another.

### Purpose
Establish a citable, complete fix map before any router source changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten packet `SKILL.md` files, hub `SKILL.md`, registry, and router.
- Top-level advisor and hub-internal baseline for six queries.
- Generator discovery across sk-doc and system-skill-advisor.

### Out of Scope
- Product edits, which begin only after this phase records the map.
- Other hubs or tracks, which are outside the frozen scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `plan.md` | Modify | Record exact file/trigger mapping and baseline |
| `tasks.md` | Modify | Mirror each fix as an executable task |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read all ten packet `SKILL.md` files | Given the packet set, when audit ends, then every packet has direct evidence |
| REQ-002 | Read hub `SKILL.md` and both router JSON files | Given hub routing, when mapped, then all three sources are represented |
| REQ-003 | Confirm branch and workstream-A commit | Given repository state, when checked, then branch and commit match the brief |
| REQ-004 | Capture six top-level advisor results | Given exact queries, when run, then output provenance and scores are recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Reason about six hub-internal outcomes | Given router JSON, when replayed, then each before-state is recorded |
| REQ-006 | Search for registry generation support | Given scoped source trees, when searched, then generator or hand-sync is selected |
| REQ-007 | Map exactly 14 fixes as 3/6/5 | Given frozen tiers, when documented, then count and target file are explicit |
| REQ-008 | Preserve benchmark-family vocabulary | Given workstream A, when map closes, then all family phrases remain required |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `plan.md` contains exactly 14 mapped rows with 3 P0, 6 P1, and 5 P2.
- **SC-002**: No sk-doc router source was edited before the map existed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local Python advisor fallback | Native dist unavailable | Record fallback provenance and analyze hub JSON separately |
| Risk | Benchmark vocabulary loss | High | Treat packet trigger line as source and run explicit preservation grep |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- Audit evidence must cite repository files or command output.
- No router-source edit may precede the fix map.
- Workstream-A benchmark vocabulary is immutable input.

## 8. EDGE CASES

- Native advisor unavailable: use local fallback and record provenance.
- No generator found: select deterministic hand-sync, not an invented script.
- Multiplexed create-skill packet: split parent-hub phrases explicitly.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---:|---|
| Scope | 18/25 | Thirteen routing sources and six queries |
| Risk | 14/25 | Vocabulary loss can silently misroute |
| Research | 14/20 | Generator and source-authority discovery |
| Total | 46/70 | Level 3 phased work |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Incomplete map | Low | High | Cross-check 3/6/5 counts in plan and tasks |
| Benchmark regression | Medium | High | Explicit family-vocabulary inventory |

## 11. USER STORIES

### Source Auditor
**Given** all packet and hub sources, **when** the audit completes, **then** every frozen fix has an exact file and concern.

### Router Maintainer
**Given** the six baseline queries, **when** implementation starts, **then** before/after behavior can be compared without inference.

### Supporting Documents

- `plan.md` contains the exact 14-row map and baseline.
- `tasks.md` mirrors all implementation and verification actions.
- `../spec.md` defines phase sequencing.

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
