# Iteration 6: Adversarial Verification — C1 Conflict Mass & the "No-RRF" Reality

## Focus
Round A verification: how is the advisor's negative `conflicts_with` mass combined (multiplicative/subtractive, inside/outside RRF), and can C1 keep it "outside RRF"? Read-only.

## Actions Taken
1. Traced the conflict mass origin in `graph-causal.ts` (`:18` EDGE_MULTIPLIER.conflicts_with=-0.35, `:70-74` propagation, `:101` emit).
2. Read the fusion mechanic `fusion.ts` (`:366` weightedScore, `:372` sum, `:425-433` sort + primaryIntentBonus re-rank) — grep `rrf|reciprocal_rank` → 0 hits.
3. Read the `conflicts_with` edge contract `affordance-normalizer.ts:206-228`.

## Findings (file:line)

**Conflict mass is subtractive INSIDE a weighted SUM — there is NO RRF — [CONFIRMED].** Magnitude is multiplicative within the graph-causal lane (`propagated = strength*edge.weight*|multiplier|*1/(depth+1)`, graph-causal.ts:70), sign-flipped (`signed=-propagated`, `:72`), accumulated additively (`entry.score += signed`, `:74`), clamped [-1,1], emitted as a negative `LaneMatch.score` (`:101`). In fusion it becomes `weightedScore = rawScore * weights['graph_causal']` (fusion.ts:366) summed into `score = Σ weightedScore` (`:372`); ranking sorts on that sum (`:425-433`). **The roadmap already knew advisor fusion is a weighted sum not RRF (§1 meta-finding); this iteration confirms the conflict mass lives INSIDE that sum, and there is literally no RRF to keep it "outside" of.** [CONFIRMED]

**C1 is achievable as a post-fusion re-rank — [PARTIAL].** Reframe C1 from "keep conflict mass outside RRF" to "lift it out of `EDGE_MULTIPLIER` into a post-fusion demotion in the sort comparator." Precedent: `primaryIntentBonus` is already applied as a post-fusion re-rank at sort time (`right.score + rightIntent`, fusion.ts:428-430), outside the per-lane sum, deterministic (tiebreak `skill.localeCompare`, `:432`). A conflict penalty could be applied identically — deterministic, auditable (its own counter like `primary_intent_bonus_applied_total` `:420-422`), decoupled from lane weights. [PARTIAL — viable, but reframe the candidate.]

**Priority caveat (new):** `conflicts_with` may be DORMANT — `affordance-normalizer.ts:206-228` notes it is a RESERVED edge requiring a reciprocal `edges.conflicts_with` declaration or it is silently dropped, so the -0.35 path may be inactive in practice. This changes C1's priority/testability.

## Questions Answered
- How is conflict mass combined? Multiplicative-in-lane → subtractive negative addend inside the weighted SUM (no RRF exists).
- Can C1 keep it "outside RRF"? Mis-framed (no RRF); but YES it can move to a post-fusion re-rank (like primaryIntentBonus).

## Questions Remaining
- (new) Is `conflicts_with` live data or dormant (reserved edge, silently dropped without reciprocal declaration)? Determines C1 priority.
- (new) C3 (import RRF) therefore REPLACES the weighted sum, not "imports into" an RRF — re-scope C3's effort.

## Next Focus
C1 reframed (post-fusion demotion, not "outside RRF"); verify `conflicts_with` is live before prioritizing. Note for synthesis: C3 is a fusion-mechanism replacement (weighted-sum→RRF), larger than "import".
