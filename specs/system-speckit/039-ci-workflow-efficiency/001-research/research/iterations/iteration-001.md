# Iteration 001 — Cost baseline

## 1. FOCUS

Establish the cost baseline: rank every workflow by billed runner minutes per day and by wall-clock, name the workflows that dominate the total, and say what each one spends its time on at job level. Spot-check two summary figures against the raw run JSON.

Read-only iteration. No workflow, script or action was edited. No mutation of the researched surface.

## 2. ACTIONS TAKEN

1. Read the pre-collected dataset `summary.md` / `summary.json` (1000 runs, 23.5 h window, 2026-10-22T07:07:25Z → 2026-10-23T06:35:03Z) [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:4].
2. Read `.github/workflows/README.md` for the workflow inventory and trigger column [SOURCE: .github/workflows/README.md:58].
3. Spot-check A — `spec-kit-check` run `39910111430`: recomputed wall and job durations from `jobs/39910111430.json`; also read its per-step timings.
4. Spot-check B — `trigger-index-rebuild` run `39912381915`: read the raw job objects to test the recorded 0 s / 0 min medians.
5. Recomputed the billed-vs-actual delta per workflow and the aggregate rounding share.

## 3. FINDINGS

### F1 — Two workflows are 45% of the bill; six are 72%

Confirmed from the recorded per-workflow estimates [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5].

| Rank | Workflow | Runs/24 h | Median wall s | Billed min/day | Share | Cumulative |
|---|---|---|---|---|---|---|
| 1 | `spec-kit-check.yml` | 50 | 1178 | 1279 | 33.6% | 33.6% |
| 2 | `sk-doc-script-tests.yml` | 73 | 199 | 448 | 11.8% | 45.3% |
| 3 | `command-tree-parity.yml` | 73 | 76 | 299 | 7.8% | 53.2% |
| 4 | `dispatch-enforcement-guard.yml` | 73 | 79 | 299 | 7.8% | 61.0% |
| 5 | `hooks-node-tests.yml` | 61 | 201 | 250 | 6.6% | 67.6% |
| 6 | `opencode-plugin-tests.yml` | 61 | 142 | 187 | 4.9% | 72.5% |
| 7-11 | `changed-packet-validation`, `gate-inputs`, `message-contract`, `playbook-operator-contract`, `rule-canary-sync` | 73 each | 80-104 | 149 each | 3.9% each | 92.0% |
| 12 | `advisory-checks.yml` | 73 | 65 | 75 | 2.0% | 94.0% |
| 13-16 | `opencode-dual-version` 64, `deep-loop-runtime` 61, `markdown-link-integrity` 50, `routing-registry-drift` 31 | 5-49 | 70-690 | 31-64 | 4.9% | 98.6% |
| 17-20 | `skill-doc-frontmatter` 7, `sk-doc-rename-harness` 6, `runtime-no-spec-import` 5, `sk-code-script-tests` 4 | 2-7 | 59-172 | 4-7 | 0.6% | 99.4% |
| 21 | `trigger-index-rebuild.yml` | 73 | 103 | 0 (artifact, see F6) | 0% | 99.4% |

Twelve workflows recorded **zero** runs inside the 23.5 h window, so their daily cost is deferred, not eliminated: `agent-mirror-sync`, `chart-corpus`, `comment-hygiene`, `dependabot-auto-merge`, `diagram-corpus`, `naming-standard-guard`, `pi-extension-tests`, `prompt-card-sync`, `repo-rules-corpus`, `sk-git-script-tests`, `skill-advisor-stress`, `strict-pass-freshness-report` [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:29]. The daily total of 3812 billed min is therefore the *push-gate* baseline; any day with pull-request traffic adds the twelve PR-triggered gates on top.

### F2 — The wall-clock critical path is a single 20-minute serial job

`spec-kit-check`'s median wall of 1178 s is 5x the next push-triggered workflow (`hooks-node-tests`, 201 s) and it is the tail that every push to `main` waits on [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:9]. Spot-check A (run `39910111430`) confirms the structure: wall 1188 s, of which the job "Typecheck, import policy and test suites for the spec-kit packages" is 1184 s — 99.7% — while its two sibling jobs finish in 70 s and 165 s. Recorded job medians reproduce this: 1215 s / 62 s / 163 s [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:45]. The workflow is serial in practice because one job carries everything.

