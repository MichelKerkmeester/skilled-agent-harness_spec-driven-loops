# Iteration 8: Adversarial Verification — Convergence-Bonus Channel-Interdependence (C-X1 ↔ C2-B)

## Focus
Round A (broadening) adversarial verification of a roadmap **[INFERENCE]**: does per-class zero-weighting of a fusion channel (candidate C2-B) silently reshape the cross-channel convergence bonus of the *surviving* channels, thereby justifying candidate **C-X1**'s `{bonusOverChannels:'active'|'configured'}` option? Verify against the real fusion code, not the inferred reasoning. Read-only; candidate proposals only. Internal path: `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts`.

## Actions Taken
1. Read `fuseResultsMulti` channel-iteration + weight-guard + bonus computation in `rrf-fusion.ts` (`:304-307`, `:345`, `:360`, `:378`, `:381-386`).
2. Confirmed the calibrated-overlap-bonus mode is **default-ON** (`:174-177`; disabled only by `SPECKIT_CALIBRATED_OVERLAP_BONUS=false`).
3. Traced the denominator: `totalChannels = activeChannelCount` (`:345`), incremented (`:307`) only *after* the `weight<=0 || empty` guard `continue` (`:304`) — so zeroed channels are excluded from the denominator.
4. Worked the concrete arithmetic for a 3→2 active-channel transition.

## Findings (file:line)

**Convergence-bonus denominator counts ONLY active channels — [CONFIRMED].**
The calibrated convergence bonus uses `overlapRatio = (channelsHit - 1) / max(1, totalChannels - 1)` [SOURCE: rrf-fusion.ts:360] where `totalChannels = activeChannelCount` [SOURCE: :345], and `activeChannelCount` is incremented at `:307` only *after* the guard at `:304` `continue`s past any channel with `weight <= 0` or empty results. Concretely: with 3 active channels a candidate hitting 2 gets `overlapRatio` 0.5; zero one channel → 2 active → the SAME candidate hitting the SAME 2 surviving channels now gets `overlapRatio` 1.0 — ≈2× bonus (capped at `CALIBRATED_OVERLAP_MAX=0.06`, `:55`/`:378`). So C2-B's per-class zero-weighting does NOT merely drop a channel; it re-normalizes every surviving multi-channel candidate's convergence bonus. [CONFIRMED — rrf-fusion.ts:304-307,345,360.]

**C-X1 `{bonusOverChannels}` is justified — [CONFIRMED, test-pending].**
Current code is hard-wired to `'active'` semantics; no `'configured'` denominator exists [SOURCE: :345/:360]. A `'configured'` mode (denominator = channels-with-results counted *before* the weight guard) would hold the bonus stable when a class zeroes a channel. Caveat: the flat 2-list fallback path computes `bonus = convergenceBonus*(uniqueSourceCount-1)` independent of `totalChannels` [SOURCE: :381-386], so the distortion is specific to the default calibrated path — a unit test must pin that path.

**Roadmap impact:** the C-X1 [INFERENCE] (Provenance & Caveats: "convergence-bonus channel-interdependence … needs a fusion-bonus unit test") is upgraded to **[CONFIRMED]** (test-pending). The C-X1-before-C2-B sequencing is now mechanism-backed, not inferred.

## Questions Answered
- Does per-class channel zero-weighting reshape the surviving channels' convergence bonus? **YES** — ≈2× `overlapRatio` inflation on a 3→2 transition (capped 0.06), in the default calibrated path. C-X1 is justified.

## Questions Remaining
- (new) Does the C2-B zero-weighting path actually flow through `fuseResultsMulti` (calibrated), or can it reach the 2-list flat `fuseResults` path (`:240`) where the bonus is denominator-independent? (Determines whether the distortion is reachable in practice.)
- (new) Should `'configured'` count empty-result channels too (the `:304` guard also `continue`s on `results.length===0`), or only zero-weighted ones?

## Next Focus
C-X1 confirmed; residual is the C2-B routing question (does it hit the calibrated path) — a Round-A follow-up or Round-C feasibility item. Convergence-bonus interdependence is no longer inferred.
