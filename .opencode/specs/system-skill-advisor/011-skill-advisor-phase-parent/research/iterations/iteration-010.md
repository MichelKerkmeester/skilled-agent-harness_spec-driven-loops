# Iteration 10: Round C Feasibility — Advisor C4 Promotion-Gate + conflicts_with Status

## Focus
Round C feasibility for the Skill Advisor C4 promotion-gate build (C4-seam, SA-two-gate-promotion, SA-cold-start-neutral-prior, SA-heldout-attestation-gate) + a definitive LIVE-or-DORMANT verdict on `conflicts_with` (sets C1 priority). Read-only.

## Feasibility verdicts (newInfoRatio 0.85)
| Candidate | Verdict | Note |
|---|---|---|
| C4-seam (estimator deltas → shadow weights) | **GO** (explicit build, not a tweak) | NET-NEW: estimator emits a `ReadOnlyScorerCalibrationProposal` to JSONL but NO consumer reads it back; must build an out-of-process promoter (read JSONL → write shadow-weights var/file → daemon reload). **Cron/maintenance, never prompt-time hook.** Shadow lane is non-live (`liveWeightsFrozen:true`) → bad shadow weight can't corrupt routing. |
| SA-two-gate-promotion (k≥2 AND posterior, reachability-refusal) | **GO** (low-risk wrapper) | greenfield, but EXTEND the existing `minSamples`→`low_sample_excluded` + concentration guards; refusal → stays at frozen defaults |
| SA-heldout-attestation-gate | **GO** (fulfills dangling `heldOutValidationRequired` flag) | needs held-out partition added to the MAX_RECORDS=50 ring buffer |
| SA-cold-start-neutral-prior | **NEEDS-BENCHMARK** | already de-facto neutral via the `low_sample_excluded` cliff; must show the continuous prior beats the cliff |

## Decisive finding — conflicts_with is **DORMANT**
skill-graph.sqlite `skill_edges`: depends_on=9, enhances=33, prerequisite_for=11, siblings=22, **conflicts_with=0**; all 20+ real-skill `graph-metadata.json` declare `"conflicts_with": []`. The path is fully wired (DB CHECK, queries, -0.35 scorer weight, bilateral-symmetry validation, normalizer reserved-field guard) but carries ZERO live data. **Implication: roadmap C1 (split-conflict re-rank) is LOW priority/latent** — it hardens a code path that changes zero observable routing until a skill declares a reciprocal conflict edge. Do NOT prioritize C1 above the C4 gate work.

## Sequencing
C4-seam (promoter) → SA-two-gate (extend existing guards) → SA-heldout-attestation (add held-out partition) → SA-cold-start-neutral only if benchmark-justified. C1/conflicts_with deprioritized.

## Next Focus
C4 is now a fully-specified, GO-rated build (promoter + two-gate + held-out). Open: does the warm advisor daemon reload `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` on `advisor_rebuild` or only full restart? (module-load resolution implies restart-only → promoter needs an explicit reload trigger.)
