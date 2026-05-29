---
title: "Implementation Plan: Perf instrumentation + batching (measure-first)"
description: "Instrument the embed path first (per-request inference ms + rolling p50/p95 + queue depth), then land real /api/embed batching, a ready-once latch, and cache-into-reindex — every win gated on measured before/after evidence."
trigger_phrases:
  - "perf instrumentation batching plan"
  - "embed path measure-first implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/004-perf-instrumentation-batching"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 plan for perf instrumentation + batching (measure-first)"
    next_safe_action: "Implement phase 004"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - "mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003142"
      session_id: "031-004-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Perf instrumentation + batching (measure-first)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS model server + TypeScript shared/mcp-server embedders |
| **Framework** | system-spec-kit hf-model-server `/api/embed` + execution-router + reindex + embedding-cache |
| **Storage** | Embedding cache + `vec_metadata` |
| **Testing** | vitest + a runnable bench capturing p50/p95 + cache hit-rate before/after |

### Overview
Measure first: land per-request timing + p50/p95 + queue depth, then batching, the ready-once latch, and cache-into-reindex — each only after measured before/after proves the win. Instrumentation is the gate, not an afterthought.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (Predecessor: 003-observability-model-switch)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Focused tests and static checks for this phase pass
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Instrument-then-optimize: capture the metrics that turn guesses into evidence first, then apply each optimization (batching, latch, cache) behind a measured before/after gate.

### Key Components
- Per-request inference ms + rolling p50/p95 + queue depth in `hf-model-server.cjs` (folds into the phase-002 health fields).
- Real batching: whole-array `/api/embed` (`hf-local.ts:672-675`, `hf-model-server.cjs:522-525`, `execution-router.ts:179-188`); one batched extractor call; `EMBEDDER_REINDEX_BATCH_SIZE` sweep.
- Ready-once latch: replace the per-embed `waitForReady` (`hf-local.ts:670`) with a latch re-validated on error / after a TTL.
- Cache-into-reindex: wire `lookupEmbedding`/`storeEmbedding` into `reindex.ts:418-439`; gate on `getCacheStats()` (`embedding-cache.ts:541-549`).

### Data Flow
reindex collects a batch -> execution-router sends the whole array to `/api/embed` -> server runs one batched extractor call and records per-request ms + p50/p95 + queue depth -> client latches readiness and re-validates lazily -> reindex consults the cache before embedding and stores results, gated on a measured hit-rate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/hf-model-server.cjs` | Phase surface | Per-request timing + p50/p95 + queue depth; batched extractor call | bench + vitest |
| `shared/embeddings/providers/hf-local.ts` | Phase surface | Whole-array `/api/embed`; ready-once latch | vitest |
| `mcp_server/lib/embedders/execution-router.ts` | Phase surface | Route batched arrays | vitest |
| `mcp_server/lib/embedders/reindex.ts` | Phase surface | Cache-into-reindex, hit-rate-gated | bench + vitest |
| `mcp_server/lib/cache/embedding-cache.ts` | Phase surface | Reuse `getCacheStats()` for the gate | static check |

Inventory: use targeted `rg` for `/api/embed`, `waitForReady`, `EMBEDDER_REINDEX_BATCH_SIZE`, `lookupEmbedding`, `storeEmbedding`, and `getCacheStats` before editing. Invariant: no perf claim ships unmeasured.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (003-observability-model-switch)
- [ ] Land instrumentation FIRST: per-request ms + p50/p95 + queue depth; capture a baseline [REQ-001]

### Phase 2: Core Implementation
- [ ] Add real `/api/embed` batching; sweep `EMBEDDER_REINDEX_BATCH_SIZE` empirically [REQ-002, REQ-006]
- [ ] Add the ready-once latch with lazy re-validate on error / after a TTL [REQ-003, REQ-007]
- [ ] Wire cache-into-reindex, gated on a measured `getCacheStats()` hit-rate [REQ-004]

### Phase 3: Verification
- [ ] Capture before/after p50/p95 + cache hit-rate for every change [REQ-005]
- [ ] Document the batch-size sweep result and the measured throughput delta
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | batch routing, latch re-validate-on-error, cache lookup/store wiring | vitest |
| Bench | before/after p50/p95 + cache hit-rate + batch-size sweep on a live reindex | runnable bench script |
| Static | imports, removed per-row POST grep, and TypeScript safety | rg + tsc |
| Manual | live reindex measurement if not fully headless-reproducible | local launcher + bench |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-observability-model-switch | Internal | Pending | Instrumentation rollups extend the surfaced health/status fields |
| 002 inference-liveness health fields | Internal | Pending | p50/p95 + queue depth fold into the phase-002 health payload |
| Live model download for measurement | External | Yellow | If unavailable, ship runnable bench scripts + gated code and report measured-vs-script-only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A perf change regresses latency or correctness, or a measured before/after fails to show a win.
- **Procedure**: Revert the unmeasured/regressing change only, preserving instrumentation and earlier phases; each optimization is an independent edit gated behind its own measurement.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
