---
title: "Feature Specification: Infra investigations — memory-DB corruption + graph-metadata churn"
description: "Phase parent for the live-infra investigations into spec-memory: the documented root cause and safe fix for memory-DB FTS corruption and repo-wide graph-metadata churn, then the daemon-lifecycle healing that applies them."
trigger_phrases:
  - "infra memory db and graph churn phase parent"
  - "memory-db corruption graph-metadata churn"
  - "daemon lifecycle healing parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn"
    last_updated_at: "2026-06-08T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Restructured to phase parent; root docs moved to phase 001"
    next_safe_action: "Resume phase 002 or apply the deferred graph-churn code fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000014"
      session_id: "026-007-014-infra-memory-db-and-graph-churn-parent"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Execution order: investigation/findings (001) then daemon-lifecycle healing (002)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->
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

# Feature Specification: Infra investigations — memory-DB corruption + graph-metadata churn

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Graph-churn fix scoped to the saved folder with archived trees excluded; memory-DB repaired via the operator-gated path; the daemon-lifecycle healing in phase 002 verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two live-infra issues degrade the spec-memory subsystem. The MCP throws `SQLITE_CONSTRAINT_PRIMARYKEY` on the memory write and index paths after an unclean shutdown corrupts on-disk FTS state, and the daemon rewrites hundreds of `graph-metadata.json` `last_save_at` timestamps repo-wide on nearly every save, burying real changes in working-tree noise.

### Purpose
Record the verified root cause and a minimal safe fix for each issue, then apply the daemon-lifecycle healing that makes the substrate self-recover. Detailed findings, plan, and implementation live in the child phases below.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed findings, plans, tasks, and implementation summaries live in the child phase folders listed in the Phase Documentation Map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child-phase manifest for the infra-investigation work.
- Per-phase findings and implementation detail (in the child folders).

### Out of Scope
- Detailed per-phase plans at the parent level.
- Applying the operator-gated memory-DB repair outside its runbook.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-infra-investigation-findings/ | Root-cause + safe-fix findings for the memory-DB FTS corruption and the repo-wide graph-metadata churn, with the graph-churn code fix scoped and the schema/parser guards landed | Complete (findings) |
| 2 | 002-daemon-lifecycle-healing/ | FTS auto-heal, clean-close barrier, and the substrate test that exercise the recovery path | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-infra-investigation-findings | 002-daemon-lifecycle-healing | Root cause + scoped fix documented; schema/parser idempotency guards landed | findings + refresh tests green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the deferred graph-churn save-path fix (scope refresh to the touched folder, exclude archived trees) ship with phase 002 or as its own follow-on?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md` (007-mcp-daemon-reliability).
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
