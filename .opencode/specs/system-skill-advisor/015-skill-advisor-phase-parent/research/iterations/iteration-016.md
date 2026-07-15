# Iteration 16: Round J Build Sequence — Skill Advisor (C4 gate chain; Beta posterior shared with D2)

## Focus
Round J: the ordered build sequence for Skill Advisor. Read-only.

## Build sequence (newInfoRatio 0.30)
| Phase | Candidates | Note |
|---|---|---|
| 0 | SA-asymmetric-deltas (new helper), C5-baseline + per-lane-health-instrumentation | measure the asserted graph_causal=0.13 skew; add the per-lane runtime score-presence signal laneSignals lacks |
| 1 | C5 (runtime-empty lane elision), C5a (degraded-lane flag) | consume the Phase-0 health signal; elide the BM25 shadow lane (live:false) |
| 2 | C4-seam (out-of-process promoter), **Beta-posterior estimator (SHARED WITH D2)**, C3 (RRF import, parallel) | C4-seam ships SHADOW-ONLY (liveWeightsFrozen guardrails intact, physically can't auto-promote) |
| 3 | SA-two-gate (k≥2 AND posterior + reachability validation), SA-cold-start-neutral (Beta(1,1)→0.5), SA-held-out-attestation, SA-decay-un-promotion, SA-content-fold | all depend on C4-seam + Beta posterior; SA-held-out finally backs the declared heldOutValidationRequired flag |

**Critical path:** C4-seam → Beta-posterior (shared w/ D2) → SA-two-gate → SA-held-out-attestation → SA-decay-un-promotion. C3/C5/SA-asymmetric are off-path parallel tracks.

## Key note (per J7 re-verify)
- **C5's "~13% skew" is ASSERTED (grep 0-match, no source artifact)** — capture the baseline first (fails the regression-baseline rule until measured). The per-lane health signal collapses to identical workspace-wide totals when laneAttributionBySkill is empty — so G3's "no usable per-lane signal" holds.
- SA-asymmetric-deltas: the cited :176 weight-delta is SOLID-symmetric, but the real asymmetry to add is at :200-201 (sign-locked threshold deltas) — a different seam.
- C4 confirmed NOT a graduation (raw-frequency estimator, zero Beta math) → build the posterior from the aionforge-trust reference.

## Next Focus
Feeds the roadmap re-sync (Advisor build order, C4 reference-backed) + the C5-13%-asserted correction.
