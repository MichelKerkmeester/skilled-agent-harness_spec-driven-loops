---
title: "system-deep-loop Skill-Benchmark Artifacts"
description: "Benchmark inputs and reports for system-deep-loop, scored by the deep-improvement Lane C harness against the hub's manual_testing_playbook."
trigger_phrases:
  - "deep-loop benchmark"
  - "system-deep-loop routing benchmark"
  - "deep-loop hub benchmark baseline"
---

# system-deep-loop Skill-Benchmark Artifacts

> Reports for benchmarking how well `system-deep-loop` is routed, discovered, and used in practice, kept beside the skill they measure.

> Authoring: this `benchmark/README.md` index template and the run-label storage standard live in [`sk-doc/create-benchmark`](../../sk-doc/create-benchmark/SKILL.md) §10 ([`skill_benchmark_readme_template.md`](../../sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md), [`skill_benchmark_storage_guide.md`](../../sk-doc/create-benchmark/references/skill_benchmark/skill_benchmark_storage_guide.md)); the per-run `skill-benchmark-report.md` is renderer-owned and never templated, and the Lane C run/scoring stays in deep-improvement.

---

## 1. OVERVIEW

The deep-improvement Lane C harness benchmarks `system-deep-loop` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). Two trace modes score the same corpus:

- **router** — deterministic and offline: replays `hub-router.json` + `mode-registry.json` per scenario. This is the CI gate and the mode used for the baseline here.
- **live** — dispatches each scenario through `cli-opencode` to a real model and grades stated routing plus observed activation. Operator default for a true routing verdict; also the only mode that scores D1-inter (advisor), D4, and the browser-class scenarios.

Note: the harness itself lives inside this hub (`deep-improvement/scripts/skill-benchmark/`), so `system-deep-loop` benchmarks itself with the same Lane C tooling every other hub uses; there is no special-casing.

### Key Statistics

| Metric | Value |
|---|---|
| Corpus | system-deep-loop `manual_testing_playbook` (20 scenarios across 5 categories) |
| Baseline verdict | CONDITIONAL · aggregate 71/100 (router mode) |
| Scenario outcomes | 16/16 scored routing scenarios passed; 4 MR (mode-routing) scenarios are browser-class and route out to live mode |
| D1 intra (router) | 100/100 |
| D2 discovery | 100/100 |
| D5 connectivity (hard gate) | 100/100 (every `hub-router.json` router resource resolves on disk; no orphaned vocabulary classes) |

### Known measurement gaps in this baseline

- **D3 efficiency scores 6/100 in router mode** for this corpus — a Mode-A measurement gap, not a routing failure: every routing scenario passes its replay. Treat D3 movement as meaningful only between runs of the same mode and corpus shape.
- **D1-inter and D4 are unscored** in router mode by design (need live mode / `--d4`).
- **The four MR mode-routing scenarios route out to browser class** by the harness `classifyKind` heuristic (the `MR` prefix is treated as browser-class, matching how every hub's `MR-*` scenarios behave). They are scored only in live mode; the router aggregate is computed over the 16 text-scorable scenarios.

## 2. RE-RUNNING

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/system-deep-loop \
  --outputs-dir /tmp/dlw-bench \
  --trace-mode router \
  --output /tmp/dlw-bench/report.json
```

Compare against `baseline/skill-benchmark-report.json`. The D5 connectivity gate runs first and hard-fails the run on structural breaks. Add new baselines as sibling folders (e.g. `after/`, `live/`) rather than overwriting `baseline/` — the baseline is the frozen comparison anchor.
