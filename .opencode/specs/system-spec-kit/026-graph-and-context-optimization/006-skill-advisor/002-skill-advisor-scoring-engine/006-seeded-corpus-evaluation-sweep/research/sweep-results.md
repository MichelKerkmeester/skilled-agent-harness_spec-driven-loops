# Lane Weight Sweep Results (2026-05-24T07:24:51.897Z)

## Seed Status

- providerModelId: `ollama__nomic-embed-text-v1.5__768`
- cacheHits: 15
- cacheMisses: 0
- seededSkills: 15
- promptEmbeddings: 46
- varianceDetected: true

| vectorLabel | weights | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |
|---|---|---:|---:|---:|---:|
| V0-baseline-015-002 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | 0.6250 | 1.0000 | 0.2500 | 0 |
| V1-pre-015-002 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | 0.6667 | 1.0000 | 0.3333 | 1 |
| V2-slightly-higher | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | 0.6250 | 1.0000 | 0.2500 | 0 |
| V3-medium | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | 0.6250 | 1.0000 | 0.2500 | 0 |
| V4-aggressive | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | 0.6250 | 1.0000 | 0.2500 | 0 |
| V5-explicit-heavy | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | 0.6250 | 1.0000 | 0.2500 | 0 |
| V6-cosine-dominant | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | 0.6667 | 1.0000 | 0.3333 | 1 |

## Per-Case Routing Diffs vs Baseline

| vectorLabel | category | prompt | baselineActual | vectorActual | expectedSkill |
|---|---|---|---|---|---|
| V6-cosine-dominant | intent-described | Create the packet docs, track tasks, and validate the spec folder before closing the work. | sk-doc | system-spec-kit | system-spec-kit |
| V1-pre-015-002 | intent-described | Have Anthropic's coding CLI take a second look at this failing refactor. | cli-codex | cli-claude-code | cli-claude-code |

## Recommendation

Recommended vector: `V1-pre-015-002`

Baseline intent-described accuracy: 0.2500

Recommended intent-described accuracy: 0.3333

Recommended today-correct accuracy: 1.0000

Recommended flippedFromBaseline: 1
