---
title: "system-deep-loop/deep-improvement Benchmark Artifacts"
description: "Benchmark inputs and reports for system-deep-loop/deep-improvement, written by its Lane B model-benchmark harness, one run-label folder per run."
trigger_phrases:
  - "deep-improvement benchmark"
  - "deep-improvement benchmark artifacts"
  - "Lane B model-benchmark run labels"
---

# system-deep-loop/deep-improvement Benchmark Artifacts

> Benchmark artifacts for `system-deep-loop/deep-improvement`, kept beside the skill they measure. Each run-label folder holds one run's rendered report set; this file indexes them.

> Authoring: the run-label storage standard and this index's template live in [`sk-doc/sk-create-benchmark`](../../../sk-doc/sk-create-benchmark/SKILL.md); a per-run report is renderer-owned and never hand-authored, and the run and its scoring stay lane-owned in deep-improvement.

---

## 1. OVERVIEW

`deep-improvement` ships two lanes and only Lane B writes here. `/deep:model-benchmark` enters through `scripts/shared/loop-host.cjs --mode=model-benchmark`, benchmarks a model or prompt framework against a profile's fixtures, and writes its report into `model-benchmark/{run_label}/`, keyed by the operator-supplied run label. Lane A (`/deep:agent-improvement`) writes packet-locally under `{spec_folder}/improvement/` instead and leaves nothing in this tree.

`reports/` holds archived run folders from a benchmark lane that has since been removed from this skill. They are kept as historical record of runs that already happened, not as a description of what the skill does now; [`reports/README.md`](./reports/README.md) indexes them.

### Key Statistics

| Metric | Value |
|---|---|
| Lane writing here | Lane B model-benchmark (`loop-host.cjs --mode=model-benchmark`) |
| Output root | `model-benchmark/{run_label}/` |
| Recorded Lane B runs | none yet |
| Archived runs | 2, under `reports/` |

---

## 2. RUN-LABEL INDEX

One row per run-label folder on disk; verdicts are read from each folder's report and are not restated as a rubric here. No Lane B run label has been written to this tree yet, so the table below is empty. The archived folders under `reports/` are indexed by [`reports/README.md`](./reports/README.md) rather than repeated here.

| Run label | What it is | Verdict/Status | Evidence |
|---|---|---|---|
| — | no Lane B run recorded yet | — | — |

> Baseline status: this tree does not yet carry a frozen `baseline/` before-anchor. The create-benchmark storage convention expects a `baseline/` folder as the frozen pre-optimization comparison snapshot, never regenerated. Establishing it is pending a first frozen run.

---

## 3. RE-RUNNING

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=model-benchmark \
  --profile=.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json \
  --outputs-dir=/tmp/di-bench
```

Compare against an existing run-label folder's report JSON. Add each new run as a fresh sibling run-label folder rather than overwriting an existing one: a run label is immutable once shipped. The fixture set, scorer selection, and promotion gates live with the lane: see [`references/model-benchmark/benchmark-operator-guide.md`](../references/model-benchmark/benchmark-operator-guide.md) and the [`deep-improvement`](../SKILL.md) skill, which owns the runner and scoring.
