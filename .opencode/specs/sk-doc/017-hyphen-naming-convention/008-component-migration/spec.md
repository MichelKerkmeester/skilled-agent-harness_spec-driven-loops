---
title: "Feature Specification: component migration (017 parent)"
description: "Phase parent for component migration (017 parent)"
trigger_phrases:
  - "008-component-migration"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-component-migration"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
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

# Feature Specification: component migration (017 parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/008-component-migration |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phased decomposition tracks component migration (017 parent) across independently executable child phase folders.

### Purpose
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for component migration (017 parent)
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-sk-code/ | [Phase 1 scope] | Pending |
| 2 | 002-sk-design/ | [Phase 2 scope] | Pending |
| 3 | 003-sk-doc/ | [Phase 3 scope] | Pending |
| 4 | 004-sk-prompt/ | [Phase 4 scope] | Pending |
| 5 | 005-cli-external-orchestration/ | [Phase 5 scope] | Pending |
| 6 | 006-mcp-tooling/ | [Phase 6 scope] | Pending |
| 7 | 007-system-deep-loop/ | [Phase 7 scope] | Pending |
| 8 | 008-system-spec-kit/ | [Phase 8 scope] | Pending |
| 9 | 009-system-skill-advisor/ | [Phase 9 scope] | Pending |
| 10 | 010-system-code-graph/ | [Phase 10 scope] | Pending |
| 11 | 011-mcp-code-mode/ | [Phase 11 scope] | Pending |
| 12 | 012-sk-git/ | [Phase 12 scope] | Pending |
| 13 | 013-commands/ | [Phase 13 scope] | Pending |
| 14 | 014-agents/ | [Phase 14 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sk-code | 002-sk-design | [Criteria TBD] | [Verification TBD] |
| 002-sk-design | 003-sk-doc | [Criteria TBD] | [Verification TBD] |
| 003-sk-doc | 004-sk-prompt | [Criteria TBD] | [Verification TBD] |
| 004-sk-prompt | 005-cli-external-orchestration | [Criteria TBD] | [Verification TBD] |
| 005-cli-external-orchestration | 006-mcp-tooling | [Criteria TBD] | [Verification TBD] |
| 006-mcp-tooling | 007-system-deep-loop | [Criteria TBD] | [Verification TBD] |
| 007-system-deep-loop | 008-system-spec-kit | [Criteria TBD] | [Verification TBD] |
| 008-system-spec-kit | 009-system-skill-advisor | [Criteria TBD] | [Verification TBD] |
| 009-system-skill-advisor | 010-system-code-graph | [Criteria TBD] | [Verification TBD] |
| 010-system-code-graph | 011-mcp-code-mode | [Criteria TBD] | [Verification TBD] |
| 011-mcp-code-mode | 012-sk-git | [Criteria TBD] | [Verification TBD] |
| 012-sk-git | 013-commands | [Criteria TBD] | [Verification TBD] |
| 013-commands | 014-agents | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which child phase should execute first?
- What handoff criteria must each child satisfy?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
