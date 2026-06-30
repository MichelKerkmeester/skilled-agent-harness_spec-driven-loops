# Iteration 049 — Corrections applied to research.md

## Focus
Fold the red-team (iter-046), pre-mortem (iter-047), and empirical (iter-048) corrections into the final research.md.

## Findings
1. **[P1] Over-claim corrected** — "kills both hallucination classes" → "substantially reduces" (value fabrication fixed at extraction; prose fabrication structurally reduced, not fully eliminated without full-architecture citation gating).
2. **[P0] A3 deltaE-raise REFUTED + demoted TIER-1→TIER-2** — independently flagged by red-team (iter-046) and empirically by measurement (iter-048): deltaE<10 over-merges 9 distinct-color pairs on anobel. Coverage-election pre-gate (SOUND/additive) is the primary L4-leak fix; deltaE stays tight, changes only via per-corpus calibration.
3. **[P2] Refinements** — Phase 3 validator = detection not prevention; pre-mortem guards added (interaction opt-out + 30s cap, section false-ABSENT guard, focus-shape consumer updates).

## Questions Answered
- Is research.md sound for sign-off? Yes (red-team: 0 critical errors) with the corrections above applied.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open).

## Next Focus
Close out the loop.

## Summary
The deliverable was adversarially audited (3 verification passes) and empirically tested (2 host experiments); corrections are folded into research.md. The headline: a live deltaE measurement reversed a TIER-1 recommendation, and the over-claim was tightened to match the evidence. research.md (307 lines) is sign-off ready.
