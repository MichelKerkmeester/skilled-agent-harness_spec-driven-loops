| workflow | job | samples | p50 | p100 | formula | final | marker | n |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| advisory-checks.yml | advisory | 39 | 1.017 | 13.800 | 28 | 28 |  | 39 |
| agent-mirror-sync.yml | agent-mirror-sync | 40 | 1.350 | 2.367 | 5 | 10 |  | 40 |
| changed-packet-validation.yml | changed-packets | 39 | 1.583 | 2.100 | 5 | 10 |  | 39 |
| chart-corpus.yml | corpus | 39 | 1.600 | 1.800 | 5 | 10 |  | 39 |
| command-tree-parity.yml | command-tree-parity | 40 | 1.158 | 1.583 | 4 | 10 |  | 40 |
| command-tree-parity.yml | hermes-mirror | 40 | 1.183 | 1.817 | 4 | 10 |  | 40 |
| comment-hygiene.yml | comment-hygiene | 39 | 1.250 | 2.083 | 5 | 10 |  | 39 |
| deep-loop-runtime.yml | deep-loop-runtime | 25 | 11.317 | 12.783 | 34 | 34 |  | 25 |
| dependabot-auto-merge.yml | metadata | 0 | - | - | - | 10 | no-sample | 0 |
| dependabot-auto-merge.yml | auto-merge | 24 | 0.067 | 0.133 | 1 | 10 |  | 24 |
| diagram-corpus.yml | corpus | 28 | 1.842 | 3.517 | 8 | 10 |  | 28 |
| dispatch-enforcement-guard.yml | dispatch-enforcement-guard | 38 | 1.033 | 1.967 | 4 | 10 |  | 38 |
| dispatch-enforcement-guard.yml | hooks-vitest | 39 | 1.183 | 1.267 | 4 | 10 |  | 39 |
| gate-inputs.yml | gate-inputs | 36 | 1.658 | 2.183 | 5 | 10 |  | 36 |
| markdown-link-integrity.yml | markdown-link-integrity | 40 | 1.000 | 1.233 | 3 | 10 |  | 40 |
| message-contract.yml | message-contract | 38 | 1.317 | 9.800 | 20 | 20 |  | 38 |
| naming-standard-guard.yml | naming-standard | 39 | 1.467 | 2.733 | 6 | 10 |  | 39 |
| opencode-dual-version.yml | battery | 78 | 2.233 | 4.917 | 10 | 10 |  | 78 |
| opencode-dual-version.yml | both | 39 | 2.283 | 2.683 | 7 | 10 |  | 39 |
| opencode-plugin-tests.yml | plugin-and-hook-tests | 5 | 3.200 | 3.317 | 10 | 10 |  | 5 |
| pi-extension-tests.yml | discover | 10 | 0.883 | 0.933 | 3 | 10 |  | 10 |
| pi-extension-tests.yml | pi-extension | 26 | 0.750 | 1.300 | 3 | 10 |  | 26 |
| playbook-operator-contract.yml | operator-contract | 39 | 1.267 | 1.583 | 4 | 10 |  | 39 |
| prompt-card-sync.yml | card-sync | 39 | 0.900 | 1.217 | 3 | 10 |  | 39 |
| repo-rules-corpus.yml | repo-rules-corpus | 18 | 1.150 | 1.500 | 4 | 10 |  | 18 |
| routing-registry-drift.yml | routing-drift | 37 | 1.667 | 3.867 | 8 | 10 |  | 37 |
| routing-registry-drift.yml | golden-prompt-gate | 40 | 2.833 | 18.433 | 37 | 37 |  | 40 |
| rule-canary-sync.yml | rule-canary | 39 | 0.900 | 3.450 | 7 | 10 |  | 39 |
| runtime-no-spec-import.yml | no-spec-import | 40 | 0.983 | 1.200 | 3 | 10 |  | 40 |
| sk-code-script-tests.yml | sk-code-scripts | 16 | 0.950 | 1.333 | 3 | 10 |  | 16 |
| sk-doc-rename-harness.yml | rename-harness | 40 | 2.667 | 3.350 | 8 | 10 |  | 40 |
| sk-doc-script-tests.yml | sk-doc-scripts | 39 | 3.150 | 3.650 | 10 | 10 |  | 39 |
| sk-doc-script-tests.yml | catalog-packages | 38 | 0.925 | 1.083 | 3 | 10 |  | 38 |
| sk-doc-script-tests.yml | citation-drift | 39 | 1.300 | 1.667 | 4 | 10 |  | 39 |
| sk-git-script-tests.yml | sk-git-scripts | 18 | 1.042 | 1.267 | 4 | 10 |  | 18 |
| skill-advisor-stress.yml | skill-advisor-stress | 31 | 1.783 | 2.133 | 6 | 10 |  | 31 |
| skill-doc-frontmatter.yml | frontmatter-coverage | 40 | 0.917 | 1.067 | 3 | 10 |  | 40 |
| skill-doc-frontmatter.yml | doc-version-raise | 7 | 1.533 | 7.050 | 15 | 15 |  | 7 |
| spec-kit-check.yml | check | 37 | 16.717 | 24.000 | 51 | 51 |  | 37 |
| spec-kit-check.yml | mirrors | 39 | 1.150 | 1.483 | 4 | 10 |  | 39 |
| spec-kit-check.yml | doctor-scripts | 40 | 2.558 | 3.067 | 8 | 10 |  | 40 |
| strict-pass-freshness-report.yml | strict-pass-freshness | 9 | 43.483 | 71.033 | 143 | 143 |  | 9 |
| trigger-index-rebuild.yml | rebuild | 38 | 1.283 | 1.383 | 4 | 10 |  | 38 |
| trigger-index-rebuild.yml | push | 27 | 0.483 | 1.000 | 2 | 10 |  | 27 |

