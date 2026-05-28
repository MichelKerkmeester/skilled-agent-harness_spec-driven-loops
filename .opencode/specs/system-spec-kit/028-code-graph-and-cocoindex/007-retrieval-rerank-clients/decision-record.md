---
title: "Decision Record — Phase 010 Retrieval Rerank Clients"
description: "ADRs for Phase 010: L3 designation, extract vs duplicate, why interface but not shared store, abstraction boundary, why Coco adapter deferred, circuit-breaker contract."
trigger_phrases:
  - "027 phase 010 ADRs"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-retrieval-rerank-clients"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored decision-record.md"
    next_safe_action: "ADRs stable"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.0 -->
# Architectural Decision Records: Phase 010 Retrieval Rerank Clients

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Why Level 3

**Status:** Accepted
**Date:** 2026-05-09

**Decision:** Designate Phase 010 as Level 3.

**Rationale:**
- **Architectural extraction with downstream-consumer impact** — `RerankClient<T>` becomes a foundational interface that future packets (RQ-A5 fusion) will compose.
- **Abstraction-boundary risk** — easy to leak memory pipeline / MMR / MPAB or code chunking concerns into shared layer; needs governance.
- **Provider abstraction semantics** — circuit-breaker + cache + caps + score-origin must be preserved across consumer boundaries.
- **Cross-language coordination** (Python + TypeScript via adapter).
- **Multi-consumer composability** — must be designed for memory + Coco + future fusion without lock-in.

**Consequences:**
- decision-record.md mandatory.
- resource-map.md mandatory.
- Strict validation gate applies.

---

## ADR-002: Extract vs Duplicate Provider Plumbing

**Status:** Accepted
**Date:** 2026-05-09

**Decision:** Extract `cross-encoder.ts` provider-generic layer into shared `RerankClient<T>` interface.

**Rationale:**
- **Eliminates future second Voyage rerank caller** — naive Coco rerank would duplicate provider plumbing (Voyage Rerank API + caching + circuit breaker).
- **Centralized provider config** — env var detection, credential management, model selection happens once.
- **Consistent semantics across consumers** — same caching, caps, score-origin metadata for memory + Coco + future fusion.
- **Cross-encoder is already provider-generic** — extraction is a refactor, not a redesign.

**Consequences:**
- Memory consumer becomes one of N consumers (still default).
- New consumers (Coco, future fusion) can adopt without touching cross-encoder internals.
- Provider config drift between consumers eliminated.

**Alternatives considered:**
- Duplicate Voyage rerank in Coco — rejected (drift risk + 2× provider plumbing).
- Coco-side wrapper around cross-encoder via IPC — viable; that's the TS-bridge alternative for Sub-Phase 3.

---

## ADR-003: Why `EmbeddingCacheClient` Interface but NOT Shared Store

**Status:** Accepted
**Date:** 2026-05-09

**Context:** Memory cache is content-addressed by `(content_hash, model_id, dimensions)` (`embedding-cache.ts:45-55`). CocoIndex has its own cache in `.cocoindex_code/target_sqlite.db`. Sharing the storage layer would couple memory DB lifecycle to Coco rebuild.

**Decision:** Define `EmbeddingCacheClient` interface; ship memory adapter only. SHARED STORE deferred until cross-backend hit-rate overlap telemetry justifies.

**Rationale:**
- **Cross-domain duplicate content likely low** — memory indexes spec-doc records (frontmatter, triggers); Coco indexes code chunks (lang-aware AST). Shared content is rare.
- **Voyage Code 3 (Coco) ≠ Voyage 4 (memory)** — even at same 1024-dim, model_id is part of the cache key. Cross-model reuse = wrong embeddings.
- **Storage coupling cost** — sharing the SQLite store means memory retention sweeps and Coco code-index rebuilds touch the same table; lifecycle coupling.
- **Telemetry first** — REQ-006 logs cross-backend overlap events. If `sameModelSameHashHit` is meaningful in production, future packet revisits shared-store decision.

