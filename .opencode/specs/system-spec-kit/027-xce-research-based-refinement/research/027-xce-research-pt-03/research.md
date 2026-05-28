# 027-XCE Pt-03 Research — Coco-Index + Memory Backend Scope Expansion

**Spec folder:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`
**Packet:** `research/027-xce-research-pt-03/`
**Executor:** cli-codex / `gpt-5.5` / `reasoning=high` / `serviceTier=fast` / sandbox=workspace-write
**Iterations:** 10 (all converged with full output triple per iter)
**Session:** `2026-05-09-027-pt-03-codex-gpt55-coco-memory`
**Run window:** 2026-05-09T09:38:03Z → 2026-05-09T10:10:53Z (~33 min wall)

---

## 1. Executive Summary

Pt-03 extends pt-01 + pt-02 (which produced the existing 5 code-graph + skill-advisor phases 004→001→{002,003}→005) to the two systems explicitly NOT covered: **mcp-coco-index** (semantic search fork, currently scope-out per `spec.md:144`) and the **system-spec-kit memory backend / causal graph** (no 027 phase touches it).

Across 10 RQs (5 coco + 5 memory) we produced **56 file:line-cited findings** with a unanimous **bounded-ADAPT** stance: every recommendation is feature-flagged, default-off, shadow-first, fail-closed, with promotion gated on Phase 005 eval evidence. No SaaS dependencies introduced. No embedding-model swaps. No full re-embeds. Lexical/deterministic precision paths are preserved as fallback in every case.

**Headline recommendations:**

1. **`006-coco-intent-steering`** (L2, ~250-350 LOC, ADAPT) — Pre-embedding query-expansion shim + Phase-004 advisor first-action hint. Standalone-shippable.
2. **`007-memory-semantic-triggers`** (L2/L3, ~350-520 LOC, ADAPT) — Hybrid lexical+semantic trigger matcher with backfilled trigger embeddings, shadow-first. Highest-leverage memory improvement.
3. **`008-feedback-reducers`** (L3, ~400-650 LOC, ADAPT) — Shared bounded reducer aggregating `feedback_events` to drive coco rerank weights (RQ-A3) + session-trace causal-edge inference (RQ-B3) + learned retention/decay (RQ-B4). One aggregation, three downstream consumers.
4. **`009-retrieval-rerank-clients`** (L2, ~250-420 LOC, ADAPT) — Extract `RerankClient` from `cross-encoder.ts` so memory + coco share provider/cache/circuit-breaker semantics; persistent embedding-cache sharing DEFERRED pending overlap telemetry.
5. **`010-coco-memory-context-extras`** (L3, ~500-800 LOC, ADAPT/DEFER split) — Few-shot example bank (RQ-A4) + LLM-curated memory_context (RQ-B2). Both presentation-layer additions, neither alters scoring authority.

**Hard-deferred:** RQ-A2 (HLD/LLD rerank fusion) and RQ-A5 (coco+graph fused rerank) cannot ship until Phases 001/002/003 emit their respective signals. Pre-work limited to interface contracts + shadow telemetry.

---

## 2. Research Questions

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/research.md.
### Group B — Memory Backend / Causal Graph XCE Teachings

| RQ | Question | Verdict |
|---|---|---|
| **RQ-B1** | Should `memory_match_triggers` graduate from lexical/regex to embedding-based semantic similarity? | **ADAPT** (hybrid, not replacement) |
| **RQ-B2** | Can `memory_context` assembly become LLM-curated instead of rule-based templates? | **ADAPT shadow / DEFER active** |
| **RQ-B3** | Can causal edges be auto-inferred from session traces within existing NFR-R01 caps? | **ADOPT** signal source / **ADAPT** reducer |
| **RQ-B4** | Can `feedback-ledger.ts` signals drive learned retention/decay decisions? | **ADAPT** (tier-gated) / **DEFER** live mutation |
| **RQ-B5** | Cross-cutting: shared embedding cache + rerank infra between memory and coco-index? | **ADAPT** clients / **DEFER** shared store / **SKIP** shared indexers |

---

## 3. Methodology

- **10 sequential iterations** dispatched via `cli-codex` (`gpt-5.5` / `reasoning=high` / `serviceTier=fast` / sandbox=`workspace-write`), one RQ per iter, no parallelism (per memory `feedback_cli_dispatch_unreliability.md`).
- Each iter required to produce (i) `iterations/iteration-NNN.md` narrative, (ii) one `{"type":"iteration",...}` append to `deep-research-state.jsonl`, (iii) `deltas/iter-NNN.jsonl` structured records (1 iteration + ≥3 findings).
- Verdicts forced into ADOPT/ADAPT/DEFER/SKIP taxonomy with LOC estimates and explicit dependency declarations on existing 027 phases.
- File:line citations required for every claim (no bare assertions).
- Out of pt-03 scope: pt-02's 6 open code-graph policy decisions, SaaS dependencies (`mcp.xanther.ai`, `xanther.ai`), embedding-model swaps, full re-embed loops, replacing coco-index entirely.

**newInfoRatio trajectory:** 0.82 → 0.74 → 0.68 → 0.61 → 0.56 → 0.64 → 0.59 → 0.62 → 0.58 → 0.47. Bumps at iter 6 (Group A → B transition) and iter 8 (causal-graph subdomain) confirm RQs surface genuinely new findings rather than duplicating prior iters.

---

## 4. Known Context

- **Pt-01** (10 iter, deepseek-v4-pro, converged 2026-05-08) → adoption matrix RQ1-RQ9; 5 phase children scaffolded (004 advisor L1 + 001 HLD/LLD L2 + 002 trace L2 + 003 impact L2 + 005 eval harness L3); zero product code shipped.
- **Pt-02** (10 IRQ, gpt-5.5/high/fast, converged 2026-05-09) → cross-validation; surfaced 6 open code-graph policy decisions (out of pt-03 scope).
- **Coco-index fork** has Voyage Code 3 + path-class ±0.05 rerank + dedup; `ccc_feedback` is write-only telemetry; integrated to code-graph via `seed-resolver.ts` (anchor lookup) and `cocoindex-calibration.ts` (overfetch). Standalone semantic search; not in pt-01/pt-02 scope.
- **Memory backend** has 4-stage hybrid retrieval (vector → BM25 → causal-boost → rerank); Voyage-4 1024-dim cache; lexical-only trigger matching; `feedback-ledger.ts` events captured but never reach trigger-match scoring or retention decisions.
- **XCE corpus** (`external/`) — public README, 6 IDE steering files, 5 MCP configs, 3 PNG assets. PRAT internals closed-source; transferable patterns are UX shape (use-first steering) and tool-shape contracts.

---

## 5. Findings per RQ

> Full per-iter detail in `iterations/iteration-NNN.md`. Summaries below cite the strongest finding per RQ.

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/research.md.
### RQ-B1 — Memory backend semantic trigger matching (ADAPT — hybrid, not replacement)

**Critical constraint:** trigger matches activate working memory and co-activation (`memory-triggers.ts:360-380`); a wrong semantic trigger mis-prioritizes cognitive tiers. Therefore: **lexical remains primary precision path**, semantic adds paraphrase recall as gated UNION.

Design: 2-stage pipeline — (1) lexical first; (2) if lexical empty/weak, embed prompt and KNN over precomputed trigger phrase embeddings; merge with lexical precedence. Strong lexical command matches (`/memory:save`, `save context`) short-circuit the semantic stage.

Storage: derived table `memory_trigger_embeddings(memory_id, phrase, phrase_hash, model_id, dimensions, embedding_status, updated_at)`; reuse `embedding_cache` for BLOB storage (`embedding-cache.ts:45-55`). Backfill via `memory_index_scan` / save-time embedding pipeline (`embedding-pipeline.ts:143-169`); **never** embed synchronously inside trigger calls (latency budget is 30-50ms PASS / 100ms WARN per `trigger-matcher.ts:132-160`).

Flag family: `SPECKIT_SEMANTIC_TRIGGERS=false` / `_MODE=shadow|union` / `_THRESHOLD=0.84` / `_MARGIN=0.04` / `_MAX=3`. Semantic-only hits carry `matchSource: "semantic"` + reduced activation (`min(0.85, semanticScore)`) so they never masquerade as exact triggers.

LOC: ~280-430 production + ~180-280 tests.

### RQ-B2 — Memory backend LLM-curated context assembly (ADAPT shadow / DEFER active)

**Pipeline contract is retrieval-oriented** (`pipeline/README.md:33-40`): Stage 4 explicitly forbids mutating ranking from Stage 3 (`stage4-filter.ts:6-19`). Therefore curator must NOT mutate `score`/`rrfScore`/`intentAdjustedScore` in the canonical result set. Shape: post-retrieval packaging plan (selected IDs, sections, rationale labels, omissions, risk flags) attached as `data.curatedContext`.

**Budget split required:** today's `memory_search` passes single `limit` to pipeline + Stage 4 cap (`stage4-filter.ts:305-309`), blocking the proposed top-2K curator unless we add `retrievalCandidateLimit` (start with 100-300, NOT 2K) + `presentationLimit` + `curationTokenBudget`.

Cache: extend `llm-cache.ts:21-27` with `mode: 'context_curation'` + `candidateSetHash` + `intent` + `profile` + `version` keying. Hard timeout 1500-2500ms with deterministic fallback. Strict JSON schema validation: selected IDs must exist in candidate set; no invented file paths.

Flag family: `SPECKIT_CONTEXT_CURATOR=false` / `_MODE=shadow|active`. **Active mode requires Phase-005 lift evidence over deterministic profiles** (`profile-formatters.ts:4-21`).

LOC: ~290-485 production + ~220-390 tests. Strongest use case is **causal-chain-aware presentation**, not "smarter ranking" — package schema should support `{causalChain, tierExemplars, directEvidence, supportingContext, omittedButAvailable}`.

### RQ-B3 — Session-trace bounded causal-edge inference (ADOPT signal source / ADAPT reducer)

**Two critical guard fixes required before shipping:**

1. **Auto-provenance cap broadening** — `insertEdge` only checks `createdBy === 'auto'` for cap enforcement (`causal-edges.ts:269-288`); proposed `created_by='auto-session'` would BYPASS the 0.5 strength cap. Fix: `isAutoEdgeCreator(createdBy) => createdBy === 'auto' || createdBy.startsWith('auto-')`. Without this, session-derived edges can exceed NFR-R01 caps via insert/upsert.
2. **Manual-edge overwrite guard** — `insertEdge` upserts on `(source, target, relation, anchors)` tuple (`causal-edges.ts:313-338`) and updates `created_by` on conflict. Reducer must query existing edge first and skip if `created_by` is non-auto.

Design: new reducer `lib/feedback/session-trace-causal-reducer.ts`. Reads `feedback_events` ordered by `(session_id, timestamp)`; for each `result_cited(B)`, selects 3-5 earlier `search_shown(A)` IDs where `A!==B` (prefer same-query, then session-recent); emits `ENABLED(A→B)` at `strength=0.3`, `created_by='auto-session'`, `evidence='Session trace: search_shown before result_cited; session=...; query=...'`.

**Deferred reducer**, NOT live per-event side effect — feedback-ledger contract is shadow-only (`feedback-ledger.ts:4-6`); live insertion would turn passive telemetry into ranking mutation via causal-boost. Fire at session close / consolidation cycle / explicit maintenance command.

Flag: `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false`. LOC: ~170-265 production + ~165-275 tests.

### RQ-B4 — Feedback-ledger-driven learned retention/decay (ADAPT tier-gated / DEFER live mutation)

**Critical signal-quality fix:** `summary.total` (raw hit count) would reward exposure (`search_shown`) instead of usefulness. Use weighted positives: `weightedHitCount = strong + 0.25 * same_topic_requery - 0.5 * query_reformulated`, clamped at zero. Strong = `result_cited + follow_on_tool_use`.

**Critical retention basement gap:** existing scoring already treats constitutional/critical as no-decay (`tier-classifier.ts:185-213`, `importance-tiers.ts:32-55`, `fsrs-scheduler.ts:286-304`), but `memory-retention-sweep.ts:52-68` selects expired rows by `delete_after` ONLY, ignoring tier — so constitutional records can still be deleted on TTL expiry. Fix: extend `RetentionExpiredRow` + `selectExpiredRows` to include `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, `last_accessed`; emit `RetentionDecision: 'delete' | 'extend' | 'protect'` per candidate.

