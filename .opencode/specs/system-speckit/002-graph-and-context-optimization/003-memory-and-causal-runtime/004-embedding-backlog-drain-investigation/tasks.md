---
title: "Tasks: mk-spec-memory embedding-backlog drain investigation"
description: "Level 1 task tracker for the mk-spec-memory embedding backlog drain and daemon config investigation."
trigger_phrases:
  - "embedding backlog drain investigation tasks"
  - "mk-spec-memory re-embed non-convergence tasks"
  - "retry queue parking daemon config reload tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation"
    last_updated_at: "2026-05-28T12:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "verified-live-drain-T021-retry-zero-28843-success-22-genuine-failed"
    next_safe_action: "none-drain-resolved-optional-22-failures-and-T014-synthesis"
    blockers: []
    key_files:
      - "mcp_server/context-server.ts"
      - "mcp_server/lib/embedders/reindex.ts"
      - "shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000012"
      session_id: "rsr-2026-05-26T20-43-39Z"
      parent_session_id: null
    completion_pct: 98
    open_questions:
      - "Are the 22 genuine failures worth a further pass; run T014 research.md synthesis?"
    answered_questions:
      - "Q1-Q6 root-cause and runbook questions answered in iteration 010"
      - "Interval/batch gap root cause = context-server.ts call-site override, not env-forwarding"
      - "Live drain verified: env reaches daemon (no launcher gap); backlog → 0 retry/pending"
---
# Tasks: mk-spec-memory embedding-backlog drain investigation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create deep-research packet state files (`research/`)
- [x] T002 Record Q1-Q6 in strategy and prompt pack (`research/deep-research-strategy.md`)
- [x] T003 Confirm research-only scope in specification (`spec.md`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Trace retry retention parking behavior (`mcp_server/lib/providers/retry-manager.ts`)
- [x] T005 Trace retry queue ownership of `pending -> retry -> success` (`mcp_server/lib/providers/retry-manager.ts`)
- [x] T006 Trace `reindex --force` and scan/save behavior (`mcp_server/cli.ts`, `handlers/memory-index.ts`)
- [x] T007 Trace `embedder_set` and reindex status-commit gap (`handlers/embedder-set.ts`, `lib/embedders/reindex.ts`)
- [x] T008 Trace daemon launcher, IPC bridge, and sidecar env inheritance (`.opencode/bin/`, `sidecar-client.ts`)
- [x] T009 Validate active-vector coverage and reconcile predicates (`research/iterations/iteration-007.md`)

### Runtime fixes (2026-05-28)

- [x] T015 Stop the daemon retry-env override so tuned `SPECKIT_RETRY_*` env applies (`mcp_server/context-server.ts`)
- [x] T016 Persist the active-embedder provider pointer on reindex completion (`mcp_server/lib/embedders/reindex.ts`)
- [x] T017 Add `invalidateProviderSingleton()` and call it on active-pointer flip (`shared/embeddings.ts`, `lib/embedders/reindex.ts`)
- [x] T018 Update embedder-reindex test expectations for the persisted provider pointer (`tests/embedder-reindex.vitest.ts`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Write final iteration narrative (`research/iterations/iteration-010.md`)
- [x] T011 Append canonical iteration record (`research/deep-research-state.jsonl`)
- [x] T012 Write per-iteration delta stream (`research/deltas/iter-010.jsonl`)
- [x] T013 Run artifact JSONL validation (`jq`)
- [x] T014 Final reducer-owned synthesis present (`research/research.md` — complete 10-iteration synthesis, completion_pct 100)
- [x] T019 Build mcp-server + shared workspaces; typecheck green (`tsc --build`)
- [x] T020 Run changed-area vitest (embedder-reindex/-set, retry-manager, default-model); 71 pass, 1 pre-existing T49 deferral
- [x] T021 Live drain verified — daemon env confirmed (`ps eww`: cap 300000/batch 100/interval 5000); retry queue → 0 at batch 100/5s; reconcile re-embed → 28843 success / 0 retry / 0 pending / coverage 0

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Iteration 10 artifacts exist and parse
- [x] Q1-Q6 have final evidence-cited answers in the iteration narrative
- [x] Operator runbook and durable prevention list are recorded
- [x] Final synthesis artifact present (`research/research.md`)
- [x] Runtime drain fixes implemented and unit-verified (T015-T020)
- [x] Live backlog drained to 0 retry/pending after MCP reconnect (T021); 22 genuine failures remain (re-embed pending)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Final iteration**: See `research/iterations/iteration-010.md`

<!-- /ANCHOR:cross-refs -->