## Method

- Floor: 10 minutes, read from `decisions.md`. Rule: `final = max(floor, formula)` and `formula = max(ceil(3 x p50 minutes), ceil(2 x p100 minutes))`.
- A sample is one job's own `startedAt` to `completedAt` in a run's job file, never the run's wall time. Only jobs whose own conclusion is `success` count. A job with no success and at least one `failure` is sized from the failures (`failed-only`); a job with neither takes the floor (`no-sample`); fewer than 5 successes is `thin`.
- p50 is the median (the mean of the two middle values for an even count) and p100 is the maximum, both in minutes. The `n` column repeats `samples` so a marked row carries its count after the marker.
- A runner reports a job under its `name:` value, or its id when it has none. A matrix expression in a name matches whatever the leg resolves it to, so every leg of a matrix job is a sample of that one job.
- Sizing and assertion script: `size-timeouts.mjs`. An independent re-implementation matched all 44 rows, and switching the median to the lower, the upper or the nearest-rank value changed no `final`.

## Comparison

The six jobs that carried a value before this pass, old value then new value:

- `deep-loop-runtime.yml` `deep-loop-runtime`: 45 to 34 (down 24%), 25 samples, p100 12.783 minutes.
- `opencode-dual-version.yml` `battery`: 30 to 10 (down 67%), 78 samples, p100 4.917 minutes.
- `opencode-dual-version.yml` `both`: 30 to 10 (down 67%), 39 samples, p100 2.683 minutes.
- `opencode-plugin-tests.yml` `plugin-and-hook-tests`: 40 to 10 (down 75%), 5 samples, p100 3.317 minutes. All five samples are warm-cache push and pull-request runs of the merged job; no cold-path run of the merged job exists yet.
- `sk-doc-rename-harness.yml` `rename-harness`: 30 to 10 (down 67%), 40 samples, p100 3.350 minutes.
- `skill-advisor-stress.yml` `skill-advisor-stress`: 20 to 10 (down 50% exactly), 31 samples, p100 2.133 minutes.

No successful sample of any job exceeds 50% of its new value, and no sample of any conclusion (success, failure or cancelled) reaches 60% of its job's new value.

## Diagnostics

- Runs read: 1156 of 1157; one cancelled `opencode-dual-version.yml` run (40107103375) holds no job data and was ignored.
- Job name that matched no job in the tree: `opencode-plugin-tests.yml`, `OpenCode plugin tests`, 35 runs, longest success 2.67 minutes. It is the job name before the hook and plugin jobs were merged, so it is not a sample of `plugin-and-hook-tests`.
- `dependabot-auto-merge.yml` `auto-merge` shows 24 samples (p100 0.133 minutes) because the earlier single-job shape ran under the same job name. The new shape runs only the merge command, so those samples overstate it; its `final` is the floor either way. `metadata` is a new job with no run yet and is `no-sample`.
- Filter sensitivity: counting a job only when its whole run succeeded, instead of when the job itself succeeded, would change one value, `spec-kit-check.yml` `check`, from 51 to 52. No other `final` moves.

## R24 proof

- Assertion: `node scratch/r24/size-timeouts.mjs --assert --floor 10` printed `values match formula: ok` and `50% rule: ok`, exit 0. Run without `--floor` (it then reads the floor from `decisions.md`) it printed the same two lines, exit 0.
- Parse: every workflow loads with `yaml.safe_load` (`parse ok`), and the inventory printed `jobs 44 no-timeout []`.
- One `timeout-minutes` line per job: 44 lines for 44 jobs in 32 files.
- Table: 46 rows that start with `| ` (44 jobs, the header and the divider). Rows carrying a marker: 1, the new `metadata` job in `dependabot-auto-merge.yml` (`no-sample`, count 0). Both the `\| (thin|no-sample|failed-only) \|` form and the form with a count after the marker return 1. No row is `thin` or `failed-only`; the lowest success counts are 5 for `plugin-and-hook-tests`, 7 for `doc-version-raise` and 9 for `strict-pass-freshness`.
- Gate: `bash .github/scripts/check-gate-inputs.sh` printed `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` then `RESULT: PASSED`, exit 0 (`gate-after-timeouts.txt`).
- Diff scope: 32 workflow files changed, 44 lines added and 6 removed. Every added or removed line is a `timeout-minutes:` line: 38 inserted after `runs-on:` and 6 existing values re-sized in place.
