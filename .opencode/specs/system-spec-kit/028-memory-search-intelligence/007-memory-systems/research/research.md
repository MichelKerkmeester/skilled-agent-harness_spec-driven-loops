---
title: "Research Report: External Memory Systems — Search-Intelligence Mining (028 child 007)"
description: "4-model mining of Mem0, Graphiti/Zep, Letta/MemGPT, Cognee for novelty-diffed Memory MCP (+ Advisor, Deep-Loop) improvements. PARTIAL — first wave banked (3-4 systems), remaining iterations handed off."
trigger_phrases:
  - "028 memory systems research report"
  - "mem0 graphiti letta cognee findings"
  - "agent memory search intelligence mining"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-memory-systems"
    last_updated_at: "2026-06-17T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Banked iters 19-22: Cognee ECL + Letta sleep-time frontier, 2 new initiatives"
    next_safe_action: "Verify/scope wave 23-26, then write synthesis/06 + roadmap addendum"
    blockers: []
    key_files:
      - "research/research.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-007-memory-systems"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---

# Research Report: External Memory Systems — Search-Intelligence Mining

> **Status: PARTIAL (first wave banked).** 4-model sweep (DeepSeek v4 Pro · MiMo v2.5 Pro · Kimi K2.7 · Opus 4.8) mining Mem0, Graphiti/Zep, Letta/MemGPT, Cognee for Memory MCP (+ Advisor fusion, Deep-Loop continuity). Every candidate is novelty-tagged vs already-mined work (aionforge + galadriel [028]; OpenLTM + memclaw [027]). Research-only.

## Progress (banked)
| Iter | Model | System | Candidates | Status |
|---|---|---|---|---|
| 1 | DeepSeek v4 Pro | Mem0 | 5 | ✅ banked |
| 2 | Opus 4.8 (claude2) | Cognee | 8 (+novelty-diff) | ✅ banked |
| 3 | MiMo v2.5 Pro | Graphiti/Zep | 6 | ✅ banked |
| 4 | DeepSeek (Kimi reassigned — timed out 2×) | Letta/MemGPT | 5 | ✅ banked |
| 5 | Kimi K2.7 (fix proven: tight+1200s+no-variant) | Letta (cross-check) | 1 | ✅ banked |
| 6 | **Opus 4.8 NATIVE** (Agent `model:opus`, not claude2) | adversarial-verify (all systems) | verdicts | ✅ banked |
| 7 | DeepSeek v4 Pro | Mem0 merge/scoring (deep) | 1 NET-NEW + 2 NO-TRANSFER (saturated) | ✅ banked |
| 8 | MiMo v2.5 Pro | Graphiti community + Cognee retrievers | 8 (5 NET-NEW) | ✅ banked |
| 9 | **Opus 4.8 NATIVE** | verify-2 (iter-1..5 remainder) | 7 GO / 5 REFINE / 0 refute | ✅ banked |
| 10 | **Opus 4.8 NATIVE** | blast-radius `GR-llm-fact-invalidation` | GO-scoped (SMALL, reader-transparent) | ✅ banked |
| 11 | DeepSeek v4 Pro | Cognee retriever internals (agentic/lexical/NL) | 2 NET-NEW + 2 EXTENDS + 1 no-transfer | ✅ banked |
| 12 | MiMo v2.5 Pro | Letta tiers/budgeting + Cognee summary | 2 NET-NEW + 2 EXTENDS + 1 dup | ✅ banked |
| 13 | **Opus 4.8 NATIVE** | verify iter-8 (Cognee/community) | **3 REFUTE / 2 GO / 2 REFINE** (major correction) | ✅ banked |
| 14 | **Opus 4.8 NATIVE** | cross-cutting → Advisor + Deep-Loop (Q9) | 4 deep-loop + 2 advisor + 4 no-transfer | ✅ banked |
| 15 | DeepSeek v4 Pro | forgetting/decay/contradiction (Q7) | 2 new (1× H/S) + 3 overlap/gated | ✅ banked |
| 16 | MiMo v2.5 Pro | ranking determinism (Q6) | **0 new — internal C5 already complete** | ✅ banked |
| 17 | **Opus 4.8 NATIVE** | verify iter-11/12 NET-NEWs | 2 GO + 2 REFINE + merge confirmed | ✅ banked |
| 18 | **Opus 4.8 NATIVE** | consolidation + tiering (synthesis input) | 5 merges, Wave-0/1/2, top-7 | ✅ banked |
| 19 | DeepSeek v4 Pro | Cognee ECL ingest + retriever depth | 1 cheap win + 2 → semantic-edge-layer | ✅ banked |
| 20 | MiMo v2.5 Pro | Letta sleep-time / archival / blocks | 3 → async-sleeptime-consolidation + governor | ✅ banked |
| 21 | **Opus 4.8 NATIVE** | Graphiti dedup + verify iter-15 invalidation | 2 GO + 1 Wave-2 + semantic-edge convergence | ✅ banked |
| 22 | **Opus 4.8 NATIVE** | blast-radius scope top-3 GOs | 2 effort corrections (L not H/L · L not M/M) | ✅ banked |

