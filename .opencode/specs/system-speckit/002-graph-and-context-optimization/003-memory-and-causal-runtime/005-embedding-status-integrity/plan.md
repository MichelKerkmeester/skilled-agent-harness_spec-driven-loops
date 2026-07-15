---
title: "Implementation Plan: embedding-status integrity (durable prevention fixes)"
description: "Level 1 plan for the three durable mk-spec-memory embedding-status prevention fixes."
trigger_phrases:
  - "embedding status integrity plan"
  - "reindex status commit plan"
  - "retry retention non-destructive plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/005-embedding-status-integrity"
    last_updated_at: "2026-05-27T09:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-level-1-plan"
    next_safe_action: "operator-rebuild-restart-daemon"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000052"
      session_id: "embedding-status-integrity-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 3 fixes implemented + verified"
---
# Implementation Plan: embedding-status integrity (durable prevention fixes)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/Node.js MCP server, better-sqlite3, sqlite-vec |
| **Framework** | system-spec-kit / mk-spec-memory runtime |
| **Storage** | `context-index.sqlite` (`memory_index`) + active vector shard (`vec_<dim>`, `vec_memories`) |
| **Testing** | vitest (`tests/embedder-reindex.vitest.ts`, `tests/providers/retry-retention.vitest.ts`), `npm run build` |

### Overview
Implement three surgical, durable fixes that close the embedding-status integrity gaps proven by the 004 deep-research: reindex must commit status, retention must not park never-attempted clean rows, and retention config must be read at call-time. Net change is ~30 LOC across two source files plus test updates.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause + exact `file:line` sites confirmed against live source (from 004)
- [x] Existing test suites identified (`embedder-reindex`, `retry-retention`)
- [x] Fixes scoped to prevention only (one-time repair excluded)

### Definition of Done
- [x] REQ-001 reindex status-commit implemented + asserted
- [x] REQ-002 non-destructive retention implemented + asserted
- [x] REQ-003 call-time config implemented + asserted
- [x] `npm run build` green; coupled vitest suites green

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical, behavior-preserving edits to existing functions; tests extended to lock in the new invariants.

### Key Components
- **reindex completion transaction** (`reindex.ts`): atomic status-commit alongside active-pointer flip + job completion.
- **`enforceRetryRetentionLimits()`** (`retry-manager.ts`): three retention passes gated by an attempted-row predicate.
- **retention config accessors** (`retry-manager.ts`): `getMaxRetryQueuePending()`/`getMaxRetryQueueAgeMs()` read env at call-time.

### Data Flow
1. `embedder_set` → `startReindex` → worker writes vectors → completion txn now also commits `embedding_status='success'`.
2. Background drain calls `enforceRetryRetentionLimits()` (call-time config) which now spares clean `pending` rows.
3. `processRetryQueue()` embeds clean `pending` → `retry` → `success`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research Setup
- [x] Verify 004 `file:line` claims against live source.
- [x] Confirm `retry_count`, `updated_at`, `embedding_generated_at` columns exist in production schema.

### Phase 2: Implementation
- [x] REQ-001: add status-commit UPDATE to reindex completion transaction.
- [x] REQ-002: add attempted-row guard to all three retention queries.
- [x] REQ-003: add call-time accessors; use as retention defaults; export them.

### Phase 3: Verification
- [x] `npm run build` (tsc → dist).
- [x] Extend + run `embedder-reindex` and `retry-retention` vitest suites.
- [x] Regression sweep across coupled suites.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | reindex status-commit; retention guard; call-time config | vitest |
| Build | full TypeScript compile to dist | `npm run build` |
| Regression | embedder/retry/index/vector coupled suites | vitest |
| Functional (deferred) | live daemon re-embed + drain to zero | operator runbook post-restart |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mk-spec-memory source + tsconfig build | Codebase | Available | Cannot compile fixes |
| Existing vitest suites | Tests | Available | No regression signal |
| Daemon rebuild + lease-owner restart | Runtime | Operator action | Fixes inert until restart |
| One-time reconcile (separate) | Follow-up | Pending | Existing backlog stays stale |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix regresses reindex completion or retry drain behavior.
- **Procedure**:
  1. `git revert` the `reindex.ts` / `retry-manager.ts` change (each fix is an isolated diff hunk).
  2. `npm run build` to regenerate `dist/`.
  3. Re-run `embedder-reindex` + `retry-retention` vitest suites.

<!-- /ANCHOR:rollback -->
