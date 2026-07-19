---
title: "Evaluation API Surface"
description: "The evaluation API surface provides a stable public import boundary for ablation runs, BM25 baselines, ground-truth loading, and evaluation database setup."
trigger_phrases:
  - "evaluation api surface"
  - "eval api facade"
  - "stable evaluation import boundary"
  - "mcp-server/api/eval.ts"
  - "public evaluation export surface"
version: 3.6.0.9
---

# Evaluation API Surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW
The Evaluation API Surface is a narrow public facade for the system's evaluation tooling. Instead of having scripts import directly from internal `lib/eval/*` modules, the codebase exposes a single stable entry point at `mcp-server/api/eval.ts` for ablation experiments, BM25 baseline runs, ground-truth loading, and evaluation database initialization.

Its main job is architectural, not algorithmic. The file is explicitly marked as a public surface for scripts and as an `ARCH-1` stability boundary, which means internal evaluation modules can move or refactor without forcing downstream scripts to chase new import paths. In practice, the API surface reduces coupling by concentrating evaluation imports behind one maintained file.

---
## 2. HOW IT WORKS
`mcp-server/api/eval.ts` contains no local implementation logic. Its entire responsibility is to re-export evaluation APIs from internal modules. The ablation portion of the surface exports `runAblation`, `storeAblationResults`, `formatAblationReport`, `toHybridSearchFlags`, `isAblationEnabled`, `ALL_CHANNELS`, and the related `AblationChannel`, `AblationSearchFn`, and `AblationReport` types. This makes the ablation workflow available through a single public import path rather than by reaching into `lib/eval/ablation-framework`.

The same facade pattern is used for BM25 baseline evaluation. The file re-exports `runBM25Baseline` and `recordBaselineMetrics`, along with the `BM25SearchFn`, `BM25SearchResult`, and `BM25BaselineResult` types, so baseline measurement code can depend on a stable API boundary even if the underlying baseline implementation changes location or internal structure.

The surface also exposes `loadGroundTruth` and `initEvalDb` directly from their underlying modules. Together, these exports define the current evaluation API contract: ablation execution and reporting, BM25 baseline execution and metrics capture, ground-truth dataset loading, and evaluation database bootstrap. Because the file adds no wrappers, validation, or transformation logic of its own, its runtime behavior is purely pass-through and its maintenance burden is intentionally concentrated on keeping the public export list aligned with the internal evaluation modules.

---
## 3. SOURCE FILES
### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp-server/api/eval.ts` | API | Stable public evaluation facade for scripts and external callers |
| `mcp-server/lib/eval/ablation-framework.ts` | Lib | Source of ablation execution, reporting, channel constants, and ablation types |
| `mcp-server/lib/eval/bm25-baseline.ts` | Lib | Source of BM25 baseline execution, metrics recording, and baseline result types |
| `mcp-server/lib/eval/ground-truth-generator.ts` | Lib | Source of ground-truth loading exported through the public facade |
| `mcp-server/lib/eval/eval-db.ts` | Lib | Source of evaluation database initialization exported through the public facade |

### Validation And Tests
| File | Type | Role |
|---|---|---|
| `mcp-server/tests/api-public-surfaces.vitest.ts` | Automated test | Direct export contract for the public eval/search barrels and top-level API barrel parity |

---
## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-and-measurement/evaluation-api-surface.md`
Related references:
- [cross-ai-validation-fixes.md](../../feature-catalog/evaluation-and-measurement/cross-ai-validation-fixes.md) — Cross-AI validation fixes
- [int8-quantization-evaluation.md](../../feature-catalog/evaluation-and-measurement/int8-quantization-evaluation.md) — INT8 quantization evaluation