Decision rules: constitutional/critical → `protect`; pinned → `protect` or extend; important + positive weighted hits → `extend` by `baseTtl × min(2, 1 + log10(weightedHitCount))`; normal/temporary → no positive boost in v1.

**Edge floor narrowness:** blanket `strength≥0.7` floor for any edge touching constitutional memory is too broad. Apply only to manual/authored edges where BOTH endpoints are constitutional/critical, OR explicit constitutional-chain evidence marker. Auto-derived RQ-B3 edges remain capped at 0.5 with normal decay.

**Live TTL/decay mutation deferred** until shadow eval (copy `shadow-scoring.ts:1-15` weekly-cycle promotion-gate pattern). LOC: ~215-385 production + ~225-385 tests.

### RQ-B5 — Cross-cutting: shared embedding cache + rerank infra (ADAPT clients / DEFER store / SKIP indexers)

**Shared rerank is the highest-leverage part.** Memory `cross-encoder.ts:35-554` already has provider-generic Voyage/Cohere/local layer with caching, caps, circuit breaker, score-origin metadata. Extract `RerankClient<T>` interface; CocoIndex consumes via candidate adapter (`QueryResult` ↔ rerank document). NO sharing of memory pipeline stages, MMR over `vec_memories`, MPAB chunk reassembly, code-language chunking, path-class semantics, or causal-graph metadata.