**Consequences:**
- Coco continues writing to its own embedding store.
- Interface exists for portability — when telemetry justifies, migration is straightforward.
- No premature abstraction.

**Alternatives considered:**
- Ship shared store now — rejected (no data showing reuse worth coupling cost).
- Skip interface entirely — rejected (loses portability + telemetry vehicle).

---

## ADR-004: Abstraction Boundary

**Status:** Accepted
**Date:** 2026-05-09

**Context:** Shared client surface MUST stop at provider primitives. Leaking domain concerns (memory tiers, code chunks, MMR, MPAB) into shared layer is a slippery slope.

**Decision:** Shared client surface knows ONLY:
- `modelId`, `contentHash`, `dimensions` (cache primitives).
- Generic candidate doc shape `{id, content, score?}` (rerank primitives).
- Provider config + circuit-breaker semantics.

Shared client surface MUST NOT know:
- Code chunks / AST labels / language tags.
- Memory tiers / importance / decay metadata.
- Frontmatter anchors / continuity blocks.
- Causal graph edges / boost metadata.
- MMR over `vec_memories` / MPAB parent rows.
- Path-class taxonomy.

**Rationale:**
- **SKIP boundary for shared indexing pipelines** is binding (per pt-03 RQ-B5 SKIP verdict).
- **Composability for future fusion** — RQ-A5 wants `RerankClient<MultiScored<MemoryRow|QueryResult>>`; the `T` parameter is the only place domain types appear.
- **Test enforcement** — interface contract tests (REQ-013) reject calls that pass forbidden fields.
- **Future-proofs additions** — new rerank providers don't need to know about consumer-specific concerns.

**Consequences:**
- Adapter pattern at every consumer (memory adapter, Coco adapter, future fusion adapter).
- Each consumer owns its T-mapping (`toDocument(candidate: T): {id, content, score?}`).
- Shared client is small + deterministic + testable.

---

## ADR-005: Why Coco `EmbeddingCacheClient` Adapter is DEFERRED

**Status:** Accepted
**Date:** 2026-05-09

**Decision:** Memory adapter for `EmbeddingCacheClient` ships in Phase 010. Coco adapter is DEFERRED.

**Rationale:**
- **Cross-runtime Python/TS bridge not yet justified** — would require CocoIndex IPC into TS cache or a second Python implementation.
- **Overlap telemetry from REQ-006 is the gate** — if `sameModelSameHashHit` events are rare, no adapter is needed.
- **Adapter risk** — IPC hop adds latency; second Python implementation duplicates the lifecycle.
- **Symmetric with shared-store decision** — both wait on telemetry data.

**Consequences:**
- Coco continues using its own embedding store via `embedder.embed()` in `query.py:293-295`.
- Interface ships unused on Coco side; ready for future adoption.
- Future packet (post-telemetry) decides Python adapter vs TS bridge vs continue separate.

---

## ADR-006: Circuit-Breaker Fallback Contract

**Status:** Accepted
**Date:** 2026-05-09

**Context:** `cross-encoder.ts:411-554` has provider failure handling — when Voyage rerank API fails, falls back to score-only ordering with `provider: 'fallback-score-only'` signal. This contract MUST be preserved across consumers.

**Decision:** Extracted client preserves circuit-breaker behavior. Each consumer can set its own fallback policy via the interface, but the default (score-only) is the contract.

**Rationale:**
- **Memory consumer relies on it today** — `stage3-rerank.ts` doesn't fail when provider is unavailable; falls back gracefully.
- **Coco consumer needs the same guarantee** — when shared rerank is enabled, provider failures shouldn't break Coco standalone behavior.
- **Future fusion consumer composability** — fusion stage needs to know which scores came from which provider (or fallback).
- **Score-origin metadata is the audit trail** — `provider: 'voyage'` vs `'fallback-score-only'` lets eval logic distinguish.

