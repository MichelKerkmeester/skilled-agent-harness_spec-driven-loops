# Iteration 35: Round I Validation Plan — C3-A (the "clean flip" claim is KILLED)

## Focus
Round I: the validation plan for the honesty audit's most-likely-wrong surviving claim — C3-A "flip SPECKIT_TEMPORAL_EDGES ON = clean reversible S-effort win." Read-only.

## Verdict (newInfoRatio 0.70) — **needs-read-side-build; clean-flip KILLED**
- **FLAG_STATE: ON-by-default** — `search-flags.ts:706-707` + `ENV_REFERENCE.md:296` both say default `true`, "Graduated ON." The "flip ON" premise is a **no-op; there is no off-state to flip from.**
- **READ_SIDE_FILTER: NOT wired** — `getValidEdges` (`temporal-edges.ts:111`, the `invalid_at IS NULL` recall filter) has **ZERO production callers** (test-only). Write-side IS wired: `detectContradictions` (`causal-edges.ts:336`) sets `invalid_at` — so edges get marked invalid but **recall never filters on it.** The currentness payoff is entirely unrealized at read time.
- **Two parallel currentness stores (the fork):** `lineage-state` (`superseded_by_memory_id`/`valid_to`, memory-level) vs `causal_edges` (`valid_at`/`invalid_at`, edge-level) — both encode current-vs-superseded; wiring `getValidEdges` without unifying them risks divergent verdicts.
- **FSRS reinforcement** under C6-A is genuinely unbuilt (no FSRS reinforcement code in `lib/`) and would add a THIRD writer to `causal_edges.strength`, re-touching the same edges — so "reversible in isolation" is false once C6-A lands.

## VERDICT: **needs-read-side-build** — C3-A is a read-side BUILD (wire `getValidEdges`/`invalid_at IS NULL` into recall) + a store-reconciliation decision, NOT an S-effort flip. **The honesty audit was right: the "clean flip" leverage claim is killed.**

## Synthesis impact
**Re-class C3-A in the roadmap** from "clean reversible S-effort flip (ship-first #3)" to "read-side currentness-filter BUILD + lineage/causal-edge store reconciliation (S→M, gated on the reconciliation decision)." The flag is already on; the value is in building the unwired read-side consumer.

## Next Focus
C3-A correctly demoted from a flip to a read-side build. Feeds Round J migration plan (Memory) + the roadmap re-sync (this is a headline correction to ship-first #3).
