# R20 CLI vitest step

| when | run id | step seconds |
|---|---|---|
| reference | 39909844384 | 791 |

baseline-source: 001-dataset

after: the median of the five green post-change runs below (operator ruling of 2026-10-24, decision-record ADR-003 amendment), read at 5 of 5 on 2026-10-25 as 451 s. The 400 s bar is not met and the criterion is waived by the operator's ruling of 2026-10-25 (decision-record ADR-011)

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
| after | 40147796034 | 8ff7da700d | success | 467 |

post-change-runs: 5 of 5

Reading at closure, 2026-10-25: the five samples are 459, 299, 313, 451 and 467 s. Every row was read the same way, from the `CLI vitest project` step of the `Typecheck` job with `gh run view <id> --json jobs`: for the fifth run 00:46:45Z to 00:54:32Z is 467 s, and the earlier four are 14:28:23Z to 14:36:02Z (459 s), 15:31:42Z to 15:36:41Z (299 s), 19:17:07Z to 19:22:20Z (313 s) and 19:32:01Z to 19:39:32Z (451 s). Every head contains 04d9b0c84f (`git merge-base --is-ancestor 04d9b0c84f <head>` exits 0 for each of the five). These are the first five consecutive green runs on main since 75b27df21c. The spread across the five samples (299 to 467 s) is comparable to the reference's own spread (776 to 950 s), so the median of five, not any single run, is the judge. The reference step read 791 s in run 39909844384.

## Runs on main after the fifth

Listed so that this file accounts for every `Spec-Kit Check` run on main since 75b27df21c. These two rows are not `| after |` rows and are not part of the five. Step seconds are read the same way as above.

| when | run id | head sha | conclusion | step seconds |
|---|---|---|---|---|
| later | 40149635448 | 03abdb20d8 | failure | 310 |
| later | 40170908787 | 1fd95b59cd | success | 324 |

Run 40149635448 is red for a cause unrelated to this phase. Its failed log names one test, `tests/trigger-index-rebuild-workflow.vitest.ts:809` (`AssertionError: expected '${{ (vars.SKILLED_CI != \'off\') && (…' to be 'needs.rebuild.outputs.committed == \'…'`), and the other 178 test files in that process passed (OBSERVED in `gh run view 40149635448 --log-failed`). That test asserts a workflow condition that another phase changed: `git log -S"SKILLED_CI" -- .github/workflows/trigger-index-rebuild.yml` prints 9480d99e6d (`ci(workflows): gate every job behind a repository switch`) as the commit that added the switch term, and commit 1fd95b59cd (`test(system-spec-kit): accept the switch term in the rebuild push condition`) changes only that test file. The 310 s is the time to the failing step's end, not a completed-step sample, and it is not used. Run 40170908787 (head 1fd95b59cd) is green and read 324 s. It is a sixth run, outside the five, mentioned as an aside and not used in the median.

## Median and waiver

The check from `acceptance-criteria.md` AC-003, run on 2026-10-25 against the five `| after |` rows above:

- `grep -c '^| after |'` returns `5`.
- The five step seconds sorted: 299, 313, 451, 459, 467. The median is the third value, 451 s.
- The awk check (sort the five, test the third value against 400) prints `NOT_MET` and exits `1`.
- The 400 s bar is therefore not met: 451 s is 51 s over it.
- Against the 791 s reference (run 39909844384): (791 - 451) / 791 = 340 / 791 = 0.4298, a cut of 43 percent.
- The runner spread across the five samples is 299 to 467 s, 168 s wide. The reference moved between 776 and 950 s across four planning samples.

The operator ruled on 2026-10-25 to close AC-003 by waiver: record the five runs as measured, keep the 400 s bar visible and note the 43 percent cut and the runner spread. The ruling is recorded as decision-record ADR-011, and the five runs above are left exactly as measured.

## Green streak

The five runs behind the median, read with `gh run view <id> --json databaseId,createdAt,headSha,conclusion` on 2026-10-25. All five are push runs on main whose head contains 04d9b0c84f.

| run id | createdAt | headSha | conclusion |
|---|---|---|---|
| 40102448836 | 2026-10-24T14:25:45Z | 75b27df | success |
| 40107239895 | 2026-10-24T15:30:01Z | e00fef3 | success |
| 40123498034 | 2026-10-24T19:02:55Z | 1c0c353 | success |
| 40125544852 | 2026-10-24T19:29:46Z | 666844f | success |
| 40147796034 | 2026-10-25T00:43:20Z | 8ff7da7 | success |

all_green: true
