# Brief: 002-consume-locked-withdraw (R2)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw/`. Wave 2, after 001 is Complete. Phases 004 and 006 follow it.

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../001-model-effort-atomic-replay/spec.md`, Successor `../003-manual-claim-live-settings/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

`consume` reads the relaunch record outside its lock (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:692`, `core.readRelaunchFile(loopId)`) and unlinks it later under `core.withAppendLock` (`:715-722`) without rechecking its status. A withdraw rewrites the record under that lock to `status: 'disarmed'` with a reason in `WITHDRAWN_DISARM_REASONS` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1021-1026`). The wrapper asks `should-relaunch` and then consumes in a separate call (`.skilled/bin/skilled-loop:667-729`, `consume_record` at `:72-79`), so a withdraw landing between approval and consume is lost and the hop goes ahead. The window is narrow: a hook firing as the runtime dies or an operator `cancel` from another shell (research §9a). The decline path for a withdrawn record already exists at `skilled-loop:859-870`.

## Design

Inside one `withAppendLock` call, consume reads the record, notes whether it is a withdrawn record, and unlinks it. Its JSON gains `withdrawn: true` only for a withdrawn record. An always-present field would break the exact-shape tests in `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` (~1685, 1706, 1946, 2445, 2507). The wrapper reads the field after `consume_record` on the approved path; when true it prints the existing withdrawn warning and exits with `runtime_exit`, starting no relaunch.

## Scope for the builder

In: `bin/session-relaunch.cjs` consume (~689-730), `.skilled/bin/skilled-loop` (~667-729 approved path and a reader helper beside `consumed_note_state` at `:93`), tests in `session-relaunch-cli.test.cjs`, `skilled-loop.test.cjs`, `withdraw.test.cjs`.
Out: `shouldRelaunch`, the withdraw writer, the goal-switch question (phase 006).

## Requirements

- REQ-001 consume reads, checks and unlinks the record inside one lock.
- REQ-002 consume adds `withdrawn: true` only when the record it read is a withdrawn record.
- REQ-003 Output for every other record is byte-identical to today.
- REQ-004 The wrapper treats `withdrawn: true` on the approved path as a decline: withdrawn warning, no relaunch, the runtime's exit code.
- REQ-005 No hop line is written for a withdrawn decline.

## Acceptance criteria

- AC-001 **Given** a record disarmed with a withdrawn reason, **When** `consume` runs, **Then** its JSON holds `withdrawn: true` and the record file is gone. Verify: CLI test, red before.
- AC-002 **Given** an armed record, **When** consume runs, **Then** the output has no `withdrawn` key and the exact-shape tests pass with unedited expectations. Verify: `session-relaunch-cli.test.cjs`.
- AC-003 **Given** the wrapper got `relaunch: true` and the record is withdrawn before consume (test barrier or stub), **When** the wrapper continues, **Then** it prints the withdrawn warning, starts no second runtime and exits with the runtime's code. Verify: `skilled-loop.test.cjs`.
- AC-004 **Given** that withdrawn decline, **When** the hop history is read, **Then** it holds no `handed-over` line. Verify: test on the history file.

## Failing-first tests

- `session-relaunch-cli.test.cjs`: "consume reports withdrawn for a record withdrawn before it", "consume output has no withdrawn key for an armed record".
- `skilled-loop.test.cjs`: "a withdraw between approval and consume declines with the runtime exit code".

## Live proof

None required; the interleaving is deterministic in tests.

## Risks

- A lock held across a slow note read; keep the note parsing outside the lock or bounded.
- The wrapper's approved path is long; place the check right after `consume_record` and before `consumed_note_state` use.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
