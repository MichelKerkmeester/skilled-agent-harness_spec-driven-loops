---
title: "Changelog: Keep-Off Flag Reinvestigation and Deep-Review Validation [001-speckit-memory/022-keep-off-flag-reinvestigation]"
description: "Chronological changelog for the keep-off flag reinvestigation, the four default-on flips, the procedural revert and the deep-review validation arc."
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

This milestone is the flag-validation arc that ran after the build program and the four-round deep review. The criterion-4 benchmark had concluded that no default-off flag earned a flip, so every 028 flag that benchmarked keep-off was reinvestigated through deep research to find the concrete path that makes it improve a real metric. The reinvestigation produced a triage that named, for each flag, its root cause, its path to useful, its effort and its flip potential. The cross-cutting finding was that every keep-off flag is mechanism-shipped and claim-deferred by design, so each gap is a missing connection to live data rather than a logic bug. Four flags then earned a default-on flip on a research-to-fix-to-flip loop, one flag reverted to default-off after its correctness fix landed, the structural keep-offs stayed off, the wired-deferred flags stayed wired and held, and a three-round deep review validated the whole disposition and caught an off-arm measurement bug that would have read every flip as a win.

### Added

- Added the keep-off flag reinvestigation triage that maps each keep-off flag to its root cause, its path to useful, its effort and its flip potential, recorded in [`../../keep-off-flag-roadmap.md`](../../keep-off-flag-roadmap.md).
- Added the per-flag flip-decision record with an honest evidence column so a release sign-off never reads a safety flip as a precision win, recorded in [`../../benchmark-status.md`](../../benchmark-status.md).
- Added the coupling guard note that pairs `confidence_calibration` with `absolute_relevance_calibration`, since the isotonic model was fitted on the cosine-prior value distribution and silently mis-calibrates if the absolute lever is turned off underneath it.

### Changed

- Flipped `SPECKIT_CONFIDENCE_CALIBRATION` to default-on as an unqualified win. Held-out ECE moved from 0.184 to 0.023 across all folds with a shipped isotonic model resolved by default, so the earlier overfit of fitting and evaluating on the same set no longer applies, and a label-decoupling fix removed the contamination.
- Flipped `SPECKIT_DERIVED_ID_PROVENANCE` to default-on as an unqualified win. Content-addressed identity correctness is 4 of 4, with stability 50 of 50, replay 3 of 3, dedup discrimination 50 of 50 and 0 collisions.
- Flipped `SPECKIT_RETENTION_FORGETTING_V1` to default-on as a safety and no-harm guarantee, not a precision win. It spares 386 keep-set rows the off path would delete with a dropRecall delta of 0, and the keep and drop labels are circular because they derive from the reducer's own thresholds, so it earns the flip as a no-harm guardrail rather than a measured precision gain.
- Flipped `SPECKIT_WORLD_SUMMARY_PRELUDE` to default-on as a no-displacement grounding aid, not a recall-quality win. In append placement it recovers 11 targets with 0 regressions by construction because it never displaces a baseline row, and its apparent gain is partly a self-recall and an append-by-construction artifact rather than a ranking improvement.
- Routed all four flipped helpers through `isFeatureEnabled` so the environment override still works and a user can force any flag off with an explicit `false`.

### Fixed

- Reverted `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` to default-off while keeping its correctness fix committed. The old multiplier could only de-rate because the score factor was at most 1, and the fix replaces it with a prior-centered evidence-weighted delta that can promote a reliable procedure and demote an unreliable one in a near-tie. The multiplier moves only synthetic near-ties with zero measurable effect on real data, so the flag does not earn default-on and waits on a near-tie benchmark.
- Fixed the deep-review off-arm evaluation bug where the delete-env path measured the on arm after a flip instead of the off arm, so a flipped flag would have been scored as a win against itself.
- Fixed the test cascade so every test that encoded the old default-off through environment absence now reaches the off path through an explicit `false`, and the flag-ceiling drift guard keeps every token accounted for as default-on.

### Verification

- Strict parent validation on 028: PASS.
- Em-dash scan on the changelog folder: PASS, 0 matches.
- Criterion-4 per-flag benchmark on the corrected default-routing driver: the two flags this Recall@20 path exercises either hurt recall when enabled or show zero movement, confirming the structural keep-offs.
- Held-out calibration evidence: ECE 0.184 to 0.023 across all folds with the shipped isotonic model.
- Deep review: three rounds, the off-arm measurement bug caught and corrected, and the principle established that synthetic, circular or self-recall wins do not earn a flip.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `keep-off-flag-roadmap.md` | Modified | Per-flag reinvestigation triage, root cause, path to useful and flip potential |
| `benchmark-status.md` | Modified | Flip-decision record with honest evidence framing for the four flips, the procedural revert and the kept-off set |
| `lib/search/search-flags.ts` | Modified | Four helpers graduate to default-on through `isFeatureEnabled`, procedural recall stays default-off |
| `tests/flag-ceiling.vitest.ts` | Modified | Drift guard accounts for the four default-on tokens and the explicit-false off paths |

### Follow-Ups

- Wire `SPECKIT_AGENTIC_RECALL` to a real production consumer that needs a live chat LLM plus the daemon, or remove the unwired scaffold. It stays default-off until it has a consumer to measure.
- Re-measure `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` on a near-tie benchmark. The de-rate fix is committed and the multiplier is promotion-capable, so it stays default-off only until a near-tie golden set shows a real win.
- Flip the advisor outcome-weighted rerank once a real production ledger exists, because the ledger is the long pole and the shadow seam is wired and held until then.
- Track the within-noise graph-channel harm on the separate pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST` as a follow-up out of 028 scope. `SPECKIT_TEMPORAL_EDGES` ships default-on as the additive graph-lane mitigation with edge-hop recall +0.083 on versus off on a live-DB copy, so the harm does not belong to it.
