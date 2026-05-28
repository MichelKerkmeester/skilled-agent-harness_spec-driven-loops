> Extracted from `027/research/027-xce-research-pt-03/research.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

### Group A — Coco-Index XCE Teachings

| RQ | Question | Verdict |
|---|---|---|
| **RQ-A1** | Can XCE's intent-steering pattern teach mcp-coco-index when to fire AND how to expand single queries into intent-tagged multi-queries? | **ADAPT** |
| **RQ-A2** | Can Phase 001's deterministic HLD/LLD narrative be folded into coco-index's path-class rerank to boost hits near known module boundaries / role anchors? | **ADAPT design / DEFER active** |
| **RQ-A3** | Should `ccc_feedback` JSONL graduate from write-only telemetry to a feedback-driven rerank-weight loop? | **ADAPT** |
| **RQ-A4** | Few-shot example-bank — can prior validated hits surface as positive exemplars in next query? | **ADAPT design / DEFER default-on** |
| **RQ-A5** | Cross-cutting: should coco-index and code-graph share a single fused rerank stage? | **ADAPT design / DEFER active** |

### RQ-A1 — Coco-index intent steering + query expansion (ADAPT)

XCE's "use first" steering pattern is an adoptable UX contract; XCE's closed-source intent-routing internals are not. Two viable adaptations:

(a) **Advisor first-action hint** — Phase-004 advisor renderer already gates by confidence threshold (`render.ts:124-133`); CocoIndex already has scorer signals for this intent class (`scorer/lanes/lexical.ts:25-30`, `scorer/lanes/explicit.ts:55-56`,`154-160`). LOC: ~25-45.

(b) **Pre-embedding query expansion** — slot a rule-based intent classifier + sub-query expander before `embedder.embed()` at `query.py:293-295`, with original query + at most 2 sub-queries (3-embedding ceiling), per-sub-query fetch capped at existing `fetch_k`, suppression for exact identifiers / file paths / quoted strings / regex. LOC: ~120-180. Path-class taxonomy (`indexer.py:53-91`) provides intent priors. Total MVP: **~220-320 production LOC**.

Risks: precision loss from over-expansion (mitigated by exact-intent suppression); embedding cost (mitigated by 3-embedding cap).

### RQ-A2 — Coco-index rerank fusion with code-graph HLD/LLD (ADAPT design / DEFER active)

Phase 001 spec (`001-code-graph-hld-lld/spec.md:100-167`) emits `{file_role, layer, summary, primary_symbols[]}` as **open string** (not closed enum). Lowest-coupling design: static sidecar export from Phase 001, keyed by normalized `file_path`, consumed by CocoIndex Python rerank. NOT a live Python→TypeScript graph DB query.

Insertion point: `_ranked_result()` at `query.py:177-223` (already the rerank surface). Bounded boosts capped at +0.03 (file-role match) + +0.02 (primary-symbol proximity) — same magnitude as existing path-class nudge. Disabled by default (`SPECKIT_COCOINDEX_HLD_RERANK=1`). Stale sidecars **fail closed** via `content_hash`/`file_mtime_ms`/graph-fingerprint validation.

LOC: ~150-240 total including tests. **Hard-depends on Phase 001 ship.** Implementation deferred until Phase 001 emits stable HLD export.

### RQ-A3 — `ccc_feedback` graduation to active rerank loop (ADAPT)

Current state: `handleCccFeedback()` (`ccc-feedback.ts:11-60`) appends JSONL only; **no production reader exists** (verified by repo-wide search). Local feedback file currently absent (0 events).

Design: keep JSONL as raw audit input; add periodic Python reducer (`feedback_reducer.py`) that aggregates recent events into a small SQLite reweight table keyed by `(intent_tag, path_class)` with min-support thresholds. Apply clamped **±0.10 max** rerank delta at `_ranked_result()`. Reuses precedent from `lib/feedback/batch-learning.ts:34-48` (`MAX_BOOST_DELTA = 0.10`).

Cold start: missing JSONL/table/below-min-support → `delta=0`, today's behavior. Privacy: aggregate counts/deltas only — no comment text in learned tables. Feature flag: `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0`.

LOC: ~250-370 production + ~90-150 tests. Path-class-only MVP achievable without RQ-A1; intent-tagged learning needs RQ-A1 classifier.

### RQ-A4 — Few-shot example-bank for coco-index (ADAPT design / DEFER default-on)

XCE has no public few-shot bank surface; the transferable analog is local positive-exemplar retrieval. **Critical separation from RQ-A3:** A3 changes weights, A4 surfaces examples as a **separate response group**, never mixed into `QueryResult` ranking.

Storage: new local SQLite/vec0 table `coco_query_examples_vec` keyed by `(query_embedding, query_hash, result_file, content_hash, path_class, line range, validation_source, validated_at, expires_at)`. **Separate** from `code_chunks_vec` so reindexing code chunks cannot corrupt example history.

Mandatory controls before default-on: opt-out flag (`SPECKIT_COCOINDEX_EXEMPLARS=0`), `ccc_examples_clear` maintenance op, capped storage (~1000-2000 rows/project), TTL ~90 days, top-3 exemplar output, similarity threshold ≥0.80, stale-hit reconciliation via `content_hash`/line-range checks.

LOC: ~320-500 production + ~120-180 tests. Default-on deferred until Phase 005 evaluates utility vs. staleness cost.

### RQ-A5 — Cross-cutting: coco+graph fused rerank stage (ADAPT design / DEFER active)

Today's flow preserves CocoIndex score and adds graph anchor as side enrichment (`seed-resolver.ts:91-133`, `:329-350`). Active fusion needs role/layer (Phase 001), trace-distance (Phase 002), and centrality (Phase 003) as inputs — **none of which exist in current runtime**.

Design when shippable: new pure module `lib/search/coco-graph-fusion.ts` (NOT extending `cocoindex-calibration.ts` which owns overfetch only). Deterministic feature-specific normalizers: bounded path-class deltas, `log1p(value)/log1p(cap)` for centrality, open-string role-family match, reciprocal trace distance. Fixed heuristic weights initially (`weightClass: "heuristic"`); learned weights deferred to Phase 005. Output: `fusedScore` + `fusionSignals` (component scores + skip reasons).

Flag family: `SPECKIT_COCO_GRAPH_FUSION=0` / `_MODE=shadow|rerank` / `_REQUIRE_FRESH_GRAPH=1`. CocoIndex standalone behavior must not require code graph.

LOC: ~180-300 production + ~80-140 tests. **Hard-depends on Phases 001+002+003.** Pre-work limited to interface contract + shadow telemetry.

### Phase 006: `006-coco-intent-steering` — L2, ~250-350 LOC, ADAPT
**Covers:** RQ-A1.
**Scope:** rule-based intent classifier shim before `query.py:293-295`; bounded query expansion (≤3 embeddings); path-class intent priors via `classify_path()` taxonomy reuse; advisor first-action hint via Phase-004 renderer; flags/caps/telemetry/exact-intent suppression.
**Dependencies:** none hard. Phase-004 advisor wording is opportunistic.
**Risk:** precision loss from over-expansion. Mitigated by exact-intent suppression + `rankingSignals` transparency + Phase-005 evaluation before default-on.

### Phase 009: `009-retrieval-rerank-clients` — L2, ~250-420 LOC, ADAPT
**Covers:** RQ-B5 client extraction.
**Scope:** extract `RerankClient<T>` from `cross-encoder.ts`; memory consumes via existing pipeline adapter (`stage3-rerank.ts:410-465`); CocoIndex candidate adapter (`QueryResult` ↔ rerank document) with score-origin and `rankingSignals` preservation; flag default-off for CocoIndex; no second Voyage rerank caller. Define `EmbeddingCacheClient` interface (memory adapter only, no Coco adapter yet) for future portability. Shadow telemetry for cross-backend hit-rate overlap.
**Dependencies:** existing `cross-encoder.ts`. Optional: RQ-A5 fusion consumers when Phases 001/002/003 ship.
**Risk:** abstraction-boundary leak (the SKIP for shared indexing pipelines in RQ-B5 is the warning sign). Keep client surface minimal; reject any "shared retrieval engine" expansion.

### Phase 010: `010-coco-memory-context-extras` — L3, ~500-800 LOC, ADAPT/DEFER split
**Covers:** RQ-A4 (coco few-shot exemplars) + RQ-B2 (memory LLM-curated context).
**Scope:** coco exemplars in separate response group (NEVER mixed into `QueryResult` ranking); memory `data.curatedContext` post-retrieval packaging plan with `{causalChain, tierExemplars, directEvidence, supportingContext, omittedButAvailable}` schema; budget-split (`retrievalCandidateLimit` + `presentationLimit` + `curationTokenBudget`); cache extension for `mode: 'context_curation'` keyed by `candidateSetHash`; strict JSON schema validation; deterministic fallback paths; flag families `SPECKIT_COCOINDEX_EXEMPLARS_*` and `SPECKIT_CONTEXT_CURATOR_*` with shadow-first.
**Dependencies:** Phase-007 (better trigger candidates improve curator input). RQ-A3 (Phase-008 reducer for example-bank signal quality).
**Risk:** both features add latency + nondeterminism to hot retrieval paths. Mitigated by default-off + strict timeout + deterministic fallback + Phase-005 lift requirement before active rollout.

### NOT scaffolded as standalone phases (explicit DEFER)

- **RQ-A2 + RQ-A5 active fusion** — hard-depends on Phases 001+002+003 ship. Pre-work limited to interface/type contract + shadow telemetry; can fold into Phase 001/002/003 as follow-on tasks once those phases mature.

---

### Pt-03 source corpus

- `external/README.md:22-28, 101-119, 188-199, 240-245` — XCE public surface, steering pattern, semantic-search claims, query/context flow
- `external/steering/CLAUDE.md:5-10` — XCE "use first" steering example
- `.opencode/skills/mcp-coco-index/SKILL.md:16-31` — current activation triggers
- `.opencode/skills/mcp-coco-index/references/search_patterns.md:28-35, 174-188, 344-352` — current query advice + ccc_feedback shape
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:40-59, 92-116, 177-264, 267-323` — query path, intent detection, rerank, dedup
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:53-91, 266-326` — `classify_path()`, vec0 indexing
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:89-110, 141-150` — MCP search tool surface
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21-28` — IPC SearchRequest schema
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py:8-36` — CodeChunk + QueryResult schemas
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:46-76` — embedder configuration

### Coco-index ↔ code-graph bridge

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:1-350` — anchor resolution, telemetry preservation
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:5-88` — overfetch + dedup + path-class-count telemetry
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:18-51` — availability reporting
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:11-60` — write-only JSONL handler
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:264-317` — code_graph_context CocoIndex seed intake
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:539-746` — resume payload exposing coco availability

### Skill advisor + scorer

- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-158` — advisor brief threshold gates + final wording
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts:25-30` — coco-relevant lexical hints
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:55-56, 154-160` — coco explicit boosts

