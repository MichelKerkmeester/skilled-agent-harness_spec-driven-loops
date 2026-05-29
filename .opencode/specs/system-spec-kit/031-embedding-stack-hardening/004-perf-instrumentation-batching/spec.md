---
title: "Feature Specification: Perf instrumentation + batching (measure-first)"
description: "Instrument the embed path first (per-request inference ms + rolling p50/p95 + queue depth), then land real /api/embed batching, a ready-once latch, and cache-into-reindex — every win gated on measured before/after evidence."
trigger_phrases:
  - "embed path instrumentation p50 p95"
  - "real /api/embed batching"
  - "ready-once latch cache-into-reindex"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/004-perf-instrumentation-batching"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 child spec for perf instrumentation + batching (measure-first)"
    next_safe_action: "Implement phase 004"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
      - ".opencode/bin/hf-model-server.cjs"
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003141"
      session_id: "031-004-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Predecessor: 003-observability-model-switch; instrumentation builds on the phase-002 health fields."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Perf instrumentation + batching (measure-first)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Spec ready (implementation pending) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-observability-model-switch |
| **Successor** | 005-live-validation-bench-hardening |
| **Handoff Criteria** | The embed path is instrumented first; batching, the ready-once latch, and cache-into-reindex each land only on measured p50/p95 + hit-rate evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4 of 5** of the embedding-stack hardening decomposition: turn the perf items from guesses into measured wins. Instrumentation comes FIRST — it is the gate that turns the next three changes from speculation into evidence.

**Scope Boundary**: Instrument the embed path (per-request ms + rolling p50/p95 + queue depth, folding into the phase-002 health fields), then land real `/api/embed` batching, a ready-once latch, and cache-into-reindex — each gated on measured before/after. Does NOT include the live two-launcher test, bench, or flag flip (phase 005).

**Dependencies**:
- Parent packet: `../spec.md`.
- Predecessor: 003-observability-model-switch; the instrumentation rollups extend the phase-002 inference-liveness health fields.

**Deliverables**:
- Server-side per-request inference ms + rolling p50/p95 + queue depth (folds into the phase-002 health fields). MUST land first.
- Real batching on `/api/embed`: pass the whole array; one batched extractor call; sweep `EMBEDDER_REINDEX_BATCH_SIZE` empirically.
- Ready-once latch: stop running `waitForReady` on every embed; re-validate lazily on error / after a TTL.
- Cache-into-reindex: wire `lookupEmbedding`/`storeEmbedding` into `reindex.ts:418-439`, gated on measured `getCacheStats()` hit-rate.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The perf items are guesses without instrumentation. A 50-row reindex issues 50 sequential POSTs (`hf-local.ts:672-675`, `hf-model-server.cjs:522-525`, `execution-router.ts:179-188`) instead of one batched call. `waitForReady` runs on every embed (`hf-local.ts:670`) instead of latching once. And the cache is wired into the query path (`vector-index-queries.ts:656`) but not into reindex (`reindex.ts:418-439`), so reindex re-embeds rows the cache already holds. Without per-request timing + p50/p95 + queue depth, none of these can be landed on evidence.

### Purpose
Instrument the embed path first, then land batching, the ready-once latch, and cache-into-reindex — each only after measured before/after proves it wins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Server-side per-request inference ms + rolling p50/p95 + queue depth (folds into the phase-002 health fields). Lands first.
- Real `/api/embed` batching: pass the whole array; one batched extractor call; empirical `EMBEDDER_REINDEX_BATCH_SIZE` sweep.
- Ready-once latch: re-validate lazily on error / after a TTL instead of on every embed.
- Cache-into-reindex: wire `lookupEmbedding`/`storeEmbedding` into `reindex.ts:418-439`, gated on measured `getCacheStats()` hit-rate.

### Out of Scope
- Live two-launcher integration test or the advisor flag flip (phase 005).
- q8-vs-fp16 / MPS bench (phase 005).
- Idle-eviction, perimeter hardening, or deprecated-env removal (phase 005).
- Any perf change landed without measured before/after evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/hf-model-server.cjs` | Modify | Per-request inference ms + rolling p50/p95 + queue depth (extends phase-002 health fields); batched extractor call on `/api/embed` |
| `shared/embeddings/providers/hf-local.ts` | Modify | Pass the whole array to `/api/embed`; ready-once latch with lazy re-validate on error/TTL |
| `mcp_server/lib/embedders/execution-router.ts` | Modify | Route batched embed arrays instead of one POST per row |
| `mcp_server/lib/embedders/reindex.ts` | Modify | Wire `lookupEmbedding`/`storeEmbedding` into reindex (`418-439`), gated on measured hit-rate |
| `mcp_server/lib/cache/embedding-cache.ts` | Modify | Reuse `getCacheStats()` for the hit-rate gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The embed path must be instrumented FIRST | Per-request inference ms + rolling p50/p95 + queue depth are captured and surfaced (folding into the phase-002 health fields) before any other perf change lands |
| REQ-002 | Batching must be real, not per-row | A multi-row reindex passes the whole array to `/api/embed` and the server makes one batched extractor call, with `EMBEDDER_REINDEX_BATCH_SIZE` swept empirically |
| REQ-003 | A ready-once latch must replace per-embed waits | `waitForReady` no longer runs on every embed; readiness is latched and re-validated lazily on error / after a TTL |
| REQ-004 | Cache must be wired into reindex on evidence | `lookupEmbedding`/`storeEmbedding` are wired into `reindex.ts:418-439` and the change is gated on a measured `getCacheStats()` hit-rate |
| REQ-005 | Every perf win must be measure-gated | Each change reports before/after p50/p95 (and hit-rate for cache); no perf claim ships unmeasured |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Batch sizing must account for heterogeneous lengths | The `EMBEDDER_REINDEX_BATCH_SIZE` sweep documents that padding can regress on mixed-length inputs and picks a size on measured throughput |
| REQ-007 | The latch must not serve a dead server | The ready-once latch re-validates on error so a server that died after latching is re-probed rather than trusted indefinitely |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Per-request timing + p50/p95 + queue depth are visible before any perf change lands.
- **SC-002**: A multi-row reindex issues one batched call and shows a measured throughput delta.
- **SC-003**: Embeds no longer pay a per-call `waitForReady`, with readiness re-validated lazily.
- **SC-004**: Reindex reuses cached embeddings with a measured hit-rate, skipping redundant re-embeds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Batching with padding can regress on heterogeneous lengths | High | Sweep `EMBEDDER_REINDEX_BATCH_SIZE` empirically and pick on measured throughput (REQ-006) |
| Risk | A ready-once latch could serve a server that died after latching | Med | Re-validate lazily on error / after a TTL (REQ-007) |
| Risk | This environment may not support a live model download for measurement | High | Deliver runnable bench/measurement scripts + gated code; report measured-vs-script-only honestly |
| Dependency | 002 inference-liveness health fields | High | The instrumentation rollups extend the phase-002 fields |
| Dependency | 029 `getCacheStats()` + query-path cache | High | Reuse the shipped cache accessors and the query-path precedent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What hit-rate threshold justifies wiring the cache into reindex versus leaving reindex cache-free?
- Should the ready-once latch TTL be fixed or derived from observed health-check cadence?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
**Given**
**Given**
**Given**
**Given**
**Given**
-->
