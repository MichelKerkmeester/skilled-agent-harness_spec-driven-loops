---
title: "sk-code Skill-Benchmark Artifacts"
description: "Benchmark inputs and reports for sk-code, scored by the deep-improvement Lane C harness in router and live modes."
trigger_phrases:
  - "sk-code benchmark"
  - "skill-benchmark artifacts"
  - "sk-code routing benchmark"
---

# sk-code Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well `sk-code` is routed, discovered, and used in practice, kept beside the skill they measure.

---

## 1. OVERVIEW

The deep-improvement Lane C harness benchmarks `sk-code` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This folder holds the run inputs and the dual reports each run writes.

Two trace modes score the same playbook corpus:

- **router** is deterministic and offline. For a hub skill it replays `hub-router.json` + `mode-registry.json`; for a flat skill it replays the machine-readable router in `sk-code/shared/references/smart-routing.md`. This is the CI gate.
- **live** dispatches each scenario through `cli-opencode` to a real model and grades the model's stated routing plus observed activation. This is the operator default for a true routing verdict.

### Key Statistics

| Metric | Value |
|---|---|
| Corpus | sk-code `manual_testing_playbook` (28 deterministic scenarios across 8 categories, including `DR-001`..`DR-004`) |
| Trace modes | router (deterministic CI gate), live (real dispatch) |
| Latest router verdict | PASS, aggregate 84/100 (`router_final`) |
| Latest live verdict | CONDITIONAL, aggregate 71/100 (`live_final`) |
| D4 usefulness (approximate) | about 49 |

### How This Compares

| Tool | Checks | Use When |
|---|---|---|
| This benchmark | Whether the skill is routed, discovered, and useful in practice | Measuring real routing quality |
| `validate.sh` | Document shape and required sections | Checking spec-folder structure |
| `manual_testing_playbook` | Described behavior per scenario | Authoring or hand-running scenarios |

---

## 2. QUICK START

Run from the repository root.

Router mode (deterministic, no network):

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark --skill=sk-code \
  --outputs-dir=.opencode/skills/sk-code/benchmark/router-final \
  --trace-mode=router
```

Live mode (dispatches through cli-opencode, needs a configured provider):

```bash
SKILL_BENCH_OPENCODE_MODEL=openai/gpt-5.5-fast SKILL_BENCH_OPENCODE_VARIANT=high \
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark --skill=sk-code \
  --outputs-dir=.opencode/skills/sk-code/benchmark/live-final \
  --trace-mode=live --advisor-mode=python \
  --scenarios=SD-001,LS-001,CS-001,RD-002,MR-001
```

Expected result: a `verdict=` line on stdout plus `skill-benchmark-report.json` and `skill-benchmark-report.md` in the outputs dir.

---

## 3. STRUCTURE

```text
benchmark/
+-- router-final/      # Current deterministic run (router mode)
+-- live-final/        # Current live run (cli-opencode) + d4-ablation.json
+-- baseline/          # Frozen pre-optimization snapshot, do not regenerate
+-- after/ full/ live/ # Earlier development runs, superseded by the -final pair
`-- fixtures/sk-code/   # Legacy synthetic fixtures, superseded by the playbook corpus
```

| Path | Purpose |
|---|---|
| `router-final/` | Latest router-mode report (real-gold scoring, the CI gate) |
| `live-final/` | Latest live-mode report plus `d4-ablation.json` (skill-on vs skill-off usefulness) |
| `baseline/` | First sk-code run, kept as a before-snapshot, not reproducible |
| `fixtures/sk-code/` | Two legacy fixtures, no longer the default corpus |

### Run-Label Index

Every run-label folder on disk, one row each. `Status` separates current runs from legacy sidecars: `current` is a canonical run the sections above point at, `superseded` is an earlier development run kept only as evidence, `frozen` is the immutable before-anchor, `sidecar` is an additional run kept beside the canonical pair, and `legacy` is a pre-playbook artifact. Underscore-named folders are listed exactly as they sit on disk; the hyphenated display names in the tree above (`router-final`, `live-final`, `fixtures/sk-code`) refer to the same `router-final/`, `live-final/`, and `fixtures/sk-code/` folders. Verdicts are read from each folder's report.