**~60 candidates surfaced across all 4 systems (net of refutes); all 4 model contracts proven (22 of 40 iters complete). Wave 19-22 frontier was genuinely productive — two new initiatives + roadmap effort corrections (below).** Per-iteration detail: `iterations/iteration-0{01..10}.md` + `deltas/iter-0{01..10}.jsonl`. **Iter-6 native-Opus adversarial-verify (net-deflationary): 1 REFUTED — `CG-composite-edge-dedup` is already implemented (insertEdge superset key); 2 DOWNGRADED NET-NEW→EXTENDS (`CG-uuid5-entity-merge`, `M0-adaptive-additive-fusion`); 1 clean GO (`GR-llm-fact-invalidation`); 1 REFUTE-as-framed (`LT-self-edit-char-limit-blocks`). Iter-9 verify-2 settled the remainder (7 GO, 0 hard-refutes; `CG-incremental-edge-merge` re-scoped to perf-only). Iter-10 scoped the spearhead: `GR-llm-fact-invalidation` event-time-close half = SMALL + reader-transparent, fits C3-A, no C3-B. Systemic caveat: the internal causal graph is memory-ID→memory-ID, NOT entity-node, and there is NO episode model — every Cognee/Graphiti community/episode `maps_to` carries a structural prerequisite.**

## Top picks so far (by leverage × effort)
- **CG-uuid5-entity-merge** (Cognee, NET-NEW, **H/S**) — deterministic `uuid5(normalized-name)` entity identity → same name auto-merges at write, zero LLM. → causal-graph entity creation.
- **CG-composite-edge-dedup** (Cognee, NET-NEW, **H/S**) — edges dedup on `src+rel+tgt` key → idempotent relationship writes. → `causal-edges.ts`.
- **GR-llm-fact-invalidation** (Graphiti, EXTENDS C3-A/B, **H/M**) — LLM-discovered contradictions close old edges with event-time `invalid_at = new.valid_at` (vs internal rule-based `invalid_at = now()`).
- **M0-entity-store-boost** (Mem0, NET-NEW, H/M) — separate entity vector index boosting linked memories at search.
- **GR-fact-embedding-on-edge** (Graphiti, NET-NEW, M/M) — semantic embedding on edges → semantic edge dedup + similarity edge retrieval.
- **CG-iterative-context-extension** (Cognee, NET-NEW, H/M) — answer-as-next-query graph retrieval with convergence stop.

