# 06 — External Memory Systems: Before → After (Plain-Language)

> **What this is.** The findings from the **007 memory-systems mining** (a 22-iteration, 4-model deep-research campaign), written as **feature changes with a concrete before vs. after** — same style as `05`. This is the external-memory-systems *extension* of the 028 campaign: where `05` mined two small memory libraries, `07` mined the four leading open-source agent-memory systems.
>
> **The campaign in one line.** We mined **Mem0** (LLM fact-extraction + scoring), **Graphiti/Zep** (bi-temporal fact graph + invalidation), **Letta/MemGPT** (self-editing memory tiers + sleep-time compute), and **Cognee** (ECL knowledge-graph pipeline + a retriever zoo) for concrete improvements to **Memory MCP** (primary), **Deep-Loop** (research/review automation), and **Skill-Advisor**.
>
> **Status: research only.** Nothing here is built or measured. Every effort/value tag is an educated guess from reading both sides' code. The campaign stopped at **22 of a planned 40 iterations** — the honest saturation point (discovery exhausted; see Caveats), not padded.

## How to read each entry

```
N. Plain name  (id)  · [NEW] or [EXISTING: …]  · Wave
   Do:     the change we'd make
   Before: what happens today
   After:  what happens once changed
   Catch:  the known caveat (only where it changes the decision)
```

- **[NEW]** = doesn't exist today. **[EXISTING: off]** = built but switched off. **[EXISTING: partial]** = present but incomplete/approximate. **[EXISTING: fallback-only]** = built but only fires as a weak last resort.
- **Wave 0** = cheap, safe, reversible. **Wave 1** = small follow-on build. **Wave 2** = bigger / schema-changing / needs new substrate. **Prove-first** = benchmark before building.
- **The campaign verified its own claims five times** (iters 6/9/13/17/21) and scoped two against real call-sites (iters 10/22). Several headline candidates were **refuted or downsized** in the process — those corrections are baked into the tags below.

---

## Memory MCP (the primary subsystem)

**1. Close superseded facts at event-time, not clock-time**  `(MEM-fact-invalidation-event-time)` · **[EXISTING: partial]** · Wave 0 · **the spearhead**
- **Do:** when a new fact supersedes an old causal edge, stamp the old edge's `invalid_at` with *when the new fact became true* (its lineage event-time), instead of `now()`.
- **Before:** `invalidateEdge` always writes `invalid_at = now()` (transaction time), so the graph records *when we noticed* a fact died, not *when it actually died* — bitemporal history is wrong.
- **After:** the close timestamp reflects real-world event-time; "what did we believe as of date X" queries become correct.
- **Catch:** derive the timestamp from **lineage** (the canonical event-time writer), NOT from the causal projection; and do **not** add a `WHERE invalid_at < now()` reader — all three current readers use a binary `IS NULL` test, which is what makes this a one-site, reader-transparent change (H leverage / **S** effort).

**2. Auto-invalidate older facts by time-ordering**  `(GR-temporal-ordering-invalidation)` · **[NEW]** · Wave 1
- **Do:** when two edges on the same pair conflict, auto-invalidate the one whose `valid_at` is earlier.
- **Before:** contradiction detection only fires on hard-coded relation-pair conflicts (`CONFLICTING_RELATIONS`); a newer fact that simply post-dates an older one doesn't retire it.
- **After:** chronology itself resolves supersession, beyond the hand-listed relation pairs.
- **Catch:** scope the rule to *conflicting/superseding* relation pairs (Graphiti gates on LLM-flagged contradiction candidates) — applying it to every same-pair edge would wrongly invalidate co-valid, non-conflicting facts.

**3. Iterative "answer-as-next-query" recall**  `(CG-iterative-context-extension)` · **[NEW]** · Wave 1 · **smallest safe new build**
- **Do:** add a new `memory_context` strategy that uses the first answer to form a follow-up query, fetches more, and stops on convergence.
- **Before:** every `memory_context` mode is single-pass — one retrieval call, no widening loop.
- **After:** multi-hop questions reach facts a single pass misses, stopping when results stabilize.
- **Catch:** purely additive (a new strategy key + switch case; existing modes untouched), but **no convergence/saturation primitive exists today** — that's the one new algorithm, and it must ship with a hard iteration cap behind a default-off flag or it can loop unboundedly.

