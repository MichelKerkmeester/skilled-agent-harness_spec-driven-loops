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

> Authoring: this `benchmark/README.md` index template and the run-label storage standard live in [`sk-doc/create-benchmark`](../../sk-doc/create-benchmark/SKILL.md) §10 ([`skill-benchmark-readme-template.md`](../../sk-doc/create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md), [`skill-benchmark-storage-guide.md`](../../sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md)); the per-run `skill-benchmark-report.md` is renderer-owned and never templated, and the Lane C run/scoring stays in deep-improvement.

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

## 2. RUN-LABEL INDEX

Every run-label folder on disk holds one run's rendered report pair (`skill-benchmark-report.json` + `.md`). One row per folder; verdicts are read from each folder's report and are not restated as a rubric here.

| Run label | What it is | Verdict/Status | Evidence |
|---|---|---|---|
| [`baseline/`](./baseline/) | Frozen pre-optimization snapshot, router mode — the before-comparison anchor described in §1 | CONDITIONAL · 71 (router) | [report](./baseline/skill-benchmark-report.md) |
| [`router-mode-a/`](./router-mode-a/) | Router-mode (Mode A) deterministic replay run | PASS · 100 (router) | [report](./router-mode-a/skill-benchmark-report.md) |
| [`live-mode-b/`](./live-mode-b/) | Live-mode (Mode B) `cli-opencode` dispatch run | PASS · 93 (live) | [report](./live-mode-b/skill-benchmark-report.md) |
| [`after-d3-proxy/`](./after-d3-proxy/) | Router-mode run after the D3-efficiency proxy adjustment | PASS · 100 (router) | [report](./after-d3-proxy/skill-benchmark-report.md) |

## 3. RE-RUNNING

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/system-deep-loop \
  --outputs-dir /tmp/dlw-bench \
  --trace-mode router \
  --output /tmp/dlw-bench/report.json
```

Compare against `baseline/skill-benchmark-report.json`. The D5 connectivity gate runs first and hard-fails the run on structural breaks. Add new baselines as sibling folders (e.g. `after/`, `live/`) rather than overwriting `baseline/` — the baseline is the frozen comparison anchor.
