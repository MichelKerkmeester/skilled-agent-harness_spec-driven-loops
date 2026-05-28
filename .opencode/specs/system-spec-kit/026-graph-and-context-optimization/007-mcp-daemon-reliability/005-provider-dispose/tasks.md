---
title: "Tasks: Dispose the embedding provider's native ONNX session on swap (F2′)"
description: "Implementation task tracker for the native-run-gated provider dispose across all three provider-holding sites."
trigger_phrases:
  - "provider dispose tasks F2"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/005-provider-dispose"
    last_updated_at: "2026-05-28T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented T002-T010; headless tests + builds green; T011 live-daemon deferred"
    next_safe_action: "Run T011 RSS observation in a live-daemon session"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000513"
      session_id: "007-005-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Dispose the embedding provider's native ONNX session on swap (F2′)

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Verify dispose chain + single-session for the feature-extraction model (done in 003 research)
- [x] T002 Add optional `dispose?(): Promise<void>` to `IEmbeddingProvider` (`shared/types.ts`)
- [x] T003 [P] Widen the local `FeatureExtractionPipeline` alias to expose `dispose()` + `model.sessions` (`hf-local.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a raw-native-run in-flight gate to `generateEmbedding` (register the un-wrapped `model(...)` promise, decrement in its `.finally`) (`hf-local.ts`) [REQ-001]
- [x] T005 Implement `HfLocalProvider.dispose()`: set `disposed`, drain in-flight raw runs (timeout ≥ `MODEL_LOAD_TIMEOUT`), single-owner claim+null `extractor`, assert one session, `await extractor.dispose()` (`hf-local.ts`) [REQ-002/004/005/006]
- [x] T005a Ensure the getModel post-load tail defers to `dispose()` (single-owner; no double native free) (`hf-local.ts`) [REQ-004]
- [x] T006 `invalidateProviderSingleton()` captures outgoing + `void dispose().catch(log)`; dispose in resetForTesting/setProviderForTesting (`shared/embeddings.ts`) [REQ-007]
- [x] T007 `execution-router`: `recycleActiveSidecars(key)` (auto/sidecar) + dispose `directAdapters` provider on clear (direct); branch on `shouldUseSidecar(job.backend)` (`execution-router.ts`) [REQ-001/003/008]
- [x] T008 Wire the policy-correct teardown at the reindex swap site keyed on `job.backend:toName` (`reindex.ts`) [REQ-003/008]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 swap-during-in-flight-inference test (no segfault) + swap-during-cold-load test (no leaked session) [REQ-001/005]
- [x] T010 auto-policy recycle (pid re-fork) + direct-policy adapter-dispose tests [REQ-003/008]
- [ ] T011 RSS-bounded-across-N-swaps observation (live daemon + sidecar) [SC-001] — DEFERRED: needs a running daemon; not drivable headlessly
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete (T002-T008)
- [x] No `[B]` blocked tasks remaining
- [x] swap-during-inference + swap-during-cold-load + policy tests green (headless); RSS-bounded observation deferred to a live daemon (T011)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause + design**: See `../003-daemon-reliability-research/research/research.md` §6.2 + `research/iterations/iteration-003.md`
<!-- /ANCHOR:cross-refs -->
