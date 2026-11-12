# Gate-critical suite run

Local census of every `.test.mjs` suite under `.skilled/skills/system-spec-kit/runtime`, run from the
repository root on 2026-11-12 with Node v26.13.0. Each suite ran on its own through
`node --test --test-reporter=tap`, and the counts below are the TAP summary lines `# pass` and `# fail`.

The split decides which suites can block a check: the 11 that pass locally run in the blocking
`gate-critical` job, and the 2 that fail locally stay in the report-only step and are excluded by name.

## Per-suite result

| Suite | Pass | Fail | Result |
|-------|------|------|--------|
| .skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-dsh.test.mjs | 3 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-dsh.test.mjs | 3 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs | 6 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-dsh.test.mjs | 5 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/cli/tests/unactioned-recorded-failure-audit.test.mjs | 1 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs | 53 | 3 | fail |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs | 17 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs | 2 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-claude.test.mjs | 13 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-codex.test.mjs | 15 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs | 57 | 50 | fail |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs | 17 | 0 | pass |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-prebind.test.mjs | 17 | 0 | pass |

## The split

Thirteen suites ran. Eleven passed and are the blocking job's path list.

Two failed on this machine and stay out of the blocking job:

- `hook-stdin-deadline.test.mjs`: 53 pass, 3 fail.
- `spec-gate-core.test.mjs`: 57 pass, 50 fail.

Both keep running in the report-only node test step, so their output stays readable while the job
stays green on them. The blocking job runs the other eleven in one `node --test` invocation; a
regression in any of those turns the job red.

## Census loop

The command that produced the table:

```bash
for f in $(rg --files .skilled/skills/system-spec-kit/runtime -g '*.test.mjs' | sort); do
  out=$(node --test --test-reporter=tap "$PWD/$f" 2>&1)
  p=$(printf '%s\n' "$out" | sed -nE 's/^# pass ([0-9]+)$/\1/p' | tail -1)
  fl=$(printf '%s\n' "$out" | sed -nE 's/^# fail ([0-9]+)$/\1/p' | tail -1)
  printf '%s pass=%s fail=%s\n' "$f" "${p:-?}" "${fl:-?}"
done
```

## Maintaining the list

The blocking job names its eleven suites explicitly, so a new gate-critical suite runs report-only
until it is added. Adding one means updating the job's path list and this record together, and
re-running the census first to confirm the suite passes locally.

> Correction after the build: `hook-stdin-deadline.test.mjs` and `spec-gate-core.test.mjs` failed only because the build ran with `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` set. With both unset they pass, 56 of 56 and 107 of 107 with 3 skipped. The blocking job therefore runs all 13 suites: 265 tests, 262 pass, 0 fail.
