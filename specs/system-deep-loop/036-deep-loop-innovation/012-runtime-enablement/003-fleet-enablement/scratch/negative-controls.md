---
title: "Negative controls — fleet enablement"
trigger_phrases: []
---
# Negative controls — fleet enablement

Every guard below was removed, the suite re-run, and the guard restored. A guard
that stayed green with its implementation deleted would be an assertion that
cannot fail, so each row records the test that actually went red.

Both scripts are kept here and are re-runnable: `nc.py` (CLI guards) and
`nc2.py` (driver and surface-map guards). Each perturbation asserts that its
edit actually applied, so a stale pattern fails loudly instead of reporting a
green that was never perturbed.

## CLI guards — `nc.py`, against `tests/unit/enable-modes-cli.vitest.ts` (15 tests)

| Control | Perturbation | Result |
|---------|--------------|--------|
| NC-A | value-required check disabled | RED — `rejects a state flag with no value` (1 failed / 14 passed) |
| NC-B | flag-takes-no-value check disabled | RED — `rejects a dry-run flag that swallowed a value` (1 failed / 14 passed) |
| NC-C | resume guard disabled | RED — `refuses to continue a stopped run unless resuming is asked for` (1 failed / 14 passed) |
| NC-D | dry run made to construct the registry | RED — `never creates the authority root during a dry run` (1 failed / 14 passed) |
| NC-E | per-mode step made to always succeed | RED — `stops at the first mode that cannot be flipped`, plus 2 more (3 failed / 12 passed) |

## Driver and surface map — `nc2.py`, against `tests/unit/fleet-enablement.vitest.ts` (23 tests)

| Control | Perturbation | Result |
|---------|--------------|--------|
| NC-F | dry-run early return removed | RED — `invokes nothing during a dry run`, plus 2 more (3 failed / 20 passed) |
| NC-G | stop-on-failure replaced with continue | RED — `never invokes a mode after the failure`, plus 2 more (3 failed / 20 passed) |
| NC-H | resume skip-list removed | RED — `resumes without re-running completed modes` (1 failed / 22 passed) |
| NC-I | state-shape validation removed | RED — `refuses a state file whose completed list is not a list` (1 failed / 22 passed) |
| NC-J | per-success persistence removed | RED — `persists progress after every success` (1 failed / 22 passed) |
| NC-K | pilot-mode exclusion removed | RED — `excludes the already-enabled pilot mode`, plus 5 more (6 failed / 17 passed) |
| NC-L | empty projectable set reported as populated | RED — `flags a mode whose projectable set is empty` (1 failed / 22 passed) |

12 of 12 went red. In ten of the twelve the blast radius was one to three tests,
which is the second half of the evidence: the suite discriminates between guards
rather than collapsing wholesale whenever anything is disturbed.

## Two defects the tests were written against, not after

The argument-shape guards exist because both failures were observed first, on the
CLI as delivered:

- `--state --dry-run` — the missing value parsed as the boolean `true` and was
  used as a filesystem path. Node's own
  `DeprecationWarning: Passing invalid argument types to fs.existsSync` confirmed
  it. Exit 0, reported as a successful dry run.
- `--dry-run <path> --state <path>` — the flag swallowed the following token, so
  the string compared unequal to `true` and a request that said "change nothing"
  executed a real run and wrote its state file.

Both now exit 1 before any work, with `ARG_VALUE_REQUIRED` and
`ARG_TAKES_NO_VALUE` respectively. The recorded before-and-after is the negative
control for this pair: the failing symptom was reproduced, then the same
invocations were re-run against the fix.

## Third pass — the guards added after the adversarial review (`nc3.py`)

| Control | Perturbation | Result |
|---------|--------------|--------|
| NC-M | cross-run union in `save` reverted | RED — `keeps an earlier run's completions when a later run resumes` **and** `does not re-plan a mode an earlier run completed` (2 failed / 39 passed) |
| NC-O | guard around the authority read reverted | RED — `stops cleanly at a mode whose authority record cannot be read` (1 failed / 40 passed) |

14 of 14 across all three passes. The atomic state write is deliberately absent
from this table: no test asserts it, because the only assertion available —
that no temporary file is left behind — would stay green with the rename
removed. An assertion that cannot fail is worse than none, so it is recorded as
reviewed rather than counted as proven.