**Shared persistent embedding storage NOT yet earned.** Memory cache key already content-addressed and model-scoped (`embedding-cache.ts:47-55`). Voyage Code 3 and Voyage 4 are both 1024-dim but `model_id` MUST remain a hard cache dimension (cross-domain duplicate content likely low). Define `EmbeddingCacheClient` interface + memory adapter now (~80-140 LOC); shared store deferred until shadow telemetry shows cross-backend hit-rate overlap.

LOC: ~220-380 production + ~120-220 tests for both clients/adapters; persistent shared storage = later add-on.

---

## 6. Adoption Matrix

| RQ | Verdict | LOC (prod + tests) | Hard dependencies | Soft dependencies |
|---|---|---|---|---|
| **RQ-A1** Coco intent steering + query expansion | **ADAPT** | ~220-320 + focused | — | Phase-004 (advisor wording); Phase-005 (default-on) |
| **RQ-A2** Coco HLD/LLD rerank | **ADAPT design / DEFER active** | ~150-240 incl. tests | **Phase-001** | Phase-005 |
| **RQ-A3** ccc_feedback active rerank loop | **ADAPT** | ~250-370 + ~90-150 | — | RQ-A1 (intent tags); Phase-005 (promotion) |
| **RQ-A4** Few-shot example bank | **ADAPT design / DEFER default-on** | ~320-500 + ~120-180 | — | RQ-A3 (signal quality); RQ-A1 (intent tags); Phase-005 |
| **RQ-A5** Coco + graph fused rerank | **ADAPT design / DEFER active** | ~180-300 + ~80-140 | **Phase-001+002+003** | Phase-005 |
| **RQ-B1** Semantic trigger matching | **ADAPT** | ~280-430 + ~180-280 | — | Phase-005 (threshold tuning) |
| **RQ-B2** LLM-curated memory_context | **ADAPT shadow / DEFER active** | ~290-485 + ~220-390 | shipped 4-stage pipeline | Phase-005; RQ-B1 (better candidates) |
| **RQ-B3** Session-trace causal edges | **ADOPT signal / ADAPT reducer** | ~170-265 + ~165-275 | feedback-ledger; auto-provenance fix | RQ-B4 (shared aggregation) |
| **RQ-B4** Learned retention/decay | **ADAPT / DEFER live mutation** | ~215-385 + ~225-385 | tier-classifier; sweep; importance-tiers | RQ-B3 (shared aggregation) |
| **RQ-B5** Shared cache + rerank infra | **ADAPT clients / DEFER store / SKIP indexers** | ~220-380 + ~120-220 | existing cross-encoder | Phase-005; RQ-A/B consumers |