## 1. Executive Summary

Pt-03 extends pt-01 + pt-02 (which produced the existing 5 code-graph + skill-advisor phases 004→001→{002,003}→005) to the two systems explicitly NOT covered: **mcp-coco-index** (semantic search fork, currently scope-out per `spec.md:144`) and the **system-spec-kit memory backend / causal graph** (no 027 phase touches it).

Across 10 RQs (5 coco + 5 memory) we produced **56 file:line-cited findings** with a unanimous **bounded-ADAPT** stance: every recommendation is feature-flagged, default-off, shadow-first, fail-closed, with promotion gated on Phase 005 eval evidence. No SaaS dependencies introduced. No embedding-model swaps. No full re-embeds. Lexical/deterministic precision paths are preserved as fallback in every case.

**Headline recommendations:**

1. **`006-coco-intent-steering`** (L2, ~250-350 LOC, ADAPT) — Pre-embedding query-expansion shim + Phase-004 advisor first-action hint. Standalone-shippable.
3. **`008-feedback-reducers`** (L3, ~400-650 LOC, ADAPT) — Shared bounded reducer aggregating `feedback_events` to drive coco rerank weights (RQ-A3) + session-trace causal-edge inference (RQ-B3) + learned retention/decay (RQ-B4). One aggregation, three downstream consumers.
4. **`009-retrieval-rerank-clients`** (L2, ~250-420 LOC, ADAPT) — Extract `RerankClient` from `cross-encoder.ts` so memory + coco share provider/cache/circuit-breaker semantics; persistent embedding-cache sharing DEFERRED pending overlap telemetry.
5. **`010-coco-memory-context-extras`** (L3, ~500-800 LOC, ADAPT/DEFER split) — Few-shot example bank (RQ-A4) + LLM-curated memory_context (RQ-B2). Both presentation-layer additions, neither alters scoring authority.

