---
title: "Implementation Plan: P0 Collision Fixes"
description: "Scope README and flowchart creation triggers and make create-quality-control the explicit owner of existing-document quality actions."
trigger_phrases:
  - "quality collision plan"
  - "readme flowchart quality routing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/002-p0-collision-fixes"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Applied and replayed three P0 collision fixes"
    next_safe_action: "Use phase 003 plan"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: P0 Collision Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet contracts |
| **Framework** | sk-doc workflow hub |
| **Storage** | Repository files only |
| **Testing** | Trigger grep, routing replay, package checks |

### Overview
Edit the three packet activation/handoff sections only. Keep each creator's local validation workflow, but move standalone existing-document quality intent to `create-quality-control`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 001 map complete

### Definition of Done
- [x] Three P0 source changes applied
- [x] Four affected routing queries replayed
- [x] Packet docs updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Intent ownership by target state: create/edit intent stays with the artifact creator; audit/validate/score/optimize intent over an existing document routes to quality control.

### Key Components
- **Creator packets**: Author or refresh an artifact and validate that output.
- **Quality-control packet**: Audit or improve an existing markdown artifact.

### Data Flow
Query action and target state -> packet trigger line -> hub vocabulary projection -> one creator or quality-control mode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create-readme/SKILL.md` | README authoring source | Remove standalone audit ownership | Trigger/handoff grep |
| `create-flowchart/SKILL.md` | Flowchart authoring source | Scope validation to same-request output | Trigger/handoff grep |
| `create-quality-control/SKILL.md` | Existing-doc quality source | Add explicit README/flowchart ownership | Routing replay |

Matrix axes are action type (create vs quality) and artifact type (README vs flowchart vs generic document).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the three source sections
- [x] Confirm P0 map

### Phase 2: Core Implementation
- [x] Apply P0-01 README scope
- [x] Apply P0-02 flowchart scope
- [x] Apply P0-03 quality-control ownership

### Phase 3: Verification
- [x] Replay audit and validate queries
- [x] Replay README and flowchart creation queries
- [x] Run affected package checks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source | Trigger and handoff text | Grep |
| Integration | Hub-internal outcomes | JSON replay |
| Structural | Edited packet validity | `package_skill.py --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 map | Internal | Green | Defines exact P0 edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A creator query defers or a quality query selects a creator.
- **Procedure**: Restore the three activation sections and adjust only the conflicting phrase.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Documentation-and-config change only; no external build graph. The subskill `SKILL.md` edits are the single input the registry regeneration consumes.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Audit and fix-map, then the SKILL.md edits, then registry regeneration from the SKILL.md source of truth, then drift verification. Each step gates the next.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

M1: fix map complete and reviewed. M2: registry and hub-router regenerated with zero SKILL.md-to-registry drift and package validation green.
<!-- /ANCHOR:milestones -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
