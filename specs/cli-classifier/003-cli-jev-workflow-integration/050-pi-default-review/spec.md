---
title: "Feature Specification: Make Pi the default Jev transport when available, then have a fresh Opus reviewer test, re-measure and fix nine features"
description: "Two phases: make Pi the default Jev transport when it is available, then have a fresh Opus reviewer test, re-measure and fix the nine Jev features with a measured gain or a near miss."
trigger_phrases:
  - "pi default transport"
  - "jev feature review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Both children Complete"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Make Pi the default Jev transport when available, then have a fresh Opus reviewer test, re-measure and fix nine features

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/050-pi-default-review |
| **Predecessor** | 049-jev-feature-improvement-build |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi answers Jev questions with the same picks as the jev CLI in about half the time, but only when a caller asks for it, and only for `choice` questions in two scorers. The nine features that earned a keep or came close were measured through the CLI, some on built rows, and one dropped on its repeat.

### Purpose
Phase 001 makes Pi the default whenever it can answer, for `choice` and `noul`, across the scorers under review. Phase 002 then has a fresh reviewer test and re-measure each of the nine features over that default, and fix what it finds.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Jev transport's default route and its `noul` support
- The eight scorers of the nine features under review
- One review, test and re-measure per feature

### Out of Scope
- Any feature on by default, per 047 D6
- New labels or corpora, per 003 D4
- Killed and no-headroom features

### Files to Change
Each child names its exact files in its own spec.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Modify | 001 | Default route, noul, route name |
| The eight scorers and their tests | Modify | 001, 002 | Transport call, then review fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-pi-default-transport/ | Pi answers Jev calls by default when it can, for choice and noul, across the eight scorers | Complete |
| 2 | 002-feature-review-and-remeasure/ | A fresh Opus reviewer tests, re-measures and fixes the nine features | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-pi-default-transport | 002-feature-review-and-remeasure | 001 Complete, so re-measures run over the default | `validate.sh --strict` on 001 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator asked for both phases on 2026-10-03.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
