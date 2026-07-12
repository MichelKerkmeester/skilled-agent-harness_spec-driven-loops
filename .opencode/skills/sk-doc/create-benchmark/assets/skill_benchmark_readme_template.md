---
title: "Skill-Benchmark README Index Template"
description: "Fillable scaffold for a hub's benchmark/README.md — the index of run-label folders in a skill's benchmark/ tree, naming the deep-improvement Lane C skill-benchmark harness and its scoring_contract as the governing measurement authority, with a run-label table carrying status, date, and verdict."
trigger_phrases:
  - "skill-benchmark readme template"
  - "benchmark/README.md index scaffold"
  - "hub benchmark tree index"
  - "run-label index table template"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for a HUB BENCHMARK INDEX:
  <skill-hub>/benchmark/README.md

This templates the INDEX of run-label folders ONLY. It does NOT template the
per-run report: `skill-benchmark-report.md` is an anti-drift RENDER produced by
`build-report.cjs` from the run JSON — never hand-author or template that file,
only point to it (see section 5).

Usage:
  1. cp this file to the hub's benchmark/ folder, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark_readme_template.md \
        .opencode/skills/<hub>/benchmark/README.md
  2. DELETE the "version:" line above. A shipped hub benchmark README carries the
     five frontmatter fields shown (title / description / trigger_phrases /
     importance_tier / contextType) and NO version field. Replace the template's
     descriptive title / description / trigger_phrases with the hub's real values.
  3. Fill every {{PLACEHOLDER}} and remove every <!-- guidance --> comment.
  4. Keep the RUN-LABEL INDEX table (section 2) in exact sync with the run-label
     folders on disk: one row per shipped run-label folder, one folder per row.
  5. Validate:
     python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
       .opencode/skills/<hub>/benchmark/README.md
     Iterate until 0 issues.

The measurement authority this index points at is NOT restated here — the five-
dimension rubric, terminal buckets, and pass thresholds live once in the
deep-improvement Lane C scoring contract:
  .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
The harness that produces every run in this tree is the deep-improvement Lane C
skill-benchmark lane. Cross-link both; do not copy them into the hub.
-->

# {{HUB_NAME}} Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well `{{HUB_NAME}}` is routed, discovered, and used in practice, kept beside the skill they measure. Each run-label folder holds one run's rendered report pair; this file indexes them.

---

## 1. OVERVIEW

The deep-improvement Lane C skill-benchmark harness benchmarks `{{HUB_NAME}}` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the run inputs and the dual reports each run writes, one run-label folder per run.

Two trace modes score the same playbook corpus:

- **router** is deterministic and offline. For a hub skill it replays `hub-router.json` + `mode-registry.json`; for a flat skill it replays the machine-readable router in the skill's `smart_routing.md`. This is the CI gate.
- **live** dispatches each scenario through `cli-opencode` to a real model and grades the model's stated routing plus observed activation. This is the operator default for a true routing verdict.

The rubric, terminal buckets, and pass thresholds are the deep-improvement Lane C **scoring contract's**, not this index's — see section 6 for the link. Where a number here and the scoring contract disagree, the scoring contract prevails.

### Key Statistics

<!-- Fill from the LATEST run-label folder's rendered report. Leave a metric blank
     only if the mode that scores it has not been run; do not invent a value. -->

| Metric | Value |
|---|---|
| Corpus | {{HUB_NAME}} `manual_testing_playbook` ({{SCENARIO_COUNT}} scenarios across {{CATEGORY_COUNT}} categories) |
| Trace modes | router (deterministic CI gate), live (real dispatch) |
| Latest router verdict | {{VERDICT}}, aggregate {{ROUTER_AGGREGATE}}/100 |
| Latest live verdict | {{VERDICT_OR_NOT_RUN}}, aggregate {{LIVE_AGGREGATE_OR_NA}} |
| D5 connectivity (hard gate) | {{D5_SCORE}}/100 |

## 2. RUN-LABEL INDEX

<!-- One row per run-label folder in this tree, newest first. Status ∈ {current,
     superseded, frozen, retired}. Verdict is the rendered report's verdict for
     that run (PASS / CONDITIONAL / FAIL), with its aggregate. `baseline/` is the
     frozen comparison anchor — mark it frozen and never regenerate it in place. -->

| Run label | Date | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|---|
| `{{RUN_LABEL_1}}` | {{YYYY_MM_DD}} | {{ROUTER_OR_LIVE}} | {{VERDICT}} {{AGGREGATE}} | current | {{WHAT_THIS_RUN_IS}} |
| `{{RUN_LABEL_2}}` | {{YYYY_MM_DD}} | {{ROUTER_OR_LIVE}} | {{VERDICT}} {{AGGREGATE}} | {{STATUS}} | {{WHAT_THIS_RUN_IS}} |
| `baseline` | {{YYYY_MM_DD}} | {{ROUTER_OR_LIVE}} | {{VERDICT}} {{AGGREGATE}} | frozen | Frozen pre-optimization snapshot, the before-comparison anchor, not regenerated |
| `{{ADD_ONE_ROW_PER_FOLDER}}` | {{YYYY_MM_DD}} | {{ROUTER_OR_LIVE}} | {{VERDICT}} {{AGGREGATE}} | {{STATUS}} | {{WHAT_THIS_RUN_IS}} |

