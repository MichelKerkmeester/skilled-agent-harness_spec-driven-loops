---
title: "sk-code Skill-Benchmark Artifacts"
description: "Historical benchmark reports for sk-code, produced by the retired deep-improvement Lane C harness in router and live modes."
trigger_phrases:
  - "sk-code benchmark"
  - "skill-benchmark artifacts"
  - "sk-code routing benchmark"
---

# sk-code Skill-Benchmark Artifacts

> Reports from benchmarking how well `sk-code` is routed, discovered, and used in practice, kept beside the skill they measure.

> **Retired lane:** the Lane C skill-benchmark harness, its runner, its scoring contract and the `/deep:skill-benchmark` command were removed. This tree is a frozen index of the reports that lane produced; no new run can be started from it.

> **Successor:** the router-mode CI gate has a partial successor in `.github/workflows/routing-registry-drift.yml`. Its compiled-serving admission step scores each hub's compiled decisions against its playbook routing gold, warn-only, and its golden-prompt job checks skill selection and the compiled workflow mode. Together they cover part of D1 routing. D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity and live-mode scoring have no successor. Owner of that gap: sk-code. The restored router-sync guard at `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` restores the four router checks the deleted suite ran: every check of the guard (1a, 1b, 2, 3 and 4) is wired into the drift-guard umbrella.


---

## 1. OVERVIEW

The retired deep-improvement Lane C harness benchmarked `sk-code` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This folder holds the dual reports each archived run wrote.

Two trace modes scored the same playbook corpus:

- **router** was deterministic and offline. For a hub skill it replayed `hub-router.json` + `mode-registry.json`; for a flat skill it replayed the machine-readable router in `sk-code/ROUTER.md`. It was the CI gate.
- **live** dispatched each scenario through `cli-opencode` to a real model and graded the model's stated routing plus observed activation. It was the operator default for a true routing verdict.

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
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Document shape and required sections | Checking spec-folder structure |
| `manual_testing_playbook` | Described behavior per scenario | Authoring or hand-running scenarios |

---

## 2. STRUCTURE

```text
benchmark/
+-- reports/           # Current and archived runs, indexed by report README files
```

| Path | Purpose |
|---|---|
| `reports/` | Current and archived router/live reports, including the compiled-routing archive lane |

### Run-Label Index

Every run-label folder on disk, one row each. `Status` separates current runs from legacy sidecars: `current` is a canonical run the sections above point at, `superseded` is an earlier development run kept only as evidence, `frozen` is the immutable before-anchor, and `sidecar` is an additional run kept beside the canonical pair. Underscore-named folders are listed exactly as they sit on disk. Verdicts are read from each folder's report.

| Run label | What it is | Verdict | Status |
|---|---|---|---|
| [`reports/2026-06-01--router-final--router/`](./reports/2026-06-01--router-final--router/) | Current router-mode run (the deterministic CI gate) | PASS · 84 | current |
| [`reports/2026-06-01--live-final--live/`](./reports/2026-06-01--live-final--live/) | Current live-mode run (`cli-opencode` dispatch) | CONDITIONAL · 71 | current |
| [`reports/2026-06-02--d4r-live--live/`](./reports/2026-06-02--d4r-live--live/) | D4-R task-outcome usefulness ablation, advisory only (see its own `README.md`) | PASS · 88 (base-live) | current · advisory |
| [`reports/2026-07-10--router-baseline--router/`](./reports/2026-07-10--router-baseline--router/) | Router-mode sidecar run | PASS · 85 | sidecar |
| [`reports/2026-07-10--live-mode-b--live/`](./reports/2026-07-10--live-mode-b--live/) | Live-mode (Mode B) sidecar run | CONDITIONAL · 66 | sidecar |
| [`reports/2026-06-01--live-remediated--live/`](./reports/2026-06-01--live-remediated--live/) | Live-mode run after a remediation pass | CONDITIONAL · 79 | superseded |
| [`reports/baseline/`](./reports/baseline/) | Frozen pre-optimization snapshot; the D5 structural gate blocked this run | BLOCKED-BY-STRUCTURE | frozen |
| [`reports/2026-06-01--after--router/`](./reports/2026-06-01--after--router/) | Earlier router-mode development run | CONDITIONAL · 69 | superseded |
| [`reports/2026-06-01--full--router/`](./reports/2026-06-01--full--router/) | Earlier router-mode development run (full corpus) | CONDITIONAL · 55 | superseded |
| [`reports/2026-06-01--live--live/`](./reports/2026-06-01--live--live/) | Earlier live-mode development run | CONDITIONAL · 76 | superseded |

