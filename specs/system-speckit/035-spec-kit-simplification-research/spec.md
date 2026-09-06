---
title: "Feature Specification: spec-kit simplification research"
description: "Phase parent for spec-kit simplification research"
trigger_phrases:
  - "001-quiet-spec-kit"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-quiet-spec-kit"
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
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: spec-kit simplification research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/001-quiet-spec-kit |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phased decomposition tracks spec-kit simplification research across independently executable child phase folders.

### Purpose
Keep parent documentation lean while child phases own detailed plans, tasks, verification, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for spec-kit simplification research
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
| 1 | 001-ripgrep-search-system/ | ten-iteration research lane: ripgrep search system | complete |
| 2 | 002-cli-runtime-utilization/ | ten-iteration research lane: cli runtime utilization | complete |
| 3 | 003-shared-package-utilization/ | ten-iteration research lane: shared package utilization | in progress |
| 4 | 004-template-system-and-acceptance-criteria/ | ten-iteration research lane: template system and acceptance criteria | in progress |
| 5 | 005-overengineering-simplification/ | ten-iteration research lane: overengineering simplification | in progress |
| 6 | 006-retrieval-drift-remediation/ | remediation of every confirmed finding from lane 001 | complete |

| 7 | 007-cli-package-residue-removal/ | removal of every confirmed dead file from lane 002 and a CI runner for the CLI gates | complete |

| 8 | 008-env-example-dead-flags/ | removal of every env template variable nothing reads, on the operator's observation | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-ripgrep-search-system | 006-retrieval-drift-remediation | research.md synthesized and every P1 row reproduced or dropped in `research/confirmed-findings.md` | `validate.sh 001-ripgrep-search-system --strict` prints RESULT: PASSED and the confirmed table names 006 |
| 002-cli-runtime-utilization | 007-cli-package-residue-removal | research.md synthesized and every removal, merge and fix row censused in `research/confirmed-findings.md` | `validate.sh 002-cli-runtime-utilization --strict` prints RESULT: PASSED and the confirmed table names 007 |
| 007-cli-package-residue-removal | 008-env-example-dead-flags | operator observation that the env template still carried memory-database flags | census over the real tree recorded in `008-env-example-dead-flags/implementation-summary.md` |
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