## 3. STRUCTURE

<!-- Mirror the actual folders on disk. Add new baselines as sibling run-label
     folders rather than overwriting an existing one — a run label is immutable
     once shipped. Delete rows that do not apply to this hub. -->

```text
benchmark/
+-- {{RUN_LABEL_1}}/    # {{ONE_LINE_PURPOSE}}
+-- {{RUN_LABEL_2}}/    # {{ONE_LINE_PURPOSE}}
`-- baseline/           # Frozen pre-optimization snapshot, do not regenerate
```

| Path | Purpose |
|---|---|
| `{{RUN_LABEL_1}}/` | {{ONE_LINE_PURPOSE}} |
| `{{RUN_LABEL_2}}/` | {{ONE_LINE_PURPOSE}} |
| `baseline/` | Frozen before-snapshot, the comparison anchor, not reproducible |

## 4. RE-RUNNING

Run from the repository root. The runner and its scoring live in the deep-improvement Lane C lane; only the `--skill` and `--outputs-dir` arguments are hub-specific.

Router mode (deterministic, no network — the CI gate):

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark --skill={{HUB_PATH}} \
  --outputs-dir={{HUB_PATH}}/benchmark/{{NEW_RUN_LABEL}} \
  --trace-mode=router
```

Live mode (dispatches through `cli-opencode`, needs a configured provider):

```bash
SKILL_BENCH_OPENCODE_MODEL={{PROVIDER_MODEL}} SKILL_BENCH_OPENCODE_VARIANT=high \
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark --skill={{HUB_PATH}} \
  --outputs-dir={{HUB_PATH}}/benchmark/{{NEW_RUN_LABEL}} \
  --trace-mode=live
```

Expected result: a `verdict=` line on stdout plus `skill-benchmark-report.json` and `skill-benchmark-report.md` in the outputs dir. The D5 connectivity gate runs first and hard-fails the run on structural breaks. Add each new run as a fresh sibling run-label folder and a new row in section 2; never overwrite `baseline/`.

## 5. READING THE REPORTS

Each run-label folder holds a matched report pair.

| File | Content |
|---|---|
| `skill-benchmark-report.json` | Machine report: verdict, D1 to D5, funnel, ranked bottlenecks, scenario rows |
| `skill-benchmark-report.md` | The same report rendered for reading, generated from the JSON by `build-report.cjs` to avoid drift |

Start with the `.md` file for the verdict and the ranked bottlenecks; open the `.json` file for per-scenario detail. The `.md` is an anti-drift **render**, not an authored document: `build-report.cjs` regenerates it from the run JSON, so never hand-edit it — fix the run or the renderer, then re-render.

## 6. RELATED RESOURCES

### Related Skills

| Skill | Relationship | Use When |
|---|---|---|
| [`deep-improvement`]({{PATH_TO_DEEP_IMPROVEMENT_SKILL}}) | Owns the Lane C skill-benchmark harness, runner, and scoring | Running or extending a benchmark |
| [`{{HUB_NAME}}`]({{PATH_TO_HUB_SKILL}}) | The skill under measurement | Reading or tuning the router being scored |

<!-- Express each link relative to this benchmark/ folder. Canonical repo-root
     targets to translate:
       {{PATH_TO_DEEP_IMPROVEMENT_SKILL}} -> .opencode/skills/system-deep-loop/deep-improvement/SKILL.md
       {{PATH_TO_HUB_SKILL}}              -> .opencode/skills/<hub>/SKILL.md
       {{PATH_TO_SCORING_CONTRACT}}       -> .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
       {{PATH_TO_SKILL_BENCHMARK_COMMAND}}-> .opencode/commands/deep/skill-benchmark.md
     For example, from .opencode/skills/sk-code/benchmark/README.md the scoring
     contract is ../../system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md -->

### Related Documents

| Document | Purpose |
|---|---|
| [`scoring_contract.md`]({{PATH_TO_SCORING_CONTRACT}}) | The normative Lane C measurement contract — five-dimension rubric, terminal buckets, and pass thresholds every verdict in this tree is scored against |
| [`/deep:skill-benchmark`]({{PATH_TO_SKILL_BENCHMARK_COMMAND}}) | The command that drives a benchmark run |
| [`manual_testing_playbook`]({{PATH_TO_HUB_PLAYBOOK}}) | The scenario corpus the harness replays for `{{HUB_NAME}}` |
