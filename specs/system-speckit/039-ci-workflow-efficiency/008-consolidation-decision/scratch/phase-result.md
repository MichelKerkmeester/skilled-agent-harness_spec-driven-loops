# Phase result

Run from the worktree at `1c317e13c5` (`scratch/phase-start-sha.txt`) on 2026-10-25.

## Setup checks

T001, read with the task's own commands:

```text
wc -l < scratch/phase-start-sha.txt                      ->  1
grep -cE '^[0-9a-f]{40}$' scratch/phase-start-sha.txt    ->  1
switch commit for SKILLED_CI_FRESHNESS in gate-inputs.yml ->  9480d99e6d, ancestor of the start SHA: switch-in-sha
002 baseline summary                                       ->  baseline-ok
grep -c 'SKILLED_CI_FRESHNESS' gate-inputs.yml             ->  1
grep -c 'concurrency:' command-tree-parity.yml             ->  1
hooks-node-tests.yml absent                                ->  hooks-merged
```

T002 printed `jobs 13`, then `13` and `1` for the two greps. A Python parse of each file's `on.push` block shows no `paths:` or `paths-ignore:` on eight of the nine; `command-tree-parity.yml` carries a push path filter, as the edge-case table expects.

## Snapshot

- `gh run list --limit 1000 --json databaseId,name,headSha,event,conclusion,createdAt,startedAt,updatedAt` exited 0: 1000 runs, 2026-10-24T14:27:40Z to 2026-10-25T20:19:19Z (29.86 h).
- `gh run list --workflow <file> --limit 40 --json databaseId,createdAt` gave 40 runs for each of the nine.
- `gh run view <id> --json jobs` for every indexed id gave 360 files; `jq -e '.jobs'` passed on all of them. The task's serial loop was run eight calls at a time with `xargs -P 8`; the calls and the files are the same.
- One run has an empty `jobs` array: 40221346293, `sk-doc Script Tests`, concluded `cancelled`. It is excluded from the medians and counted in `excluded.emptyRuns`.

## Deviations

- The snapshot was taken about 19 h after `9480d99e6d`, the last commit to touch the nine files, not 24 h. That commit adds a job-level `if:` and changes no step. Detail: `scratch/snapshot-window.md`.
- `command-tree-parity.yml` reads `SKILLED_CI_TESTS`, not `SKILLED_CI_FRESHNESS`, in the tree (`scratch/pre-merge-inventory.md`, and `.github/workflows/README.md:84`), and its push trigger is path-filtered. The plan's candidate set still names it. The cost script keeps the plan's eight as `bounds.freshness` and adds `bounds.freshnessSwitched`, the seven workflows that read `SKILLED_CI_FRESHNESS`, so the record can show both.
- The checkout step is matched as a step name containing `actions/checkout` that does not start with `Post `, so the near-zero post-checkout step does not halve the median.
- The script adds a rate-aware saving next to the plan's `savingPerPush x max(runsPerDay)`, because `command-tree-parity.yml` runs about 19 times a day against 43 to 50 for the others.

## Cost check

```text
$ node specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.mjs --check; echo "exit=$?"
check: ok
exit=0
```

## Hostile variants

Run on a throwaway copy of `consolidation-cost.mjs`, `window.json`, `jobs/` and `consolidation-cost.json` in the session scratchpad, removed afterwards. The phase's own files were not touched.

```text
stored bounds.freshness.mergedBilled set to 99, then --check   ->  "check: mismatch ...", exit 1
one gate-inputs job set to conclusion "skipped"                  ->  excluded.skippedJobs 1, gate-inputs samples 38
one gate-inputs job with completedAt null                        ->  excluded.noTimestampJobs 1
every rule-canary-sync checkout step removed                     ->  rule-canary-sync flags ["no-checkout"]
every advisory-checks run file set to {"jobs":[]}                ->  advisory-checks flags ["no-sample"], excluded.emptyRuns 43
gate-inputs.yml removed from window.json perWorkflow             ->  "window.json perWorkflow must name exactly the nine workflows", exit 1
```

The `emptyRuns` figure of 43 is 40 emptied advisory runs, the real cancelled run 40221346293, and two gate-inputs runs whose only job was the skipped or timestamp-less one.

## D8

`scratch/d8-answer.md` holds `D8=no`, the session's judgment under the operator's delegation of 2026-10-25, pending the operator's verification at the end of the session. T015 to T020 and T023 are superseded by that answer. `scratch/no-merge.md` holds the empty workflow diff and the empty worktree status.

## Gates

```text
$ node specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.mjs --check; echo "cost=$?"
check: ok
cost=0

$ bash .github/scripts/check-gate-inputs.sh; echo "gate=$?"
files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0
RESULT: PASSED
gate=0

$ python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"; echo "parse=$?"
parse=0
```

The strict validation of this folder is recorded in `implementation-summary.md` and the acceptance row AC-008, because it has to run after the closure edits it validates.
