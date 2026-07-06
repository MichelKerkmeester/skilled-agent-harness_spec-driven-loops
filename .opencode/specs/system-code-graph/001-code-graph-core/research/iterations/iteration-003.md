# Iteration 3: Edge-weight rank-time reliability (Q4) + readiness watermark (Q6)

## Focus
Two targeted questions:
- **Q4 (edge-weight learning):** Where are edge weights applied at rank time, and does an unwired `metadata.confidence`/`evidenceClass` hook already exist on edges? Propose a RANK-TIME reliability multiplier that re-ranks WITHOUT mutating the deterministic structural weight (aionforge trust re-rank pattern).
- **Q6 (readiness watermark):** Read aionforge `bi-temporal-model.md` generation-checked maintained-set section. Propose upgrading the binary `freshness !== 'fresh'` gate to a generation-numbered watermark (stale = error, as-of-generation).

Candidate proposals only — no implementations. Confirmed vs inferred kept legible.

## Actions Taken
1. Read `config-defaults.ts:45-59` — edge weight table.
2. Grepped `code-graph-context.ts` for weight/confidence/evidenceClass/metadata usage.
3. Read `code-graph-context.ts:600-680` (impact ranking walk) and `:313-325` (freshness compute).
4. Traced `edgeWeights` consumers across `mcp_server/lib/` (4 files).
5. Read `bi-temporal-model.md:115-175` (maintained-set providers + §"Generation checking and the watermark").
6. Confirmed index-time-only weight usage in `structural-indexer.ts:127,827,853,1006-1011`.

## Findings [file:line]

### Q4 — edge weights are index-time-baked; rank-time reliability is unwired

- **CONFIRMED — Edge weights are static, set at INDEX time only.** `edgeWeights` (`config-defaults.ts:45-59`: CONTAINS/IMPORTS/EXPORTS=1.0 … TESTED_BY=0.6) is consumed exclusively by `structural-indexer.ts` (`:127,:827,:853,:1006-1011` `extractEdges(..., edgeWeights)`) and `tree-sitter-parser.ts`. It is written onto each edge row as `edge.weight` at scan time. `grep edgeWeights` across `lib/` returns ZERO hits in `code-graph-context.ts` — the rank/walk path never reads the weight table.
- **CONFIRMED — `confidence` / `evidenceClass` already exist on edge metadata but are OUTPUT-only.** `code-graph-context.ts:63-65` declares `confidence: number|null` and `evidenceClass: string|null` on the formatted edge type; `:350-356` `formatContextEdge` derives `confidence = edge.metadata?.confidence ?? edge.weight` and passes `evidenceClass` straight through to the rendered edge. These values are surfaced to the caller (`:450,:463,:465`; printed at `:787-792` as `confidence=...`) and used to compute a chain `Math.min` for display (`:472-483`, where `evidenceClass === 'INFERRED'` flags `edgeAmbiguous`). They are **never multiplied into a node/path score**.
- **CONFIRMED — there is no rank-time score at all on the impact path.** The impact walk (`:626-671`) is a flat single-hop reverse-edge enumeration (`queryEdgesTo` for `CALLS` then `IMPORTS`), pushing edges/nodes in DB iteration order, bounded only by a 400ms budget. The only `score` field in the file is hardcoded `score: null` (`:720`). So ordering is insertion/DB order, not weight- or confidence-driven. (Consistent with iter-2 "flat single-hop, no PPR" finding.)
- **INFERRED — the reliability hook is "pre-plumbed."** Because `metadata.confidence` and `metadata.evidenceClass` already travel end-to-end on every edge (`:350-356`) but terminate at formatting, folding them into a rank multiplier needs no schema change — only a scoring read site. Would confirm: locate/introduce the single comparator/accumulator where impact results are ordered.

**Q4 candidate proposal (rank-time reliability multiplier, structural weight untouched):**
- **C1 — Rank-time trust multiplier (aionforge trust re-rank).** Keep `edge.weight` as the deterministic STRUCTURAL prior (never mutated). At rank time compute `effectiveScore = structuralWeight(edge) * reliability(edge)` where `reliability = clamp(metadata.confidence ?? 1.0) * evidenceClassFactor(metadata.evidenceClass)` (e.g. `OBSERVED→1.0`, `INFERRED→~0.7`, `null→1.0` neutral). Apply only to ordering of the result set, not to the persisted weight. **Size: S** — fields already plumbed (`:350-356`); needs one scoring function + sort site on the impact/dependency result arrays (`edges.push` sites ~`:607,:649`). Risk: low — additive, falls back to neutral when metadata absent.
- **C2 — Multi-hop reliability decay (folds into Q3 PPR).** If impact graduates to a weighted multi-hop walk (iter-2 Q3 PPR candidate), reuse the same `reliability` factor as the per-edge transition weight so an `INFERRED` 2-hop path ranks below an `OBSERVED` 1-hop path. **Size: M** — depends on PPR landing first; otherwise no walk to weight. Mark deferred-behind-Q3.

