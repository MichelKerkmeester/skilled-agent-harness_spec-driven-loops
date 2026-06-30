# Iteration 17: Round J GO Re-Verify — Advisor + Deep Loop GOs (the C5 13% is unsourced)

## Focus
Round J: adversarial re-verification of the top Advisor + Deep Loop GOs' evidence quality. Read-only.

## Re-verdicts (newInfoRatio 0.45)
| GO | Quality | Caveat |
|---|---|---|
| **C5 "~13% confidence skew"** | **ASSERTED** | grep for `13%`/`~13`/`0.13`/`confidence skew` across ALL of `.opencode/specs/` + `system-skill-advisor/` = **ZERO matches**. The number has NO source artifact — asserted, not measured. Fails the regression-baseline rule. Per-lane signal exists (feedback-calibration.ts:167-189) but is shadow-gated + collapses to identical workspace totals without laneAttributionBySkill (:169) → G3's "no usable per-lane signal" holds |
| SA-asymmetric-deltas | **SOLID** | :86-88 clamp is symmetric; the real asymmetry to add is at :200-201 (sign-locked threshold deltas), not the cited :176 |
| Q6-anchor FIX | **SOLID** | reduce-state.cjs:709-711 throws on the first missing anchor (key-questions, :734); template lacks all 7 (grep absence) |
| DL-order-independent-merge | **WEAKER** | labelDirs unsorted (:335) ✓, but `finding.id` NOT always present (key `id||title` :123); it's first-seen-wins Map dedup (:125-131), NOT a tiebreak comparator — itself order-dependent |
| DL-failure-class-taxonomy | **WEAKER** | `settleItem` computes NO class (grep 0 timeout/exitCode/signal tokens); catch flattens to {name,message} (:103-106) — "discarded" real, "computed[-in-pool]" overstates (computed upstream in fanout-run) |

## Key note
**C5's headline "~13% skew" is unsourced — the strongest evidence-quality correction.** It must be measured (baseline capture) before C5 can claim that leverage. SOLID: Q6-anchor, SA-asymmetric-deltas. The two DL GOs are real opportunities but the I-sketch evidence framing was loose (id-not-always-present; class-computed-upstream-not-in-pool).

## Next Focus
Feeds the roadmap re-sync — C5's 13% is asserted-not-measured (capture baseline first); refine the DL-merge + failure-class framing.