**Hard-deferred:** RQ-A2 (HLD/LLD rerank fusion) and RQ-A5 (coco+graph fused rerank) cannot ship until Phases 001/002/003 emit their respective signals. Pre-work limited to interface contracts + shadow telemetry.

---

## 6. Adoption Matrix

| RQ | Verdict | LOC (prod + tests) | Hard dependencies | Soft dependencies |
|---|---|---|---|---|
| **RQ-A1** Coco intent steering + query expansion | **ADAPT** | ~220-320 + focused | — | Phase-004 (advisor wording); Phase-005 (default-on) |
| **RQ-A2** Coco HLD/LLD rerank | **ADAPT design / DEFER active** | ~150-240 incl. tests | **Phase-001** | Phase-005 |
| **RQ-A3** ccc_feedback active rerank loop | **ADAPT** | ~250-370 + ~90-150 | — | RQ-A1 (intent tags); Phase-005 (promotion) |
| **RQ-A4** Few-shot example bank | **ADAPT design / DEFER default-on** | ~320-500 + ~120-180 | — | RQ-A3 (signal quality); RQ-A1 (intent tags); Phase-005 |
| **RQ-A5** Coco + graph fused rerank | **ADAPT design / DEFER active** | ~180-300 + ~80-140 | **Phase-001+002+003** | Phase-005 |
| **RQ-B5** Shared cache + rerank infra | **ADAPT clients / DEFER store / SKIP indexers** | ~220-380 + ~120-220 | existing cross-encoder | Phase-005; RQ-A/B consumers |

