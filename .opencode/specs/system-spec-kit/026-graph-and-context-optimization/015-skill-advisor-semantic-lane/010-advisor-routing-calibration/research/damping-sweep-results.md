# Lane Damping Sweep Results (2026-05-14T07:10:54.452Z)

## Seed Status

- providerModelId: `llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8`
- cacheHits: 15
- cacheMisses: 0
- seededSkills: 15
- promptEmbeddings: 46
- weightVectors: 7
- dampingConfigs: 6
- combinationsPerCorpus: 42
- varianceDetected24: false
- varianceDetectedHarder: true

Baseline anchors: 24-prompt V0 no-damping = accuracyTotal 0.6667, todayCorrect 1.0000, intentDescribed 0.3333, flippedFromBaseline 0. 22-harder V0 no-damping = accuracyTotal 0.2273, todayCorrect 1.0000, intentDescribed 0.2273, flippedFromBaseline 0.

## 24-Prompt Accuracy Matrix

| vectorLabel | dampingLabel | weights | damping | accuracyTotal | deltaAccuracy | todayCorrect | deltaTodayCorrect | floor | intentDescribed | deltaIntentDescribed | flippedFromBaseline |
|---|---|---|---|---:|---:|---:|---:|---|---:|---:|---:|
| V0-baseline-015-002 | D0-control-no-damping | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | none | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V0-baseline-015-002 | D1-light-t0.20-f0.50 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V0-baseline-015-002 | D2-medium-t0.30-f0.30 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V0-baseline-015-002 | D3-aggressive-t0.40-f0.10 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V0-baseline-015-002 | D4-probe-t0.60-f0.05 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V0-baseline-015-002 | D5-probe-t0.80-f0.00 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V1-pre-015-002 | D0-control-no-damping | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | none | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V1-pre-015-002 | D1-light-t0.20-f0.50 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V1-pre-015-002 | D2-medium-t0.30-f0.30 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V1-pre-015-002 | D3-aggressive-t0.40-f0.10 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V1-pre-015-002 | D4-probe-t0.60-f0.05 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V1-pre-015-002 | D5-probe-t0.80-f0.00 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V2-slightly-higher | D0-control-no-damping | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | none | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V2-slightly-higher | D1-light-t0.20-f0.50 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V2-slightly-higher | D2-medium-t0.30-f0.30 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V2-slightly-higher | D3-aggressive-t0.40-f0.10 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V2-slightly-higher | D4-probe-t0.60-f0.05 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V2-slightly-higher | D5-probe-t0.80-f0.00 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V3-medium | D0-control-no-damping | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | none | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V3-medium | D1-light-t0.20-f0.50 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V3-medium | D2-medium-t0.30-f0.30 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V3-medium | D3-aggressive-t0.40-f0.10 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V3-medium | D4-probe-t0.60-f0.05 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V3-medium | D5-probe-t0.80-f0.00 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V4-aggressive | D0-control-no-damping | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | none | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V4-aggressive | D1-light-t0.20-f0.50 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V4-aggressive | D2-medium-t0.30-f0.30 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V4-aggressive | D3-aggressive-t0.40-f0.10 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V4-aggressive | D4-probe-t0.60-f0.05 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V4-aggressive | D5-probe-t0.80-f0.00 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V5-explicit-heavy | D0-control-no-damping | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | none | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V5-explicit-heavy | D1-light-t0.20-f0.50 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V5-explicit-heavy | D2-medium-t0.30-f0.30 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V5-explicit-heavy | D3-aggressive-t0.40-f0.10 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V5-explicit-heavy | D4-probe-t0.60-f0.05 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V5-explicit-heavy | D5-probe-t0.80-f0.00 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V6-cosine-dominant | D0-control-no-damping | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | none | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V6-cosine-dominant | D1-light-t0.20-f0.50 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V6-cosine-dominant | D2-medium-t0.30-f0.30 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V6-cosine-dominant | D3-aggressive-t0.40-f0.10 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V6-cosine-dominant | D4-probe-t0.60-f0.05 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |
| V6-cosine-dominant | D5-probe-t0.80-f0.00 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | ok | 0.3333 | +0.0000 | 0 |

## 22-Harder Accuracy Matrix