Per-step timings from run `39910111430` show where that 1184 s goes: `checkout` 50 s, install+build 46 s, sk-vision bundle 5 s, typecheck 12 s, shared-package tests 3 s, ripgrep 7 s, **CLI vitest project 776 s (65.5%)**, legacy module lanes + bash validation 155 s, runtime vitest 125 s. One vitest project is two-thirds of the slowest gate in the repository. Run id `39910111430` — confirmed.

### F3 — About 26% of all billed minutes buy no compute

Billed minutes use `ceil(job seconds / 60)` per job [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5]. Multiplying each workflow's median job-minutes by its run count gives ~2826 min/day of actual job time against 3812 billed — **~986 min/day (25.9%) is the per-job minute ceiling**. The worst offenders are the sub-140 s pairs:

- `command-tree-parity`: 69 s + 70 s = 2.3 job-min, billed 4 (2+2) — 42% efficiency [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:47].
- `dispatch-enforcement-guard`: 72 s + 69 s = 2.3 job-min, billed 4 — 41% [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:48].
- `message-contract` 78 s, `playbook-operator-contract` 76 s, `rule-canary-sync` 78 s: each a single job billing 2 minutes for ~1.3 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:53].
- `sk-doc-script-tests`: 77 s + 56 s + 167 s = 5.0 job-min, billed 6 — 83% [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:46].

This inverts the intuitive fix. Merging small jobs does **not** recover the rounding, because the ceiling is applied per job, and merging them into one job replaces parallel 70 s legs with a serial ~540 s leg, worsening wall-clock. The levers are (a) fewer *runs*, and (b) shorter *jobs*, not fewer workflows.

### F4 — The fixed per-job overhead floor is ~50 s of checkout, and it is paid ~1500 times a day

Every job in spot-check run `39910111430` spends 50-51 s in `actions/checkout` (three independent jobs, 50 s / 51 s / 51 s). Reconstructing the push fan-out — 21 jobs per full fan-out across the 14 push-triggered workflows — at 73 fan-outs per day yields ~1500 job starts/day. At ~50 s of checkout each that is ~1250 min/day, ~33% of the billed total, before any test executes. For the smallest gates the checkout *is* the job: `markdown-link-integrity`'s recorded 59 s job [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:59] leaves roughly 9 s of actual link checking behind a ~50 s clone. Run ids `39910111430`, `39912381995` (sample set) — confirmed timings, inferred multiplication.

### F5 — The bill scales with *push count*, not with code changed: ~73 pushes/day, ~13 workflows each

Twelve push-triggered workflows each recorded exactly 73 runs in 23.5 h, and the last 40 events of each are `push:40` with `success:40` (e.g. `sk-doc-script-tests`, `command-tree-parity`, `gate-inputs`, `message-contract`) [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:10]. So the repository receives ~73 pushes/day to `main` and each one starts ~13 workflows holding ~21 jobs. Cost is dominated by push *frequency*; per-push billed minutes are ~58 when all fourteen fire. This is the baseline against which every path-filter and duplicate-trigger recommendation must be scored.

### F6 — The recorded zero cost of `trigger-index-rebuild` is a measurement artifact, not a free workflow

The summary records 0 s job medians and 0 billed minutes for both of its jobs [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:77], while the same row records 73 runs and a 103 s median wall [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:41]. Spot-check B (run `39912381915`) shows why: `conclusion: skipped`, both jobs `skipped` at the same timestamp with `steps: []`. The job medians are taken from the five latest completed runs [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5], and for this workflow that sample is dominated by skipped runs. Consequence: any cost ranking built from this dataset **understates** the rebuild workflow by construction, and the real cost of the rebuild is its fan-out, not its own runtime (see F7).

### F7 — Approximately half of the gate traffic may be re-gating auto-generated index commits

`trigger-index-rebuild`'s last 40 runs split `skipped:20 success:20` [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:41], and the documented loop guard skips commits whose message ends with the `Trigger-Index-Rebuild: ci` trailer [SOURCE: .github/workflows/README.md:58]. A skipped run exists only because a run *started*, so rebuild commits do reach the workflow layer. Matching signal: `spec-kit-check` recorded 50 runs against 73 for its peers, consistent with one path filter already excluding index-only commits. If the other twelve push gates lack that filter, ~23 of every 73 push runs (31%) are commits that only rewrite the generated index plus three sidecars, worth on the order of 700-800 billed min/day of the 2533 attributable to those twelve. **Inferred**, not confirmed: it needs the `paths:` blocks in `gate-inputs.yml`, `message-contract.yml` and peers, which iteration 2 must read.

