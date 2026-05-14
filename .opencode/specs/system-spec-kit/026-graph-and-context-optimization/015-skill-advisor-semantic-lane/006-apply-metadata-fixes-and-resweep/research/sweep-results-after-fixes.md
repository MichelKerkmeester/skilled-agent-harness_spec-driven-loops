# Lane Weight Sweep Results After Metadata Fixes (2026-05-14T05:19:34.402Z)

## Seed Status

Default provider run:

- skipped: true
- skipReason: Failed to create context
- command: `npm exec --workspace=@spec-kit/mcp-server -- vitest run skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts`

Local provider measurement:

- providerModelId: `hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8`
- cacheHits: 0
- cacheMisses: 12
- seededSkills: 12
- promptEmbeddings: 24
- varianceDetected: false
- command: `EMBEDDINGS_PROVIDER=hf-local npm --prefix .opencode/skills/system-spec-kit exec --workspace=@spec-kit/mcp-server -- vitest run skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts`

The default environment still cannot create the embedding context, matching 015/004. The explicit local provider run seeded from an empty cache and produced a valid empirical sweep, but the variance assertion failed because all vectors still routed identically.

## Per-Vector Summary

015/004 baseline for every vector: `accuracyTotal 0.6667`, `todayCorrectAccuracy 1.0000`, `intentDescribedAccuracy 0.3333`, `flippedFromBaseline 0`.

| vectorLabel | weights | accuracyTotal | Delta vs 015/004 | todayCorrect | Delta vs 015/004 | intentDescribed | Delta vs 015/004 | flippedFromBaseline | Delta vs 015/004 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| V0-baseline-015-002 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V1-pre-015-002 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V2-slightly-higher | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V3-medium | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V4-aggressive | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V5-explicit-heavy | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V6-cosine-dominant | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |

## Per-Case Routing Diffs vs 015/004

| vectorLabel | category | prompt | 015/004 actual | 015/006 actual | expectedSkill |
|---|---|---|---|---|---|
| none | n/a | n/a | n/a | n/a | n/a |

## Cache Invalidation Evidence

| Evidence | Value |
|---|---:|
| Cache file deleted before default sweep | yes |
| Cache file deleted before local provider measurement | yes |
| Local provider cacheHits | 0 |
| Local provider cacheMisses | 12 |
| Seeded skills | 12 |
| Prompt embeddings | 24 |
| Cache file removed again after measurement | yes |

## Conclusion

Metadata fixes did not move the seeded sweep numbers. Every vector remains at `accuracyTotal 0.6667`, `todayCorrectAccuracy 1.0000`, `intentDescribedAccuracy 0.3333`, and `flippedFromBaseline 0`, so the delta versus 015/004 is `+0.0000` across the measured accuracy metrics.

The practical implication is that this 24-prompt corpus is still saturated by existing explicit/lexical routing, and the sweep fixture only embeds skill descriptions. The trigger phrase and key topic improvements are worthwhile discovery metadata, but they are not a strong enough knob for this corpus. Recommendation: stay at semantic weight `0.05` and use a harder corpus or a projection that includes richer metadata before changing lane weights.