### Q6 — binary wall-clock freshness vs aionforge generation watermark

- **CONFIRMED — current gate is binary wall-clock staleness, no generation number.** `code-graph-context.ts:313-321` `computeFreshness()` reads `MAX(indexed_at) FROM code_files`, computes `ageMs = Date.now() - lastScanAt`, and buckets `ageMs < 300_000 → 'fresh'`, `< 3_600_000 → 'recent'`, else `'stale'`. `:227` collapses this to a 3-way label (`live`/`stale`/`unavailable`) for metrics. Consumers see only the staleness string — there is no generation/commit counter, and no path that turns staleness into an error; a stale read silently returns possibly-out-of-date edges.
- **CONFIRMED — aionforge contract (bi-temporal-model.md §"Generation checking and the watermark", L146-153).** Reading a maintained set is "generation-checked end to end": the engine binds the set to the same immutable snapshot whose generation it validates the provider against. "A stale provider surfaces as an **error**, never an out-of-date set." The `generation` on a returned `CandidateStateInfo` is "a live watermark, not a hint. A successful call is itself the proof that no set is stale." Providers are rebuilt-from-primary, never persisted (L165-175), so the watermark is always re-derivable.
- **INFERRED — code-graph has no generation counter today.** No `generation` column appeared in the freshness path or (per iter-1/2) on `code_edges`/`code_files`; staleness is purely temporal. Porting the watermark requires introducing a monotonic graph generation (incremented per scan/commit) and stamping reads against it. Would confirm: grep schema DDL in `code-graph-db.ts` for any existing generation/version column before adding one.

**Q6 candidate proposal (generation-numbered readiness watermark):**
- **C1 — Monotonic graph generation + as-of binding.** Add a monotonic `generation` counter bumped on each scan/reindex commit; stamp it onto query results so `code_graph_context` returns `{ generation, lastScanAt }`. Replace the binary `staleness !== 'fresh'` consumer logic with an explicit as-of-generation check: a query may request "results as of generation ≥ N" and a read that cannot satisfy the requested generation surfaces an **error**, never silently-stale edges (the aionforge "successful call = proof of freshness" property). **Size: M** — needs a generation column/counter (touches the reindex DELETE+INSERT sites flagged iter-1 in `code-graph-db.ts`), a stamp on `computeFreshness`/result envelope (`:313-321,:251,:278`), and consumer gate rewrite at `:227`. Risk: medium — interacts with the destructive-reindex transaction boundary (generation must bump atomically with the swap).
- **C2 — Soft watermark (telemetry-first, non-breaking).** Keep the wall-clock buckets but ADD a `generation` integer to the freshness envelope and emit it in metrics/output without yet making stale an error. Lets callers opt into "as-of-generation" comparisons before the hard error gate lands. **Size: S** — additive field on `:313-321` + envelope; no transaction changes. Risk: low. Recommended as the staged first step ahead of C1's error gate.

## Questions Answered
- **Q4** — Answered. Edge weights are index-time-static (`config-defaults.ts:45-59` → `structural-indexer.ts`); rank-time reliability is unwired but pre-plumbed via existing `metadata.confidence`/`evidenceClass` (`code-graph-context.ts:350-356`). Proposed rank-time multiplier C1 (S) / multi-hop decay C2 (M, behind Q3).
- **Q6** — Answered. Current gate is binary wall-clock (`code-graph-context.ts:313-321`); aionforge generation watermark = stale-is-error + live-watermark (bi-temporal-model.md L146-153). Proposed generation counter C1 (M) staged behind soft watermark C2 (S).

## Questions Remaining
- **Q1** — bi-temporal mapping: surfaced iter-2, not yet closed (validity-window vs supersession candidate selection).
- **Q5** — doc-lane / provenance lane (not yet investigated).
- **Q7 / Q8** — cross-cutting synthesis (edge schema migration cost; combined reindex+generation+temporal-column transaction boundary).

## Next Focus
Iter 4: **Q5 doc-lane provenance** + **close Q1** (validity-window vs supersession decision) + begin **Q7/Q8 cross-cutting** — specifically the combined transaction-boundary cost of layering temporal columns (Q1), a generation counter (Q6-C1), and the existing destructive DELETE+INSERT reindex (iter-1) onto `code-graph-db.ts`, since these three all touch the same write path.