> **⚠ Corrected by iter-6 native-Opus adversarial-verify (vs live internal code):** `CG-composite-edge-dedup` is **REFUTED** (already implemented — drop it). `CG-uuid5-entity-merge` is **EXTENDS not NET-NEW** (entity_catalog already merges on normalized canonical name) and is mis-mapped (causal graph is memory-ID, not entity-node). The durable spearhead is **`GR-llm-fact-invalidation`** (event-time-close half = small, well-scoped GO). Treat any candidate whose `maps_to` assumes an entity-node graph as needing a memory-ID-graph reframe first.

## Per-system findings
- **Mem0** (iter 1): entity-store boost, adaptive channel-gated additive fusion (alt to RRF), query-length-adaptive BM25 sigmoid (EXTENDS aionforge), entity cardinality penalty, LLM memory-linking at extraction (EXTENDS memclaw).
- **Cognee** (iter 2): uuid5 entity-merge, composite-edge dedup, incremental edge merge, ontology canonicalization, iterative context-extension retrieval, neighborhood rescore ranking (EXTENDS Mem0), cascade extraction (EXTENDS Mem0), schema-driven edges. Supersedes Mem0's dedup half (zero-LLM).
- **Graphiti** (iter 3): 5-timestamp edge (EXTENDS C3-B), LLM fact-invalidation (EXTENDS C3-A/B), episode provenance, fact-embedding-on-edge, episode-window context; **NO-TRANSFER** on 3-channel RRF (ours is a superset).
- **Letta** (iter 4, DeepSeek — Kimi reassigned): self-edit char-limit blocks (EXTENDS C7-A, H/M — model-aware eviction vs blind cap), compaction fallback ladder (NET-NEW), sliding-window %-keep (EXTENDS C7-A), external-memory-size-injected-into-prompt, approx token counter (bytes/4×1.3).