**Verdict diversity (quality guard):** ADOPT (RQ-B3 signal source), ADAPT (every other RQ — bounded design recommendations), DEFER (RQ-A2/A4/A5/B2/B4/B5 active mode), SKIP (RQ-B5 shared indexers; XCE closed PRAT internals from RQ-A1 finding). All four verdict classes present. ✓

---

## 7. Proposed Phase 006+ Scaffolds

> Ordered by leverage / dependency. Phases 006-007 are standalone-shippable; 008-009 enable the deferred phases to mature.

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/research.md.
### Phase 007: `007-memory-semantic-triggers` — L2/L3, ~350-520 LOC, ADAPT
**Covers:** RQ-B1.
**Scope:** hybrid lexical+semantic trigger matcher; trigger-embedding backfill via `memory_index_scan` + save-time pipeline; lexical precedence with semantic UNION fallback; flag family `SPECKIT_SEMANTIC_TRIGGERS_*`; activation guards (semantic-only hits at reduced attention `min(0.85, semanticScore)`); shadow-first rollout with `0.84` threshold + `0.04` margin.
**Dependencies:** existing Voyage cache + provider auto-resolution + `embedding_cache` table. Shipping needs no new infrastructure.
**Risk:** false semantic triggers mis-prioritize cognitive tiers (working-memory activation, co-activation spreading). Mitigated by lexical short-circuit on strong command matches + reduced activation + source-tagged telemetry + shadow eval before active mode.

