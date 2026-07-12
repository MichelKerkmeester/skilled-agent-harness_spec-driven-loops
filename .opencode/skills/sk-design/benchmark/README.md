---
title: "sk-design Skill-Benchmark Artifacts"
description: "Benchmark inputs and reports for sk-design, scored by the deep-improvement Lane C harness against the hub's manual_testing_playbook."
trigger_phrases:
  - "sk-design benchmark"
  - "sk-design routing benchmark"
  - "design hub benchmark baseline"
---

# sk-design Skill-Benchmark Artifacts

> Reports for benchmarking how well `sk-design` is routed, discovered, and used in practice, kept beside the skill they measure.

> Authoring: this `benchmark/README.md` index template and the run-label storage standard live in [`sk-doc/create-benchmark`](../../sk-doc/create-benchmark/SKILL.md) §10 ([`skill_benchmark_readme_template.md`](../../sk-doc/create-benchmark/assets/skill_benchmark_readme_template.md), [`skill_benchmark_storage_guide.md`](../../sk-doc/create-benchmark/references/skill_benchmark_storage_guide.md)); the per-run `skill-benchmark-report.md` is renderer-owned and never templated, and the Lane C run/scoring stays in deep-improvement.

---

## 1. OVERVIEW

The deep-improvement Lane C harness benchmarks `sk-design` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). Two trace modes score the same corpus:

- **router** — deterministic and offline: replays `hub-router.json` + `mode-registry.json` per scenario. This is the CI gate and the mode used for the baseline here.
- **live** — dispatches each scenario through `cli-opencode` to a real model and grades stated routing plus observed activation. Operator default for a true routing verdict; also the only mode that attempts D1-inter (advisor), D4, and the browser-class scenarios — full browser-class scoring is still blocked by a known P1 harness gap (see below).

### Key Statistics

| Metric | Value |
|---|---|
| Corpus | sk-design `manual_testing_playbook` (21 scenarios across 5 categories) |
| Baseline verdict | CONDITIONAL · aggregate 69/100 (router mode) |
| Scenario outcomes | 15/15 scored scenarios passed; 6 MR (mode-routing) scenarios are browser-class and route out to live mode |
| D1 intra (router) | 100/100 |
| D2 discovery | 100/100 |
| D5 connectivity (hard gate) | 100/100 (an orphaned `references/design_proof_token.md` was wired into `routerPolicy.defaultResource` before freezing this baseline) |

### Known measurement gaps in this baseline

- **D3 efficiency scores 0/100 in router mode** for this corpus — a Mode-A measurement gap, not a routing failure: every routing/advisor scenario passes its replay. Treat D3 movement as meaningful only between runs of the same mode and corpus shape.
- **D1-inter and D4 are unscored** in router mode by design (need live mode / `--d4`).

### Known gap in live-mode (`mode-b-live`) reports

The live-mode sibling reports (e.g. `after-016-hub-routing/`, `after-018-transport-integration/`, `after-022-coverage-fill/`) each carry their own **PASS** headline verdict *and* a P1 `funnel_attrition` bottleneck in the same document — that is not a contradiction to reconcile away, it is two claims about different scope. The PASS verdict is computed over the weighted, scored dimensions only (D1intra, D2, D3, D5); D1-inter and D4 stay unscored in these runs (no advisor probe/rank-gold, no `--d4`). It does **not** certify the browser-class scenarios: most first-fail at the `browser` stage because the harness has no per-URL export/motion/video probe for three scenario types (`PARTIAL-NEEDS-ARTIFACT`) and no recipe at all for the rest (`SKIP-NO-BROWSER`) — an instrumentation gap in the benchmark harness, not an observed routing/discovery defect in the skill. Read each report's Ranked bottlenecks table before treating its PASS as browser-complete.

## 2. RE-RUNNING

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/sk-design \
  --outputs-dir /tmp/skd-bench \
  --trace-mode router \
  --output /tmp/skd-bench/report.json
```

Compare against `baseline/skill-benchmark-report.json`. The D5 connectivity gate runs first and hard-fails the run on structural breaks. Add new baselines as sibling folders (e.g. `after/`, `live/`) rather than overwriting `baseline/` — the baseline is the frozen comparison anchor.
