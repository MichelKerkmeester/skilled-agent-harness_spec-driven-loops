# system-spec-kit Benchmark Sources

> system-spec-kit · model-eval · authoring-baseline

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives. The folder holds curated outputs only.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Source packet | `specs/system-speckit/054-weak-model-spec-authoring` |
| Baseline runs | `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline-swe-l3/baseline.json` |
| Final runs | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/baseline.json` |
| Per-run extras | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/runs-meta.jsonl` |
| Run and metric script | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/run-final.sh` |
| Delta | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/delta.json` |
| Run briefs and replies | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/briefs/` and `scratch/runs/` |
| Model | cli-devin `swe-2-max` |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-10-25.