| vectorLabel | dampingLabel | weights | damping | accuracyTotal | deltaAccuracy | todayCorrect | deltaTodayCorrect | floor | intentDescribed | deltaIntentDescribed | flippedFromBaseline |
|---|---|---|---|---:|---:|---:|---:|---|---:|---:|---:|
| V0-baseline-015-002 | D0-control-no-damping | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | none | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V0-baseline-015-002 | D1-light-t0.20-f0.50 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V0-baseline-015-002 | D2-medium-t0.30-f0.30 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V0-baseline-015-002 | D3-aggressive-t0.40-f0.10 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V0-baseline-015-002 | D4-probe-t0.60-f0.05 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V0-baseline-015-002 | D5-probe-t0.80-f0.00 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V1-pre-015-002 | D0-control-no-damping | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | none | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V1-pre-015-002 | D1-light-t0.20-f0.50 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V1-pre-015-002 | D2-medium-t0.30-f0.30 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V1-pre-015-002 | D3-aggressive-t0.40-f0.10 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V1-pre-015-002 | D4-probe-t0.60-f0.05 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V1-pre-015-002 | D5-probe-t0.80-f0.00 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.1818 | -0.0455 | n/a | n/a | n/a | 0.1818 | -0.0455 | 1 |
| V2-slightly-higher | D0-control-no-damping | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | none | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V2-slightly-higher | D1-light-t0.20-f0.50 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V2-slightly-higher | D2-medium-t0.30-f0.30 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V2-slightly-higher | D3-aggressive-t0.40-f0.10 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V2-slightly-higher | D4-probe-t0.60-f0.05 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V2-slightly-higher | D5-probe-t0.80-f0.00 | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V3-medium | D0-control-no-damping | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | none | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V3-medium | D1-light-t0.20-f0.50 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V3-medium | D2-medium-t0.30-f0.30 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V3-medium | D3-aggressive-t0.40-f0.10 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V3-medium | D4-probe-t0.60-f0.05 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V3-medium | D5-probe-t0.80-f0.00 | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V4-aggressive | D0-control-no-damping | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | none | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V4-aggressive | D1-light-t0.20-f0.50 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V4-aggressive | D2-medium-t0.30-f0.30 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V4-aggressive | D3-aggressive-t0.40-f0.10 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V4-aggressive | D4-probe-t0.60-f0.05 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V4-aggressive | D5-probe-t0.80-f0.00 | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V5-explicit-heavy | D0-control-no-damping | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | none | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V5-explicit-heavy | D1-light-t0.20-f0.50 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V5-explicit-heavy | D2-medium-t0.30-f0.30 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V5-explicit-heavy | D3-aggressive-t0.40-f0.10 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V5-explicit-heavy | D4-probe-t0.60-f0.05 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V5-explicit-heavy | D5-probe-t0.80-f0.00 | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V6-cosine-dominant | D0-control-no-damping | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | none | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V6-cosine-dominant | D1-light-t0.20-f0.50 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.2000/f0.5000, lexical=t0.2000/f0.5000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V6-cosine-dominant | D2-medium-t0.30-f0.30 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.3000/f0.3000, lexical=t0.3000/f0.3000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V6-cosine-dominant | D3-aggressive-t0.40-f0.10 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.4000/f0.1000, lexical=t0.4000/f0.1000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V6-cosine-dominant | D4-probe-t0.60-f0.05 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.6000/f0.0500, lexical=t0.6000/f0.0500 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |
| V6-cosine-dominant | D5-probe-t0.80-f0.00 | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | explicit_author=t0.8000/f0.0000, lexical=t0.8000/f0.0000 | 0.2273 | +0.0000 | n/a | n/a | n/a | 0.2273 | +0.0000 | 0 |

## Per-Case Routing Diffs vs V0/D0

| corpus | vectorLabel | dampingLabel | category | prompt | baselineActual | comboActual | expectedSkill | correct | harderReason |
|---|---|---|---|---|---|---|---|---|---|
| 22-harder | V1-pre-015-002 | D5-probe-t0.80-f0.00 | intent-described | Ask the search-grounded external model to sweep the architecture and report what this repo is missing. | cli-gemini | cli-codex | cli-gemini | no | Search-grounded external model implies Gemini, but repo architecture terms can route to cli-codex/sk-code. |

## Recommendation

`stay at current 0.05 + no damping`

24-prompt floor for recommendation: 1.0000

Harder baseline intent-described accuracy: 0.2273

Recommended harder intent-described accuracy: 0.2273

Delta vs harder V0/D0: +0.0000

Delta vs 015/004 V0 intent-described baseline: -0.1060
