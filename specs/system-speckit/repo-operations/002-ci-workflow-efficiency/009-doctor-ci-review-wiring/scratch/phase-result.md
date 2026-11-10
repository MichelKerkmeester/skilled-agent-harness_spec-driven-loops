# Phase result (recorded 2026-10-25)

D9: write

The operator ruled "Drop R30, keep the hub." on 2026-10-25 and ADR-013 records it. The CI surface value is superseded, no sk-code file changes, and T018 to T025 are closed as superseded. Every gate below was run from the repository root, and the code gates ran between 09:52 and 09:57 UTC.

## Gates

| Command | Exit | Last or key output line |
|---------|------|-------------------------|
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 0 | `[run-all] 7 suite(s) passed, 0 failed`, with node:test `tests 458`, `pass 458`, `fail 0` |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` | 0 | `tests 27`, `pass 27`, `fail 0`, the same as the baseline in `pre-phase.md` |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | 0 | `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)` |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | 0 | `OK: route-validate` line ending `17 routes validated, 2 warnings` |
| `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` | 0 | `"status": "fresh"` with `"changed": []` |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | 0 | `STATUS=OK phrases=109 bridges=21` |
| `node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | 0 | `tests 14`, `pass 14`, `fail 0` |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` | 0 | `tests 12`, `pass 12`, `fail 0` |
| `node .skilled/skills/sk-git/scripts/validate-message.mjs --commit scratch/commit-message-closure.txt` | 0 | no output, and a message with a forbidden attribution line exits 1 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase> --strict --no-recursive` | 0 | `Summary: Errors: 0  Warnings: 0` then `RESULT: PASSED` |

`git status --porcelain` lists this phase's eight packet docs and its `scratch/` files. It also lists changes this phase did not make: the doctor assets and `ci.md` under `.skilled/commands/doctor/`, the `sk-code-ci` packet docs and `specs/sk-code/014-code-modes-research/`. They appeared while the closure pass ran, they are uncommitted and another process owns them.

## Live report

Command: `node .skilled/commands/doctor/scripts/ci-report.cjs --json` (exit 0, read-only `gh` calls only).

workflows: 32
newest non-rebuild SHA: bce45aa297aac14f6b0e92f85126c57dc53c4ba2
switch set: ['on'], errors: none, reason `no rebuild commit above it`

The glob `ls .github/workflows/*.yml | wc -l` prints `32`. The last non-empty message line of the resolved commit is `Commit-Id: 0012178`, not `Trigger-Index-Rebuild: ci`. The first run in `live-report.md` resolved `4e0b8560cb`, and the resolved commit moved because `main` gained commits between the two runs (INFERRED from both being ancestors of `origin/main`).

## R28 probe and D9

`r28-probe.md` holds 4 exit lines (set 0, get 0, delete 0 and get-after-delete 1) and `gh variable list --json name,value` printed `[]`. The answer is `D9: write`.

## Compiled route

`node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this github actions workflow diff"` returns `sk-code-review` then `sk-code-ci` with `selectionKind` `surfaceBundle`. The bundle comes from request vocabulary and not from surface detection.

## No ephemeral id in code

Command: `git show --format= <sha> -- .skilled .github` for `10c6791341`, `e0f922b593` and `4e0b8560cb`, piped to `grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]'`. The combined diff `cfd9285e32..4e0b8560cb`, the three commit messages and the mirror files of the first commit gave the same result, and a seeded control line matched.

ephemeral-id hits: 0