| Run label | What it is | Verdict | Status |
|---|---|---|---|
| [`router-final/`](./router-final/) | Current router-mode run (the deterministic CI gate) | PASS · 84 | current |
| [`live-final/`](./live-final/) | Current live-mode run (`cli-opencode` dispatch) | CONDITIONAL · 71 | current |
| [`d4r-live/`](./d4r-live/) | D4-R task-outcome usefulness ablation, advisory only (see its own `README.md`) | PASS · 88 (base-live) | current · advisory |
| [`router-baseline/`](./router-baseline/) | Router-mode sidecar run | PASS · 85 | sidecar |
| [`live-mode-b/`](./live-mode-b/) | Live-mode (Mode B) sidecar run | CONDITIONAL · 66 | sidecar |
| [`live-remediated/`](./live-remediated/) | Live-mode run after a remediation pass, an intermediate before `live-final/` | CONDITIONAL · 79 | superseded |
| [`baseline/`](./baseline/) | Frozen pre-optimization snapshot; the D5 structural gate blocked this run | BLOCKED-BY-STRUCTURE | frozen |
| [`after/`](./after/) | Earlier router-mode development run | CONDITIONAL · 69 | superseded |
| [`full/`](./full/) | Earlier router-mode development run (full corpus) | CONDITIONAL · 55 | superseded |
| [`live/`](./live/) | Earlier live-mode development run | CONDITIONAL · 76 | superseded |
| [`fixtures/sk-code/`](./fixtures/sk-code/) | Legacy synthetic fixtures, superseded by the playbook corpus | n/a — see folder | legacy |

---

## 4. READING THE REPORTS

Each run writes a matched pair:

| File | Content |
|---|---|
| `skill-benchmark-report.json` | Machine report: verdict, D1 to D5, funnel, ranked bottlenecks, scenario rows |
| `skill-benchmark-report.md` | The same report rendered for reading, generated from the JSON to avoid drift |
| `d4-ablation.json` | Usefulness deltas per scenario (skill-on score, skill-off score), stamped approximate |

Start with the `.md` file for the verdict and the ranked bottlenecks. Open the `.json` file for per-scenario detail.

---

## 5. TROUBLESHOOTING

| What you see | Cause | Fix |
|---|---|---|
| Live dispatch returns null after about 4 minutes | `xhigh` reasoning variant is too slow per dispatch | Set `SKILL_BENCH_OPENCODE_VARIANT=high` |
| `provider/model not found` or 401 in live mode | The provider is not configured | Run `opencode providers list`, then log in to the provider you name in `SKILL_BENCH_OPENCODE_MODEL` |
| Browser scenarios skip with `SKIP-NO-BROWSER` | `bdg` (Chrome) is unavailable | Install `bdg`, or accept the honest skip for non-Chrome legs |
| Router mode reports orphan references | A routable doc is not reachable from the router | Add it to `RESOURCE_MAP` or the always-loaded default in `smart-routing.md` |

---

## 6. RELATED RESOURCES

### Related Skills

| Skill | Relationship | Use When |
|---|---|---|
| [`deep-improvement`](../../system-deep-loop/deep-improvement/SKILL.md) | Owns the Lane C benchmark harness | Running or extending the benchmark |
| [`sk-code`](../SKILL.md) | The skill under measurement | Reading or tuning the router being scored |

### Related Documents

| Document | Purpose |
|---|---|
| [`smart-routing.md`](../shared/references/smart-routing.md) | The machine-readable router the benchmark replays for a flat skill (a hub replays `hub-router.json`) |
| [`/deep:skill-benchmark`](../../../commands/deep/skill-benchmark.md) | The command that drives a benchmark run |
| [`sk-doc/create-benchmark`](../../sk-doc/create-benchmark/SKILL.md) | Authoring templates for this `benchmark/README.md` index + the run-label storage standard (§10: [`skill-benchmark-readme-template.md`](../../sk-doc/create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md), [`skill-benchmark-storage-guide.md`](../../sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md)); the per-run `skill-benchmark-report.md` stays renderer-owned |

---

## 7. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/` — a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

Convention and schema: [`serving-snapshot-schema.md`](../../sk-doc/create-benchmark/references/skill-benchmark/serving-snapshot-schema.md) · storage standard: [`skill-benchmark-storage-guide.md`](../../sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md).
