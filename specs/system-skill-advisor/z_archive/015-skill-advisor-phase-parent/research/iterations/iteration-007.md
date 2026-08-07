# Iteration 7: External Mining — aionforge trust-model.md + attestation-and-promotion.md → Skill Advisor

## Focus
Round B external mining: two unread aionforge docs (trust-model, attestation-and-promotion) for NET-NEW Skill Advisor candidates. **Targeted at C4's MISSING promotion gate** (Round A iter-5 refuted C4 as a ready pipeline — the estimator→shadow-weight seam + promotion gate are absent). aionforge supplies the exact gate shape. Read-only.

## Actions Taken
1. Read aionforge `docs/trust-model.md` + `docs/attestation-and-promotion.md`.
2. Confirmed internal seams: `feedback-calibration.ts:222-238` (emits proposal w/ weight+threshold deltas; `autoPromotion:false, liveWeightsFrozen:true, shadowOnly:true, heldOutValidationRequired:true` — no gate consumes it), `:176` (symmetric single clamp), `:193-197` (low_sample/concentration EXCLUDE not neutral-prior), `:241-249` (JSONL append log), `lane-registry.ts:8-13` (defaultWeight vs defaultShadowWeight), `advisor-recommend.ts:382-390` (shadow-vs-live delta sink).

## Findings — NET-NEW candidates (6; directly close the C4 gate gap, newInfoRatio 0.75)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| two-gate-promotion (k≥2 distinct AND posterior≥threshold, non-tradeoff + REFUSE unreachable policy) | feedback-calibration.ts:222-238 (gate=GAP) | H/M | BUILD | CONFIRMED |
| cold-start-neutral-prior (unscored contributor = uninformative 0.5 → cold start promotes nothing) | feedback-calibration.ts:193-197 | M/S | BUILD | CONFIRMED |
| held-out-attestation-gate (distinct-source corroboration, one-vote-per-source, can't certainty by count) | feedback-calibration.ts:235; advisor-recommend.ts:382-390 | H/M | BUILD | CONFIRMED |
| decay-driven-un-promotion (reversible: decayed support demotes; stable id re-promotes; audit "support went bad" vs "lost") | lane-registry.ts:8-13 (no revert path) | M/L | BUILD | CONFIRMED-seam/INFERRED-absence |
| asymmetric-promote-demote-deltas (corrections sink harder than acceptances raise; up-cap=0 decay-only mode) | feedback-calibration.ts:176 | M/S | FIX | CONFIRMED |
| content-addressed-order-independent-fold (append-only log source-of-truth; Beta increments commute; replay-safe) | feedback-calibration.ts:241-249 | M/M | FIX | CONFIRMED-seam/INFERRED-property |

**Already covered:** C1-C5/C5a/QCR. C4 (Beta-posterior lane auto-tune) — **A/B/C above ARE the missing promotion-gate machinery C4 needs**, not C4 itself. This iteration directly closes the Round-A C4-refutation gap.

## Questions Answered
- What does C4's missing promotion gate look like? aionforge's two-gate promotion (k≥2 AND posterior, reachability-refusal) + cold-start-neutral prior + held-out attestation gate + decay-driven un-promotion. The estimator already emits a `proposal`; **no gate consumes it** — these candidates ARE the gate.

## Questions Remaining
- Does the shadow-delta sink (shadow-sink.ts) already partition records by query-class (could reuse QCR buckets as the distinct-source dimension for held-out-attestation)? Should un-promotion gate on the same posterior as promotion (aionforge mirrors promotion/demotion)?

## Next Focus
C4 is now fully specified: estimator→proposal exists; the BUILD is the two-gate promotion + neutral prior + held-out gate + reversible demotion. This converts the Round-A C4 refutation into an actionable build spec. Feeds Round C (C4 feasibility/sequencing).
