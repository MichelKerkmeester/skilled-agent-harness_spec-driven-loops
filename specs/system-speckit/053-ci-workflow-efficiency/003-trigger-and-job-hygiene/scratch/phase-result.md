# Phase result: the 24 h delta (AC-016, AC-009)

Date: 2026-10-25. Every figure below was computed from files on disk with the arithmetic shown; nothing is carried from memory or from the research estimates.

## Sources and why

- **Before:** `../001-research/scratch/ci-run-data/` (summary, `per-workflow/*.json` and `jobs/*.json`), copied into `scratch/phase-baseline.md`. This is the operator's ruling of 2026-10-25: "Use the 001 research data as the baseline for this phase." The 002 window cannot be this phase's before-state, because it starts after the phase reached `main` (run `40026353792`, head `3ab67b70cb`, created 2026-10-23T21:23:01Z). Phase 004 cites the same source the same way.
- **After:** `../002-rebuild-fanout-removal/scratch/baseline-24h/` (read only): `summary.md`, `window.json`, `run-ids.txt` and `jobs/`. The window is `createdAt` 2026-10-23T21:59:34Z to 2026-10-24T21:59:34Z, collected 2026-10-24T21:58Z, which is 24 h 35 min after the last change merged, so the T036 window condition holds. `scratch/runs-after.json` is a byte copy of that `window.json` (795 runs), so the raw sample sits inside this phase.
- **Method (both sides):** billed minutes per run are the sum over non-skipped jobs of ceil(job seconds / 60); the per-workflow median is over the five latest completed runs; the estimate is runs in the window times that median. The 001 estimates are scaled from 23.5 h to 24 h (factor about 1.02); the 002 window is exactly 24 h.

## The ten workflows

Baseline and after are estimated billed runner-min per 24 h. Delta is after minus baseline, raw, with phase 002's fan-out removal still inside it.

| Workflow | Runs before to after | Median billed min per run, before to after | Baseline | After | Raw delta |
|---|---|---|---:|---:|---:|
| `advisory-checks` | 73 to 49 | 1 to 1 | 75 | 49 | -26 |
| `agent-mirror-sync` | 0 to 6 | 2 to 2 | 0 (unmeasured) | 12 | +12 (no baseline) |
| `changed-packet-validation` | 73 to 49 | 2 to 2 | 149 | 98 | -51 |
| `command-tree-parity` | 73 to 15 | 4 to 4 | 299 | 60 | -239 |
| `dispatch-enforcement-guard` | 73 to 49 | 4 to 4 | 299 | 196 | -103 |
| `deep-loop-runtime` | 5 to 8 | 12 to 10 | 61 | 80 | +19 |
| `repo-rules-corpus` | 0 to 1 | 2 to 1 | 0 (unmeasured) | 1 | +1 (no baseline) |
| `rule-canary-sync` | 73 to 49 | 2 to 1 | 149 | 49 | -100 |
| `skill-doc-frontmatter` | 7 to 13 | 1 to 1 | 7 | 13 | +6 |
| `strict-pass-freshness-report` | 0 to 1 | 43 to 52 | 0 (unmeasured) | 52 | +52 (no baseline) |
| **Ten workflows, summed** | | | 1039 | 610 | -429 |

The +19, +6 and +52 rows are run-count effects, not hygiene effects: `deep-loop-runtime` and `skill-doc-frontmatter` ran more often in the after-window, and `strict-pass-freshness-report` had one manual `workflow_dispatch` run (52 billed min) where the 001 window had none. `agent-mirror-sync` and `repo-rules-corpus` are pull-request-only and the 001 window held no pull-request runs, so their baselines are unmeasured rather than zero. Their after figures are the 002 summary's.

## Netting out phase 002

The raw deltas for the unfiltered push-and-PR workflows include phase 002 removing the per-rebuild-commit runs: the 002 summary records 49 runs of each unfiltered push workflow against 73 before ("Push-triggered volume matches the prediction: 49 runs of each unfiltered push workflow against 73 before"). The same window therefore supplies a reference of 49 runs at the baseline per-run median, which is what these workflows would have cost with 002 applied and this phase not. That reference is derived, not observed, so each net figure below is inferred; what would confirm it is a window with this phase reverted, which nobody ran.

- `command-tree-parity`: reference 49 runs times 4 min = 196; measured 15 runs times 4 min = 60; net **-136** runner-min/day. The row asks for about -123 after R1. Raw delta -239.
- `rule-canary-sync`: reference 49 runs times 2 min = 98; measured 49 runs times 1 min = 49; net **-49** runner-min/day. The row asks for about -39. Raw delta -100.
- `dispatch-enforcement-guard` (R6 re-measurement): reference 49 runs times 4 min = 196; measured 49 runs times 4 min = 196; net **0** billed runner-min/day. Per-job seconds moved by single digits: the rule-reachability job median 72 s to 63 s (-9), the vitest job 69 s to 72 s (+3), summed per run 139 s to 135 s (-4). The deleted duplicate step does not cross a billed-minute boundary, so the saving is real wall time but 0 billed minutes.

## Pull-request-side cancellation: unmeasured

The concurrency group's saving on pull requests is **unmeasured**. The after-window shows 13 `pull_request` runs with conclusion `cancelled` (of 321 pull_request runs), but a cancelled run's job minutes are not in the sampled `jobs/` files and there is no run-it-would-have-been counterfactual, so no runner-minute figure is claimed, and it is not recorded as zero. T027's probe (older run `40100004699` `cancelled`, newest `40100024617` `success`) is the direct observation that the group works.

## Checkout seconds (AC-009)

Checkout step = the step named `Run actions/checkout...`, in seconds. Before: median of the five latest completed 001 runs. After: median over the sampled 002 runs of that workflow, except where stated.

- `repo-rules-corpus`: 72 s before (62, 67, 72, 72, 74); 51 s after (one run, PR `40101304407`, the only sampled run, job 57 s). Shortened by **21 s**.
- `deep-loop-runtime`: 74 s before (63, 72, 74, 76, 89); 51 s after (50, 51, 51, 52, 52; runs `40126001075`, `40125544874`, `40123920562`, `40123498287`, `40107240026`). Shortened by **23 s**. The after-window installs changed later (commits `1c0c3534cf`, `b5451258b2`) but those do not touch the checkout step.
- `rule-canary-sync`: 73 s before (51, 71, 73, 77, 78). The phase-only observation is PR run `40101304274` (2026-10-24T14:12Z, head `5039e47f10`, before any sparse change): checkout 21 s (14:12:23 to 14:12:44), job 24 s. Shortened by **52 s**. The 24 h window median is 2 s (2, 2, 2, 3, 3), a shortening of 71 s, but that is not this phase's effect: commit `ea39cd7b2c` (2026-10-24T21:40+02:00, "keep the faster checkout variant") switched the canary to a blobless sparse checkout, and the five sampled runs (19:39Z to 21:57Z on 2026-10-24, the hours that variant was probed and landed) all show a 2 to 3 s checkout. The job is 56 to 90 s before (median 78 s) and 24 s in the phase-only run, so the `under 60 s` clause holds (window median 6 s).

Note on the deep-loop sample: the five 002 sample runs for this workflow include one failed run (`40107240026`, push, 2026-10-24T15:30:01Z); its checkout step is in the 50 to 52 s group and the cause of the failure was not investigated here. The other four runs are `success`.

Reading against the row: two of the three checkouts are about 20 s shorter (21 s and 23 s). The third, `rule-canary-sync`, is 52 s shorter on the phase-only evidence and 71 s on the window median, which is not about 20 s. See `acceptance-criteria.md` AC-009.
