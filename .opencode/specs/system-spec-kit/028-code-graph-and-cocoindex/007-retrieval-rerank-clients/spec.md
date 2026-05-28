---
title: "Phase 010 — Retrieval Rerank Clients (Shared RerankClient + EmbeddingCacheClient Interfaces)"
description: "ADAPT pt-03 RQ-B5 client extraction: extract shared `RerankClient<T>` from memory's cross-encoder.ts so memory backend + coco-index share provider/cache/circuit-breaker semantics. The Coco adapter path depends on Phase 001's complete CocoIndex MCP fork; memory-only interface extraction can be reasoned about independently. Define `EmbeddingCacheClient` interface (memory adapter only — Coco adapter deferred). Cross-backend hit-rate overlap telemetry. SKIP shared indexing pipelines (binding boundary). ~250-420 prod LOC + ~120-220 tests."
trigger_phrases:
  - "027 phase 010"
  - "retrieval rerank clients"
  - "shared RerankClient"
  - "EmbeddingCacheClient"
  - "shared rerank client coco memory"
  - "cross-backend embedding overlap telemetry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-retrieval-rerank-clients"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/010 from pt-03 RQ-B5"
    next_safe_action: "Implement Sub-Phase 1 (interface extraction)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "resource-map.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-09-027-010-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the Coco rerank adapter live in Python (cocoindex_code/rerank_adapter.py) or as a TS bridge that Coco IPC into?"
      - "Should the cross-backend overlap telemetry live in shared client or per-adapter?"
      - "When RQ-A5 fusion lands (post-Phases 001-003), should the fusion stage consume RerankClient or call cross-encoder directly?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retrieval Rerank Clients (Shared Interfaces)

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Pt-03 RQ-B5 (verdict ADAPT clients / DEFER shared store / SKIP shared indexers, see `../research/027-xce-research-pt-03/research.md` §RQ-B5 and `../research/027-xce-research-pt-03/iterations/iteration-010.md`) identifies that memory's `cross-encoder.ts:35-554` is already provider-generic (Voyage, Cohere, local) with caching, caps, circuit breaker, score-origin metadata. CocoIndex has its own embedding usage (Voyage Code 3) but no rerank stage today. Two extractable interfaces:

1. **`RerankClient<T>`** — generic provider-agnostic rerank with candidate adapter pattern. Memory consumes via existing pipeline adapter (`stage3-rerank.ts:410-465`); CocoIndex consumes via candidate adapter mapping `QueryResult` ↔ rerank document.
2. **`EmbeddingCacheClient`** — content-addressed embedding cache interface. Memory adapter ships now; Coco adapter DEFERRED until cross-backend hit-rate overlap telemetry justifies.

**Three explicit boundaries (binding):**
- **NO** shared persistent embedding storage — Voyage Code 3 ≠ Voyage 4 even at same dimension; cross-domain duplicate content rare.
- **SKIP** shared indexing pipelines — CocoIndex owns code chunking + path-class semantics; memory owns MMR + MPAB + tier metadata; these MUST NOT cross.
- **NO** Coco adapter for `EmbeddingCacheClient` in this phase — interface exists for future portability; Coco adopts only if telemetry shows overlap.

**Key Decisions:**
- **Extract, don't duplicate** — eliminates risk of a future second Voyage rerank caller (which `cross-encoder.ts` already centralizes).
- **Memory consumer behavior unchanged** after adapter swap — interface is a refactor seam, not a behavior change.
- **CocoIndex consumer default-off** behind `SPECKIT_COCO_USE_SHARED_RERANK=false` — opt-in, no surprises.
- **Circuit-breaker fallback contract preserved** — extracted client must preserve provider fallback for both memory and Coco consumers.
- **Interface boundary tested** — what shared client knows (modelId, contentHash, dimensions, generic candidate doc shape) vs what it MUST NOT know (memory tiers, code chunks, MMR, MPAB, causal metadata).

