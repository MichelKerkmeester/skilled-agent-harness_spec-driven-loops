# npm dedupe record

Measured 2026-10-24 on the substitution commit `1c0c3534cf` pushed to main. The first attempt of each run populated the cache. Attempt 2 of the same run, started by a rerun, is the warm run. The baseline is the latest successful push run on main before the substitution commit. Each figure is the sum of the seconds of the steps that install, provision or build dependencies in that run, read from the run's job steps with `gh api repos/{owner}/{repo}/actions/runs/{id}/attempts/{n}/jobs`.

The rule from the task: a block stays only when its warm install seconds are at least 10 s shorter than its baseline. The wall seconds in the last column are the sum of the workflow's job durations in the same runs, so the reader can see whether the step figure matches the job figure.

| File | Baseline run | Baseline s | Warm s | Saved s | Verdict | Job seconds, baseline to warm |
|---|---|---:|---:|---:|---|---|
| `routing-registry-drift` | 40113489423 | 83 | 67 | 16 | keep | 1204 to 235 |
| `spec-kit-check` | 40107239895 | 79 | 119 | -40 | revert | 768 to 893 |
| `skill-advisor-stress` | 40113489449 | 29 | 39 | -10 | revert | 106 to 121 |
| `sk-doc-script-tests` | 40114077313 | 12 | 39 | -27 | revert | 278 to 313 |
| `sk-doc-rename-harness` | 40112631195 | 16 | 48 | -32 | revert | 166 to 201 |
| `deep-loop-runtime` | 40102448812 | 17 | 39 | -22 | revert | 667 to 682 |
| `skill-doc-frontmatter` | 40112631232 | 0 | 0 | 0 | revert | 53 to 47 |
| `playbook-operator-contract` | 40114077351 | 14 | 35 | -21 | revert | 77 to 94 |
| `gate-inputs` | 40114077340 | 13 | 40 | -27 | revert | 102 to 131 |
| `command-tree-parity` | 40112631201 | 22 | 67 | -45 | revert | 142 to 170 |

## Reading the rows

The shared action restores a dependency cache and costs 31 to 44 s on a warm run in every workflow that calls it. A workflow whose own install takes less than about 40 s therefore gets slower, which is what the nine restored rows show. Only `routing-registry-drift` installs and builds something larger than that (a 66 s advisor scorer build in the baseline), and its two jobs drop from 1204 s to 235 s of job time.

`skill-doc-frontmatter` has no baseline: its install step did not run in the sampled baseline run or in the warm run, so both read 0 s. The block cannot show a saving it never measured, so the rule restores it.

The first attempt of each substituted workflow is slower than its baseline in most rows (for example `command-tree-parity` 142 s to 494 s of job time and `playbook-operator-contract` 77 s to 184 s). That cost is the one-time cache population and is not part of the verdict.

The four pip caches are not in this record. They install two small pinned packages, were not given a saving threshold, and stay as committed.
