# Lane Weight Sweep Results (2026-05-15T16:40:33.502Z)

## Seed Status

- providerModelId: `llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8`
- cacheHits: 15
- cacheMisses: 0
- seededSkills: 15
- promptEmbeddings: 46
- varianceDetected: false

| vectorLabel | weights | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |
|---|---|---:|---:|---:|---:|
| V0-baseline-015-002 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V1-pre-015-002 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V2-slightly-higher | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V3-medium | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V4-aggressive | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V5-explicit-heavy | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V6-cosine-dominant | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | 0.6667 | 1.0000 | 0.3333 | 0 |

## Per-Case Routing Diffs vs Baseline

| vectorLabel | category | prompt | baselineActual | vectorActual | expectedSkill |
|---|---|---|---|---|---|
| none | n/a | n/a | n/a | n/a | n/a |

## Recommendation

Recommended vector: `V0-baseline-015-002`

Baseline intent-described accuracy: 0.3333

Recommended intent-described accuracy: 0.3333

Recommended today-correct accuracy: 1.0000

Recommended flippedFromBaseline: 0
