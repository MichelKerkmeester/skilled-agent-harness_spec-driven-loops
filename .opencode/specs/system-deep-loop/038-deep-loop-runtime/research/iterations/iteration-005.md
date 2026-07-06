# Iteration 5: Adversarial Verification — D3 Re-baselining (not a no-op) + Quarantine Folding Call Site (no reusable helper)

## Focus
Round A (broadening) adversarial verification of two **[INFERRED]** Deep Loop claims: (a) D3's `min(reliabilityPosterior, normalizedDiversity/Depth)` cap is NOT a pure no-op at uniform r=0.5, so a build-time calibration run is genuinely required; (b) Deep Loop's quarantine tie-break (Q2) can reuse 001's content-derived ordering/fold helper. Read-only; verify against `convergence.cjs` + `bayesian-scorer.ts`.

## Actions Taken
1. Read the research composite fold in `convergence.cjs` (`:111-121`: `normalizedDiversity=min(sourceDiversity/3,1)*0.15`, `normalizedDepth=min(evidenceDepth/5,1)*0.15`), the STOP guard (`:198`,`:204`,`:207`, sourceDiversity threshold 1.5), and the decision path (`:378-381`).
2. Read `bayesian-scorer.ts` `computeScore`.
3. Grepped the deep-loop tree for a reusable content-derived ordering/fold helper.

## Findings (file:line)

**D3 is NOT a pure no-op at r=0.5 — [CONFIRMED].**
The 0.5 cap bites whenever `normalizedDiversity > 0.5` (i.e. `sourceDiversity > 1.5`) — and 1.5 is exactly the research STOP guard threshold [SOURCE: convergence.cjs:198/204/207]. So every STOP-eligible run sits at/above the point where `min(0.5, normalizedDiversity)` clamps the diversity contribution below today's value; depth diverges once `evidenceDepth > 2.5`. The composite score therefore diverges from today's. Caveat: today's `decision` (`:378-381`) is driven by `blockers` + `trace.every(passed)` on RAW signals, NOT the composite score — so the divergence flips STOP decisions only once D3's two-gate STOP actually consumes the capped score. That is precisely why a build-time calibration run is REQUIRED, not optional. [CONFIRMED — convergence.cjs:111-121,198-207,378-381.]

**No reusable content-derived ordering/fold helper exists — [REFUTED].**
The only deterministic content-derived tie-break is INLINE at `council-graph-query.ts:280` (`a.id.localeCompare(b.id)` final sort key in `rankHotNodes`); the only id-keyed fold is the registry merge in `fanout-merge.cjs:117-136,:209-229` (fold-into-Map keyed on finding id, insertion-order output — not a content-derived ordering). Neither is a callable helper a quarantine tie-break could reuse as-is. [REFUTED — the roadmap's "reuse 001's content-derived ordering helper" assumes an extracted helper that does not exist.]

**Roadmap impact:** (a) confirms the roadmap's own Provenance caveat ("D3 threshold re-baselining is unmeasured … a measured calibration run is required at build time") — upgrade to **[CONFIRMED]**. (b) the cross-system reuse claim (Deep Loop reuses 001's folding helper) is **[REFUTED]**: the helper must first be EXTRACTED from the inline `council-graph-query.ts:280` idiom — a new prerequisite candidate.

## Questions Answered
- Is D3 a no-op at r=0.5? **NO** — it diverges above the `sourceDiversity≥1.5` STOP threshold; calibration required.
- Where is the 001 folding call site to reuse? **It does not exist as a reusable helper** — only an inline `localeCompare` at `council-graph-query.ts:280`.

## Questions Remaining
- (new) Does D3's two-gate STOP REPLACE the `trace.every(passed)` gate (`:379-381`) or add a second gate alongside it? Calibration design depends on which path consumes the capped score.
- (new) Confirm whether packet 001 ever landed a shared ordering/fold helper elsewhere, or never landed one (current evidence: never landed; only inline idiom exists).

## Next Focus
D3-calibration confirmed required; folding-helper reuse refuted (needs extraction first). Round-A/C residual: the two-gate-STOP wiring question (replace vs add). New candidate: extract `council-graph-query.ts:280` into a shared deterministic-ordering helper as the prerequisite for Q2 quarantine ordering.