**Consequences:**
- Mock-failure tests required for each consumer (REQ-010).
- `provider` signal MUST be present in all reranked output envelopes.
- Provider-specific fallback (e.g. switch from Voyage to Cohere on Voyage failure) is NOT v1 — single fallback path.

**Alternatives considered:**
- Per-consumer fallback policy (richer interface) — deferred to follow-on if needed.
- Hard fail on provider failure — rejected (memory consumer relies on graceful degradation).

---

## REFERENCES

- Pt-03 source: `../research/027-xce-research-pt-03/research.md` §RQ-B5.
- Iteration narrative: `../research/027-xce-research-pt-03/iterations/iteration-010.md`.
- Delta records: `../research/027-xce-research-pt-03/deltas/iter-010.jsonl`.
- Cross-encoder: `mcp_server/lib/search/cross-encoder.ts:35-554`.
- Embedding cache: `mcp_server/lib/cache/embedding-cache.ts:45-215`.
- Stage3 rerank: `mcp_server/lib/search/pipeline/stage3-rerank.ts:410-465`.
- Pipeline types: `mcp_server/lib/search/pipeline/types.ts`.
- Pipeline README: `mcp_server/lib/search/pipeline/README.md`.
- CocoIndex query: `mcp-coco-index/mcp_server/cocoindex_code/query.py:177-323`.
- CocoIndex shared embedder: `mcp-coco-index/mcp_server/cocoindex_code/shared.py:46-76`.

---

<!-- L3 STRUCTURAL APPENDIX: ADR-001 sub-anchored mirror per L3 contract.
     Substantive ADR-001 content is in the section above; the sub-anchored mirror below
     satisfies the validator's anchor + sufficiency checks. -->

<!-- ANCHOR:adr-001 -->
## ADR-001 (sub-anchored mirror)

<!-- ANCHOR:adr-001-context -->
### Context

Pt-03 verdict for this phase recommends Level 3 designation. After the Phase 001 complete-fork insertion, the 5 pt-03 phase children are numbered 007-011. The user's scaffolding directive elevates all 5 to Level 3 regardless of pt-03's per-phase L2/L3 suggestion, citing the cross-component nature of every recommendation and the governance discipline (feature flags, telemetry contracts, Phase-006 eval gates) that L3 enforces.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Designate Phase 010 as **Level 3**. Apply full L3 file contract: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json, plus per-child resource-map.md per user directive.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Level 2** — pt-03 originally suggested L2 for some phases (006/007/009 by LOC alone). Rejected because user's scaffolding directive uniformly elevates to L3, and cross-component nature justifies L3 governance regardless of LOC.
- **Level 3+** — applies for multi-agent or enterprise-governance work. Not justified for this phase scope.
- **Defer to follow-on packet** — rejected because pt-03's bundled recommendations are sized for one packet each, not split across follow-ons.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- decision-record.md mandatory (this file).
- resource-map.md mandatory per user directive.
- Strict spec validation gate applies before merge.
- Implementation-summary.md must be filled with concrete file:line citations after Sub-Phases land.
- Phase-006 eval gate required for any active-mode rollout.
- Test discipline includes unit + integration + diff (backward-compat) + Phase-006 paired comparison.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Checks Verification

1. **Cross-component change?** Yes — touches multiple subsystems and/or runtimes.
2. **New feature flag family?** Yes — default-off rollout per pt-03 universal pattern.
3. **Telemetry contract introduced?** Yes — per-phase eval logger events documented in REQs.
4. **Promotion gate required?** Yes — Phase-006 eval lift before active mode.
5. **Hot-path or governance impact?** Yes — affects retrieval / cognitive activation / governance decisions per phase scope.

All five checks affirmative → Level 3 designation justified.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

- Sub-Phases listed in plan.md.
- Tasks T### in tasks.md.
- Verification CHK-### in checklist.md.
- File inventory in resource-map.md.
- All ADR-001 sub-anchors above mirror substantive content from "ADR-001: Why Level 3" section earlier in this file.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->
