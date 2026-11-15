# Brief: 006-relaunch-coverage-gaps (R6)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/006-relaunch-coverage-gaps/`. Wave 3, after 002 is Complete (it tests the consume 002 rewrites and shares `session-relaunch-cli.test.cjs`).

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../005-persisted-hops-validation/spec.md`, Successor `../007-compaction-pointer-staleness/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

Four paths have no test (research §9 findings 6 to 9, §15):

1. OpenCode 2 `--server=URL`: the parser branch at `.skilled/bin/skilled-loop:573-578` and the warning at `:625-628` are covered only for `--server URL` (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1056-1064`).
2. A missing runtime binary: the launch at `skilled-loop:661-665` would exit 127; no test (`skilled-loop.test.cjs:1820-1882` cover other failures).
3. Two concurrent `claimHandoff` calls: the lock at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1065-1085` is tested only sequentially (`relaunch-core.test.cjs:278-304`).
4. A reused note while `SESSION_RELAUNCH_GOAL=0`: prepare keeps an existing `goal_packet` when the switch is off (README `.skilled/hooks/session-relaunch/README.md:164-174`), and consume checks the switch at consume time (`usableGoalPacket`, `bin/session-relaunch.cjs:376-381`, called at `:708`). So a note reused with the switch off at prepare and on at consume can hand on an old packet. Likely defect, not yet confirmed.

## Design

Tests only. If test 4 fails on current code, fix it so a packet written before a switch-off prepare is not handed on, and record the fix. If it passes, record that too.

## Scope for the builder

In: `skilled-loop.test.cjs`, `relaunch-core.test.cjs`, `session-relaunch-cli.test.cjs`; `bin/session-relaunch.cjs` (or the core helper if 004 moved it) only for the case 4 fix.
Out: everything else.

## Requirements

- REQ-001 A test covers OpenCode 2 `--server=http://localhost:4096`: warning printed, arguments passed through, no arm.
- REQ-002 A test covers a missing runtime binary: exit status 127.
- REQ-003 A test runs two concurrent claims on one open note: one wins, the other gets the `claimed` refusal.
- REQ-004 A test reuses a note holding a goal packet with `SESSION_RELAUNCH_GOAL=0` at prepare, covering switch still off and switch on at consume.
- REQ-005 Case 4 is fixed only if its test fails first.

## Acceptance criteria

- AC-001 **Given** `skilled-loop opencode --server=http://localhost:4096` on a stub OpenCode 2, **When** it starts, **Then** stderr has the shared-server warning, the stub sees the argument and no record arms. Verify: test.
- AC-002 **Given** a runtime absent from PATH, **When** the wrapper starts it, **Then** it exits 127. Verify: test.
- AC-003 **Given** two child processes claiming one open note at once, **When** both finish, **Then** exactly one returns the note and the other throws `cannot claim handoff with status claimed`. Verify: test with real processes.
- AC-004 **Given** a note with `goal_packet` reused while `SESSION_RELAUNCH_GOAL=0`, **When** consume runs with the switch off and again with it on, **Then** neither hands on the old packet. Verify: test; implementation summary says whether it failed first.

## Failing-first tests

- `skilled-loop.test.cjs`: "OpenCode 2 equals-form server warns and never arms", "missing runtime binary exits 127".
- `relaunch-core.test.cjs`: "two concurrent claims have one winner".
- `session-relaunch-cli.test.cjs`: "a reused note with the goal switch off hands on no packet".

## Live proof

None.

## Risks

- Phase 008 changes the claimed message; assert on the kept prefix only.
- The concurrency test must use separate processes to exercise the file lock.

## Docs to fill and the rules they follow

This child is Level 2. `create.sh` already scaffolded it; fill the scaffolded files in place, never recreate them:

- `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. Level 2 has no `checklist.md`; `acceptance-criteria.md` is the closure gate.
- Leave `implementation-summary.md` as scaffolded; the builder fills it. Do not edit `goal.md`, it is already written and checked. If what you write disagrees with it, keep your docs true to this brief and name the conflict in your report.

Template rules, all under `.skilled/skills/system-spec-kit/references/`:

- `validation/template-compliance-contract.md` §4 (Level 2 anchors and H2 headers for each doc, in order), §7 (content minimums: spec.md at least 7 H2 sections, at least 5 `REQ-` lines and at least 4 `**Given**` scenarios; plan.md at least 6 H2 sections) and §8.5 (ask the contract engine with `node template-structure.js compare 2 spec.md <abs-path>` from `runtime/cli/utils` instead of guessing).
- `templates/template-style-guide.md` and `templates/level-specifications.md` for Level 2 content.
- `workflows/spec-folder-authoring-checklist.md` §2 to §4.
- `structure/phase-definitions.md` §3, child back-reference: the spec.md metadata table names `../spec.md` as Parent Spec and the Predecessor and Successor given below.
- Keep every scaffolded `SPECKIT_TEMPLATE_SOURCE` and `SPECKIT_LEVEL` marker and every anchor pair. Replace every bracketed placeholder. Set `**Status**` to `Draft`.
- Prose follows `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`. No em dashes anywhere.
- Copy the requirements and acceptance criteria below into spec.md §4 and §5 and into acceptance-criteria.md, each AC as a row with its verification and an empty evidence cell.
- Tasks in tasks.md put the failing-first test before the code change, then the test run, then any live proof, then doc updates.
- Docs may name spec and phase ids. Any code comment the plan describes must carry none: comments keep the durable why only.

## Write scope for you, the writer

Only the four docs above, inside this child folder. No code, no test files, no commits, no pushes. Other sessions share this checkout.

## Test commands (baseline before, rerun after, in the plan's testing section)

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```

## Validate (must print `RESULT: PASSED`)

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/006-relaunch-coverage-gaps --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