---

## 3. READING THE REPORTS

Each run writes a matched pair:

| File | Content |
|---|---|
| `skill-benchmark-report.json` | Machine report: verdict, D1 to D5, funnel, ranked bottlenecks, scenario rows |
| `skill-benchmark-report.md` | The same report rendered for reading, generated from the JSON to avoid drift |
| `d4-ablation.json` | Usefulness deltas per scenario (skill-on score, skill-off score), stamped approximate |

Start with the `.md` file for the verdict and the ranked bottlenecks. Open the `.json` file for per-scenario detail.

---

## 4. TROUBLESHOOTING

Retained from the retired lane; these symptoms describe historical runs only.

| What you see | Cause | Fix |
|---|---|---|
| Live dispatch returns null after about 4 minutes | `xhigh` reasoning variant is too slow per dispatch | Set `SKILL_BENCH_OPENCODE_VARIANT=high` |
| `provider/model not found` or 401 in live mode | The provider is not configured | Run `opencode providers list`, then log in to the provider you name in `SKILL_BENCH_OPENCODE_MODEL` |
| Browser scenarios skip with `SKIP-NO-BROWSER` | `bdg` (Chrome) is unavailable | Install `bdg`, or accept the honest skip for non-Chrome legs |
| Router mode reports orphan references | A routable doc is not reachable from the router | Add it to `RESOURCE_MAP` or the always-loaded default in `ROUTER.md` |

---

## 5. RELATED RESOURCES

### Related Skills

| Skill | Relationship | Use When |
|---|---|---|
| [`sk-code`](../SKILL.md) | The skill under measurement | Reading or tuning the router being scored |

### Related Documents

| Document | Purpose |
|---|---|
| [`ROUTER.md`](../ROUTER.md) | The machine-readable router the benchmark replays for a flat skill (a hub replays `hub-router.json`) |

---

## 6. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/reports/compiled-routing/<run-label>/`: a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

---

## 7. RENDERING A REPORT FOLDER

A report folder is a rendered artifact, so it is produced from its machine record rather than written by hand. `scripts/render-report.cjs` renders a record in the `skill-benchmark-report.v1` shape into the seven-file set.

Folders written before the renderer existed are legacy. They do not reproduce from their records, and `render-report.cjs --check` does not apply to them. The seven legacy folders are `reports/2026-06-01--after--router`, `reports/2026-06-01--full--router`, `reports/2026-06-02--d4r-live--live` and `reports/baseline` under this hub, plus `sk-code-review/benchmark/reports/2026-07-10--router-mode-a--router`, `sk-code-skilled/benchmark/reports/2026-07-10--live-mode-b--live` and `sk-code-skilled/benchmark/reports/2026-07-10--router-mode-a--router` under the mode packets.

| Command | What it does |
|---|---|
| `node .skilled/skills/sk-code/benchmark/scripts/render-report.cjs <report.json> <out-folder>` | Writes the seven files from one machine record. The record's `corpus` field fills the `Scenario corpus` row of `source.md`, and `targetSkill.root` is written exactly as recorded, so a record that stores a repository-relative root renders a portable folder. |
| `node .skilled/skills/sk-code/benchmark/scripts/render-report.cjs --check <report-folder>` | Re-renders the folder's record into a temporary folder, compares every file byte for byte, names each file that differs and exits 1. It exits 0 when the folder matches its record. |

The same record produces the same bytes on every run, so a difference in a rendered report is a difference in the measurement and never a difference in the template. The golden test re-renders the committed reports of the current format and fails when a template change would rewrite one of them:

```bash
node --test .skilled/skills/sk-code/benchmark/scripts/tests/render-report.test.cjs
```

Archived folders stay frozen. A folder written by an earlier template, or written by hand, fails `--check` by design, and the storage rule above gives a changed result a new folder rather than an edit to an old one.

<!-- readme-check
allow-ref /deep:skill-benchmark | names the retired command the retired-lane note says was removed
-->