**4. Promote summaries/communities to a real ranked channel**  `(MEM-fused-summary-channel)` · **[EXISTING: fallback-only]** · Wave 2
- **Do:** make the already-computed community summaries a first-class weighted lane in the result-fusion, not a last-resort patch.
- **Before:** community members are injected only as a *weak-result fallback* (when normal search comes up short), and per-chunk summaries are a stage-1 candidate source — neither participates in the main ranked blend.
- **After:** summary/community evidence is fused alongside vector/keyword/graph signals with its own tuned weight.
- **Catch:** **bigger than it looks (L, corrected down from M/M).** The channel list is hardcoded in ~5 places, the weight model has no per-channel slot for it, and the two existing inject paths must be retired to avoid double-counting — plus a re-tune of the ablation-derived weights. Needs a baseline-and-delta plan.

**5. Budget recall per-section and per-tier, not one flat ratio**  `(MEM-tiered-recall-budget)` · **[EXISTING: partial]** · Wave 1
- **Do:** give each context section (system / core / messages / …) an independent token budget, and vary per-result content density by memory tier (hot = full text, cold = short summary, dormant = metadata only).
- **Before:** pressure is one global `tokens/budget` ratio; tier limits cap result *counts* but every surviving result is returned at full content.
- **After:** the prompt stays in budget by trimming the right section/tier first, keeping coverage of distant memories as compact stubs.

**6. Summarize before you truncate**  `(LT-compaction-fallback-ladder)` · **[NEW]** · Wave 1
- **Do:** when recall exceeds budget, add a "summarize the lowest-value results" tier *before* the existing drop-results truncation.
- **Before:** `enforceTokenBudget` goes straight to char-slicing content and dropping whole results under pressure.
- **After:** a graceful ladder (summarize → then truncate) preserves more signal before anything is discarded.

**7. Multi-pass cascade extraction**  `(CG-cascade-extraction)` · **[NEW]** · Wave 1
- **Do:** extract entities/relations in a broad pass, then a refine pass, instead of one shot.
- **Before:** extraction is single-pass; subtle relations get missed.
- **After:** a second refine pass catches what the broad pass left, at extraction-time LLM cost.

**8. Link related memories at write time**  `(M0-llm-memory-linking)` · **[EXISTING: partial]** · Wave 1
- **Do:** have the extraction step emit `linked_memory_ids` so the relationship graph is built as you save.
- **Before:** inter-memory links are built post-hoc by separate causal-link calls.
- **After:** the graph forms at write time, fewer round-trips.

**9. Cheap retrieval/ranking tweaks (Mem0 scoring)**  `(M0-bm25-sigmoid-calibration · M0-entity-cardinality-penalty · M0-spacy-lemmatization-bm25)` · **[EXISTING: partial / NEW]** · Wave 1
- **Do:** (a) make the BM25 normalization midpoint vary with query length; (b) damp high-degree "hub" entities with a quadratic penalty so they can't dominate; (c) lemmatize before BM25 so "attending"/"attend" match.
- **Before:** BM25 midpoint is fixed; hub entities over-contribute; keyword matching is verb-form-sensitive.
- **After:** calibration tracks query verbosity, hubs are dampened, and verb forms match — small, additive ranking gains.

**10. Declarative entity-extraction patterns**  `(CG-declarative-regex-entity-config)` · **[EXISTING: partial]** · Wave 0 · **cheap win**
- **Do:** move entity regex rules into a JSON config (type + pattern + metadata) loadable without code changes.
- **Before:** entity extraction has 5 hard-coded regex rules; adding a type means editing code.
- **After:** entity types are config-driven and extensible. (Best effort/value ratio in this campaign: L/S.)

**11. Extract time-windows from the query**  `(CG-temporal-query-extraction)` · **[NEW]** · Wave 1
- **Do:** parse a time interval out of the natural-language query ("since March", "last week") and filter/boost by it.
- **Before:** records carry timestamps but the query never extracts or filters by a time range.
- **After:** time-scoped questions retrieve time-scoped results. High cross-fit with the bitemporal currentness work.

