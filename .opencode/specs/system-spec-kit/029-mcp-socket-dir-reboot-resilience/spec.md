---
title: "Feature Specification: MCP socket-dir reboot resilience: canonicalize missing IPC socket dirs in resolveIpcSocketPath, then populate the empty code graph"
description: "Phase parent for MCP socket-dir reboot resilience: canonicalize missing IPC socket dirs in resolveIpcSocketPath, then populate the empty code graph"
trigger_phrases:
  - "029-mcp-socket-dir-reboot-resilience"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-mcp-socket-dir-reboot-resilience"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 1 shipped (socket-dir fix); Phase 2 (code-graph scan) pending reconnect"
    next_safe_action: "Reconnect mk_code_index, then run Phase 2 code_graph_scan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000290"
      session_id: "029-parent"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "First phase: 001 socket-dir fix (no MCP); then 002 scan (needs reconnect)"
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

# Feature Specification: MCP socket-dir reboot resilience: canonicalize missing IPC socket dirs in resolveIpcSocketPath, then populate the empty code graph

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/029-mcp-socket-dir-reboot-resilience |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phased decomposition tracks MCP socket-dir reboot resilience: canonicalize missing IPC socket dirs in resolveIpcSocketPath, then populate the empty code graph across independently executable child phase folders.

### Purpose
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for MCP socket-dir reboot resilience: canonicalize missing IPC socket dirs in resolveIpcSocketPath, then populate the empty code graph
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modify | 1 | Canonicalize missing socket dir |
| (operational: code_graph_scan) | N/A | 2 | Populate the empty graph (no source change) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-ipc-socket-dir-canonicalize/ | Canonicalize a missing IPC socket dir in system-code-graph resolveIpcSocketPath (+ regression test) | Complete |
| 2 | 002-code-graph-initial-scan/ | Run a full code_graph_scan to populate the empty graph + verify readiness | In Progress (blocked on mk_code_index reconnect) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-ipc-socket-dir-canonicalize | 002-code-graph-initial-scan | Socket-dir fix shipped + dist rebuilt so mk_code_index can reconnect | Regression test green; `tsc --build` exit 0 |
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
