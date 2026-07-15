---
title: "system-deep-loop/deep-improvement Skill-Benchmark Artifacts"
description: "Benchmark inputs and reports for system-deep-loop/deep-improvement, scored by its own Lane C skill-benchmark harness in router and live modes."
trigger_phrases:
  - "deep-improvement benchmark"
  - "deep-improvement routing benchmark"
  - "Lane C skill-benchmark self-run"
---

# system-deep-loop/deep-improvement Skill-Benchmark Artifacts

> Reports for benchmarking how well `system-deep-loop/deep-improvement` is routed, discovered, and used in practice, kept beside the skill they measure. Each run-label folder holds one run's rendered report pair; this file indexes them.

> Authoring: this `benchmark/README.md` index template and the run-label storage standard live in [`sk-doc/create-benchmark`](../../../sk-doc/create-benchmark/SKILL.md) §10 ([`skill_benchmark_readme_template.md`](../../../sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md), [`skill_benchmark_storage_guide.md`](../../../sk-doc/create-benchmark/references/skill_benchmark/skill_benchmark_storage_guide.md)); the per-run `skill-benchmark-report.md` is renderer-owned and never templated, and the Lane C run/scoring stays lane-owned in deep-improvement.

---

## 1. OVERVIEW

The deep-improvement Lane C harness benchmarks `system-deep-loop/deep-improvement` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the run inputs and the dual reports each run writes, one run-label folder per run.

Two trace modes score the same playbook corpus:

- **router** — deterministic and offline: replays the skill's machine-readable router per scenario. This is the CI gate.
- **live** — dispatches each scenario through `cli-opencode` to a real model and grades stated routing plus observed activation. Operator default for a true routing verdict.

Note: `deep-improvement` owns the Lane C harness itself, so it benchmarks itself with the same tooling every other hub uses; there is no special-casing. The rubric, terminal buckets, and pass thresholds are the Lane C scoring contract's, not this index's (see §3) — where a number here and the scoring contract disagree, the scoring contract prevails.

### Key Statistics

| Metric | Value |
|---|---|
| Corpus | `system-deep-loop/deep-improvement` `manual_testing_playbook` (9 scored routing scenarios) |
| Trace modes | router (deterministic CI gate), live (real dispatch) |
| Latest router verdict | PASS · aggregate 100/100 (`router_mode_a`) |
| Latest live verdict | PASS · aggregate 90/100 (`live_mode_b`) |
| D5 connectivity (hard gate) | 100/100 |

## 2. RUN-LABEL INDEX

Every run-label folder on disk holds one run's rendered report pair (`skill-benchmark-report.json` + `.md`). One row per folder; verdicts are read from each folder's report and are not restated as a rubric here.

| Run label | What it is | Verdict/Status | Evidence |
|---|---|---|---|
| [`router_mode_a/`](./router_mode_a/) | Router-mode (Mode A) deterministic replay run | PASS · 100 (router) | [report](./router_mode_a/skill-benchmark-report.md) |
| [`live_mode_b/`](./live_mode_b/) | Live-mode (Mode B) `cli-opencode` dispatch run | PASS · 90 (live) | [report](./live_mode_b/skill-benchmark-report.md) |

## 3. RE-RUNNING

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/system-deep-loop/deep-improvement \
  --outputs-dir /tmp/di-bench \
  --trace-mode router \
  --output /tmp/di-bench/report.json
```

Compare against an existing run-label folder's `skill-benchmark-report.json`. The D5 connectivity gate runs first and hard-fails the run on structural breaks. Add each new run as a fresh sibling run-label folder rather than overwriting an existing one — a run label is immutable once shipped. The five-dimension rubric, terminal buckets, and pass thresholds live once in the Lane C [`scoring_contract.md`](../references/skill_benchmark/scoring_contract.md); the [`deep-improvement`](../SKILL.md) skill owns the runner and scoring.
