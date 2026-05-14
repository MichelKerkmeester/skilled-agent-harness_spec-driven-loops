# Lane Weight Sweep Results (2026-05-14T04:22:21.000Z)

## Seed Status

- skipped: true
- skipReason: Failed to create context

Provider unavailable; seeded sweep skipped in the default verification environment. The new test path stays green by skipping the seeded sweep when `createEmbeddingsProvider().embedDocument(...)` cannot produce vectors.

## Exploratory Provider Check

An explicit `EMBEDDINGS_PROVIDER=hf-local` run seeded vectors successfully, but the current 7-vector corpus still produced zero top-route variance, so the variance assertion failed as designed. Those exploratory numbers are not promoted as the official sweep result because the requested default provider path skipped.

| vectorLabel | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |
|---|---:|---:|---:|---:|
| V0-baseline-015-002 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V1-pre-015-002 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V2-slightly-higher | 0.6667 | 1.0000 | 0.3333 | 0 |
| V3-medium | 0.6667 | 1.0000 | 0.3333 | 0 |
| V4-aggressive | 0.6667 | 1.0000 | 0.3333 | 0 |
| V5-explicit-heavy | 0.6667 | 1.0000 | 0.3333 | 0 |
| V6-cosine-dominant | 0.6667 | 1.0000 | 0.3333 | 0 |

## Per-Case Routing Diffs vs Baseline

| vectorLabel | category | prompt | baselineActual | vectorActual | expectedSkill |
|---|---|---|---|---|---|
| none | n/a | n/a | n/a | n/a | n/a |

## Recommendation

Recommended next weight: stay at `0.05`.

The default provider did not run, and the explicit local fallback check showed no `intentDescribedAccuracy` delta versus V0. There is no evidence in this packet to promote a different semantic weight.
