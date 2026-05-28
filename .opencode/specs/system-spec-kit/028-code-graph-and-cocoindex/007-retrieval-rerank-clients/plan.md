---
title: "Plan — Phase 010 Retrieval Rerank Clients"
description: "Technical plan: 4 sub-phases covering interface extraction, memory adapter swap, Coco rerank adapter, telemetry + tests + docs."
trigger_phrases:
  - "027 phase 010 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-retrieval-rerank-clients"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Begin Sub-Phase 1 (interface extraction)"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->
# Plan: Retrieval Rerank Clients (Shared Interfaces)

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Extract memory's mature `cross-encoder.ts` provider-generic layer into shared `RerankClient<T>` + `EmbeddingCacheClient` interfaces. Memory consumer behavior unchanged after refactor; CocoIndex consumer opt-in via flag. NO shared persistent storage. NO shared indexing. ~250-420 production LOC + ~120-220 tests.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- Strict spec validation passes (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0).
- All P0 checklist items green.
- All ADR commitments upheld with file:line evidence in `implementation-summary.md`.
- Phase-006 eval gate documented (when applicable for active-mode promotion).
<!-- /ANCHOR:quality-gates -->

---


<!-- ANCHOR:technical-context -->
## TECHNICAL CONTEXT

### Current state (verified file:line)
- `mcp_server/lib/search/cross-encoder.ts:35-60` — Generic document shape + provider configs.
- `mcp_server/lib/search/cross-encoder.ts:73-124` — Voyage / Cohere / local provider config + detection.
- `mcp_server/lib/search/cross-encoder.ts:220-230` — Provider selection by env vars.
- `mcp_server/lib/search/cross-encoder.ts:252-270` — Result cache keyed by `(provider, query, document fingerprints)`.
- `mcp_server/lib/search/cross-encoder.ts:287-327` — Max-document caps + tail scoring.
- `mcp_server/lib/search/cross-encoder.ts:411-554` — Circuit-breaker fallback.
- `mcp_server/lib/search/pipeline/stage3-rerank.ts:410-465` — Memory consumer adapter (memory rows → cross-encoder docs → memory rows).
- `mcp_server/lib/cache/embedding-cache.ts:45-215` — Persistent cache keyed by `(content_hash, model_id, dimensions)`; LRU + age eviction; 10000-row cap.
- `mcp-coco-index/mcp_server/cocoindex_code/query.py:267-323` — Coco query path (no cross-encoder usage today).
- `mcp-coco-index/mcp_server/cocoindex_code/query.py:177-223` — Coco `_ranked_result()` (path-class rerank only).
- `mcp-coco-index/mcp_server/cocoindex_code/shared.py:46-76` — Embedder configuration.

### Adjacent precedents
- Memory's existing rerank cache + circuit breaker is the canonical pattern; we're not inventing semantics, just repackaging.
- Phase 009 Sub-Phase 3 (Consumer A) is independently using a Python feedback reducer; if Coco rerank adapter goes Python-side, similar patterns apply.

### XCE source
- `external/README.md:240-245` — Public mention of architecture context + relationships; no rerank-client transfer.
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

```
                    ┌─────────────────────────────────────┐
                    │  RerankClient<T> (NEW interface)    │
                    │  - rerank(input)                    │
                    │  - circuit-breaker + cache + caps   │
                    │  - provider-agnostic                │
                    └─────────────────────────────────────┘
                           │                       │
              ┌────────────┴───────┐  ┌────────────┴──────────────┐
              ▼                    │  ▼                            │
┌─────────────────────────┐        │  ┌──────────────────────────┐
│ Memory consumer         │        │  │ CocoIndex consumer        │
│ stage3-rerank.ts        │        │  │ rerank_adapter.py (NEW)   │
│ (refactor only)         │        │  │ Default-off behind flag   │
│                         │        │  │ SPECKIT_COCO_USE_SHARED_  │
│ memory rows ─→ docs     │        │  │ RERANK                    │
│   ↓ RerankClient.rerank │        │  │                           │
│ docs ─→ memory rows     │        │  │ QueryResult ─→ docs       │
│ scored                  │        │  │   ↓ RerankClient.rerank  │
│                         │        │  │ docs ─→ QueryResult       │
└─────────────────────────┘        │  └──────────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │  EmbeddingCacheClient (NEW)         │
                    │  - lookup / store / stats           │
                    │  Memory adapter ONLY (Coco DEFERRED)│
                    └─────────────────────────────────────┘

Telemetry (REQ-006):
- crossBackendEmbCacheCandidate
- sameContentHashDifferentModel
- sameModelSameHashHit
```

What's NOT shared (binding boundaries — REQ-008):
- Code chunking (Coco indexer.py)
- Memory pipeline stages (Stage 1/2/3/4)
- MMR over vec_memories
- MPAB parent reassembly
- Tier metadata
- Causal graph edges
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Sub-Phase 1 — Interface Extraction (~80-130 LOC + tests)

