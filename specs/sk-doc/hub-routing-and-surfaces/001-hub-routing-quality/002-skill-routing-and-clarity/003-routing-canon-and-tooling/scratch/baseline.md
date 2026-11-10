# Baseline: phase 003 gates before any edit

Recorded 2026-10-28 on `worktrees/254-skill-routing-and-clarity` at `fca978fd29`, after the fast-forward onto `origin/main` and a clean `worktree-naming.sh provision` (`3 built, 14 already present, 0 failed`), before the first edit. Every gate ran from the worktree root through one runner script. Exit is the process exit code, read together with the result line from the log.

This file lives in phase 003's `scratch/` rather than phase 002's: phase 002's `baseline.md` is that phase's own closed "before" record, and overwriting it would destroy it. The gate set and commands are the same as phase 002's, plus `compiled-route-sync --check`.

| Gate | Exit | Result line |
|------|------|-------------|
| parent-skill-check, cli-classifier | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, cli-external-orchestration | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, mcp-tooling | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, sk-code | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, sk-design | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, sk-doc | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, system-deep-loop | 0 | all hard invariants passed, 0 warnings |
| compiled-route-guard --json | 0 | 7 hubs `fresh`, `"failures": 0` |
| compiled-route-sync --check | 0 | `all 55 served copies match their authored files` |
| verify-router-sync | 0 | `router-sync: 5/5 checks passed` |
| package_skill --check --strict, all 14 roots | 0 x 14 | `Result: PASS` x 14 |
| check-rule-copies | 0 | `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).` |
| router reach | 0 | `checked=7 hub(s), wrong-hub=0, outranked=0, no-reach=0, allowed=3, probe-error=0, operator-local=0`, `RESULT: PASSED` |
| Hermes --check | 0 | `PASS: 67 Hermes skill copies in sync` |
| sk-code-setup-check | 0 | `STATUS=OK legs=9` |
| skill-root metadata | 0 | `checked=14 passed=14 failed=0 fixed=0` |
| leaf-manifest freshness | 0 | `checked=14 fresh=14 failed=0` |
| router tests (the eight files phase 002 names) | 0 | `tests 40, pass 40, fail 0` |
| capture-scorer-eval-baseline.mjs (no `--write`) | 0 | full corpus 155/195, holdout 49/66, ambiguity 19/24 |
| validate.sh 072 --recursive --strict | 0 | `RESULT: PASSED` x 12, `Errors: 0 Warnings: 0` each |

Runner: `bash specs/sk-doc/072-skill-routing-and-clarity/003-routing-canon-and-tooling/scratch/gates.sh <log-dir>`, run from the repository root, writes one log per gate to a directory outside the repository and prints one `name|exit|last line` row per gate. Its gate set and commands are the ones this table lists. The raw logs were not kept in the repository; this table is the record.
