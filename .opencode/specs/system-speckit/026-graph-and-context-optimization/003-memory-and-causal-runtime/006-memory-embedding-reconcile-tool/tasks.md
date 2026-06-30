---
title: "Tasks: memory_embedding_reconcile() MCP maintenance tool"
description: "Task breakdown for the guarded reconcile tool: core lib, thin handler, six registration surfaces, and the 7-scenario vitest suite."
trigger_phrases:
  - "memory_embedding_reconcile tasks"
  - "embedding reconcile task breakdown"
  - "reconcile vitest tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 task breakdown for memory_embedding_reconcile() tool"
    next_safe_action: "Implement core logic + handler + registration, then run vitest + build"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/handlers/memory-embedding-reconcile.ts"
      - "mcp_server/tests/embedding-reconcile.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: memory_embedding_reconcile() MCP maintenance tool

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `memory_retention_sweep` handler + lib to capture pattern (`mcp_server/handlers/memory-retention-sweep.ts`) [20m]
- [ ] T002 Confirm active-shard resolution anchor (`mcp_server/lib/search/vector-index-store.ts:364-372`) [10m]
- [ ] T003 [P] Confirm dry-run/apply SQL + bucket schema from 004 `iteration-008.md` §F1-§F2 [15m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Logic
- [ ] T004 Implement active-embedder resolution + shard verification → `activeShardVerified` (`mcp_server/lib/embedders/embedding-reconcile.ts`) [45m]
- [ ] T005 Implement dry-run bucket aggregation + schema (4 buckets incl. byStatus split, `activeEmbedder`/`safety`/`plannedMutations`) (`mcp_server/lib/embedders/embedding-reconcile.ts`) [1h]
- [ ] T006 Implement apply-mode ordered transaction: reconcile-then-reset under `BEGIN IMMEDIATE` (`mcp_server/lib/embedders/embedding-reconcile.ts`) [1h]
- [ ] T007 Implement args defaults + fail-closed guard for unverified shard (`mcp_server/lib/embedders/embedding-reconcile.ts`) [30m]

### Handler + Registration
- [ ] T008 Create thin handler delegating to core (`mcp_server/handlers/memory-embedding-reconcile.ts`) [20m]
- [ ] T009 [P] Add input schema (`mcp_server/schemas/tool-input-schemas.ts`) [15m]
- [ ] T010 [P] Add tool definition (`mcp_server/tools/memory-tools.ts`) [15m]
- [ ] T011 [P] Add tool schema entry (`mcp_server/tool-schemas.ts`) [10m]
- [ ] T012 [P] Add result/args typing (`mcp_server/tools/types.ts`) [15m]
- [ ] T013 Route handler in index (`mcp_server/handlers/index.ts`) [10m]
- [ ] T014 Add to `MEMORY_RUNTIME_TOOL_NAMES` (`mcp_server/context-server.ts`) [10m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit / Integration Tests
- [ ] T015 Test dry-run bucket counts incl. failed/pending/retry status split (`mcp_server/tests/embedding-reconcile.vitest.ts`) [25m]
- [ ] T016 Test apply → `success` without enqueue (`mcp_server/tests/embedding-reconcile.vitest.ts`) [20m]
- [ ] T017 Test missing-vector retention reset shape (retry/retry_count=0/last_retry_at=NULL/failure_reason=NULL) (`mcp_server/tests/embedding-reconcile.vitest.ts`) [20m]
- [ ] T018 Test provider-failure rows unchanged by default (`mcp_server/tests/embedding-reconcile.vitest.ts`) [15m]
- [ ] T019 Test active-shard fail-closed (dry-run false, apply zero mutations / typed error) (`mcp_server/tests/embedding-reconcile.vitest.ts`) [20m]
- [ ] T020 Test masked rows reconciled-not-pruned negative test (`mcp_server/tests/embedding-reconcile.vitest.ts`) [20m]
- [ ] T021 Test idempotency — second dry-run after apply all-zero action buckets (`mcp_server/tests/embedding-reconcile.vitest.ts`) [15m]

### Build + Manual Verification
- [ ] T022 Run `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` [10m]
- [ ] T023 Run the new vitest suite green + confirm no regressions [20m]
- [ ] T024 Dry-run against current DB; confirm near-zero buckets (backlog already cleared) [10m]

### Documentation
- [ ] T025 Reconcile spec.md / plan.md status to shipped [15m]
- [ ] T026 Finalize implementation-summary.md Files Changed + verification tables [20m]
- [ ] T027 Mark all checklist items with evidence [15m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All vitest scenarios passing
- [ ] `npm run build` green with no regressions
- [ ] Dry-run verified near-zero on current DB
- [ ] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