**12. Re-derive artifacts when content changes**  `(CG-content-hash-reprocessing-trigger)` · **[NEW — needs-verify]** · Wave 1
- **Do:** on re-save, compare the content hash and, if changed, reset downstream state so embeddings/entities/edges re-derive.
- **Before:** dedup skips unchanged content, but the behavior on *changed* content (does it fully re-derive all artifacts?) is unconfirmed.
- **After:** changed content reliably refreshes every derived artifact.
- **Catch:** **verify against the existing reindex path first** — the memory-index scan may already cover this; if so, this collapses to NO-TRANSFER.

**13. Hierarchical "world summary" prelude**  `(CG-global-context-summary-hierarchy)` · **[NEW]** · Wave 2
- **Do:** keep a two-tier summary (a root world-summary + topic subsections) and prepend the relevant slice as grounding before retrieved context.
- **Before:** summaries are flat (single collection), never used as a top-of-context grounding prelude.
- **After:** retrieval is anchored by a coarse-to-fine summary prelude.

**14. Agentic tool-loop recall strategy**  `(CG-agentic-tool-loop)` · **[NEW]** · Wave 2 · **corrected: L, not the cheap win it looked like**
- **Do:** add a ReAct-style `memory_context` strategy that calls the existing memory tools in a reason→act loop.
- **Before:** `memory_context` is a static mode router with zero tool-calling.
- **After:** complex asks get an agentic, multi-tool retrieval path.
- **Catch:** the clean new-strategy seam made this look like H/L, but blast-radius scoping (iter 22) shows it injects an LLM into a *synchronous, deterministic* retrieval hot path with **no loop/cost governor anywhere** — controller, step-cap, cost-ceiling, stop-condition are all greenfield. Needs its own design packet. **Mitigant:** Letta's tool-rule DAG (initiative B) is a ready governor template.

---

## New initiative A — a "semantic edge layer"  · Wave 2 (high-effort, one coherent build)

Five separate candidates all turned out to need the **same missing substrate**: per-edge embeddings + semantic retrieval over edges. Our causal graph stores edges in SQLite only, with no vector index and no fact text, so edges never inform ranking and can only be deduped on an exact key. Build the layer once and these unlock together:
- **`CG-edge-vector-index`** — store edge-relationship vectors in their own collection.
- **`CG-edge-aware-triplet-search`** — score results by node + *edge* + node distances (triplet retrieval).
- **`GR-fact-embedding-on-edge`** — semantic embedding per edge.
- **`GR-semantic-fact-dedup-merge`** — collapse paraphrased-but-equal edges (LLM-judged over semantically-retrieved candidates), not just exact-key duplicates.
- **`GR-semantic-invalidation-discovery`** — find invalidation candidates across *different* node pairs by semantic similarity, not just same-pair.
- **Catch:** high effort and a real architectural commitment; the memory-ID graph has no episode model and no LLM in the insert path, so this is a consolidation-time/async layer, not an insert-path tweak. **Prove-first.**

## New initiative B — "async sleep-time consolidation"  · Wave 2 (new architectural direction)

Letta runs memory reorganization *after* the foreground turn, on a cadence — a shape we don't have (our reconsolidation is synchronous, on-save). Three candidates form it:
- **`LT-bg-sleeptime-agent`** (H/M) — a background agent reorganizes recent transcripts into archival memory via a bounded tool-chain.
- **`LT-turn-cadence-trigger`** (M/S) — gate that work by a turn counter (`turns % N == 0`) so it amortizes instead of running every turn.
- **`LT-llm-transcript-chunking`** (M/M) — let the model choose which transcript ranges are worth preserving as discrete memories.
- **Bonus:** **`LT-tool-rule-memory-chain`** — Letta's Init→Child→Continue→Terminal tool-call DAG; the bounding pattern that de-risks the agentic-tool-loop (#14) above.

---

## Deep-Loop (research/review automation)

**The standout cross-cutting insight:** the Cognee *retrieval-loop* patterns transfer to Deep-Loop, because the deep-research iteration cycle **is itself** a retrieval loop.

**15. Derive next-focus from the prior answer**  `(DL-iterative-retrieval-loop)` · **[EXISTING: partial]** · Wave 1 · **top deep-loop transfer**
- **Do:** make each iteration's "next focus" a *derived* function of the previous iteration's answer, not free-text the agent writes.
- **Before:** `reduce-state.cjs:resolveNextFocus` takes the last iteration's hand-written "recommended next focus."
- **After:** next-focus is computed from the prior answer (answer-as-next-query), with the **convergence-stop already built** (`convergence.cjs` + saturation thresholds) — so the change is bounded.
- **Catch:** the `cot-validate`, `query-decomposition`, and `question-type-router` patterns stack on the same `key-questions` / `focusTrack` machinery behind this one.

