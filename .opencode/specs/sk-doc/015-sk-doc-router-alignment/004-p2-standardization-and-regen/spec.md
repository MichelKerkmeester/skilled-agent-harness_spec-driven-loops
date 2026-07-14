---
title: "Feature Specification: P2 Standardization and Registry Regeneration"
description: "Normalize trigger and handoff shape across ten packet sources, synchronize both router projections, and verify the routing delta."
trigger_phrases:
  - "sk-doc router regeneration"
  - "packet trigger standardization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/004-p2-standardization-and-regen"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Standardized packet shape and synchronized router JSON"
    next_safe_action: "None — strict validation passed Errors:0"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-p2-standardization-and-regen"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: P2 Standardization and Registry Regeneration

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

Normalize ten packet sources into one parseable trigger and handoff shape, then synchronize both runtime JSON projections. Close with package, JSON, drift, and six-query routing evidence while reporting the stale strict-validator blocker honestly.
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
| **Phase** | 4 of 4 |
| **Predecessor** | 003-p1-trigger-scoping-and-handoffs |
| **Successor** | None |
| **Handoff Criteria** | Ten package checks pass, JSON parses, trigger drift is zero, routing delta is recorded, and validation blocker is reported |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Align sk-doc subskill routing triggers, sibling handoffs, and generated hub registries specification.

**Scope Boundary**: P2 shape changes, two router JSON projections, routing replay, and final packet evidence.

**Dependencies**:
- Completed P0 and P1 source changes.

**Deliverables**:
- Five standardized source-shape fixes.
- Synchronized registry and router with zero drift.
- Package and routing verification evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ten packets placed trigger lines and handoff boundaries inconsistently, and the JSON projections were not derived from a uniform source shape. This made hand maintenance error-prone and obscured drift.

### Purpose
Give every packet one parseable trigger source and one exact handoff shape, then prove both JSON projections match.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Standardize five source-shape conventions across ten packet files.
- Synchronize `mode-registry.json` and `hub-router.json` from packet trigger lines.
- Re-run package checks, drift check, and routing measurements.

### Out of Scope
- Creating a new registry generator, because no generator exists and scripts are outside allowed paths.
- Rebuilding system-spec-kit dist, because the required path is explicitly banned.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-*/SKILL.md` | Modify | Standardized trigger/handoff source shape |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Trigger alias projection |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Vocabulary and scoring projection |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | Document packet-source/runtime-projection authority |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Place `Activation Triggers` first | Given ten packet files, when scanned, then each has the heading |
| REQ-002 | Keep one trigger line per packet | Given ten packet files, when counted, then count is ten |
| REQ-003 | Standardize `When NOT to Use` | Given ten packet files, when scanned, then heading is consistent |
| REQ-004 | Standardize handoff lead-in | Given ten packet files, when scanned, then each uses the same lead-in |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Use exact sibling ids | Given handoff bullets, when reviewed, then targets are exact and backticked |
| REQ-006 | Synchronize both router JSON files | Given packet trigger lines, when compared, then drift count is zero |
| REQ-007 | Preserve benchmark vocabulary | Given all three projections, when grepped, then family phrases remain |
| REQ-008 | Verify routing and package validity | Given final sources, when checked, then ten packages pass and routing matches target |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Source-to-registry drift script reports `drift: 0`.
- **SC-002**: Internal replay produces the exact six-query target matrix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `package_skill.py` | Invalid packet structure could ship | Run against every edited packet |
| Risk | Stale validator dist | Exact strict gate cannot execute | Do not rebuild banned path; report blocker and run documented legacy path |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- Source-to-projection drift must equal zero.
- Both JSON files must parse.
- Ten packet package checks must pass.
- No generator or validator rebuild may write outside allowed paths.

## 8. EDGE CASES

- `generate a readme` requires noun-only `readme` evidence because the phrase contains an article.
- `create a flowchart` requires noun-only `flowchart` evidence for the same reason.
- Generic authoring actions alone produce a tie and defer.
- Stale compiled validation dist blocks the exact command before packet inspection.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---:|---|
| Scope | 24/25 | Ten sources, hub source, and two JSON projections |
| Risk | 20/25 | Runtime routing and three-way drift |
| Research | 10/20 | Generator search and replay design |
| Total | 54/70 | Level 3 phased work |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Projection drift | Medium | High | Deterministic extractor over all modes |
| Stale validation runtime | High | Medium | Report blocker and avoid banned rebuild |
| Benchmark vocabulary loss | Low | High | Three-surface preservation grep |

## 11. USER STORIES

### Hub Maintainer
**Given** a packet trigger change, **when** projections are synchronized, **then** the extractor reports zero drift.

### Documentation Requester
**Given** one of the six coverage queries, **when** the hub classifies it, **then** the target matrix is exact and ambiguous queries defer.

### Supporting Documents

- `implementation-summary.md` records the routing delta and gate results.
- `decision-record.md` records the hand-sync decision.
- `../spec.md` records parent status and remaining blocker.

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