### Phase 008: `008-feedback-reducers` — L3, ~400-650 LOC, ADAPT
**Covers:** RQ-A3 + RQ-B3 + RQ-B4 — shared aggregation layer with three downstream consumers.
**Scope:** shared `feedback-aggregation` reducer (`feedback_events` → strong/medium/weak counts, sessions, queries, weighted positives) + three independent decision-makers: (a) coco rerank-weight reducer + ±0.10 clamped delta application; (b) session-trace causal-edge reducer + auto-provenance cap fix + manual-edge overwrite guard; (c) retention-decision reducer + sweep integration with `protect`/`extend`/`delete` actions + tier-basement gap fix.
**Dependencies:** `feedback-ledger.ts`, `causal-edges.ts`, `memory-retention-sweep.ts`, `consolidation.ts`, `importance-tiers.ts`. Two precondition fixes required: (i) `isAutoEdgeCreator` predicate broadening; (ii) `RetentionExpiredRow` schema extension.
**Risk:** retention/causal mutation is governance — copy `shadow-scoring.ts` weekly-cycle promotion-gate pattern. Live mutation requires shadow eval window with metrics (prevented-then-cited deletes; extended-then-unused records; stale retained ratio; constitutional delete-prevention count).

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/research.md.
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
| **Auto-provenance cap bypass** | RQ-B3 reducer with `created_by='auto-session'` | **P0** | Fix `isAutoEdgeCreator` predicate before reducer ships; OR use `created_by='auto'` + `evidence='session-trace'` |
| **Manual edge overwrite** | RQ-B3 `insertEdge` upsert with no provenance check | **P0** | Reducer queries existing edge first; skip if `created_by` is non-auto |
| **Constitutional/critical record deletion via TTL expiry** | RQ-B4 retention-sweep tier-basement gap | **P0** | Extend `RetentionExpiredRow` schema + tier-aware decision before any feedback-driven extension lands |
| **Shared indexing pipeline abstraction leak** | RQ-B5 shared infra ambition creep | **P0** | SKIP is binding — reject any "shared retrieval engine" RFC. Client surface only |
| **Active fusion ships without Phases 001-003 inputs** | RQ-A2 / RQ-A5 active mode | **P0** | DEFER is binding. Pre-work = interface/type contract + shadow telemetry only |
| **False semantic triggers mis-prioritize cognitive tiers** | RQ-B1 active union mode | **P1** | Lexical precedence + reduced activation `min(0.85, semanticScore)` + source-tagged telemetry + shadow eval |
| **LLM curator nondeterminism affects retrieval trust** | RQ-B2 active mode | **P1** | Default-off + strict timeout (1500-2500ms) + deterministic fallback + JSON schema validation + Phase-005 lift requirement |
| **Query expansion precision loss** | RQ-A1 default-on too early | **P1** | 3-embedding ceiling + exact-intent suppression + `rankingSignals` transparency + Phase-005 evaluation |
| **Stale HLD/LLD sidecar produces wrong boosts** | RQ-A2 freshness gap | **P1** | Sidecar carries `content_hash` + `file_mtime_ms` + graph-fingerprint; suppress boost on mismatch + emit `hld_rerank_skipped_stale` telemetry |
| **Stale exemplar references in coco** | RQ-A4 example bank | **P1** | TTL ~90 days + reconciliation via `content_hash` + line-range checks + bounded growth (1000-2000 rows) |
| **Feedback-driven retention rewards exposure not usefulness** | RQ-B4 raw `hit_count` design | **P1** | Use weighted positives (`strong + 0.25*same_topic_requery - 0.5*query_reformulated`); never raw `summary.total` |
| **Edge floor protects noisy auto-derived edges** | RQ-B4 blanket `0.7` floor | **P1** | Floor only for manual/authored edges with BOTH endpoints constitutional/critical, OR explicit constitutional-chain evidence |
| **Cross-system telemetry retention beyond local/default-off assumptions** | RQ-A4 / RQ-B5 privacy | **P2** | Aggregate counts/deltas only in learned tables; raw comments stay in audit JSONL; documented opt-out + clear-history maintenance ops |
| **Embedding cost from per-prompt embedding under semantic triggers** | RQ-B1 latency budget | **P2** | Lexical short-circuit on strong command matches; semantic only when lexical empty/weak; backfill not synchronous embed |

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