**Files (created):**
- `mcp_server/lib/search/rerank-client.ts` — `RerankClient<T>` generic interface.
- `mcp_server/lib/cache/embedding-cache-client.ts` — `EmbeddingCacheClient` interface.
- `mcp_server/__tests__/search/rerank-client-contract.vitest.ts` — Interface contract tests.

**Approach:**
- Define `RerankClient<T>` interface:
  ```typescript
  interface RerankClient<T> {
    rerank(input: {
      query: string;
      candidates: T[];
      toDocument(candidate: T): { id: string|number; content: string; score?: number };
      limit: number;
      scope?: { tenantId?: string; userId?: string; agentId?: string };
    }): Promise<{
      results: T[];
      applied: boolean;
      provider: string;
      signals: unknown;
    }>;
  }
  ```
- Define `EmbeddingCacheClient` interface:
  ```typescript
  interface EmbeddingCacheClient {
    lookup(input: { modelId: string; contentHash: string; dimensions: number }): Promise<Buffer | null>;
    store(input: { modelId: string; contentHash: string; dimensions: number; embedding: Buffer }): Promise<void>;
    stats(): Promise<{ hits: number; misses: number; hitRate: number }>;
  }
  ```
- Both interfaces preserve all current semantics — no new behavior.
- Contract tests verify abstraction boundary (REQ-013): reject calls that pass memory-tier or code-chunk fields.

**Acceptance:**
- Both interfaces type-check.
- Contract tests pass (rejecting boundary violations).

### Sub-Phase 2 — Memory Adapter Swap (~40-70 LOC + tests)

**Files (modified):**
- `mcp_server/lib/search/cross-encoder.ts` — Implement `RerankClient<T>` interface.
- `mcp_server/lib/cache/embedding-cache.ts` — Implement `EmbeddingCacheClient` interface.
- `mcp_server/lib/search/pipeline/stage3-rerank.ts` — Consume `RerankClient<T>` via dependency injection at lines 410-465.

**Files (created):**
- `mcp_server/__tests__/search/memory-rerank-adapter.vitest.ts` — Adapter swap parity tests.

**Approach:**
- Add `implements RerankClient<MemoryDocument>` to cross-encoder.
- Add `implements EmbeddingCacheClient` to embedding-cache.
- Stage3 dependency injection: take `RerankClient<MemoryRow>` as constructor arg (default = current cross-encoder instance).
- No behavior change — refactor seam only.

**Acceptance:**
- Existing memory rerank tests pass unchanged.
- Diff test: memory rerank output bit-identical pre/post (REQ-002).

### Sub-Phase 3 — Coco Rerank Adapter (~70-110 LOC + tests)

**Files (created — Python option, default):**
- `mcp-coco-index/mcp_server/cocoindex_code/rerank_adapter.py` — Python adapter.
- `mcp-coco-index/tests/test_rerank_adapter.py` — Adapter tests.

**Files (modified):**
- `mcp-coco-index/mcp_server/cocoindex_code/query.py` — Optional rerank stage after `_dedup_and_rank_rows()` when flag enabled.

**Approach (Python option):**
- New adapter consumes IPC interface contract (modelId, content, score).
- Calls Voyage Rerank API directly via existing CocoIndex provider patterns.
- Maps `QueryResult` → rerank document; remaps results back preserving `score-origin` + `rankingSignals`.
- Default-off behind `SPECKIT_COCO_USE_SHARED_RERANK=false`.

**TS bridge alternative (open question):**
- New TS module that Coco IPC consumes via existing socket protocol.
- Preserves single-source-of-truth provider config but adds IPC hop.

**Acceptance:**
- Coco standalone tests pass when flag off (REQ-012).
- When flag on, Coco rerank uses shared client; circuit-breaker fallback verified.
- `score-origin` + `rankingSignals` preserved through adapter (REQ-004).

### Sub-Phase 4 — Telemetry + Tests + Docs (~60-110 LOC)

**Files (created):**
- `mcp_server/__tests__/search/circuit-breaker-fallback.vitest.ts` — Circuit-breaker shared-client behavior.
- `mcp_server/__tests__/search/cross-backend-telemetry.vitest.ts` — Overlap event verification.

**Files (modified):**
- `mcp_server/lib/search/cross-encoder.ts` — Add cross-backend overlap telemetry.
- `mcp_server/lib/cache/embedding-cache.ts` — Same.
- `mcp_server/ENV_REFERENCE.md` — Document `SPECKIT_COCO_USE_SHARED_RERANK`.
- `mcp_server/lib/search/README.md` (or `rerank-client.ts` header) — Documentation for future RQ-A5 fusion consumer.

**Approach:**
- Telemetry events:
  - `crossBackendEmbCacheCandidate` — same `content_hash` queried by both backends.
  - `sameContentHashDifferentModel` — same `content_hash`, different `model_id`.
  - `sameModelSameHashHit` — same `content_hash` + `model_id` (potentially shareable).
- Documentation explains:
  - How RQ-A5 fusion (when shipped) can compose `RerankClient<MultiScored<...>>`.
  - Abstraction boundary (what NOT to add to shared interface).

