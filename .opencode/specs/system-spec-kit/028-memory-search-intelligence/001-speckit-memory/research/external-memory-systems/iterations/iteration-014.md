# Iteration 14 (Opus lineage — NATIVE): cross-cutting transfers to Skill-Advisor + Deep-Loop (Q9)

> Model: **Opus 4.8 NATIVE** (Agent tool `model: opus`, read-only). Orchestrator-written. newInfoRatio **0.7**. The richest cross-cutting result of the campaign: the **Cognee retrieval-loop cluster transfers to DEEP-LOOP**, because the deep-research iteration cycle *is itself* a retrieval loop. 10 candidates triaged for transfer; every seam confirmed by reading.

## Two framing corrections (confirmed against code)
- **The advisor does NOT share Memory's fusion code.** `grep` for `algorithms/(adaptive-fusion|rrf-fusion)` in the advisor tree = 0 hits; the advisor runs its own independent 5-lane weighted-sum fusion (`scorer/fusion.ts`) + its own BM25F (`scorer/lanes/bm25.ts`). "Transfer to advisor fusion" = porting an *idea* into a parallel codebase, never a shared-module edit.
- **The sigmoid-bucket + quadratic-cardinality candidates are NOT yet implemented anywhere** — they are GO candidates proposed *for* Memory (rrf-fusion has only a `DEGREE` channel name).

## Transfer verdicts
| Candidate | Target | Verdict | Seam |
|---|---|---|---|
| **CG-iterative-context-extension** | **deep-loop** | **EXTENDS (H/M) — TOP TRANSFER** | `reduce-state.cjs:538 resolveNextFocus` (next-focus = last iter's free-text; convergence-stop ALREADY built in `convergence.cjs`). Transfer = derive next-focus from the prior answer. |
| CG-cot-validate-retrieve-loop | deep-loop | EXTENDS (M/M) | deep-review validate spine `reduce-state.cjs:201-273` (P0/P1/P2 status) + deep-research key-questions = the follow-up slot. |
| CG-query-decomposition | deep-loop | EXTENDS (M/M) | deep-research `key-questions` IS manual decomposition (`reduce-state.cjs:556-571`); automate the topic→sub-question split. |
| CG-question-type-router | deep-loop | EXTENDS (M/M) | deep-review severity routing + deep-research `focusTrack` (:769) — coarse 2-3-way → 10-way type taxonomy w/ per-type prompt. |
| M0-bm25-sigmoid-calibration | skill-advisor | EXTENDS (M/S) | `scorer/lanes/bm25.ts:277` hardcoded midpoint `/(raw+4)`, query-length-blind; length already a live dim (`text.ts:79-99`). **NOTE: `shadowOnly` lane — improves shadow/telemetry, not live ranking until BM25 promoted.** |
| M0-entity-cardinality-penalty | skill-advisor | EXTENDS but near-no-op (L/S) | `scorer/lanes/graph-causal.ts:62-70` flat maxBreadth; advisor skill graph ~22 nodes, n<10 → quadratic penalty ≈1.0. Real but low-value. |
| GR-llm-fact-invalidation | **none** | NO-TRANSFER | Bitemporal is a Memory-record property; advisor projection regenerated wholesale; deep-loop supersession is iteration-ordinal (`reduce-state.cjs resolvedAtIteration`). |
| M0-llm-memory-linking | **none** | NO-TRANSFER | Memory owns it (`causal-links-processor.ts`); advisor projects static SKILL.md metadata, deep-loop links via its own coverage graph — neither extracts facts. |
| CG-temporal-query-extraction | **none** | NO-TRANSFER | No event timeline in advisor (static skills) or deep-loop (ordinal iterations) to filter. Belongs with GR-invalidation in Memory. |
| LT-compaction-fallback-ladder | Memory-home; weak deep-loop | EXTENDS Memory | `memory-context.ts:492-532 enforceTokenBudget` truncates (drops results) with a `DroppedAllResultsReason` ladder; candidate ADDS a summarize tier before truncation. Deep-loop only does raw `slice(0,200)` (cosmetic fit). |

## TOP TRANSFER
**CG-iterative-context-extension → deep-loop** (`reduce-state.cjs:538`). The only candidate landing on the architectural spine of an existing loop with the convergence-stop half already built — bounded change (derive next-focus from the prior answer vs agent free-text), high leverage (upgrades the core iteration mechanism for every research/context run). The CG-cot-validate / CG-query-decomposition / CG-question-type-router cluster all EXTEND the same `key-questions`/`focusTrack`/severity machinery and stack behind it.

## Net effect
4 deep-loop transfers (1 TOP + 3 stacking), 2 skill-advisor EXTENDS (1 shadow-lane caveat, 1 near-no-op), 4 NO-TRANSFER (correctly bounded to Memory). **Key insight: the memory-system *retrieval-loop* patterns generalize to deep-loop's own iteration machinery — a transfer surface 028 had not previously identified.** The Memory-specific scoring candidates (invalidation, memory-linking, temporal) correctly do NOT transfer (they presuppose a timestamped/extracted memory-record corpus that only Memory MCP has).

## Next Focus
First-half (iters 1-14) is comprehensive across all 4 systems + cross-cutting. Remaining iters 15-40 should: (a) consolidate the summary/community-channel + the deep-loop-transfer cluster into roadmap-ready candidates; (b) verify iter-11/12 NET-NEWs (agentic-tool-loop, per-component-recall-budget); (c) then synthesis/06 + roadmap addendum. Saturation rising on pure finding-discovery; pivot toward consolidation + verification.