## 13. References (file:line index)

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/research.md.
### System-spec-kit memory backend

- `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:132-160, 201-545, 749-880` — current lexical trigger matching
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:155-430` — trigger handler, activation, scope filtering
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:953-1031, 1595-1808` — memory_context strategy + intent routing
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:900-1625` — V2 pipeline + caching + feedback logging
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:45-215` — persistent embedding cache schema
- `.opencode/skills/system-spec-kit/mcp_server/lib/embeddings/embedding-pipeline.ts:114-169` — save-time embedding lookup/generate/store
- `.opencode/skills/system-spec-kit/mcp_server/lib/embeddings/factory.ts:88-364` — provider auto-resolution (Voyage default `voyage-4`)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:13-218` — semantic query-expansion precedent
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md:15-111` — 4-stage pipeline contract
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:6-465` — rerank stage + cross-encoder adapter
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:6-317` — filter/cap, ordering immutability
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35-554` — provider-generic rerank with cache + circuit breaker
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:9-784` — intent-aware causal boost, sparse-first traversal, neighbor injection
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-cache.ts:4-127` — LLM cache TTL/LRU pattern
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:321-371` — LLM call + cache + fail-open precedent

### Causal graph + retention + feedback

- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18-1038` — relations, NFR-R01 caps, insertEdge, batch, weight history, createSpecDocumentChain
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:330-400` — Hebbian decay cycle, stale-edge detection
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:17-195` — current TTL-only retention sweep
- `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:1-338` — event schema, confidence hierarchy, queries
- `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:1-494` — promotion-gate weekly-cycle pattern
- `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:1-48` — `MAX_BOOST_DELTA = 0.10` precedent
- `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:185-303` — null half-life for constitutional/critical
- `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/importance-tiers.ts:32-119` — tier `decay: false` policy
- `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:286-304` — Infinity stability for constitutional/critical
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts:610-621, 2375-2393` — causal_edges uniqueness, retention columns

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/research.md.
### Pt-01 + pt-02 continuity

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-01/research.md:117-126, 176-181` — XCE non-adoption boundary
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-02/research.md:43-47, 144` — Phase-004 guardrails note + pt-03 trigger
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:137-144` — packet scope including coco scope-out
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md:82-167` — Phase 001 generator schema
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md:45-142` — Phase 001 plan + classifyFileRole contract
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/implementation-summary.md:27-40` — Phase 001 not-implemented status
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace/spec.md:29-88` — Phase 002 trace + role dependency
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis/spec.md:30-131` — Phase 003 risk signals + normalizers
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/implementation-summary.md:53-115` — prior coco rerank precedent + sandbox limits

### Resource map

- `{spec_folder}/resource-map.md` — `present=true` confirmed at packet root; entries list for spec-folder coverage

---

## 14. Convergence Report

- **Stop reason:** `max_iterations_with_synthesis` (configured 10-iter cap reached with all RQs answered).
- **Total iterations:** 10
- **Questions answered:** 10 / 10 (RQ-A1..A5 + RQ-B1..B5)
- **Remaining questions:** 0
- **Last 3 iter newInfoRatio:** iter 8: 0.62 (RQ-B3) → iter 9: 0.58 (RQ-B4) → iter 10: 0.47 (RQ-B5 + synthesis prep)
- **Convergence threshold:** 0.05 (configured); not triggered before max_iter because each RQ is a distinct topic by design (3-signal vote not applicable to multi-RQ research)
- **Verdict diversity quality guard:** ✓ all 4 verdict classes present (ADOPT/ADAPT/DEFER/SKIP)
- **Evidence density quality guard:** ✓ ≥3 file:line citations per RQ verdict (most RQs have 6+ findings each)
- **Cross-phase dependencies quality guard:** ✓ each ADOPT/ADAPT entry declares dependencies on existing 027 phases or notes "none"

---

## 15. Appendix — Per-iteration index

| Iter | RQ | Focus | newInfoRatio | Duration | Findings |
|---|---|---|---|---|---|
| 1 | RQ-A1 | Coco intent steering + query expansion | 0.82 | 155s | 5 (1×SKIP closed-source PRAT internals + 4×ADAPT) |
| 2 | RQ-A2 | Coco HLD/LLD rerank fusion | 0.74 | 166s | 5 (1×DEFER active impl + 4×ADAPT design) |
| 3 | RQ-A3 | ccc_feedback active rerank loop | 0.68 | 185s | 5 (5×ADAPT) |
| 4 | RQ-A4 | Few-shot example bank | 0.61 | 194s | 6 (1×ADAPT-with-flag + 5×ADAPT design with default-on DEFER) |
| 5 | RQ-A5 | Coco + graph fused rerank | 0.56 | 154s | 6 (2×DEFER + 4×ADAPT design with active DEFER) |
| 6 | RQ-B1 | Memory semantic triggers | 0.64 | 288s | 6 (6×ADAPT — variants: not-replace / with-flag / with-shadow-first / with-guards) |
| 7 | RQ-B2 | LLM-curated memory_context | 0.59 | 199s | 6 (1×DEFER + 5×ADAPT — variants: shadow-first / cache-reuse / chain-aware / budget-split) |
| 8 | RQ-B3 | Session-trace causal edges | 0.62 | 182s | 6 (1×ADOPT signal + 5×ADAPT — variants: auto-provenance fix / deferred reducer / manual-edge guard / boost guards / precedent caveat) |
| 9 | RQ-B4 | Learned retention/decay | 0.58 | 172s | 6 (1×DEFER live mutation + 5×ADAPT — variants: strong-signal weighting / sweep-decision reducer / retention basement / edge floor narrow / formula with guards) |
| 10 | RQ-B5 | Shared cache + rerank infra | 0.47 | 275s | 5 (1×SKIP shared indexers + 1×DEFER shared store + 3×ADAPT clients) + synthesis-prep record with phase scaffolds |

**Total findings:** 56 distinct ADOPT/ADAPT/DEFER/SKIP records across 10 iters.
**Total iter narrative:** 138 KB.
**Total delta JSONL:** 22 KB.
**Total wall:** ~33 minutes.