---

## 8. Cross-Cutting Recommendations

1. **RQ-A5 and RQ-B5 are NOT one packet.** They share design philosophy (bounded extraction, default-off, shadow-first) but have completely different implementation shapes. Keep separate.
2. **Phase 008 (shared feedback reducer) is the highest-leverage cross-cut.** RQ-A3, RQ-B3, RQ-B4 all consume `feedback_events` with strong/weak signal classification, session grouping, shadow audit trails. One aggregation, three decisions.
3. **Phase 009's `RerankClient` extraction can support future RQ-A5 fusion** when graph signals land — but A5 still has its own Phase-001+002+003 dependency chain.
4. **Shared embedding storage is YAGNI today.** Add overlap telemetry (`crossBackendEmbCacheCandidate`, `sameContentHashDifferentModel`, `sameModelSameHashHit`) before any storage-sharing decision. Voyage Code 3 ≠ Voyage 4 even at same dimension.
5. **Every cross-system feature MUST be default-off or shadow-first** until Phase-005 evaluates task success, precision, latency, quota, and failure-mode clarity. This is the most consistent finding across all 10 iters.

---

## 9. Risk Register

| Risk | Surface | Severity | Mitigation |
|---|---|---|---|
| **Shared indexing pipeline abstraction leak** | RQ-B5 shared infra ambition creep | **P0** | SKIP is binding — reject any "shared retrieval engine" RFC. Client surface only |
| **Active fusion ships without Phases 001-003 inputs** | RQ-A2 / RQ-A5 active mode | **P0** | DEFER is binding. Pre-work = interface/type contract + shadow telemetry only |
| **Query expansion precision loss** | RQ-A1 default-on too early | **P1** | 3-embedding ceiling + exact-intent suppression + `rankingSignals` transparency + Phase-005 evaluation |
| **Stale HLD/LLD sidecar produces wrong boosts** | RQ-A2 freshness gap | **P1** | Sidecar carries `content_hash` + `file_mtime_ms` + graph-fingerprint; suppress boost on mismatch + emit `hld_rerank_skipped_stale` telemetry |
| **Stale exemplar references in coco** | RQ-A4 example bank | **P1** | TTL ~90 days + reconciliation via `content_hash` + line-range checks + bounded growth (1000-2000 rows) |
| **Cross-system telemetry retention beyond local/default-off assumptions** | RQ-A4 / RQ-B5 privacy | **P2** | Aggregate counts/deltas only in learned tables; raw comments stay in audit JSONL; documented opt-out + clear-history maintenance ops |

---

## 10. Dependencies on Existing 027 Phases

