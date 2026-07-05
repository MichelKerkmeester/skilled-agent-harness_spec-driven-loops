# 013 — Deep-Research Loop Instrumentation (`newInfoRatio` + evidence labels)

## METADATA
- **Status:** Deferred (documented; needs focused implementation)
- **Level:** 2
- **Parent:** `008-speckit-surface-alignment`
- **Source:** `../../research/fable-5-review-synthesis.md` §(d)(ii)

## 1. FINDING
Across all 20 iterations of the surface-alignment deep-research run, the emitted `newInfoRatio` was exactly `1.0` in every state record — including iterations that verbatim-repeated earlier findings (retention drift in iters 1+2, benchmark README in 1+6, a convergence fixture in 12+13). The convergence/novelty signal never engaged, yet the synthesis cited "every iteration fully novel / corpus not exhausted" as evidence the loop was still productive. That conclusion was unevidenced: ~93 log findings compress to ~18 distinct.

Root cause: `newInfoRatio` is **emitted by the deep-research LEAF agent** (an LLM self-assessment written to `deep-research-state.jsonl`), and `deep-research/scripts/reduce-state.cjs` only *consumes* it (`record.newInfoRatio`). Nothing recomputes it deterministically against the accumulated findings registry, so a leaf that defaults to `1.0` is never corrected.

Related: the `[INFERENCE]` label in the prompt-pack conflates two evidence classes — genuine unverified inference vs. executed-command-with-output (the *strongest* class) — which the review found mis-tagged as weak.

## 2. FIX APPROACH (recommended: deterministic recompute)
Prefer a deterministic scorer over an LLM instruction (LLM self-scoring is what failed). In the reducer path (`deep-research/scripts/reduce-state.cjs`) or a sibling scorer, recompute `newInfoRatio` per iteration by comparing that iteration's findings against the accumulated `deep-research-findings-registry.json` (e.g. fraction of findings not already present), and let the reducer's recomputed value — not the leaf's raw emission — drive convergence telemetry. Separately, split the `[INFERENCE]` prompt-pack label into `[INFERENCE]` (unverified) and `[VERIFIED]`/`[COMMAND-OUTPUT]` (executed evidence).

## 3. ACCEPTANCE (RED/GREEN — must be ungameable)
- Feed the scorer a synthetic iteration whose findings duplicate a prior iteration's → recomputed `newInfoRatio < 1.0` (RED before fix, GREEN after).
- A fully-novel iteration → `newInfoRatio == 1.0`.
- The prompt-pack distinguishes inference from executed-command evidence.

## 4. WHY DEFERRED
Alters **shared deep-loop convergence semantics** consumed by every research/review/council loop. It needs a focused implementation with a real (not self-authored, not gameable) RED/GREEN test — not an autonomous mechanical dispatch that could ship a plausible-but-wrong convergence change. `deep-loop-runtime` code is currently clean, so there is no blocking collision; this is a care/blast-radius deferral, not a conflict one.
