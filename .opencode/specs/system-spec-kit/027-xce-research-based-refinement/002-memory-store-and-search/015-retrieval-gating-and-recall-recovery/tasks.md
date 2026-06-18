---
title: "Tasks: Retrieval Gating and Recall Recovery [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval gating tasks"
  - "absolute relevance calibration"
  - "rerank provider"
  - "archived opt-in"
  - "tasks core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/015-retrieval-gating-and-recall-recovery"
    last_updated_at: "2026-06-16T18:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped query-time cold-tier inclusion; rerank dropped per directive"
    next_safe_action: "Land vector-lane cold inclusion with the deferred index rebuild"
    blockers: []
    key_files:
      - "mcp_server/lib/search/pipeline/types.ts"
      - "mcp_server/tests/absolute-relevance-calibration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "tasks-015-retrieval-gating-and-recall-recovery"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Tasks: Retrieval Gating and Recall Recovery

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Capture the gate-vs-reality baseline: confirm an on-topic query returns the correct specs yet reads `requestQuality: weak`
- [x] T002 Add the `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` feature flag, default ON graduated (`mcp_server/lib/search/search-flags.ts`)
- [x] T003 [P] Confirm `resolveEffectiveScore` ordering is the surface to leave untouched (`mcp_server/lib/search/pipeline/types.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `resolveAbsoluteRelevance()` preferring cosine over RRF magnitude, lexical fallback to effective score (`mcp_server/lib/search/pipeline/types.ts`)
- [x] T005 Wire absolute relevance into the confidence `scorePrior` and `assessRequestQuality` topScore; keep margins on the ordering score (`mcp_server/lib/search/confidence-scoring.ts`)
- [x] T006 Update the evidence digest "avg score" and per-result "why" to read absolute relevance (`mcp_server/lib/response/profile-formatters.ts`)
- [x] T007 Make `/memory:search` rendering truncation-resilient (render from `progressiveDisclosure` on `meta.tokenBudgetTruncated`) and de-duplicate constitutional rows (`.opencode/commands/memory/assets/search_presentation.txt`)
- [x] T008 Include cold/deprecated tiers by default in the query-time channels via `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` (default ON): lexical FTS/BM25 (`mcp_server/lib/search/sqlite-fts.ts`) and in-memory BM25 + trigger (`mcp_server/lib/search/hybrid-search.ts`). FSRS retrievability ranks cold rows lower; constitutional stays on its injected path
- [x] T009 Vector-lane cold inclusion (option A) IMPLEMENTED behind opt-in `SPECKIT_INCLUDE_ARCHIVED_VECTOR` (default OFF): `backfillColdOrphanProjection()` in `mcp_server/lib/storage/lineage-state.ts` admits archived/cold rows whose logical key has no active winner into `active_memory_projection` (uses `buildLogicalKey`, idempotent, preserves the UNIQUE invariant); the vector query filter (`vector-index-queries.ts:424`) is relaxed under the flag; wired best-effort into daemon boot (`context-server.ts`). Unit-tested (`cold-orphan-projection-backfill.vitest.ts`, 6 tests). No re-embed (2,676 rows already embedded)
- [x] T009b Vector-lane graduated to default-ON (operator directive); validated on a real-DB copy (admits only 2 cold-orphans — the embedded deprecated rows are overwhelmingly superseded dedup-losers, correctly skipped; 0 dup keys/ids, UNIQUE invariant intact). Daemon restarted from rebuilt dist; boot backfill ran. NOTE: the archived content the operator wanted (z_archive 022/023) is mostly ACTIVE-tier (949 rows already in the projection / vector-reachable), so option A is safe but near-inert — the real fix was the calibration
- Reranker: REJECTED per operator directive (see ADR-003) — not a task; `stage3-rerank.ts` stays as-is
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Add `absolute-relevance-calibration.vitest.ts` (6 tests, all pass) covering cosine-over-RRF, lexical fallback, and the `=false` revert path (`mcp_server/tests/absolute-relevance-calibration.vitest.ts`)
- [x] T011 Update `hybrid-search.vitest.ts` BM25 deprecated tests to the new contract (included by default; excluded when `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false`); full hybrid suite green (104 tests)
- [x] T012 Run `npm run typecheck` (clean) and rebuild dist
- [x] T013 Live re-verified on the rebuilt daemon: front-door `memory_search` → `requestQuality:"good"`, `citationPolicy:"cite_results"`, top hit confidence 0.81 "high" (was weak/do_not_cite, conf ~0.31); cli-opencode fresh session → results=5, top score 0.89, hybrid-RAG specs ranked
- [x] T014a Reindex (cheap part): `memory_embedding_reconcile --mode apply` flipped 2,721 vector-present mislabeled rows to success → failedVectors 2,745 → 24
- [x] T014b Residual reindex done: `memory_embedding_reconcile --json '{"mode":"apply","repairSuccessCoverage":true}'` reset the 503 success-missing-vector rows to retry (`successMissingActiveVector` 503 → 0); the embedder retry queue is re-embedding them in the background (queue 502 → draining steadily, ollama healthy). `code_graph_scan` rebuilt the structural graph (679 files, `trustState:live`; was empty/unavailable at session start)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Tier B calibration tasks (T004-T006) marked `[x]`
- [x] Tier B cold-tier inclusion in query-time channels (T008) marked `[x]`
- [x] Tier C presentation task (T007) marked `[x]`
- [x] New and existing confidence/recovery/hybrid tests green; typecheck clean
- [ ] Staged tasks (T009 vector-lane, T013 live re-run, T014 reindex) remain `[B]` with explicit acceptance and are NOT claimed done
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- Simple task tracking with implemented vs staged status
- 3 phases: Setup, Implementation, Verification
-->
