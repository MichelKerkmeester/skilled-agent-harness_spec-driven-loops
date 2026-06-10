---
title: "Feature Specification: Soft-delete tombstone audit for stale code-graph nodes/edges"
description: "The code graph hard-deletes nodes/edges during reindex and stale cleanup, so there is no answer to why did this edge disappear. Adopt 027's tombstone audit lineage, bounded/default-off since the graph is rebuildable."
trigger_phrases:
  - "code graph tombstones"
  - "soft delete audit lineage"
  - "why did this edge disappear"
  - "stale node cleanup audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold phase from 027 adoption analysis transfer #4"
    next_safe_action: "Plan bounded/default-off tombstone lineage"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-codegraph-tombstone-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: codegraph-tombstone-audit

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | None (independent) |
| **Successor** | None (independent) |
| **Source transfers** | Analysis #4 (soft-delete tombstones / active-purgeable lifecycle) |
| **Handoff Criteria** | Phase validates `--strict`; tombstone retention is bounded and default-off |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the spec-027 feature adoption into the advisor and code-graph daemons. It adds a deletion audit lineage for stale code-graph cleanup.

**Scope Boundary**: The node/edge deletion paths in `lib/code-graph-db.ts` plus scan/status surfaces. Add bounded soft-delete tombstones (or status-only deletion counts) for stale-file, node, and edge cleanup. Default-off; the graph stays rebuildable.

**Dependencies**:
- None. Independent of all other phases; ships standalone.

**Deliverables**:
- A bounded tombstone lineage (or status-only counts) recording why/when nodes/edges were removed.
- A default-off flag and a retention bound so path-history does not bloat the DB.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code graph hard-deletes nodes and edges during reindex and stale cleanup (`lib/code-graph-db.ts:692-704`, `:784-790`, `:890-905`), so after a file deletion or scan repair there is no way to answer "why did this edge disappear?". Memory's 027 tombstones preserve a deletion audit (`027 before-vs-after.md:91-101`). Because the code graph is rebuildable from source, tombstones are less critical than in memory and must stay bounded.

### Purpose
Adopt 027's soft-delete audit lineage for code-graph cleanup so deletions are diagnosable, while keeping retention bounded and the feature default-off to avoid path-history bloat.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bounded soft-delete tombstones (or status-only deletion counts) for stale node/edge cleanup.
- Deletion reason + timestamp capture at the hard-delete sites.
- A default-off flag and a retention bound (count or age) with pruning.
- Surfacing deletion counts in `code_graph_status`.

### Out of Scope
- Full deletion history / time-travel of the graph - bounded audit only, since the graph rebuilds from source.
- Changing what gets deleted or the reindex/stale-cleanup logic itself.
- Restoring tombstoned nodes/edges (audit, not recovery).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-code-graph/mcp_server/lib/code-graph-db.ts` (~:692-704, :784-790, :890-905) | Modify | Record bounded tombstone/reason at delete sites instead of pure hard-delete |
| `system-code-graph/mcp_server/handlers/scan.ts` | Modify | Emit deletion reasons during reindex/stale cleanup |
| `system-code-graph/mcp_server/handlers/status.ts` | Modify | Surface bounded deletion/tombstone counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Retention is bounded; tombstones cannot grow unbounded | Test: exceed the configured bound; assert oldest tombstones are pruned and DB size stays bounded |
| REQ-002 | Default-off: with the flag unset, delete behavior matches today's hard-delete | Scan/cleanup with flag off leaves no tombstone rows; status counts unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A deleted edge/node records a reason answerable via status | After deleting a file and reindexing, the tombstone/status shows why the edge disappeared |
| REQ-004 | Tombstones never affect live query results | Active queries ignore tombstoned rows; correctness unchanged vs hard-delete |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After a file deletion + reindex, an operator can see why a given edge/node was removed via status, with retention staying bounded.
- **SC-002**: With the flag off (default), the code graph behaves exactly as it does today (pure hard-delete).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Path-history / DB bloat | Med | Bounded retention + pruning (REQ-001) |
| Risk | Low value since graph is rebuildable | Low | Default-off (REQ-002); status-only counts as the minimal option |
| Risk | Tombstones leak into live queries | Med | REQ-004: active queries exclude tombstoned rows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Minimal viable form: full row-level tombstones, or just status-only deletion counts with reasons in a small ring buffer?
- What retention bound (count vs age) fits the typical reindex churn without bloating the DB?
<!-- /ANCHOR:questions -->

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
