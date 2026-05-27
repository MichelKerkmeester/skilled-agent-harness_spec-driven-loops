---
title: "Feature Specification: success-rows-missing-active-vector coverage hygiene"
description: "Detection and repair pass for success-status rows that are missing from an active vector surface; resets them to retry so the retry-manager re-embeds and regenerates the missing vector."
trigger_phrases:
  - "success vector coverage hygiene"
  - "success rows missing vector"
  - "missing active vector success"
  - "vector coverage repair"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/003-memory-and-causal-runtime/007-success-vector-coverage-hygiene"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 1 spec for success-vector coverage hygiene"
    next_safe_action: "Implement detection + guarded repair (reset to retry), then run vitest"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/tests/embedding-reconcile.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: success-rows-missing-active-vector coverage hygiene

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned / in implementation |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Verification during the 005 reconcile found 23 rows marked `embedding_status='success'` that are MISSING from an active vector surface — not present in `active_vec.vec_memories_rowids` OR not present in `active_vec.vec_<dim>`. This is the inverse of the fixed backlog bug (those rows were "has vector, wrong status"; these are "right status, missing vector", ~0.24% of success rows) and they may not surface correctly in semantic search. The 006 reconcile tool does NOT touch success rows, so this case needs its own detection and repair.

### Purpose
Add a low-volume detection + repair hygiene pass that finds success rows missing an active vector surface and resets them to `retry` so the retry-manager re-embeds them and regenerates the missing vector, preserving the memory rather than deleting or relabeling it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Detection query for `embedding_status='success'` rows missing an active vector surface (`vec_memories_rowids` rowid OR `vec_<dim>` id), guarded by `activeShardVerified`.
- Repair: reset detected rows to `retry` (`retry_count=0`, `failure_reason=NULL`) so the retry-manager re-embeds and regenerates the missing vector; dry-run default.
- Exposure via the reconcile lib — a sibling exported function (e.g. `findSuccessRowsMissingActiveVector`) plus a guarded repair — OR a small extension; the main agent decides exact wiring during implementation.
- Vitest coverage for detection, repair, untouched-when-covered, and idempotency.

### Out of Scope
- The reconcile tool itself (packet `006-memory-embedding-reconcile-tool`) - separate concern.
- Pruning/dedup of any rows - preservation only, never deletion.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp_server/lib/embedders/embedding-reconcile.ts | Modify | Add detection + guarded repair (sibling export or small extension) |
| mcp_server/tests/embedding-reconcile.vitest.ts | Modify | Add detection/repair/coverage/idempotency tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detect success rows missing active vector | Count/list `embedding_status='success'` rows where NOT EXISTS `active_vec.vec_memories_rowids(rowid=id)` OR NOT EXISTS `active_vec.vec_<dim>(id=id)`, guarded by `activeShardVerified`; on the live DB this is ~23 rows |
| REQ-002 | Repair by re-embed (apply, dry-run default) | Apply resets detected rows to `retry` (`retry_count=0`, `failure_reason=NULL`) so they re-embed; idempotent (second run finds 0 after re-embed); fail closed if active shard unverified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Vitest coverage | Detection counts a seeded missing-vector success row; apply resets it to `retry`; rows WITH full coverage are untouched; idempotency (second run finds 0) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Detection accurately counts success rows missing an active vector surface (seeded fixture verifies exact count).
- **SC-002**: Apply resets only detected rows to `retry` and is idempotent — a second run after re-embed finds 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Active shard verification (shared with 006) | Cannot detect/repair safely if shard unverified | Reuse the same `activeShardVerified` approach; fail closed |
| Dependency | Retry-manager re-embed path | Reset rows never re-embed if drain disabled | Reset to `retry` puts rows in the retry queue; document drain requirement |
| Risk | Relabeling/deleting instead of re-embedding | Loses the memory or leaves a stale label | Repair-by-re-embed (reset to `retry`) preserves the row and regenerates the vector |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should this be a standalone exported function or folded into the 006 reconcile result? (Main agent decides exact wiring during implementation; both options keep the same active-shard verification.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
