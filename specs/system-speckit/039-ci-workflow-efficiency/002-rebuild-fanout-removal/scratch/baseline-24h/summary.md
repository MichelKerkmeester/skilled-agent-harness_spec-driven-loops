# 24 h post-change baseline

Collected 2026-10-24T21:58Z to 21:59Z with `gh run list --limit 1000` and `gh run view <id> --json jobs` against `MichelKerkmeester/skilled-agent-harness_spec-driven-loops`. Every command exited 0.

- **Window:** `createdAt` from 2026-10-23T21:59:34Z to 2026-10-24T21:59:34Z (exactly 24 h, so no scaling factor applies). The 1000-run list reaches back to 2026-10-23T15:24:36Z, so the window is fully covered. The first run in the window was created 2026-10-24T06:40:51Z and the last 2026-10-24T21:57:05Z; nothing ran overnight.
- **Window size:** 795 runs, of which 728 come from `.github/workflows/` and 67 have event `dynamic` (GitHub-managed: code scanning, Dependabot update jobs, runs named after pull requests, the scheduled default run). Events: push 391, pull_request 321, dynamic 67, workflow_dispatch 15, schedule 1.
- **Method:** the same billing rule as the pre-change dataset: billed minutes per run = sum over non-skipped jobs of ceil(job seconds / 60); the per-workflow figure is the median over the five latest non-skipped completed runs (191 run ids in `run-ids.txt`, each with a `jobs/<id>.json`); the estimate is runs in the window times that median.
- **Pre-change reference:** 3,812 billed min/day over a 23.5 h window.

## Headline

**Measured total, `.github/workflows/` runs only: 2,191 runner-min in the 24 h window.** The expected band was 1,700-1,850 (about 1,739 predicted). The measured number is outside the band and is reported as measured, not rescaled or adjusted.

**Per-rebuild-SHA runs in the window:** 19 trigger-index rebuild commits landed in the window (`rebuild-shas.txt`). Runs caused by those commits (event push, pull_request or schedule): **0**. Five `workflow_dispatch` runs carry a rebuild SHA as `headSha` because someone dispatched them by hand on the branch tip (OpenCode Dual-Version Battery 3, OpenCode Plugin Tests 2); they are not triggered by the commit. The 19 SHAs also carry `dynamic` runs (GitHub-managed, listed below), which `[skip ci]` does not suppress.

## Separate line: GitHub-managed `dynamic` runs (not counted above)

- `Push on main` (code scanning default setup): 42 runs, median 10 billed min, about 420 min.
- Other `dynamic` runs (Dependabot update jobs, runs named after pull requests, Scheduled, CodeQL Setup): 25 runs, about 164 min.
- Total `dynamic`: 67 runs, about 584 min. Adding it to the headline would give 2,775.

## Per-workflow table (`.github/workflows/` runs)

| Workflow (name) | Runs in window | Events | Sampled runs | Median billed min per run | Est. billed min in window |
|---|---|---|---|---|---|
| sk-doc Script Tests | 49 | push+pull_request | 5 | 7 | 343 |
| Dispatch Enforcement Guard | 49 | push+pull_request | 5 | 4 | 196 |
| Spec-Kit Check | 13 | pull_request+push | 5 | 14 | 182 |
| Message Contract | 76 | push+pull_request | 5 | 2 | 152 |
| OpenCode Dual-Version Battery | 15 | pull_request+workflow_dispatch+push | 5 | 9 | 135 |
| OpenCode Plugin Tests | 29 | push+pull_request+workflow_dispatch | 5 | 4 | 116 |
| Playbook Operator Contract | 50 | push+pull_request+schedule | 5 | 2 | 100 |
| Changed Packet Validation | 49 | push+pull_request | 5 | 2 | 98 |
| Gate Inputs | 49 | push+pull_request | 5 | 2 | 98 |
| Trigger Index Rebuild | 30 | push | 5 | 3 | 90 |
| Deep-Loop Runtime Tests | 8 | pull_request+push | 5 | 10 | 80 |
| Routing Registry Drift Guard | 15 | pull_request+push | 5 | 5 | 75 |
| Hook Node Tests | 21 | push+pull_request | 5 | 3 | 63 |
| Command Tree Parity | 15 | push+pull_request | 5 | 4 | 60 |
| Strict Pass Freshness Report | 1 | workflow_dispatch | 1 | 52 | 52 |
| Rule Canary Sync | 49 | push+pull_request | 5 | 1 | 49 |
| Advisory Checks | 49 | push+pull_request | 5 | 1 | 49 |
| Naming Standard Guard | 19 | pull_request | 5 | 2 | 38 |
| Comment Hygiene Gate | 19 | pull_request | 5 | 2 | 38 |
| Skill Advisor Stress Tests | 10 | pull_request+push | 5 | 2 | 20 |
| Dependabot Auto-merge | 19 | pull_request | 5 | 1 | 19 |
| Prompt-Knowledge Card Sync | 19 | pull_request | 5 | 1 | 19 |
| sk-doc Rename Harness | 6 | pull_request+push | 5 | 3 | 18 |
| Diagram Corpus | 9 | pull_request+workflow_dispatch | 5 | 2 | 18 |
| Markdown Link Integrity | 14 | push+pull_request | 5 | 1 | 14 |
| Skill Doc Frontmatter | 13 | pull_request+push | 5 | 1 | 13 |
| Agent Mirror Sync | 6 | pull_request | 5 | 2 | 12 |
| Pi Extension Tests | 3 | pull_request | 5 | 4 | 12 |
| Runtime No-Spec-Import Guard | 11 | pull_request+push | 5 | 1 | 11 |
| sk-git Script Tests | 4 | pull_request+push | 5 | 2 | 8 |
| sk-code Script Tests | 4 | pull_request+push | 5 | 1 | 4 |
| Chart Corpus | 2 | pull_request | 4 | 2 | 4 |
| Cache Probe | 2 | push | 2 | 2 | 4 |
| Repo Rules Corpus | 1 | pull_request | 1 | 1 | 1 |
| **Total, .github/workflows runs** | 728 | | | | **2191** |

## Reading the gap against the band

These are observations about the 24 h window, listed so a later phase can see what the total contains. None of them is applied to the headline.

- The pre-change dataset estimated `Trigger Index Rebuild` at 0 min because its sampled runs were loop-guard rows with skipped jobs. In this window each of its 30 runs follows a push that is not a rebuild commit and its five latest completed runs bill 3 min each, so it contributes 90 min.
- Manual `workflow_dispatch` runs add 114 min: Strict Pass Freshness Report 1 run at 52 min, OpenCode Dual-Version Battery 4 runs at 9 min, OpenCode Plugin Tests 3 runs at 4 min, Diagram Corpus 7 runs at 2 min.
- The window held 321 pull_request runs and 391 push runs; the pull_request share was not traced to a cause.
- Removing both of the first two items would give 2,191 - 90 - 114 = 1,987, still above 1,850. The gap is therefore not explained by these items alone.
- Push-triggered volume matches the prediction: 49 runs of each unfiltered push workflow against 73 before, which is the 24 fewer rebuild-commit runs.