---

## Skill-Advisor

**16. Query-length BM25 calibration in the advisor**  `(ADV-bm25-calibration)` · **[EXISTING: partial]** · Prove-first
- **Do:** replace the advisor's fixed BM25 sigmoid midpoint with the query-length-bucketed one.
- **Before:** `scorer/lanes/bm25.ts` uses a hardcoded midpoint, query-length-blind.
- **After:** calibration tracks query length.
- **Catch:** the BM25 lane is **shadow-only** (its weight is zeroed in fusion), so this improves telemetry, not live ranking, until BM25 is promoted. And the advisor runs its *own* fusion — this is porting an idea into a parallel codebase, not a shared-module edit. The entity-cardinality penalty also "ports" but is a **near-no-op** at ~22-skill scale (the quadratic term ≈ 1.0). Low priority.

---

## What we deliberately are NOT changing (and why)

| Candidate | Why not |
|---|---|
| Community detection / clustering | **Already implemented** — `community-detection.ts` (BFS+Louvain) wired into checkpoint rebuild, default-on. |
| Query decomposition | **Already implemented** — `query-decomposer.ts` wired into stage-1 (deep mode, rule-based). |
| Composite-edge dedup | **Already implemented** — `insertEdge` dedups on a superset composite key. |
| Ranking determinism (tiebreaks, canonical IDs, stable reorder, content-addressed cache) | **Already complete** — the internal C5 layer is comprehensive (iter 16 found 6 existing mechanisms, 0 gaps). |
| Mem0 entity-cleanup-on-update / pre-fusion threshold gate | **Already covered** — we `refreshAutoEntitiesForMemory` on update and gate at stage-1/stage-4. |
| Episode provenance / episode-window context | **Gated** — there is no episode model; adopting one is a schema-level build, not a tweak. |
| Letta self-edit char-limit eviction | **Refuted as framed** — Letta's char-limit is advisory (no auto-eviction). |
| Graphiti 3-channel RRF / fact-text reconciliation | **NO-TRANSFER** — our multi-channel RRF is a superset; provenance accrual needs the absent episode model. |
| Block undo/redo stack | **Lower-leverage** — our snapshot checkpoints already cover the need. |

---

## Honest caveats (what might be wrong)

- **No benefit numbers.** Every leverage/effort tag is structural inference from reading code — none is benchmarked. This is the single biggest residual (same as `05`).
- **The "semantic edge layer" is the recurring gate.** Five edge-intelligence candidates all need it; none ships cheaply without it. Treat A as one prove-first initiative, not five quick wins.
- **Finder estimates ran optimistic.** Blast-radius scoping deflated two headline candidates (`CG-agentic-tool-loop` H/L→L, `MEM-fused-summary-channel` M/M→L). Assume any un-scoped GO is optimistic until a blast-radius pass confirms it.
- **Two candidates are unverified:** `CG-content-hash-reprocessing-trigger` and `CG-graph-neighborhood-projection` (may overlap the existing reindex path / `enableCausalBoost`) — verify before building.
- **The campaign stopped at 22/40 by design.** Discovery saturated: Mem0/determinism veins returned 0 net-new (iter 16); the remaining iters would re-surface known findings. This is the strategy's "mark saturation, don't pad" rule, not an abandonment.

## How this relates to the rest of the campaign

- `05` is the **internal-style plain-language** view of the 200-iteration aionforge/galadriel campaign; **`06` is its external-memory-systems sequel** (Mem0/Graphiti/Letta/Cognee, +22 iters).
- The Wave-0/1/2 tiers here feed the **same structure as `01-go-candidates.md`** — `06`'s GO set is the input to the same future implementation packet.
- Detailed per-iteration evidence: `../../007-memory-systems/research/{research.md, iterations/, deltas/}`. Top-7 + tiering: `007-memory-systems/research/research.md` (Consolidated roadmap).

> **Scope reminder.** Research-only (spec §3). The packet ends at this roadmap; implementation is a separate, later decision. Nothing here is built or benchmarked.
