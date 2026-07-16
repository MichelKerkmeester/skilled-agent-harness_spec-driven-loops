# Iteration 001, Q1: Evidence-gap detector-vs-cap desync (keystone)

**Focus:** Why does the `[EVIDENCE GAP DETECTED]` banner coexist with a `good` `requestQuality` verdict on 19 of 144 benchmark cells?
**Executor:** gpt-5.5-fast xhigh, read-only.
**newInfoRatio:** 1.0, fully-new keystone root cause on the first pass.

## Finding: a field-bridging bug, not a threshold mismatch

The banner and the verdict cap read two **different** live signals, and only the banner's is set in production.

- Stage 4 detects the gap from TRM scores (`Z_SCORE_THRESHOLD = 1.3`), sets `metadata.stage4.evidenceGapDetected`, creates `annotations.evidenceGapWarning`, and annotates rows. [SOURCE: `lib/search/pipeline/stage4-filter.ts:264-277`, `:295-345`; `lib/search/evidence-gap-detector.ts:29-32`, `:199-208`]
- The **banner** is rendered from `pipelineResult.annotations.evidenceGapWarning`. [SOURCE: `handlers/memory-search.ts:1502-1508`]
- The **verdict cap** caps `good`→`weak` only when `options.evidenceGapDetected === true`. [SOURCE: `lib/search/confidence-scoring.ts:663-670`]
- The formatter feeds the cap `evidenceGapDetected: Boolean(safeExtraData?.evidenceGap)`. [SOURCE: `formatters/search-results.ts:1139-1142`]
- **But the live handler never sets `extraData.evidenceGap`**, only `extraData.evidenceGapWarning`. [SOURCE: `handlers/memory-search.ts:1365-1386`, `:1489-1499`]

So `safeExtraData.evidenceGap` is always falsy on the live path, the cap never fires for Stage-4 gaps, and the banner (from the warning) and the verdict (uncapped) disagree.

## Cap liveness

`SPECKIT_EVIDENCE_GAP_VERDICT_V1` is default-on and unit-tested (the cap fires when a caller passes `evidenceGapDetected: true`). [SOURCE: `lib/search/search-flags.ts:749-765`; `tests/flag-graduation-evidence-gap.vitest.ts:60-76`] But on the production `/memory:search` handler path the cap is **effectively dead code** because the boolean it reads is never set from the Stage-4 result. [INFERRED from the missing `extraData.evidenceGap` write]

## Fix design

Minimal one-line bridge in `handlers/memory-search.ts` near `:1365-1372`, add to `extraData`:

```
evidenceGap: pipelineResult.metadata.stage4.evidenceGapDetected
```

This routes the Stage-4 source of truth (which already drives the warning) into the boolean the cap reads at `formatters/search-results.ts:1141`.

**Blast radius:** `safeExtraData.evidenceGap` also drives recovery classification, it is treated as `partial` and triggers recovery context. [SOURCE: `formatters/search-results.ts:1162-1168`; `lib/search/recovery-payload.ts:76-80`, `:374-376`] So bridging the boolean also activates the recovery prompt on a gap. That is plausibly correct (a weak verdict with a recovery hint), but the fix must be verified against the recovery path, not just the verdict.

## Uncertainty
- INFERRED: that all 19 contradictions traversed this exact handler path.
- Confirming check: for one contradictory query, inspect the returned JSON for `stage4.evidenceGapDetected === true`, `evidenceGapWarning` present, `evidenceGap` absent, `requestQuality.label === "good"` before the fix; after the fix expect `evidenceGap === true` and label `weak`.

## Ruled out
- Threshold mismatch between detector and cap (both ultimately trace to the same Stage-4 TRM signal; the gap is in field-bridging, not thresholds).

## Next focus
Q4, the intent classifier inertia (132/144 `understand`, `weightsApplied off`): where intent is classified and what gates the retrieval-class weights.
