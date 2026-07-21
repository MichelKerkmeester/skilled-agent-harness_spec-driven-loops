---
title: "sk-doc Skill-Benchmark Artifacts"
description: "Benchmark tree for the sk-doc parent hub, scored by the deep-improvement Lane C harness, plus the compiled-routing archive convention. No Lane C run is archived here yet."
trigger_phrases:
  - "sk-doc benchmark"
  - "sk-doc skill-benchmark artifacts"
  - "sk-doc routing benchmark"
importance_tier: "important"
contextType: "general"
---

# sk-doc Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well the `sk-doc` parent hub is routed, discovered, and used in practice, kept beside the skill they measure. Each run-label folder holds one run's rendered report pair; this file indexes them.

---

## 1. OVERVIEW

The deep-improvement Lane C skill-benchmark harness benchmarks `sk-doc` against its own playbook scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the dual reports each run writes, one run-label folder per run.

Two trace modes score the same corpus:

- **router** is deterministic and offline — it replays `hub-router.json` + `mode-registry.json`. This is the CI gate.
- **live** dispatches each scenario through `cli-opencode` to a real model and grades the model's stated routing plus observed activation.

The rubric, terminal buckets, and pass thresholds are the deep-improvement Lane C **scoring contract's**, not this index's — see section 4. Where a number here and the scoring contract disagree, the scoring contract prevails.

## 2. RUN-LABEL INDEX

No Lane C skill-benchmark run has been archived for `sk-doc` yet. When the first run lands, add one row per run-label folder (newest first), mark `baseline/` as the frozen anchor, and never overwrite a shipped run-label — each new run is an additive sibling folder.

| Run label | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|
| _(none archived yet)_ | — | — | — | First run adds the first row |

## 3. RE-RUNNING

Run from the repository root. The runner and its scoring live in the deep-improvement Lane C lane; only the `--skill` and `--outputs-dir` arguments are hub-specific.

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark --skill=sk-doc \
  --outputs-dir=.opencode/skills/sk-doc/benchmark/router-final \
  --trace-mode=router
```

Expected result: a `verdict=` line on stdout plus `skill-benchmark-report.json` and `skill-benchmark-report.md` in the outputs dir. The D5 connectivity gate runs first and hard-fails the run on structural breaks. Add each new run as a fresh sibling run-label folder and a new row in section 2.

## 4. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`deep-improvement`](../../system-deep-loop/deep-improvement/SKILL.md) | Owns the Lane C skill-benchmark harness, runner, and scoring |
| [`sk-doc`](../SKILL.md) | The hub under measurement |
| [`scoring-contract.md`](../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) | The normative Lane C measurement contract every verdict is scored against |
| [`/deep:skill-benchmark`](../../../commands/deep/skill-benchmark.md) | The command that drives a benchmark run |

## 5. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/` — a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

Convention and schema: [`serving-snapshot-schema.md`](../create-benchmark/references/skill-benchmark/serving-snapshot-schema.md) · storage standard: [`skill-benchmark-storage-guide.md`](../create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md).
