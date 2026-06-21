# Iteration 001 — KQ1: Context-budget optimizer under the truncation floor

## Focus

The single most floor-engaged novel candidate. Concept: instead of returning a fixed top-K, an optimizer picks the highest total-information subset of candidate rows that fits a token budget, so the agent's context window is spent on the most valuable rows rather than the first K by score.

## What the live code actually does

- The prod floor truncates by COUNT and GAP, not by tokens. `truncateByConfidence` (`confidence-truncation.ts:102-199`) keeps `results[0..cutoffIndex]` on the PRE-SORTED score order, with `minResults` defaulting to 3 (`:35,106`). It never reads token length; it can only keep a PREFIX of the score-sorted list. It returns 3 rows, or more if no relevance cliff is found before the gap test.
- A token-budget concept DOES exist one layer out: the response envelope carries `tokenBudget?` (`response/envelope.ts:19`), and `cognitive/pressure-monitor.ts` tracks context pressure. So a budget-aware assembler has a real seam — but it sits DOWNSTREAM of the floor, on the rows the floor already returned.

## The verdict shape: two different optimizers hide under one name

1. **Score-changing optimizer (retrieval-class, floor-taxed).** To change WHICH rows land in the top-3, you must change the score before truncation. The only live pre-truncation consumer is the `qualityScore` multiplier in `stage2-fusion.ts:264-296` (a [0.9,1.1] band). Anything that reorders the top-3 by injecting a "value" term is a reranker, pays the floor tax, needs a re-index-independent score source, and is promotable only by a prod-mode completeRecall@3 read. This collapses into the reuse-first CONDITIONAL retrieval tier; it is NOT novel.

2. **Budget-fitting assembler (adherence/logic-class, floor-bypassing).** Operating at the envelope layer (`envelope.ts:19` + `pressure-monitor.ts`), the optimizer takes the rows truncation already returned and selects the highest-value subset that fits the agent's actual token budget — dedup near-duplicates, prefer diverse packets over three chunks of one doc, drop a long low-value row to fit a short high-value one. This is genuinely novel: NO prior lineage proposed a value-under-budget selection over the returned set, and it does NOT pay the floor tax because it never re-embeds and never tries to add a floor-cut row.

## Value per reader

- R retrieval: NONE for recall. It cannot recover a row the floor cut; recall is fixed upstream. This is the hard ceiling and the honest disappointment of the idea.
- A adherence + L logic: REAL. The agent reads a denser, less redundant, more diverse top-of-context. Three chunks of the same spec collapse to one, freeing budget for a second relevant packet that truncation DID return but a naive head-K assembler would have pushed out of the window. It protects the QUALITY of the top-3, which is exactly the floor's own doctrine ("change the composition of what is returned") applied at the assembly layer instead of the ranking layer.

## Floor survival

Survives by construction — it runs AFTER the floor, on the floor's output, with no re-index. It is the rare novel retrieval-adjacent idea that bypasses the truncation tax entirely, at the cost of never improving recall.

## Go / No-Go

- Score-changing variant: NO-GO as novel (it is the reuse-first CONDITIONAL reranker in disguise; promotable only via C2).
- Budget-fitting assembler variant: GO-on-cost, novel, distinct from the reuse-first program. Ship default-off behind the envelope seam; its win is context density and diversity, not recall, and that win is measurable without a re-index (token-per-relevant-row, duplicate rate in the assembled window).

## Dead Ends

- Reading the floor as a place to inject a value term: any pre-truncation value term is just `qualityScore` fusion, already mapped, retrieval-class, C2-gated.
- Treating the optimizer as a recall lever: impossible; recall is fixed before the floor runs.

## Sources

- `confidence-truncation.ts:35,102-199` (count+gap floor, prefix-only, token-blind)
- `response/envelope.ts:19` (tokenBudget seam, downstream of the floor)
- `cognitive/pressure-monitor.ts` (context-pressure substrate)
- `stage2-fusion.ts:264-296` (the only live pre-truncation score consumer)

## Assessment

newInfoRatio 0.90 — first novel candidate split into a real GO (budget-fitting assembler, floor-bypassing, A/L value) and a disguised reuse-first reranker. Establishes the lineage's discriminator: a novel idea is real only if it serves a reader the floor does not tax OR protects the returned top-3 without a re-index.
