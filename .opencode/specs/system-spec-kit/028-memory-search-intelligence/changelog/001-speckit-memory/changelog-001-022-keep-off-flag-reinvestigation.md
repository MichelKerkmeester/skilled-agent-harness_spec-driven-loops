---
title: "Changelog: Keep-Off Flag Resolution and Deep-Review Validation [001-speckit-memory/022-keep-off-flag-reinvestigation]"
description: "Chronological changelog for the keep-off flag resolution reckoning: keep 5 default-on, delete 10 and their code, plus the deep-review validation arc."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-20

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence`

### Summary

This milestone is the flag-resolution reckoning that closed the keep-off experiment after the build program and the four-round deep review. The criterion-4 benchmark had concluded that no default-off flag earned a flip, so every 028 flag that benchmarked keep-off was first reinvestigated for a path to useful, then simulated under a fair real-world load with claude2 and gpt-5.5 as the live signal, and finally given a per-flag keep-or-delete decision behind a fresh-Opus gate. The reckoning ended the path-to-useful framing. Where the connection to live data was made and the metric still did not move, the flag was deleted along with its code rather than left dormant. The final tally is keep 5 default-on and delete 10. A three-round deep review validated the disposition and caught an off-arm measurement bug that would have read every flip as a win.

### Added

- Added the final per-flag resolution table that records each flag as KEPT default-on or DELETED with its one-line deciding evidence, recorded in [`../../keep-off-flag-roadmap.md`](../../keep-off-flag-roadmap.md) and [`../../benchmark-status.md`](../../benchmark-status.md).
- Added the deleted-superseded-by-measurement note to each affected decision-record so the design-of-record stays readable while the flag and code are gone.
- Added the coupling guard follow-up that pairs `confidence_calibration` with `absolute_relevance_calibration`, since the isotonic model was fitted on the cosine-prior value distribution and silently mis-calibrates if the absolute lever is turned off underneath it.

### Changed

- Kept `SPECKIT_CONFIDENCE_CALIBRATION` default-on as an unqualified win. Held-out ECE moved from 0.184 to 0.023 across all folds with a shipped isotonic model resolved by default, so the earlier overfit of fitting and evaluating on the same set no longer applies, and a label-decoupling fix removed the contamination.
- Kept `SPECKIT_DERIVED_ID_PROVENANCE` default-on as an unqualified win. Content-addressed identity correctness is 4 of 4, with stability 50 of 50, replay 3 of 3, dedup discrimination 50 of 50 and 0 collisions.
- Kept `SPECKIT_RETENTION_FORGETTING_V1` default-on as a safety and no-harm guarantee, not a precision win. It spares 386 keep-set rows the off path would delete with a dropRecall delta of 0, and the keep and drop labels are circular because they derive from the reducer's own thresholds, so it earns its keep as a no-harm guardrail rather than a measured precision gain.
- Kept `SPECKIT_WORLD_SUMMARY_PRELUDE` default-on as a no-displacement grounding aid, not a recall-quality win. In append placement it recovers 11 targets with 0 regressions by construction because it never displaces a baseline row, and its apparent gain is partly a self-recall and an append-by-construction artifact rather than a ranking improvement.
- Kept `SPECKIT_TEMPORAL_EDGES` default-on on prod-path displacement protection. The +0.083 edge-hop recall is an eval-mode artifact the 3-result prod truncation floor cuts to a 0.000 delta, so the keep rests upstream of truncation on the graph-additive reorder that protects the prod top-3 from graph-channel displacement, 3 of 12 golden queries with 0 regressions.
- The five kept helpers route through `isFeatureEnabled` so the environment override still works and a user can force any of them off with an explicit `false`.

### Removed

- Deleted `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` and its `SPECKIT_PROCEDURAL_OUTCOME_EMITTER` companion and their code. The de-rate correctness fix was real but the outcome ledger stayed empty and the bounded multiplier moves only synthetic near-ties with an eval rankDelta of 0.
- Deleted `SPECKIT_SUMMARY_FUSION_LANE` (Recall@20 -0.036, displacement-only), `SPECKIT_CARDINALITY_PENALTY` (0.0000 movement, cap too small at K=20) and `SPECKIT_SLEEPTIME_CONSOLIDATION` (net -1.67pp, dedup hurts recall) and their code.
- Deleted `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` (negative on the real forward-CALLS graph) and the edge family `SPECKIT_SEMANTIC_EDGE_LAYER`, `SPECKIT_EDGE_VECTOR_INDEX`, `SPECKIT_EDGE_TRIPLET_SEARCH`, `SPECKIT_EDGE_SEMANTIC_DEDUP` and `SPECKIT_EDGE_SEMANTIC_INVALIDATION` (generic relation-template edges, recall-inert at K=20) and their code.
- Deleted `SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK` (MRR within noise on an empty ledger), `SPECKIT_BITEMPORAL_RECALL` (zero callers), `SPECKIT_EDGE_PRESENCE_CURRENTNESS` (integrity pass, repairs 0) and `SPECKIT_AGENTIC_RECALL` (oracle +0.344 but live net-zero with regressions, 51s, no consumer) and their code.

### Fixed

- Fixed the deep-review off-arm evaluation bug where the delete-env path measured the on arm after a flip instead of the off arm, so a flipped flag would have been scored as a win against itself.
- Fixed the test cascade so every test that encoded the old default-off through environment absence now reaches the off path through an explicit `false`, and the flag-ceiling drift guard accounts for the five default-on tokens and drops the deleted ones.

### Verification

- Strict parent validation on 028: PASS.
- Em-dash scan on the changelog folder: PASS, 0 matches.
- Criterion-4 per-flag benchmark on the corrected default-routing driver: the flags this Recall@20 path exercises either hurt recall when enabled or show zero movement, the measurement that drove the deletions.
- Held-out calibration evidence: ECE 0.184 to 0.023 across all folds with the shipped isotonic model.
- 4-layer verification: triage to adversarial-verify to fresh-Opus per-flag decision to a three-round deep review, which caught the off-arm measurement bug and established that synthetic, circular or self-recall wins do not earn a keep.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `keep-off-flag-roadmap.md` | Modified | Final per-flag resolution table, keep 5 and delete 10 with deciding evidence |
| `benchmark-status.md` | Modified | Final flip-decision tally with honest evidence framing for the 5 kept and the 10 deleted |
| `lib/search/search-flags.ts` | Modified | Five helpers stay default-on through `isFeatureEnabled`, the ten deleted helpers and their reads are removed |
| `tests/flag-ceiling.vitest.ts` | Modified | Drift guard accounts for the five default-on tokens and drops the deleted ones |

### Follow-Ups

- Add the coupling guard on the kept calibration pair so `absolute_relevance_calibration=false` with `confidence_calibration=true` degrades to identity rather than silently mis-calibrating.
- Track the within-noise graph-channel harm on the separate pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST` as a follow-up out of 028 scope. `SPECKIT_TEMPORAL_EDGES` stays default-on for its prod-path displacement protection, the graph-additive reorder that protects the truncated prod top-3, so the harm does not belong to it.