**Acceptance:**
- Telemetry events fire on appropriate conditions.
- Event size < 50B per event (REQ-016).
- Docs reviewed.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## TESTING STRATEGY

- Unit tests per sub-phase (vitest TypeScript / pytest Python).
- Integration tests for cross-component code paths.
- Diff tests for backward-compat (flag-off output bit-identical to current).
- Phase-006 paired comparison harness for active-mode promotion gating.
- Per-checklist verification commands for repeatable green-field checks.
<!-- /ANCHOR:testing -->

---


---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

### Hard preconditions
- Memory-only extraction: `cross-encoder.ts` exists and is mature.
- Coco adapter work: Phase 001 complete CocoIndex MCP fork must land first, so adapter changes target the owned v0.2.33 wrapper baseline.

### Soft preconditions
- Phase 001 is a hard precondition only for Sub-Phase 3; Sub-Phases 1-2 can still proceed as memory-side interface work if deliberately split.

### Internal sub-phase order
- Sub-Phase 1 (interfaces) → Sub-Phase 2 (memory adapter) → Sub-Phase 3 (Coco adapter) → Sub-Phase 4 (telemetry + docs).

### Downstream consumers
- **RQ-A5 active fusion** (deferred until Phases 001/002/003 ship) — composes `RerankClient<MultiScored<MemoryRow|QueryResult>>` for combined memory+coco+graph ranking.
- Future shared-cache decision — driven by REQ-006 telemetry data.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:risk-matrix -->
## RISK MATRIX

| ID | Risk | Severity | Likelihood | Mitigation | Verification |
|----|------|----------|------------|------------|--------------|
| R-009-01 | Abstraction boundary leak | **P0** | Med | SKIP boundary REQ-008 + ADR-004 + interface contract tests | `rerank-client-contract.vitest.ts` rejects boundary violations |
| R-009-02 | Memory rerank regression post-swap | P1 | Low | Diff test pre/post (REQ-002) | `memory-rerank-adapter.vitest.ts` parity test |
| R-009-03 | Future fusion consumer interface mismatch | P2 | Low | Multi-consumer composability designed in ADR-006 | Documentation + future RQ-A5 phase consumes interface |
| R-009-04 | CocoIndex ships shared-rerank by default | P1 | Low | Default-off flag (REQ-007); Coco existing tests as regression sentinel | Diff test: Coco flag-off output bit-identical |
| R-009-05 | Cross-backend telemetry overhead | P2 | Low | Event size budget (REQ-016) | Snapshot test on event size |
| R-009-06 | Provider failure during shared-client adoption breaks both backends simultaneously | P1 | Low | Circuit-breaker fallback contract preserved (REQ-010) | Mock-failure test |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:success-metrics -->
## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Memory rerank parity | Bit-identical pre/post | Diff test |
| Coco flag-off parity | Bit-identical to current | Diff test |
| Interface contract violations rejected | 100% | Contract test set |
| Circuit-breaker fallback path triggered correctly | 100% | Mock-failure test |
| Cross-backend telemetry events fire | When applicable | Telemetry test |
| Existing rerank test suite | All green | `npx vitest run mcp_server/__tests__/search/` |
| Coco existing tests | All green when flag off | `pytest mcp-coco-index/tests/` |
<!-- /ANCHOR:success-metrics -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

If extraction causes regression:
- Revert Sub-Phase 2 changes (memory adapter swap) — cross-encoder behavior unchanged at source.
- `RerankClient<T>` interface module persists but unused.

If Coco shared-rerank causes precision regression:
- Set `SPECKIT_COCO_USE_SHARED_RERANK=false` → reverts to today's path-class rerank only.

Telemetry is observation-only; no rollback risk.
<!-- /ANCHOR:rollback -->

---

<!-- L3 STRUCTURAL APPENDIX -->



<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

See "DEPENDENCIES" section above (hard preconditions, soft preconditions, internal sub-phase order, downstream consumers).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

LOC budget in `spec.md` Section 1 Metadata. Per-sub-phase LOC estimates in "SUB-PHASES" section above. Wall-time estimates in `tasks.md` "TOTAL EFFORT" section.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

See "ROLLBACK PLAN" section above. All flags reversible per-phase; no schema rollback needed for forward-only migrations. Each consumer / sub-phase has its own flag for fine-grained rollback.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

See sub-phase task dependency diagrams in `tasks.md` "TASK DEPENDENCIES" section.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

See sub-phase ordering in `tasks.md` task dependency diagrams. Hard-blocking dependencies (e.g. Sub-Phase 1 → Sub-Phase 4 in Phase 009) are explicit in the dep diagram.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

- **M1**: Sub-Phase 1 complete (foundational schema/precondition/extraction).
- **M2..MN**: Each subsequent sub-phase complete per `tasks.md` group.
- **MFinal**: All checklist items green; implementation-summary filled; Phase-006 eval gate ready (when applicable).
<!-- /ANCHOR:milestones -->
