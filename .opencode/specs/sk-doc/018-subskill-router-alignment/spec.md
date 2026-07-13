---
title: "Feature Specification: Align sk-doc subskill routing triggers, sibling handoffs, and generated hub registries"
description: "Phase parent for Align sk-doc subskill routing triggers, sibling handoffs, and generated hub registries"
trigger_phrases:
  - "018-subskill-router-alignment"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-subskill-router-alignment"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Aligned packet triggers, handoffs, and router projections"
    next_safe_action: "Orchestrator may rebuild stale spec-kit dist and rerun strict validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Align sk-doc subskill routing triggers, sibling handoffs, and generated hub registries

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-13 |
| **Branch** | `wt/goalAB-skdoc` |
| **Parent Spec** | None |
| **Parent Packet** | `sk-doc/018-subskill-router-alignment` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All 14 fixes mapped and applied, router drift zero, package checks pass, and strict validation evidence is recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ten sk-doc creation packets had inconsistent trigger placement, vague sibling handoffs, and router JSON that did not reflect packet-owned vocabulary. Quality actions could be claimed by README or flowchart workflows, while generic phrases selected specific creators without enough artifact intent.

### Purpose
Make each packet the source of truth for its activation boundary, then synchronize the hub registries so quality verbs, artifact nouns, ambiguous requests, and workstream-A benchmark families route predictably.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all ten packet contracts and both hub router files.
- Apply the frozen 3 P0, 6 P1, and 5 P2 fixes.
- Regenerate both router JSON projections and verify zero trigger drift.
- Preserve workstream-A create-benchmark layout and family vocabulary.

### Out of Scope
- Any create-benchmark layout change.
- Changes outside sk-doc packet contracts, hub routers, and this spec packet.
- Rebuilding stale system-spec-kit dist because that path is explicitly excluded.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/create-*/SKILL.md` | Modify | 002-004 | Trigger boundaries, exact sibling handoffs, and heading placement |
| `.opencode/skills/sk-doc/{mode-registry.json,hub-router.json}` | Modify | 004 | Synchronized routing projections |
| `.opencode/specs/sk-doc/018-subskill-router-alignment/**` | Create | 001-004 | Audit map, evidence, decisions, and verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-audit-and-fix-map/ | Read all sources, map all 14 fixes, and capture routing baseline | Complete |
| 2 | 002-p0-collision-fixes/ | Resolve README/flowchart quality-action collisions | Complete |
| 3 | 003-p1-trigger-scoping-and-handoffs/ | Narrow broad triggers and correct sibling handoffs | Complete |
| 4 | 004-p2-standardization-and-regen/ | Standardize packet shape, sync registries, and verify | Review |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume .opencode/specs/sk-doc/018-subskill-router-alignment/004-p2-standardization-and-regen/` to resume the active phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-audit-and-fix-map | 002-p0-collision-fixes | Exact 14-fix map and before-state recorded | Phase 001 plan/tasks contain 3/6/5 map |
| 002-p0-collision-fixes | 003-p1-trigger-scoping-and-handoffs | Quality-action ownership is unambiguous | Internal replay routes both quality queries to `create-quality-control` |
| 003-p1-trigger-scoping-and-handoffs | 004-p2-standardization-and-regen | Broad triggers removed and all handoffs name siblings | Grep and packet source review |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. The frozen order and completion gates are defined above.
<!-- /ANCHOR:questions -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the active child phase and its allowed files.
- Read source files before editing.
- Preserve workstream-A benchmark vocabulary and layout.

### Execution Rules
| Rule | Required Behavior |
|---|---|
| Scope | Write only to approved sk-doc files and this packet |
| Source | Treat packet trigger lines as authoring truth |
| Verification | Run package, drift, routing, JSON, and spec gates |

### Status Reporting Format
Report phase, changed files, verification commands, results, and blockers.

### Blocked Task Protocol
Stop the blocked gate, preserve verified work, record the exact error, and do not write to a banned path to bypass it.

---

## RELATED DOCUMENTS

- **Phase children**: See the four numbered child folders above for per-phase canonical docs
- **Parent Spec**: See `../spec.md`
