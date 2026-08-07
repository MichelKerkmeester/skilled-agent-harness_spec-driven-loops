# Iteration 4: Lightweight Reranker Value + FSRS Cold-Tier Tuning

## Focus

Problem 4: is a lightweight local reranker worth the latency now that the cross-encoder is
removed? Problem 5: are the FSRS cold-tier decay multipliers right for retrieval (vs
spaced-repetition), and does cold inclusion crowd hot results?

## Findings — Problem 4 (reranker)

1. **The removed cross-encoder was already inert, so its removal cost nothing — re-adding the
   same thing would be a regression risk for no proven gain.** Stage 3 documents: the
   cross-encoder layer "had no configured provider after the sidecar deprecation
   (`isCrossEncoderEnabled()` was hard-off), so it was an inactive no-op"
   [SOURCE: pipeline/stage3-rerank.ts:109-116]. Provider is now hard `'none'`
   [SOURCE: stage3-rerank.ts:87,116]. Stage 3 still runs MMR diversity + MPAB chunk-collapse
   [SOURCE: stage3-rerank.ts:118-169], so the *reordering* slot is occupied by diversity, not by
   relevance reranking.

2. **The cheapest, highest-leverage "rerank" is already-computed and unused for ordering:
   absolute cosine.** Ordering uses the RRF fusion score (`resolveEffectiveScore`), whose
   magnitude (~0.01–0.05) compresses the gap between a 0.89 cosine hit and a 0.68 one
   [SOURCE: pipeline/types.ts:67-96 + grounding evidence]. A **cosine-primary reorder of the
   top-N before truncation** would push the true-best vector hit to position 1 at near-zero
   latency — and this matters *more* now, because a top-dominant request-quality rule
   (Problem 2) and a min-floor budget (Problem 3) both make position 1 decisive.

3. **An LLM-judge rerank already has a budget envelope — but only on the deep path.** HyDE +
   reformulation cap at ≤2 LLM calls per deep query, sharing one `LlmCache`
   [SOURCE: hyde.ts:17-24]. A late-interaction or cross-encoder model would add a new dependency
   and per-query latency with no labeled-set evidence of lift. **Recommendation: do NOT re-add a
   model reranker as the first move.** Sequence it: (a) cosine-primary top-N reorder (free), then
   (b) measure precision@1 on a labeled set, then (c) only if a gap remains, add an LLM-judge
   rerank gated to low-confidence/deep queries reusing the existing LLM budget.

## Findings — Problem 5 (FSRS cold-tier)

4. **The decay multipliers are spaced-repetition constants, applied to *stability*, not to
   retrieval rank directly.** FSRS v4 power-law `R(t) = (1 + 19/81 · t/S)^-0.5` on a days/weeks
   timescale [SOURCE: cognitive/fsrs-scheduler.ts:10-11,33]. Tier multipliers scale stability:
   `deprecated:0.25` (4x faster decay), `temporary:0.5`, `normal:1.0`, `important:1.5`,
   `constitutional/critical:Infinity` [SOURCE: fsrs-scheduler.ts:297-304]. Because they scale
   stability (not elapsed time), deprecated content's retrievability collapses fast — exactly the
   de-ranking retrieval wants.

5. **Cold content empirically does NOT crowd hot results — the premise of the worry is already
   falsified.** The grounding evidence found the vector lane admits only cold-orphans with no
   active winner, "empirically just ~2 rows, near-inert." Combined with 0.25x stability decay and
   the multiplicative structural-freshness `stability · centrality`
   [SOURCE: search/fsrs.ts:40-47] — a peripheral cold node is double-penalized — cold crowding is
   structurally suppressed. **Recommendation: leave cold-tier multipliers as-is; this is the
   lowest-priority of the six problems.**

6. **The real FSRS risk is the opposite direction and out of scope here:** `normal:1.0` content
   that is old-but-central may decay faster than its retrieval value warrants, since structural
   freshness multiplies by centrality but central nodes still age. Flag for monitoring, not change.

## Sources Consulted

- `pipeline/stage3-rerank.ts:87,109-169`; `hyde.ts:17-24`; `pipeline/types.ts:67-96`
- `cognitive/fsrs-scheduler.ts:10-11,33,285-304`; `search/fsrs.ts:40-47`
- Grounding evidence (cold-lane ~2 rows near-inert; reranker removed)

## Assessment

- **newInfoRatio: 0.5** — Net-new: the sequencing recommendation (free cosine-reorder before any
  model reranker) and the structural argument that cold-crowding is already suppressed. Lower
  than iter 3 because Problem 5 largely confirms the grounding evidence rather than overturning it.
- Confidence: HIGH on reranker-was-inert and FSRS constants (code-confirmed); MEDIUM on the
  precision@1 lift claim (needs the labeled set from Problem 6 to quantify).

## Reflection

- **Worked:** treating "is a reranker worth it" as a sequencing question (free reorder first)
  rather than a yes/no on a model.
- **Ruled out:** re-adding a cross-encoder/local-GGUF reranker as a first step — it was inert,
  adds latency + a dependency, and has no labeled-set evidence of lift.
- **Ruled out:** retuning cold-tier decay multipliers — cold crowding is empirically near-inert.

## Recommended Next Focus

Iteration 5 → Problem 6 (calibration headroom / band spread) + cross-cutting synthesis of how
the six fixes interact (recall ↑ must co-move with request-quality and budget-floor).