**Critical Constraints:**
- Memory rerank behavior MUST be bit-identical post-adapter-swap when flag off (same provider, same caching, same circuit-breaker, same scoring).
- CocoIndex standalone behavior MUST work without code-graph or memory backend.
- Future fusion consumer (RQ-A5, deferred) interface contract must be designed-in (composable).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | **3** (architectural extraction with downstream-consumer impact; abstraction-boundary risk; provider abstraction semantics; designed for future fusion consumer; see `decision-record.md` ADR-001) |
| **Priority** | P1 (foundation for future RQ-A5 fusion + reduces duplicate provider plumbing) |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/027-xce-research-pt-03/research.md` §RQ-B5; `../research/027-xce-research-pt-03/iterations/iteration-010.md` |
| **Depends on** | `027/001-cocoindex-complete-fork` for the Coco adapter path; existing `mcp_server/lib/search/cross-encoder.ts` for memory extraction |
| **LOC budget** | ~250-420 production + ~120-220 tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Memory backend has a mature rerank stage. `mcp_server/lib/search/cross-encoder.ts:35-554` defines:
- Generic document shape (`{id, content, score?}`).
- Provider configs for Voyage, Cohere, local rerankers (lines 73-124).
- Provider detection + selection (line 220-230).
- Result cache keyed by `(provider, query, document fingerprints)` (lines 252-270).
- Max-document caps + tail scoring (lines 287-327).
- Circuit-breaker fallback (lines 411-554).
- Score-origin metadata.

`stage3-rerank.ts:410-465` consumes via narrow adapter: memory rows → `{id, content, score}` → cross-encoder → result remapping back to memory-row shape.

CocoIndex has none of this — it relies on path-class rerank only (`query.py:177-223`, ±0.05 nudges). No cross-encoder, no provider fallback, no caching beyond embedding cache.

**Two missed opportunities:**
1. **Code duplication risk** — if a future packet adds rerank to CocoIndex naively, it'll duplicate provider plumbing (Voyage rerank API caller + caching + circuit breaker).
2. **Cross-backend learnings invisible** — without shared cache interfaces, we can't measure hit-rate overlap that would justify (or refute) a future shared-store decision.

**Purpose:** extract the provider-generic layer once, expose it as `RerankClient<T>` + `EmbeddingCacheClient` interfaces, give CocoIndex an opt-in adapter, and add cross-backend overlap telemetry so future shared-store decisions are data-driven.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (4 sub-phases)

**Sub-Phase 1 — Interface Extraction (~80-130 LOC + tests)**
- New `mcp_server/lib/search/rerank-client.ts` — `RerankClient<T>` generic interface.
- New `mcp_server/lib/cache/embedding-cache-client.ts` — `EmbeddingCacheClient` interface.
- Both interfaces preserve all current `cross-encoder.ts` + `embedding-cache.ts` semantics.
- No behavioral changes — pure refactor seam.

**Sub-Phase 2 — Memory Adapter Swap (~40-70 LOC + tests)**
- Refactor `mcp_server/lib/search/pipeline/stage3-rerank.ts:410-465` to consume `RerankClient<T>` via dependency injection.
- Refactor `mcp_server/lib/cache/embedding-cache.ts` to implement `EmbeddingCacheClient` interface.
- Memory provider behavior unchanged — same Voyage/Cohere/local config; same caching; same circuit breaker.

**Sub-Phase 3 — Coco Rerank Adapter (~70-110 LOC + tests)**
- Requires Phase 001 to be complete before modifying the local `mcp-coco-index` package.
- Decision pending (open question): Python adapter vs TS bridge.
  - **Python option:** New `mcp-coco-index/mcp_server/cocoindex_code/rerank_adapter.py` — converts `QueryResult` ↔ rerank document; calls Voyage Rerank API directly via existing CocoIndex provider patterns; reuses provider config from shared interface contract.
  - **TS bridge option:** New TS module that Coco IPC consumes via existing socket protocol.
- Both options preserve `score-origin` + `rankingSignals` through the adapter.
- Default-off behind `SPECKIT_COCO_USE_SHARED_RERANK=false` — opt-in.
- CocoIndex standalone behavior unchanged when flag off.

**Sub-Phase 4 — Telemetry + Tests + Docs (~60-110 LOC)**
- Cross-backend hit-rate overlap telemetry events:
  - `crossBackendEmbCacheCandidate` — same content_hash queried by both backends.
  - `sameContentHashDifferentModel` — same content_hash, different model_id (correctly NOT shareable).
  - `sameModelSameHashHit` — same content_hash + model_id (potentially shareable; data-driven shared-store decision).
- vitest covering interface contract / memory adapter / circuit-breaker fallback / Coco adapter shape.
- Documentation for downstream consumers (RQ-A5 fusion future work).
- ENV_REFERENCE.md update.

### Out of Scope
- Shared persistent embedding storage (DEFERRED per pt-03 RQ-B5 verdict; needs telemetry to justify).
- Shared indexing pipelines (SKIP per ADR-004 binding).
- Coco adapter for `EmbeddingCacheClient` (DEFERRED — interface ships, adapter doesn't).
- New rerank providers (existing Voyage/Cohere/local set unchanged).
- Active fusion (RQ-A5 territory; hard-blocked on Phases 001-003 ship).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Extract `RerankClient<T>` generic interface from `cross-encoder.ts:35-554` | Interface defined in new module; original cross-encoder semantics preserved |
| REQ-002 | Memory consumes via existing pipeline adapter (`stage3-rerank.ts:410-465`); minimal swap, behavior unchanged | Diff test: memory rerank output bit-identical pre/post adapter swap |
| REQ-003 | CocoIndex candidate adapter (`QueryResult` ↔ rerank document) preserving `score-origin` + `rankingSignals` | Adapter test: round-trip preserves all telemetry fields |
| REQ-004 | Score-origin metadata preserved through adapter (`provider`, `cacheHit`, `circuitBreakerActive`, `tailScored`) | Snapshot test on adapter output envelope |
| REQ-005 | Define `EmbeddingCacheClient` interface (memory adapter only) | Interface defined; `embedding-cache.ts` implements |
| REQ-006 | Cross-backend hit-rate overlap telemetry — log `crossBackendEmbCacheCandidate`, `sameContentHashDifferentModel`, `sameModelSameHashHit` events | Telemetry events in eval logger; populated when both backends queried |
| REQ-007 | Feature flag default-off for CocoIndex consumer (`SPECKIT_COCO_USE_SHARED_RERANK=false`); memory consumer behavior unchanged | Diff test: flag-off Coco behavior bit-identical to today |
| REQ-008 | NO sharing of indexing pipelines (binding SKIP boundary) — shared client surface MUST NOT know about: code chunks, AST/language labels, memory tiers, frontmatter anchors, causal graph metadata, MPAB parent rows, MMR over `vec_memories` | Code review + grep absence of these terms in shared interface modules |
| REQ-009 | NO Coco adapter for `EmbeddingCacheClient` in this phase — DEFERRED to future packet pending overlap telemetry from REQ-006 | Code review: no Python `EmbeddingCacheClient` adapter file |
| REQ-010 | Circuit-breaker behavior preserved — when provider fails, fallback to score-only ordering with `provider: 'fallback-score-only'` signal | Mock-failure test: fallback path triggers; signal present |

### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Existing memory rerank tests (cross-encoder + stage3) pass unchanged after extraction | Existing suite green |
| REQ-012 | Coco standalone behavior preserved when flag off | Coco existing tests + smoke test green |
| REQ-013 | Interface contract tests verify abstraction boundary | Test set: rejects calls that pass memory-tier or code-chunk fields |
| REQ-014 | Documentation for future RQ-A5 fusion consumer (interface composability) | New section in `mcp_server/lib/search/README.md` (or rerank-client.ts header) |

### P2
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | ENV_REFERENCE.md documents `SPECKIT_COCO_USE_SHARED_RERANK` flag | grep verification |
| REQ-016 | Telemetry overhead < 50B per cache event | Snapshot test on event size |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:edge-cases -->
## 5. EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| Memory rerank called BEFORE Coco rerank in same session | Memory adapter handles; Coco adapter unaffected |
| Coco rerank called with flag off | No adapter invocation; existing path-class rerank only |
| Provider failure during memory rerank | Circuit breaker triggers; fallback to score-only ordering; `provider: 'fallback-score-only'` signal |
| Provider failure during Coco rerank (when enabled) | Same fallback contract — Coco results returned with score-only ordering |
| Shared `RerankClient` instantiated with config that violates abstraction (e.g. memory-tier field) | Interface contract test: rejects with explicit error |
| `EmbeddingCacheClient` lookup with `model_id` not in cache | Cache miss; existing miss-and-store path runs |
| Cross-backend overlap event for `sameModelSameHashHit` | Telemetry logged; data-driven shared-store decision deferred to follow-on |
| Concurrent rerank calls from memory + Coco | Independent client instances; no shared mutable state |
| Future fusion consumer (RQ-A5, post-Phases 001-003) wants to compose RerankClient with graph-feature provider | Interface designed for composition (T or `T = MultiScored<MemoryRow \| QueryResult>` shape supports it) |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success -->
## 6. SUCCESS CRITERIA

- Phase 010 strict-validates.
- Memory rerank behavior bit-identical pre/post extraction (REQ-002 diff test).
- Coco standalone behavior bit-identical when flag off (REQ-012 diff test).
- Interface contract tests reject abstraction-boundary violations (REQ-013).
- All 16 REQ-NNN have green checklist entries.
- Cross-backend telemetry surfaces in eval logger.
- Future fusion consumer (RQ-A5) can adopt `RerankClient<T>` interface without modification.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

See `decision-record.md` ADR-002..ADR-006 + `plan.md` Risk Matrix.

| Risk | Severity | Mitigation |
|------|----------|------------|
| Abstraction boundary leak (shared client knows too much about memory or Coco internals) | **P0** | SKIP boundary in REQ-008 + ADR-004 + dedicated interface contract tests |
| Regression in existing memory rerank behavior post-swap | P1 | stage3-rerank tests cover pre/post adapter parity (REQ-002 diff test) |
| Future fusion consumer (RQ-A5) interface mismatch | P2 | Client interface designed with multi-consumer composability (ADR-006) |
| CocoIndex ships shared-rerank by default, breaking standalone | P1 | Default-off flag (REQ-007); Coco existing tests as regression sentinel |
| Cross-backend telemetry overhead | P2 | Event size budget (REQ-016 < 50B/event) |
<!-- /ANCHOR:risks -->

---

<!-- L3 STRUCTURAL APPENDIX: required template anchors + headers per system-spec-kit
     L3 contract. Substantive content for these topics lives in the numbered sections above
     where natural; the named-anchor stubs below satisfy the validator's anchor + header contract. -->

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA (alias)

Substantive success criteria are in section 6 above. This anchor exists for L3 template compliance.
<!-- /ANCHOR:success-criteria -->

## RISKS & DEPENDENCIES

See section 7 above ("Risks") for the per-phase risk register and `plan.md` for the full Risk Matrix with severity/likelihood/mitigation/verification columns.

<!-- ANCHOR:questions -->
## NON-FUNCTIONAL REQUIREMENTS

Latency budget, cost bounds, telemetry overhead, and rollback ergonomics are detailed in `plan.md` Risk Matrix + Success Metrics sections and the per-REQ acceptance criteria above.
<!-- /ANCHOR:questions -->


## EDGE CASES

See section 5 above ("Edge Cases") for the comprehensive case-by-case list.

## COMPLEXITY ASSESSMENT

L3 designation rationale is in `decision-record.md` ADR-001. Cross-component change with feature-flag governance, telemetry contract, and Phase-006 eval gate.

## RISK MATRIX

See section 7 above + `plan.md` Risk Matrix for the full register with severity, likelihood, mitigation, and verification columns.

## USER STORIES

- **US-001**: As an operator, I can enable the feature via the designated env flag (default off).
- **US-002**: As a developer, I can observe feature decisions via telemetry signals (rankingSignals or eval logger events).
- **US-003**: As a Phase-006 evaluator, I can compare baseline (flag-off) vs treatment (flag-on) on the labeled task set with paired comparison metrics.

## OPEN QUESTIONS

See `_memory.continuity.open_questions` block in this file's frontmatter.

## RELATED DOCUMENTS

- `../research/027-xce-research-pt-03/research.md` (pt-03 verdict matrix and adoption recommendations)
- `decision-record.md` (ADRs for this phase)
- `plan.md` (sub-phases, risk matrix, success metrics)
- `tasks.md` (T### task list)
- `checklist.md` (CHK-### verification items)
- `resource-map.md` (file inventory)
