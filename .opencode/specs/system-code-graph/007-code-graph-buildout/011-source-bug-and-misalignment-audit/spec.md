---
title: "Feature Specification: Code Graph Source Bug & Misalignment Audit"
description: "Phase parent for the system-code-graph correctness and doc-alignment audit: the audit findings, the applied source and doc fixes, the deferred overlapping work, and the skill-local DB relocation."
trigger_phrases:
  - "code graph source bug audit phase parent"
  - "mk-code-index correctness audit"
  - "code graph misalignment audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit"
    last_updated_at: "2026-06-08T13:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Restructured to phase parent; audit docs moved to phase 001"
    next_safe_action: "Resume the applied-fixes or deferred-findings phases"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000011"
      session_id: "026-004-011-source-bug-and-misalignment-audit-parent"
      parent_session_id: null
    completion_pct: 65
    open_questions: []
    answered_questions:
      - "Execution order: audit findings (001) then applied fixes (002), deferred WIP (003), DB relocation (004)"
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

# Feature Specification: Code Graph Source Bug & Misalignment Audit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/004-code-graph |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Audit findings recorded; applied fixes land and verify; deferred overlapping work tracked; the DB relocation completes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` skill ships a ~17.5k-LOC standalone `mk-code-index` MCP server (tree-sitter parsing, better-sqlite3 storage, IPC launcher, owner-lease election, readiness contracts) that had no recent end-to-end correctness audit, and several documentation surfaces had drifted from the implementation.

### Purpose
Run a bug and misalignment sweep over the code-graph implementation and its docs, then apply the verifiable fixes, track the overlapping work that belongs elsewhere, and relocate the DB to a skill-local path. The findings and each remediation live in the child phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All findings, plans, tasks, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child-phase manifest for the audit and its remediations.
- Per-phase findings, fixes, and verification (in the child folders).

### Out of Scope
- The broader code-graph program work tracked by the parent packet.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-source-bug-audit-findings/ | The end-to-end correctness and doc-alignment sweep findings (dispatched via cli-opencode gpt-5.5 xhigh) | Complete |
| 2 | 002-applied-source-and-doc-fixes/ | The verifiable source and documentation fixes applied from the findings | In Progress |
| 3 | 003-deferred-wip-overlapping-findings/ | Findings that overlap in-flight work and were deferred to their owning packets | Pending |
| 4 | 004-db-location-skill-local/ | Relocate the code-graph DB to a skill-local path | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-source-bug-audit-findings | 002-applied-source-and-doc-fixes | Findings triaged into applied vs deferred | findings list complete |
| 002-applied-source-and-doc-fixes | 003-deferred-wip-overlapping-findings | Applied fixes land and verify | fix tests green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the deferred overlapping findings (003) be re-homed into their owning packets now, or tracked here until those packets resume?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md` (004-code-graph).
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
