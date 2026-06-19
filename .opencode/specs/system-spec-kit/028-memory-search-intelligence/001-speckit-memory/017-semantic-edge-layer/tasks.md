---
title: "Tasks: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)"
description: "Task Format: T### [P?] Description (file path). Substrate-first, consolidation-time, shadow-gated, benchmark-post-reindex. All PENDING — none of the five edge-intelligence candidates shipped in Wave-0 (030 §14)."
trigger_phrases:
  - "028 semantic edge layer tasks"
  - "per edge embedding substrate tasks"
  - "GR-fact-embedding-on-edge tasks"
  - "edge vector triplet dedup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown; all tasks PENDING (none of the five candidates implemented in Wave-0)"
    next_safe_action: "Start T004 — land the additive schema migration + edge-vector store"
    blockers:
      - "schema-migration: no fact_text/edge-vector columns; substrate is gate-zero"
      - "shared-infra-dep: gate-zero corpus reindex precedes the benchmark"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-017-semantic-edge-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Recall lift + dedup false-merge rate pending post-reindex benchmark"
    answered_questions: []
---
# Tasks: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **STATUS: PENDING (Wave-2, prove-first, shadow-gated).** None of `semantic-edge-layer`, `GR-fact-embedding-on-edge`, `CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-semantic-fact-dedup-merge`, or `GR-semantic-invalidation-discovery` appears in the Wave-0 shipped record (`../../../030-memory-search-intelligence-impl/spec.md` §14, 13-row status table), so no task is pre-checked. Gate: schema-migration (gate-zero substrate) + shared-infra-dep (gate-zero corpus reindex precedes the benchmark) + needs-benchmark before any promotion.

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

- [ ] T001 Confirm the seams unchanged from research: `insertEdge` exact-key upsert (`mcp_server/lib/storage/causal-edges.ts:350-352`), same-pair contradiction (`mcp_server/lib/graph/contradiction-detection.ts:85-93`), consolidation entry `runConsolidationCycle` (`mcp_server/lib/storage/consolidation.ts:499`); re-grep 0 hits for `embedding|vector|fact_text` in `causal-edges.ts`
- [ ] T002 Reserve and document the default-off flags in the registry plan: `SPECKIT_SEMANTIC_EDGE_LAYER` (substrate) + `SPECKIT_EDGE_VECTOR_INDEX`, `SPECKIT_EDGE_TRIPLET_SEARCH`, `SPECKIT_EDGE_SEMANTIC_DEDUP`, `SPECKIT_EDGE_SEMANTIC_INVALIDATION` (`mcp_server/lib/search/search-flags.ts`)
- [ ] T003 [P] Capture the flag-off baseline goldens for insert, consolidation, fused recall, and same-pair contradiction detection (for the later byte-identical isolation test)
- [ ] T004 [P] Acknowledge the shared-infra dependency: the recall/dedup benchmark (Phase 5) is deferred until the gate-zero corpus reindex (`../001-corpus-reindex-gate-zero`) lands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Substrate (Phase 1 of plan — gate-zero)
- [ ] T005 Additive schema migration: nullable `fact_text` column on `causal_edges` + a dedicated edge-vector collection mirroring `ports/vector-store.ts` (`mcp_server/lib/storage/causal-edges.ts` + migration)
- [ ] T006 Create `edge-vector-store.ts`: store an edge's relationship/fact embedding + nearest-edge lookup by vector (`mcp_server/lib/storage/edge-vector-store.ts`)
- [ ] T007 Wire `insertEdge` to write the passive `fact_text` column; the exact-key upsert (`causal-edges.ts:350-352`) and the synchronous txn are otherwise UNCHANGED (no embedding call in the sync path)

### Consolidation-time embedder (Phase 2 of plan)
- [ ] T008 Add the default-off `SPECKIT_SEMANTIC_EDGE_LAYER` flag (`mcp_server/lib/search/search-flags.ts`)
- [ ] T009 In `runConsolidationCycle` (`consolidation.ts:499`), add a flag-gated pass that embeds each edge's `fact_text` → edge-vector collection; skip null fact text; degrade gracefully if the embed provider is unavailable (no exception to the sync paths)

### Retrieval primitives (Phase 3 of plan — shadow side-channel)
- [ ] T010 Create `edge-semantic-retrieval.ts`: nearest-edge semantic lookup over the collection (`SPECKIT_EDGE_VECTOR_INDEX`, shadow) (`mcp_server/lib/graph/edge-semantic-retrieval.ts`)
- [ ] T011 Add the edge-aware-triplet scorer (node + edge + node distances, Cognee `brute_force_triplet_search.py:263-287` shape) behind `SPECKIT_EDGE_TRIPLET_SEARCH`; NOT wired into live fused recall

### Intelligence consumers (Phase 4 of plan — shadow-only)
- [ ] T012 Semantic dedup/merge: exact-key fast-path → semantic-retrieval candidates → LLM `resolve_edge`-style adjudication (Graphiti `edge_operations.py:684-749`) → reuse existing edge identity vs insert near-dup; NEVER merge on adjudication uncertainty; `SPECKIT_EDGE_SEMANTIC_DEDUP` shadow
- [ ] T013 Cross-pair semantic invalidation: gather invalidation candidates by edge similarity across *different* node pairs (Graphiti `EDGE_HYBRID_SEARCH_RRF`, `edge_operations.py:407-418`); same-pair `contradiction-detection.ts:85-93` behavior preserved when the flag is off; `SPECKIT_EDGE_SEMANTIC_INVALIDATION` shadow; never auto-close a live edge while shadow-only
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Migration back-compat test: with the layer flag off, old edge reads + `insertEdge` are byte-identical to baseline; pre-migration edges read as un-embedded
- [ ] T015 Isolation test: with ALL flags off, insert / consolidation / fused recall / same-pair contradiction output is byte-identical to the T003 goldens and no embedding/LLM-merge code executes
- [ ] T016 Confirm the synchronous insert path is untouched: `git diff` shows zero embedding/vector calls inside the `insertEdge` txn; the deterministic core (`hybrid-search.ts`, Stage-2 fusion) is unmodified
- [ ] T017 Consolidation embedder test: flag-on populates edge vectors off-turn, skips null fact text, and degrades on provider-down without failing the cycle
- [ ] T018 [B] Build and run the post-reindex benchmark: edge-aware-triplet recall lift, dedup precision/recall, and false-merge rate; record numbers + the per-sub-candidate promote/keep-shadow/drop decision (BLOCKED on `../001-corpus-reindex-gate-zero`) (`mcp_server/__tests__/`)
- [ ] T019 node --check + tsc + existing suite green; `validate.sh --strict` passes on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T018 unblocks once the gate-zero reindex lands)
- [ ] Substrate landed root-first; migration back-compat proven; flag-off isolation proven; synchronous insert path untouched; consolidation-time embedding only; false-merge benchmark + recall lift recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Shared-infra dependency**: `../001-corpus-reindex-gate-zero` (gate-zero reindex — precondition for T018 benchmark)
- **Shipped record (Wave-0)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (all five edge candidates absent → PENDING)
<!-- /ANCHOR:cross-refs -->