| Phase | Status | Pt-03 phases that depend on it |
|---|---|---|
| **Phase 001** HLD/LLD generator | Scaffolded, not shipped | RQ-A2 (hard); RQ-A5 (hard) |
| **Phase 002** Trace tool | Scaffolded, not shipped | RQ-A5 (hard, for trace-distance signal) |
| **Phase 003** Impact analysis | Scaffolded, not shipped | RQ-A5 (hard, for centrality signal) |
| **Phase 004** Skill advisor first-action mandate | Scaffolded, not shipped | RQ-A1 (soft — advisor wording for coco first-action hint) |
| **Phase 005** Adoption eval harness | Scaffolded, not shipped | All ADAPT verdicts (gating default-on rollout); RQ-A2/A4/A5/B2/B4 (gating active mode) |

**Implication:** Phases 006 (coco intent steering), 007 (semantic triggers), 008 (feedback reducers — partial: RQ-A3 path-class-only MVP), 009 (rerank clients) can all ship without ANY of the existing 027 phases shipping first. Active modes for everything else need Phase 005 eval evidence.

---

## 11. Out of Scope

Explicitly NOT addressed by pt-03:

- **Pt-02's 6 open code-graph policy decisions** (dangling-edge policy, module semantics, normalizer constants, TESTED_BY direction, test heuristic scope, Phase 005 split) — those are pt-02 follow-up territory.
- **SaaS dependencies** — `mcp.xanther.ai`, `xanther.ai`, hosted PRAT services. Pt-01 RQ9 SKIP boundary is binding.
- **Embedding-model swaps** — Voyage Code 3 / Voyage 4 / MiniLM stay as-is. No re-embed loops.
- **Replacing coco-index** — `spec.md:144` SCOPE-OUT is binding.
- **Closed-source XCE PRAT internals** — only public README / steering / config patterns are transferable.
- **Shared indexing pipelines** — RQ-B5 SKIP is binding.

---

## 12. Known Gaps / Pt-04 Candidates

- No direct measurement yet for CocoIndex query-embedding repetition rate, memory trigger-embedding hit rate, or cross-backend same-content overlap. (Phase 008 telemetry would close this.)
- No held-out Phase-005 task suite to compare query expansion / semantic triggers / rerank clients / exemplars / LLM curation. (Phase 005 spec needs to define this before any pt-03 phase ships default-on.)
- No final contract for where shared TypeScript infrastructure should live if Python CocoIndex consumes it (HTTP/CLI bridge / generated schema contract / duplicated Python adapter around same provider API).
- No decision on whether CocoIndex rerank should run inside raw `query_codebase()`, system-spec-kit code-graph seed path, or only as opt-in MCP wrapper.
- No privacy policy yet for example-bank records, feedback reducer retention windows, cross-system telemetry retention beyond local/default-off assumptions.
- Pt-04 candidate: deeper investigation of XCE's omnibus tool-call combiner (`xce_get_context`) — pt-01 RQ4 mapped this to fold-in `queryMode:'omni'` for code-graph but didn't address whether memory backend should expose a similar single-entry combiner.

---

## 15. Appendix — Per-iteration index

| Iter | RQ | Focus | newInfoRatio | Duration | Findings |
|---|---|---|---|---|---|
| 1 | RQ-A1 | Coco intent steering + query expansion | 0.82 | 155s | 5 (1×SKIP closed-source PRAT internals + 4×ADAPT) |
| 2 | RQ-A2 | Coco HLD/LLD rerank fusion | 0.74 | 166s | 5 (1×DEFER active impl + 4×ADAPT design) |
| 3 | RQ-A3 | ccc_feedback active rerank loop | 0.68 | 185s | 5 (5×ADAPT) |
| 4 | RQ-A4 | Few-shot example bank | 0.61 | 194s | 6 (1×ADAPT-with-flag + 5×ADAPT design with default-on DEFER) |
| 5 | RQ-A5 | Coco + graph fused rerank | 0.56 | 154s | 6 (2×DEFER + 4×ADAPT design with active DEFER) |
| 10 | RQ-B5 | Shared cache + rerank infra | 0.47 | 275s | 5 (1×SKIP shared indexers + 1×DEFER shared store + 3×ADAPT clients) + synthesis-prep record with phase scaffolds |

**Total findings:** 56 distinct ADOPT/ADAPT/DEFER/SKIP records across 10 iters.
**Total iter narrative:** 138 KB.
**Total delta JSONL:** 22 KB.
**Total wall:** ~33 minutes.