### Wave-2 additions (iters 7-10)
- **Mem0** (iter 7, DeepSeek — near-saturated): `M0-spacy-lemmatization-bm25` (NET-NEW, M/M — pre-index+pre-query lemmatization → consistent verb-form keyword matching, our FTS doesn't lemmatize); `M0-add-only-extraction-pass` (thin EXTENDS); 2 NO-TRANSFER (`M0-update-entity-cleanup` — we already `refreshAutoEntitiesForMemory`; `M0-pre-fusion-threshold-gate` — we already gate Stage-1/4). Rest re-confirm iter-1 candidates. **Mem0 scoring/merge mined out.**
- **Cognee retriever zoo** (iter 8, MiMo — richest fresh vein): `CG-cot-validate-retrieve-loop` (NET-NEW H/M — validate→follow-up→retrieve-again, we're single-pass); `CG-query-decomposition` (NET-NEW H/M — subquery decompose→parallel retrieve→merge); `CG-temporal-query-extraction` (NET-NEW H/M — extract time-interval from query→filter events, **high C3-x cross-fit**); `CG-question-type-router` (EXTENDS intent, M/S — 10-way type→retriever routing); `CG-context-extension-convergence` (EXTENDS banked, M/S). These map to a **multi-strategy `memory_context`**, dodging the entity-node mismatch.
- **Graphiti community** (iter 8, MiMo — gated): `GR-community-label-propagation` (NET-NEW H/M), `GR-community-pairwise-summary` (NET-NEW M/M), `GR-community-search-channel` (EXTENDS adaptive-fusion H/M). All **gated on the entity-node reframe** (internal graph is memory-ID).
- **Verify-2** (iter 9, Opus native): 7 GO settled (CG-iterative-context-extension, CG-cascade-extraction, GR-five-timestamp-edge[expired_at], M0-llm-memory-linking, M0-bm25-sigmoid-calibration, M0-entity-cardinality-penalty, LT-compaction-fallback-ladder); 5 REFINE (`CG-incremental-edge-merge` re-scoped to batch-preload perf — most-likely-wrong; ontology→class-snap only; neighborhood-rescore→feedback_weight; both GR-episode-* gated on a non-existent episode model); **0 hard-refutes** → banked set settled.
- **Spearhead blast-radius** (iter 10, Opus native): `GR-llm-fact-invalidation` event-time-close half = **SMALL + reader-transparent** (all 3 readers of `causal_edges.invalid_at` use binary `IS NULL`: contradiction-detection.ts:89, temporal-edges.ts:111-122, relation-backfill.ts:700,721; recall + sweep don't read it). Fits **C3-A (S)**, no C3-B. CAVEAT: derive the close timestamp from **lineage** (canonical writer); do NOT add a `WHERE invalid_at < now()` reader (would break the tombstone-column reader-transparency).

### Wave-3 additions (iters 11-14)
- **Cognee retriever internals** (iter 11, DeepSeek): `CG-agentic-tool-loop` (**NET-NEW H/L — headline**: ReAct tool-loop → a new `memory_context` strategy, `agentic_retriever.py:419-478`); `CG-post-retrieval-summarization` (NET-NEW L/S); `CG-pluggable-lexical-architecture` + `CG-jaccard-lexical-channel` (paired EXTENDS — injectable tokenizer/scorer channel); `CG-query-generation-retry-loop` (NO-TRANSFER — assumes entity-node Cypher introspection).
- **Letta tiers + Cognee summary** (iter 12, MiMo): `LT-per-component-recall-budget` (**NET-NEW H/M** — 9-section independent token budgets vs our single pressure ratio); `CG-summary-retrieval-channel` (NET-NEW M/M — **converges with GR-community-search-channel**); `LT-tiered-compression-in-recall` (EXTENDS — internal tier-classifier already mirrors Letta's `summaryFallbackLength=150` for counts, not per-result density); `LT-eviction-percentage-ratchet` (EXTENDS).
- **⚠ MAJOR CORRECTION** (iter 13, Opus native, host-verified): my own iter-8 claims "no community layer" and "no query-decomposition" were **WRONG**. Internal **community layer exists** (`lib/graph/community-detection.ts` BFS+Louvain + `community-summaries.ts`, wired `checkpoints.ts:1942-1948`, default-ON, clusters memory-IDs) and **query-decomposition exists** (`query-decomposer.ts` wired `stage1-candidate-gen.ts:489`, deep-only, rule-based). So **3 REFUTES** (`CG-query-decomposition`, `GR-community-label-propagation`, `GR-community-pairwise-summary`). Survivors: `CG-cot-validate-retrieve-loop` + `CG-temporal-query-extraction` (clean GO); `GR-community-search-channel` (REFINE — community/summaries exist but are injected only as a weak-result fallback at `memory-search.ts:1158`, never as a fused RRF channel → promoting to a fused channel is the real candidate, consolidating CG-summary-retrieval-channel).
- **Cross-cutting** (iter 14, Opus native): **the Cognee retrieval-loop cluster transfers to DEEP-LOOP** (the deep-research iteration cycle is itself a retrieval loop). **TOP: `CG-iterative-context-extension → deep-loop`** (`reduce-state.cjs:538 resolveNextFocus`; convergence-stop already built — derive next-focus from the prior answer). Plus `CG-cot`/`CG-query-decomposition`/`CG-question-type-router` → deep-loop (stack on key-questions/focusTrack). Advisor: `M0-bm25-sigmoid` → `bm25.ts:277` (EXTENDS, but **shadow-lane only**); `M0-entity-cardinality` → near-no-op at ~22-skill scale. 4 NO-TRANSFER (invalidation/memory-linking/temporal = Memory-only; advisor runs its OWN fusion, not Memory's shared algos).

### Wave-4 additions (iters 15-18) — frontier + verify + consolidation
- **Forgetting/contradiction** (iter 15, DeepSeek, Q7): `GR-temporal-ordering-invalidation` (**EXTENDS, H/S** — auto-invalidate when old.valid_at < new.valid_at, beyond relation-pairs; `contradiction-detection.ts:38-55`) + `GR-semantic-invalidation-discovery` (NET-NEW M/M — find invalidation candidates by semantic search across *different* node pairs; `:84-93`). Both fold into the invalidation spearhead cluster. Mem0 forgetting = gated on entity nodes.
- **Determinism** (iter 16, MiMo, Q6 — NEGATIVE): **internal C5 determinism is already complete** (deterministic tiebreak triple, canonical RRF-id normalization, stable cosine-head reorder, tier-retire dedup, content-addressed embedding cache, typed-degree log-norm — all already implemented). No net-new transfer. (MiMo couldn't read the gitignored external repos, so the diff is one-sided — but the internal audit stands.)
- **Verify NET-NEWs** (iter 17, Opus native): `CG-agentic-tool-loop` **GO** (H/L — confirmed static mode router, no tool loop) · `LT-per-component-recall-budget` **GO** (single flat pressure ratio, no per-section budget) · `CG-post-retrieval-summarization` REFINE (no *LLM* compression, but structural truncation exists) · `CG-summary-retrieval-channel` REFINE → **merges with `GR-community-search-channel`** (neither is a *weighted RRF lane*).

## Consolidated roadmap (iter 18 — synthesis-ready)
Five merged candidates + the top-7. **Research-only: this is the candidate roadmap; implementation is a separate packet (028 §3).**

| # | Candidate | Value | lev/eff | Seam | Subsystem |
|---|---|---|---|---|---|
| 1 | **MEM-fact-invalidation-event-time** | close superseded edges at event-time not `now()` — correct bitemporal history, reader-transparent | H/**S** | `temporal-edges.ts:81-96` | Memory |
| 2 | **CG-iterative-context-extension** | answer-as-next-query recall w/ convergence stop | H/M | `memory-context.ts` + `reduce-state.cjs:538` | Memory (+Deep-Loop) |
| 3 | **CG-agentic-tool-loop** | ReAct tool-loop as a new `memory_context` strategy | **H/L** | `memory-context.ts:1291-1311` | Memory |
| 4 | **MEM-fused-summary-channel** | promote built community-summaries from fallback → fused RRF lane | M/M | `hybrid-search.ts:1394-1439` | Memory |
| 5 | **MEM-tiered-recall-budget** | per-section/per-tier budgets vs one flat pressure ratio | H/M | `pressure-monitor.ts` + `memory-context.ts` | Memory |
| 6 | **LT-compaction-fallback-ladder** | summarize tier before hard truncation | M/S | `memory-context.ts:492-532` | Memory |
| 7 | **DL-iterative-retrieval-loop** | derive next-focus from prior answer (convergence built) | H/M | `reduce-state.cjs:538` | Deep-Loop |

Merges: `MEM-fact-invalidation-event-time` = GR-llm-fact-invalidation(event-time) + GR-five-timestamp(expired_at) + GR-temporal-ordering + GR-semantic-invalidation. `MEM-fused-summary-channel` = CG-summary-retrieval-channel + GR-community-search-channel. `MEM-tiered-recall-budget` = LT-per-component + LT-tiered-compression + LT-eviction-ratchet. `DL-iterative-retrieval-loop` = CG-iterative-context-extension + CG-cot + CG-query-decomposition + CG-question-type-router (deep-loop targets).

### Wave-5 corrections + two new initiatives (iters 19-22)
**Blast-radius effort corrections (iter 22 — finder lev/eff was optimistic):**
- **`CG-agentic-tool-loop`: H/L → actually L effort.** Same clean new-`case` seam, but it injects an LLM into the *synchronous deterministic* retrieval hot path with no loop/cost governor (all greenfield). Needs its own design packet — NOT the cheap top-3 win it looked like. (Mitigant: `LT-tool-rule-memory-chain` below is a ready governor.)
- **`MEM-fused-summary-channel`: M/M → actually L.** Not single-site — 5 hardcoded channel-list sites + the adaptive-weight model has no per-channel slot + double-counting risk + an ablation-tuned retune obligation.
- **Smallest safe ships remain `MEM-fact-invalidation-event-time` (H/S) and `CG-iterative-context-extension` (M, one-site, flag-gated, only net-new = convergence-stop).**

**New initiative A — "semantic edge layer" (Wave-2, high-effort):** consolidates `CG-edge-vector-index` + `CG-edge-aware-triplet-search` (iter 19) + `GR-semantic-fact-dedup-merge` (iter 21) + `GR-semantic-invalidation-discovery` + `GR-fact-embedding-on-edge`. All require the *same* substrate our memory-ID graph lacks: per-edge embeddings + semantic edge retrieval. One coherent initiative, not separate ships.

**New initiative B — "async sleep-time consolidation" (NET-NEW architectural direction):** `LT-bg-sleeptime-agent` (H/M) + `LT-turn-cadence-trigger` (M/S) + `LT-llm-transcript-chunking` (M/M). Background, cadence-gated memory reorganization that LLM-selects transcript ranges to archive — distinct from our synchronous on-save `reconsolidation-bridge.ts`.

**Cheap wins added:** `CG-declarative-regex-entity-config` (L/S — JSON entity patterns vs hardcoded 5 rules) · `LT-turn-cadence-trigger` (M/S) · `GR-temporal-ordering-invalidation` (H/S, scope to conflicting relation-pairs). **To verify:** `CG-content-hash-reprocessing-trigger` + `CG-graph-neighborhood-projection` (vs existing reindex / `enableCausalBoost`).

## Saturation read (22/40)
**The Mem0/determinism/verify backbone is saturated; the Cognee-ECL + Letta-sleep-time frontier (waves 19-22) was genuinely productive — two new initiatives + a cheap-win + roadmap effort corrections.** newInfoRatio: Mem0/determinism veins collapsed (iter-16 = 0.1), but the un-mined ingest/sleep-time veins returned 0.7. Settled & host-verified: memory-ID graph (not entity-node), no episode model, internal already has community detection + query-decomposition + multi-channel RRF + FSRS + a complete determinism layer; the recurring gate is the absent **semantic edge layer** (per-edge embeddings).

**Frontier now largely covered.** Remaining genuine work for 23-40: (a) **verify** `CG-content-hash-reprocessing-trigger` + `CG-graph-neighborhood-projection` (vs reindex / `enableCausalBoost`) + the iter-19/20 NET-NEWs; (b) **blast-radius scope** the remaining GOs (MEM-tiered-recall-budget, the two new initiatives, LT-bg-sleeptime-agent); (c) **synthesis/06** (before→after, matching sibling 05) + roadmap addendum. Per the strategy STOP CONDITION, this is verify + scope + synthesize — discovery is near-exhausted (further finder waves would re-surface or pad). **Recommendation: 1 verify/scope wave (23-26), then write synthesis/06 and present; padding to exactly 40 with low-yield finder iterations is explicitly discouraged by the strategy.**

## Honest status / open issues
- **Kimi K2.7 timeout — DIAGNOSED (not broken).** `kimi-for-coding/k2p7 --variant high` timed out 2× at 600s with **zero stdout**, but its 65 KB **stderr shows it was working productively the whole time** — it read `external/letta/` by explicit path (`rg --no-ignore` + explicit `Read`s; the gitignore-fix worked) and simply **over-explored past the 600s budget** (many file reads across agent_manager/block_manager/orm/context-window/passage/archive) before reaching the final-output stage. opencode writes only the *final* assistant message to stdout, so a mid-stream `gtimeout` kill = 0 bytes. Root cause: **under-budgeted + over-scoped at high reasoning on a 1185-file repo** (DeepSeek finished the same task because it's more decisive). **Fix for the Kimi lineage:** (a) timeout **1200s+**, (b) hard per-seat scope + read-cap in the prompt ("read ≤N files then emit, do not keep browsing"), optionally (c) drop `--variant high`. **CONFIRMED FIXED:** the tight + ≤4-read-cap + 1200s + no-`--variant` relaunch returned a **clean 863-byte block in exactly 4 reads (exit 0)** — Kimi's contract is proven and its 10-iter lineage is unblocked with this config. (Bonus: Kimi's read refined iter-4 — Letta's core-memory char-limit is *advisory only* with no auto-eviction, so a block-size compaction trigger is net-new / NO-TRANSFER — see iter-5.) **All four model dispatch contracts now proven.**
- **Proven contracts:** `deepseek/deepseek-v4-pro --variant high`, `xiaomi/mimo-v2.5-pro --variant high` (both via `opencode run`), and Opus via claude2 (`-p --model opus --permission-mode bypassPermissions` + read-only prompt — NOT plan mode, which truncates stdout).
- **gitignore gotcha:** `external/` is gitignored, so opencode Glob/grep cannot discover the cloned repos. Seats MUST `ls` + Read/`cat` explicit paths. (MiMo fell back to fetching Graphiti from GitHub — valid, but line numbers are approximate.)
- No benefit numbers measured; all leverage/effort are structural inference.

## CONTINUATION RECIPE (turnkey — for the next session)

**State:** iters 1-3 banked (Mem0/Cognee/Graphiti); iter 4 (Letta) via DeepSeek may be banked by the time you resume (check `iterations/` + `deltas/` + `deep-research-state.jsonl`). ~36 of 40 iterations remain.

**Per-lineage plan (10 iters each):** DeepSeek = deep-extract algorithmic cores; MiMo = broad cross-system sweep (1M ctx); Kimi = seam-map to our TS internals (BLOCKED — see above); Opus = adversarial-verify + novelty-diff + synthesis.

**Dispatch (verify slugs live with `opencode providers list` / `opencode models <provider>`):**
```
opencode run --model deepseek/deepseek-v4-pro --variant high --dir <ROOT> "<prompt>" </dev/null
opencode run --model xiaomi/mimo-v2.5-pro --variant high --dir <ROOT> "<prompt>" </dev/null
# Opus 4.8 — NATIVE via the Agent tool (NOT claude2; operator directive 2026-06-17, proven on iter-6):
#   Agent(subagent_type: "general-purpose", model: "opus", prompt: "<read-only prompt + return findings block>")
#   Read-only + orchestrator-writes; runs in-process (returns its findings to the orchestrator on completion).
```
Concurrency: ≤2 `opencode run` at once (launch-race). Native-Opus Agent seats run in parallel with opencode. Each seat READ-ONLY; prompt every external-repo seat with the gitignore-access note (ls + explicit Read, not Glob — applies to native Agent Grep too).

**Orchestrator-writes per iteration:** append a `{"type":"iteration","iteration":N,...,"model":...,"graphEvents":[...]}` row to `deep-research-state.jsonl`, write `iterations/iteration-NNN.md`, write `deltas/iter-NNN.jsonl` (iteration row + finding/candidate rows). Prompt files live in `/tmp/028-007/`.

**Angles still to mine:** deeper Mem0 ADD/UPDATE/DELETE/NOOP merge logic + relevance scoring; Graphiti `resolve_extracted_edge` dedup + community detection; Cognee retrievers (graph_completion, summaries) + DLT pipeline; Letta block-eviction + sleep-time compute + archival rerank; cross-cutting determinism/idempotency; Advisor-fusion + Deep-Loop-continuity transfers; then Opus adversarial-verify + the GO/no-go novelty-diff synthesis.

**Finish:** run `reduce-state.cjs <child>`; write `synthesis/06-memory-systems-findings.md` (before→after, matching `05`) + roadmap addendum + `00-index` update; `validate.sh --strict` (parent 0/0); commit scoped + push.