### F8 — Documented contradiction between the README's token claim and the observed skip pattern

`README.md` states "A newer commit pushed with the default `GITHUB_TOKEN` starts no run, so the index then stays unrebuilt until a later push that does start one" [SOURCE: .github/workflows/README.md:58]. If rebuild pushes started no runs, the trailer loop guard could never fire — yet 20 of the last 40 rebuild-workflow runs are `skipped` [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:41]. Both readings cannot hold. Most likely resolution (inferred): the push job authenticates with a token that *does* start runs, and the `GITHUB_TOKEN` sentence describes a degraded fallback path. Recorded as a logic-sync finding per the unattended-run rule; no operator was asked. It matters because the fan-out cost in F7 is real only if rebuild pushes start runs, which the skip evidence indicates they do.

### F9 — Advisory and flaky jobs already show up in the cost data

- `advisory-checks` is documented as non-gating — "Reports without gating" [SOURCE: .github/workflows/README.md:26] — and still spends 75 billed min/day across 73 runs [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:20]. Its single job's 60 s exactly equals its 1-minute bill, so it is nearly rounding-free; its cost is entirely avoidable if it moves to a scheduled lane.
- `deep-loop-runtime` shows `failure:13` of its last 40 runs (32.5%) with an 11.5 min median job [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:22], and `diagram-corpus` shows 12 failures of 40 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:33]. Both are retry-cost and trust-cost candidates for angle 6.
- `strict-pass-freshness-report` is the single most expensive *run* in the dataset: 2577 s wall, 2568 s job, 43 billed min [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:76]. It is scheduled, so it contributes 0 to the 23.5 h window, but it is one serial job of 43 minutes.

## 4. QUESTIONS ANSWERED

- "What does each workflow cost in wall-clock and runner minutes, and which workflows dominate the total?" — answered: 3812 billed min/day total; `spec-kit-check` 1279 (33.6%), `sk-doc-script-tests` 448 (11.8%), top six 72.5%; wall-clock tail is `spec-kit-check` at 1178 s median driven by a 776 s vitest project; ~26% of billed minutes are per-job ceiling rounding; ~33% is ~50 s checkout across ~1500 job starts.

## 5. QUESTIONS REMAINING

All eleven others, with the cost-lens precondition now satisfied. Cheapest next wins, in order:

1. Measure the rebuild-commit fan-out properly (F7): read the `paths:`/`on:` blocks of the twelve 73-run gates and confirm how many of them fire on index-only commits. This is the largest single candidate saving (~700-800 billed min/day).
2. The 50 s checkout floor (F4): determine what makes checkout take 50 s (fetch depth, LFS, history, worktree layout) and whether `fetch-depth: 1` / sparse checkout is already set.
3. Rounding structure (F3): identify which of the 73-run gates can be joined into an existing matrix leg without serialising wall-clock.
4. Then the original angle list: duplicate provisioning (`provision_worktree` + bun) per run, cache effectiveness, matrix/fail-fast/concurrency, timeouts, overengineering, pinning hygiene, on/off control, `/doctor:ci`, `sk-code-ci`.

## 6. NEXT FOCUS

Rebuild-commit fan-out and path filters: read `gate-inputs.yml`, `message-contract.yml`, `rule-canary-sync.yml`, `playbook-operator-contract.yml`, `changed-packet-validation.yml` and `spec-kit-check.yml` `on:`/`paths:` blocks; quantify how much of the 3812 billed min/day is gating commits that only change the generated trigger index; and measure the checkout floor from the workflow checkout steps.

## 7. METHOD NOTES AND CAVEATS

- Wall medians come from the 40 latest runs, job medians from the 5 latest completed runs; the two samples differ, which is why `spec-kit-check` can show a 1178 s wall median beside a 1215 s job median [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5]. Both are internally consistent but must not be subtracted from each other.
- The `Events (last 40)` column spans a longer period than the 23.5 h window for sparse workflows, so `failure:N` counts for `deep-loop-runtime` and `diagram-corpus` describe their last 40 runs, not their last day.
- Daily estimates multiply `runsInWindow × medianBilled`, so a 5-run workflow carries a ±20% error bar.
- Confirmed: run ids `39910111430`, `39912381915`, the dataset's recorded medians, the two README statements. Inferred: F4's aggregate checkout total, F7's index-commit share, F8's token resolution.

## SCOPE VIOLATIONS

None. This iteration wrote only to its two allowed artifacts and the append gateway.
