# Iteration 005 - RQ-A5 Cross-cutting coco+graph fused rerank stage

## Focus

RQ-A5 asks whether CocoIndex and code graph should share a single fused rerank stage, replacing today's flow where CocoIndex returns ranked semantic hits, `seed-resolver` maps those hits to graph anchors, and graph context uses the anchor without feeding graph scores back into search ranking.

## Actions Taken

- Read the current seed resolver. `resolveCocoIndexSeed()` converts a CocoIndex hit into a file/range seed, resolves it through the graph resolver, then restores CocoIndex `score`, `snippet`, `range`, provider, source, and optional fork telemetry (`rawScore`, `pathClass`, `rankingSignals`) as additive fields (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:91-133`). `resolveSeeds()` deduplicates and sorts by CocoIndex score first, then graph resolution confidence, file path, and line (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:329-350`).
- Read the current graph-context seed intake. `code_graph_context` normalizes CocoIndex wire fields into a `CocoIndexSeed`, preserves snake_case fork telemetry, and delegates scoring/order to seed resolution plus `buildContext()` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:264-317`). The handler does not compute a graph score for CocoIndex ordering.
- Read CocoIndex calibration. `cocoindex-calibration.ts` only computes requested/effective limit, duplicate density, unique path count, overfetch flag state, multiplier, path-class counts, and optional scope (`.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:14-88`). It is an overfetch/dedup telemetry helper, not a score combiner.
- Read status/bootstrap surfaces. `ccc_status` exposes CocoIndex availability, index existence, readiness, last graph scan, and recommendations (`.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:18-51`). The requested `code_graph/handlers/session-resume.ts` path does not exist; the relocated handler is `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts`. That handler exposes code graph status, CocoIndex availability, and structural bootstrap context in one resume payload (`handlers/session-resume.ts:539-746`).
- Read Phase 001. HLD/LLD will expose file role, layer, primary symbols, per-symbol dependencies, signatures, docstrings, and complexity hints, with `classifyFileRole(filePath, db)` as an exported open-string role contract (`001-code-graph-hld-lld/spec.md:100-167`).
- Read Phase 002. Trace will produce a symbol-to-file/module/architectural-role chain and depends on Phase 001's role classifier (`002-code-graph-trace/spec.md:29-41`, `002-code-graph-trace/spec.md:72-88`).
- Read Phase 003. Impact analysis will compute deterministic file-level risk signals: fan-in, fan-out, hub centrality, coverage evidence gap, edge confidence, transitive depth, and a heuristic score with documented normalization (`003-code-graph-impact-analysis/spec.md:30-52`, `003-code-graph-impact-analysis/spec.md:82-131`).
- Re-read iterations 001-004. A1 adds bounded pre-embedding expansion and path-class intent priors. A2 defers HLD/LLD role boosts until Phase 001 ships and prefers a static sidecar. A3 makes feedback a bounded reducer/rerank loop. A4 surfaces exemplars separately rather than mixing them into normal ranking.

## Findings

### F-iter005-001 - A fused stage is viable only as a post-retrieval rerank plugin, not as the default CocoIndex path

Verdict: ADAPT-DESIGN; DEFER active implementation. LOC estimate: ~180-300 production LOC plus ~80-140 tests. Dependencies: Phase-001, Phase-002, Phase-003, Phase-005 evaluation.

Evidence: Current CocoIndex-to-graph flow treats graph anchoring as context enrichment after semantic retrieval. `resolveCocoIndexSeed()` preserves CocoIndex score and telemetry while resolving graph anchors, and comments explicitly say fork telemetry must not alter score, confidence, resolution, or ordering (`seed-resolver.ts:25-35`, `seed-resolver.ts:91-133`). `resolveSeeds()` orders by score and confidence, but the score is still the CocoIndex score (`seed-resolver.ts:329-350`). Iteration 002 already found role-aware HLD rerank should be feature-flagged and fail closed because Phase 001 is not shipped.

Implication: do not replace today's standalone semantic search. Add a separate fusion stage that accepts already-retrieved candidates plus optional graph-derived features, then emits `fusedScore`, component signals, and explanation telemetry. Default behavior should remain today's CocoIndex ranking and seed-resolver anchoring.

### F-iter005-002 - Fusion should live in a new `lib/search` module, not inside `cocoindex-calibration.ts`

Verdict: ADAPT. LOC estimate: ~90-150 for a pure fusion module; ~40-70 for caller integration. Dependencies: Phase-001/002/003 feature providers.

Evidence: `cocoindex-calibration.ts` is scoped to overfetch calibration: duplicate density, overfetch multipliers, and path-class counts (`cocoindex-calibration.ts:14-88`). Its exported helpers are named around adaptive/graduated overfetch, not ranking. Existing search envelopes also treat CocoIndex calibration as telemetry, while score-changing decisions belong to rerank metadata or explicit pipeline stages (`search-decision-envelope.ts:1-118`; `pipeline/types.ts:284-304`).

Implication: create a new pure module under `mcp_server/lib/search/`, for example `coco-graph-fusion.ts` or `retrieval-fusion.ts`. Keep `cocoindex-calibration.ts` focused on fetch calibration. The fusion module should accept normalized candidate features and return ranked candidates plus telemetry; it should not directly call CocoIndex or graph DB APIs. Graph feature extraction can sit next to graph-side modules and feed this pure combiner.

### F-iter005-003 - Score normalization should use fixed, explainable transforms first; learned weights are premature

Verdict: ADAPT. LOC estimate: ~50-90 inside the fusion module. Dependencies: Phase-003 signal definitions; Phase-005 for later calibration.

Evidence: Phase 003 already labels risk weights as heuristic until Phase 005 calibration and requires deterministic normalizers for fan-in, hub degree, and transitive depth (`003-code-graph-impact-analysis/spec.md:82-103`, `003-code-graph-impact-analysis/spec.md:124-131`). Existing CocoIndex rerank nudges are small and transparent, such as path-class boosts/penalties and canonical-resource boosts described in earlier iterations. A3 similarly caps feedback deltas to +/-0.10.

Implication: v1 fusion should normalize each feature independently with deterministic transforms:

- `semanticScore`: use CocoIndex's final score already in [0..1] if available; otherwise normalize raw distance through the existing CocoIndex query code before fusion.
- `pathClassScore`: bounded categorical prior, e.g. -0.05 to +0.05 before weighted fusion.
- `centralityScore`: `log1p(value) / log1p(cap)` with a fixed cap or graph-baseline cap from Phase 003, then clamp to [0..1].
- `architecturalRoleScore`: exact/broad role-family match from Phase 001 open-string `file_role`, not a closed enum.
- `traceDistanceScore`: `1 / (1 + distance)` or a small bucketed score from Phase 002 trace output.

Avoid per-request min-max because it makes scores unstable when the candidate set changes. Avoid learned weights until Phase 005 has labeled evaluation data. Start with fixed weights, shadow telemetry, and an explicit `weightClass: "heuristic"` marker.

### F-iter005-004 - The dependency chain is hard; without Phases 001-003 there is almost nothing to fuse

Verdict: DEFER. LOC estimate now: ~0 implementation; ~20-40 to document the future contract. Dependencies: Phase-001 for role/layer, Phase-002 for trace distance, Phase-003 for centrality/impact signals.

Evidence: Today's available fusion inputs are CocoIndex score, path class, ranking signals, graph resolution confidence, and anchor identity. That is not enough to justify a new cross-system combiner. Phase 001 will provide HLD role/layer and primary symbol context. Phase 002 will provide trace chain and architectural-role distance. Phase 003 will provide centrality and impact/risk signals. The user-proposed fusion ingredients mostly come from those future phases, not the current runtime.

Implication: active implementation should wait. The useful work now is to pin the extension contract so the future phases expose their signals in a fusion-friendly shape. If a small preparatory change lands before 001-003, it should be telemetry-only: define types and shadow logging, not score mutation.

### F-iter005-005 - Coupling risk is real; feature flag and standalone fallback must be part of the contract

Verdict: ADAPT-WITH-FEATURE-FLAG. LOC estimate: ~35-60 for flags/fallback/telemetry beyond the fusion module. Dependencies: none for the flag shape; graph feature providers for active mode.

Evidence: CocoIndex currently ships as a standalone semantic search skill. `ccc_status` can report CocoIndex availability independently of graph fusion, and `session_resume` exposes code graph and CocoIndex status as adjacent sections rather than one fused dependency (`ccc-status.ts:18-51`; `handlers/session-resume.ts:610-746`). Iterations 002-004 repeatedly chose feature flags, fail-closed sidecars, and separate result groups to avoid making semantic search depend on graph readiness.

Implication: use a flag family such as:

- `SPECKIT_COCO_GRAPH_FUSION=0` default off.
- `SPECKIT_COCO_GRAPH_FUSION_MODE=shadow|rerank`, with shadow as the first enabled mode.
- `SPECKIT_COCO_GRAPH_FUSION_REQUIRE_FRESH_GRAPH=1` to suppress graph signals when structural readiness is stale/missing.

When CocoIndex is available but graph inputs are absent, stale, or below confidence threshold, fusion should no-op and emit `fusionApplied:false` with skip reasons. CocoIndex standalone behavior must not require code graph.

### F-iter005-006 - Single combined score is useful for ordering, but explanation must preserve component scores

Verdict: ADAPT. LOC estimate: ~40-70 for telemetry fields and ranking signals. Dependencies: search decision envelope integration.

Evidence: The current result schema already carries `rawScore`, `pathClass`, and `rankingSignals`, and the seed resolver preserves those fields through graph anchoring. Search decision envelopes already support side telemetry such as calibration, rerank decisions, shadow deltas, degraded readiness, and pipeline timing (`search-decision-envelope.ts:15-58`). If fusion collapses everything into one opaque score, operators lose the ability to tell whether semantic match, role match, centrality, trace proximity, or feedback caused the reorder.

Implication: output should carry both:

- `fusedScore`: the one ordering score when feature flag enables active rerank.
- `fusionSignals`: component scores, weights, skip reasons, freshness/trust, and bounded deltas.

This keeps ranking simple while preserving auditability and allowing Phase 005 ablations to disable one component at a time.

## Questions Answered

- Should CocoIndex and code graph share a single fused rerank stage? Yes as an optional post-retrieval plugin, no as a mandatory replacement for today's CocoIndex standalone pipeline.
- Where should fusion live? In a new pure module under `mcp_server/lib/search/`, not as an extension of `cocoindex-calibration.ts`. Calibration should stay about overfetch/dedup telemetry.
- How should heterogeneous scores be normalized? Use deterministic feature-specific transforms and clamps first: bounded path-class deltas, log-capped centrality, open-string role-family match, reciprocal trace distance, and existing normalized CocoIndex score. Do not use per-request min-max. Do not use learned weights until Phase 005.
- What is the dependency chain? Hard dependency on Phases 001, 002, and 003 for meaningful active fusion. Without them, only semantic score, path class, graph resolution confidence, and anchor identity exist.
- LOC estimate? Approximately ~180-300 production LOC plus ~80-140 tests for a real feature-flagged fusion stage: pure fusion module (~90-150), graph feature adapter/caller integration (~40-70), flags/fallback/telemetry (~35-60), and envelope/result fields (~40-70). Some overlap can keep the first implementation near the low end.
- Coupling mitigation? Default off, shadow first, fail closed on missing/stale graph inputs, preserve standalone CocoIndex, and carry component telemetry.
- Verdict? ADAPT the pluggable design and feature-flag contract; DEFER active rerank implementation until Phases 001/002/003 ship. SKIP an always-on single combined score that makes CocoIndex depend on graph readiness.

## Questions Remaining

- Should the first active fusion target `memory_search` pipeline Stage 3, raw `mcp-coco-index` query results, or only the `code_graph_context` seed path?
- Should Phase 001 own a sidecar export for role/layer features, or should fusion call graph feature adapters in the system-spec-kit MCP server only?
- What Phase 005 labeled task set should decide the first default weights?
- Should fusion consume A3 feedback deltas and A4 exemplar matches, or keep those as separate mechanisms until after graph fusion is proven?

## Next Focus

RQ-B1 - Memory backend semantic trigger matching. Transition from CocoIndex/code-graph cross-cutting work to the system-spec-kit memory backend: investigate whether XCE-style semantic triggers should replace or augment current lexical trigger matching.
