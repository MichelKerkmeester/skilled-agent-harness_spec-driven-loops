# R20 CLI vitest step

| when | run id | step seconds |
|---|---|---|
| reference | 39909844384 | 791 |

baseline-source: 001-dataset

after: the median of the five green post-change runs below (operator ruling of 2026-10-24, decision-record ADR-003 amendment), awaiting run 5 of 5 (4 of 5 read)

ceiling: 400 s, judged on that median. The `| after |` rows below are the runs on main since 75b27df21c, oldest first, and only runs whose head contains 04d9b0c84f count.

## Count-based shard samples (superseded)

The first shard split the project by file count (`--shard=1/2` and `--shard=2/2`), committed as `b2a1663ee9`. Two CI runs used it; both are over the ceiling, so the operator ruled on 2026-10-24 to rebalance the split by hand.

| run id | event | step seconds |
|---|---|---|
| 40090109005 | push on main at b2a1663 | 643 |
| 40094302049 | pull_request on a Dependabot branch; its log shows both `--shard=` commands | 482 |

The 791 s reference moved between 776 s and 950 s across four planning samples (`001-research/research/iterations/iteration-005.md:47`), so two samples of 643 s and 482 s do not establish a gain; they show only that the count-based split stayed over 400 s.

## Why the count-based split missed

The step lasts as long as the slower process, because the two processes run concurrently. The local sequential halves took 145.13 s (`--shard=1/2`) and 561.58 s (`--shard=2/2`), so the second half alone was over 400 s. Per-file timings (below) show why: one file, `tests/upgrade-legacy.vitest.ts`, takes about half of the project's serial time, and a file-count split cannot divide a file.

## Per-file timings

One full local run of the `cli` project outside the sandbox, with `--reporter=json`, on 2026-10-24: `exit=0`, `real 759.67`, 183 files, 2062 tests passed. That run overlapped other work on the machine, so its seconds are about 20% above the quiet serial run (625.44 s); the proportions are what the split uses. The `.json` is not committed; the slowest files from it:

| file | seconds |
|---|---|
| tests/upgrade-legacy.vitest.ts | 369.0 |
| tests/progressive-validation.vitest.ts | 122.5 |
| tests/archive-track.vitest.ts | 33.8 |
| tests/repair-derived.vitest.ts | 33.1 |
| tests/task-enrichment.vitest.ts | 14.2 |
| every other file | 13.5 or less |

The 183 per-file durations sum to 709 s.

## Rebalanced split

`spec-kit-check.yml` now runs two concurrent processes inside the existing step: the first runs `tests/upgrade-legacy.vitest.ts` alone, and the second runs every other file through `--exclude tests/upgrade-legacy.vitest.ts`. A renamed heavy file makes the first process find no test file and fail, so the split cannot drop it silently. Both statuses still fail the step through `wait ... || status=1`.

Local check on 2026-10-24, the two processes run one after the other outside the sandbox:

| process | exit | files | tests | seconds |
|---|---|---|---|---|
| tests/upgrade-legacy.vitest.ts alone | 0 | 1 | 67 passed | 313.90 |
| every other file | 0 | 182 (179 passed, 3 skipped) | 1995 passed, 20 skipped | 356.56 |

Together they cover 183 files and 2062 passed, 20 skipped tests, equal to the serial run. `vitest list --filesOnly` returns 183 files for the project, 182 with the exclusion, and 1 with the filter. On CI the two processes run at the same time on a shared runner, so the step may take longer than the slower local half; the CI number decides AC-003.

## Post-change runs

Every `Spec-Kit Check` run on main since 75b27df21c (inclusive), oldest first. Every head contains 04d9b0c84f (`git merge-base --is-ancestor 04d9b0c84f <sha>` exits 0 for each). Step seconds are `completedAt` minus `startedAt` of the `CLI vitest project` step in the `Typecheck` job, read with `gh run view <id> --json jobs`. Pull-request runs on other branches are not on main and are not listed.

| when | run id | head sha | conclusion | step seconds |
|---|---|---|---|---|
| after | 40102448836 | 75b27df21c | success | 459 |
| after | 40107239895 | e00fef3e76 | success | 299 |
| after | 40123498034 | 1c0c3534cf | success | 313 |
| after | 40125544852 | 666844f806 | success | 451 |

post-change-runs: 4 of 5 needed

Running values, re-pulled 2026-10-25: the four samples are 459, 299, 313 and 451 s; their median is 382 s (the mean of 313 and 451). With four runs, not five, it is a running figure and decides nothing, so AC-003 stays Unmet, awaiting run 5 of 5. The two new rows were read the same way as the first two, from the `CLI vitest project` step of the `Typecheck` job: 19:17:07Z to 19:22:20Z is 313 s, and 19:32:01Z to 19:39:32Z is 451 s. Both heads contain 04d9b0c84f (`git merge-base --is-ancestor` exits 0 for each). The two new heads also changed other steps of the same workflow (the install steps now go through the setup action) but are separate steps from the CLI one. The spread across the four samples (299 to 459 s) is comparable to the reference's own spread (776 to 950 s), so the median of five, not any single run, is the judge. As of 2026-10-25 no further `Spec-Kit Check` run on main exists: the newest completed main run is 40125544852, and the later runs listed for the workflow are on the Dependabot branch, which is not main. The reference step read 791 s in run 39909844384.

When one more natural run on main has finished with head shas that contain 04d9b0c84f, append one `| after |` row per run (stop at five rows), then the `## Green streak` section from those five runs and the `all_green: true` line, and judge AC-003 on the median of the five `step seconds` values.
