# R19 probe

| mode | run | exit | seconds | log |
|---|---|---|---|---|
| serial | 1 | 0 | 625.44 | r19-serial.log |
| parallel | 1 | 0 | 292.33 | r19-run-1.log |
| parallel | 2 | 1 | 305.59 | r19-run-2.log |
| parallel | 3 | 1 | 311.91 | r19-run-3.log |

The serial row is the rerun outside the sandbox; the first in-sandbox attempt, which failed, is the `## T004 first attempt, failed in the sandbox` section below.

## T004 first attempt, failed in the sandbox

The serial row above is the rerun outside the sandbox. This section is the first attempt, which ran inside the sandbox and failed; its cause: the sandbox blocked parent-process inspection.

Command: `cd .skilled/skills/system-spec-kit/runtime/cli && /usr/bin/time -p npx vitest run --config ../../vitest.config.ts --project cli`

Observed output: `exit=1 real=743.57`; `Test Files  1 failed | 179 passed | 3 skipped (183)`; `Tests  1 failed | 2061 passed | 20 skipped (2082)`.

Failure: `tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > reads the token from a readable parent as yes, so the clean parent results are not vacuous` expected `true`, received `false` at line 1084.

Task check outputs: `1`; `0`; `Test Files  1 failed | 179 passed | 3 skipped (183)`.

Stop-if: the exit code is not `0`, or the collected file count is not `183`.

## Outcome

Collision log:
(empty)

Failure log:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/218-ci-efficiency-build/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-run-2.log:219: FAIL  |cli| tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > renders filesystem-backed key_files and phase metadata into the saved memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/218-ci-efficiency-build/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-run-2.log:220:Error: Test timed out in 30000ms.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/218-ci-efficiency-build/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-run-3.log:221: FAIL  |cli| tests/trigger-phrase-no-prose-bigrams.vitest.ts > trigger phrase workflow fixes > filters prose-derived bigram noise without exposing a legacy context filename
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/218-ci-efficiency-build/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-run-3.log:222:Error: Test timed out in 30000ms.

classification: parallel-only timeouts, counted as a concurrency result by operator ruling on 2026-10-24, written after the probe data was in; the planned rules (parallel when all three rows exit 0, shard on a collision token) would have stopped here as unclassified

outcome: shard
comment-rewrite: skipped
| shard | 1/2 | 0 | 145.13 | r19-shard-1-2.log |
| shard | 2/2 | 0 | 561.58 | r19-shard-2-2.log |

## Quoted log lines

The `.log` files in this folder are gitignored, so the summary lines that decide each row are quoted here. Observed on 2026-10-24.

| log | Test Files | Tests | real |
|---|---|---|---|
| r19-serial.log | 180 passed, 3 skipped (183) | 2062 passed, 20 skipped (2082) | 625.44 |
| r19-run-1.log | 180 passed, 3 skipped (183) | 2062 passed, 20 skipped (2082) | 292.33 |
| r19-run-2.log | 1 failed, 179 passed, 3 skipped (183) | 1 failed, 2061 passed, 20 skipped (2082) | 305.59 |
| r19-run-3.log | 1 failed, 179 passed, 3 skipped (183) | 1 failed, 2061 passed, 20 skipped (2082) | 311.91 |
| r19-shard-1-2.log | 91 passed, 1 skipped (92) | 1005 passed, 7 skipped (1012) | 145.13 |
| r19-shard-2-2.log | 89 passed, 2 skipped (91) | 1057 passed, 13 skipped (1070) | 561.58 |

The shard halves are unbalanced: the second half carries the slow files and took 3.9 times as long as the first. The two halves ran one after the other locally and run concurrently in CI.

## Run environments

| run | environment | basis |
|---|---|---|
| first serial attempt | inside the codex sandbox | its own failure: `reads the token from a readable parent` returned `false` at line 1084 because the sandbox blocks parent-process inspection |
| serial (table row) | outside the sandbox | rerun for that reason; the same test passed |
| parallel 1, 2, 3 | outside the sandbox (inferred) | not logged when run; the only failure in runs 2 and 3 is a 30 s timeout in another file, and the sandbox-sensitive test is not among the failures, which it would be inside the sandbox |
| shard 1/2 and 2/2 | outside the sandbox (inferred) | same inference: both exit 0 with the sandbox-sensitive test passing |
| rebalanced split and the per-file timing run | outside the sandbox | run from a plain shell with no sandbox variable set |

The sandbox-sensitive test file was run alone outside the sandbox on 2026-10-24: `Test Files  1 passed (1)`, `Tests  60 passed | 1 skipped (61)`, `exit 0`, and `reads the token from a readable parent as yes, so the clean parent results are not vacuous` passed. The skipped test is `when the generator exits nonzero after writing (regenerate-partial) > stops on the exit check before the content check runs`.
