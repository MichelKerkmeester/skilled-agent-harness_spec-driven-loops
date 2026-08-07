---
title: "Feature Specification: embedding-status integrity (durable prevention fixes)"
description: "Three durable code fixes that prevent the mk-spec-memory embedding backlog from recurring: commit embedding_status on reindex completion, make retry-retention non-destructive for never-attempted pending rows, and read retry-retention config at call-time."
trigger_phrases:
  - "embedding status integrity fixes"
  - "reindex status commit prevention"
  - "retry retention non-destructive call-time config"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/005-embedding-status-integrity"
    last_updated_at: "2026-05-27T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented + verified all 3 prevention fixes (build + tests green)"
    next_safe_action: "operator-rebuild-restart-daemon-then-reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000050"
      session_id: "embedding-status-integrity-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 3 root-cause fixes implemented + verified via npm run build + vitest"
---
# Feature Specification: embedding-status integrity (durable prevention fixes)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 004 deep-research investigation proved a bulk re-embed of the mk-spec-memory store cannot reach `0 failed / 0 pending` because of three durable defects: (1) the `embedder_set`/reindex completion transaction writes vectors but never commits `memory_index.embedding_status`, so a completed re-embed leaves rows stale; (2) `enforceRetryRetentionLimits()` parks clean never-attempted `pending` rows as `failed` before the drain can embed them; (3) retry-retention config is read once at module load, so tuned env never applies to a long-lived daemon without a precise restart.

### Purpose
Implement the three durable prevention fixes so the backlog cannot recur. The one-time repair of the existing backlog (status reconciliation) is operational and tracked separately, not in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Commit `memory_index.embedding_status='success'` for active-profile vector-present rows at reindex completion (`reindex.ts`).
- Make `enforceRetryRetentionLimits()` non-destructive for never-attempted clean `pending` rows (`retry-manager.ts`).
- Read retry-retention cap/age at call-time via accessors (`retry-manager.ts`).
- Extend the two existing test suites to lock in the new behavior.

### Out of Scope
- One-time backlog repair (`memory_embedding_reconcile` / reconciliation UPDATE) — operational, separate.
- The context-server hardcoded retry interval/batch (5min/5) — noted follow-up, not changed here.
- Provider-cascade or vector-shard architecture changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/embedders/reindex.ts` | Modify | REQ-001: completion txn commits embedding_status |
| `mcp_server/lib/providers/retry-manager.ts` | Modify | REQ-002 retention guard + REQ-003 call-time config accessors |
| `mcp_server/tests/embedder-reindex.vitest.ts` | Modify | Realistic schema + status-commit assertion |
| `mcp_server/tests/providers/retry-retention.vitest.ts` | Modify | Clean-pending-spared + call-time-config assertions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reindex completion commits `embedding_status='success'` for rows backed by the active-profile vector | After a completed reindex, all rows in `vec_<dim>` are `success` with `failure_reason IS NULL`; embedder-reindex vitest asserts it; `npm run build` green |
| REQ-002 | Retention spares never-attempted clean `pending` rows (`retry_count=0`) | All three retention passes carry `AND (embedding_status='retry' OR COALESCE(retry_count,0)>0)`; retry-retention vitest asserts the guard |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Retry-retention cap/age read at call-time | `getMaxRetryQueuePending()`/`getMaxRetryQueueAgeMs()` honor changed env without re-import; defaults preserved when unset; vitest asserts it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A completed reindex drives touched rows to `success` (no stale backlog after re-embed).
- **SC-002**: Clean never-attempted `pending` rows survive retention; attempted rows still bounded.
- **SC-003**: Tuned retention env applies at call-time; `npm run build` + embedder-reindex + retry-retention suites green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Marking rows success without a real vector | False embedded state | UPDATE scoped to `id IN (SELECT id FROM vec_<dim>)` only |
| Risk | Retention behavior change breaks expectations | Test/behavior drift | Existing retry-retention suite + new assertions encode intended behavior |
| Dependency | Fixes activate only after rebuild + daemon restart | Backlog still stale until then | Operator rebuilds (`npm run build`) + restarts lease owner; one-time reconcile clears existing backlog |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the context-server hardcoded retry interval/batch should also move to call-time env reads (deferred follow-up).
- Whether to ship the one-time `memory_embedding_reconcile()` repair tool here or in a separate operational packet.
<!-- /ANCHOR:questions -->
