# Brief: 009-pi-arm-on-agent-settled (B4)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/009-pi-arm-on-agent-settled/`. Wave 1, independent.

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../008-claim-error-per-state/spec.md`, Successor None (last child). The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

The Pi extension arms the prepared record on `agent_end` (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts:526`) and withdraws an arm on `agent_start` (`:561`). The live Pi is 1.4.0 (`~/.pi/agent/install/current-version`). In 1.4.0 a continuation (auto-retry, compaction, queued follow-up) emits a fresh `agent_start` after `agent_end`, which can withdraw a record armed a moment before. Pi 1.4.0 emits `agent_settled` to extensions only when no such continuation will run (`~/.pi/agent/install/releases/1.4.0/node_modules/@earendil-works/pi-coding-agent/dist/core/agent-session.js:689`; type at `dist/core/extensions/types.d.ts:802`, `on("agent_settled")` at `:1211`). Research §11a lesson 4.

## Design

Move the arm (and the killer restart for an unowned armed record) from `agent_end` to `agent_settled`. Decide from the Pi 1.4.0 source whether the held nudge stays on `agent_end` (README `.skilled/hooks/session-relaunch/README.md:126`) and record the decision with its source line. About ten tests in `pi/session-relaunch.test.ts` (~364-625) drive `agent_end` and change. README lines ~126, ~138 and ~223 name `agent_end` as Pi's arm event.

## Scope for the builder

In: `pi/session-relaunch.ts`, `pi/session-relaunch.test.ts`, README lines ~126, 138, 223, and the mirror `.pi/extensions/session-relaunch.ts` if it is a copy rather than a link (check before editing).
Out: other runtimes, the withdraw helper.

## Requirements

- REQ-001 The extension arms on `agent_settled`, not `agent_end`.
- REQ-002 The killer-restart path for an unowned armed record runs on `agent_settled`.
- REQ-003 A continuation `agent_start` between `agent_end` and `agent_settled` leaves the record armed once settled.
- REQ-004 The held nudge event is decided from the Pi 1.4.0 source and recorded.
- REQ-005 README names `agent_settled` as Pi's arm event.

## Acceptance criteria

- AC-001 **Given** a pending record, **When** the test fires `agent_end` alone, **Then** the record stays pending; **When** it fires `agent_settled`, **Then** it is armed. Verify: Pi test, red before.
- AC-002 **Given** `agent_end`, a continuation `agent_start`, `agent_end`, `agent_settled`, **When** run, **Then** the record ends armed, not disarmed. Verify: Pi test.
- AC-003 **Given** the full suite, **When** `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` runs, **Then** it exits 0. Verify: output.
- AC-004 **Given** the README, **When** searched for Pi's arm event, **Then** it names `agent_settled` and no line names `agent_end` as the arm. Verify: grep.
- AC-005 **Given** a live Pi 1.4.0 session through `skilled-loop` with `openai/gpt-6-luna`, **When** it hops, **Then** `relaunch.log` holds the hop line. Verify: saved log under `scratch/`, harness from `031-relaunch-model-and-effort/scratch/harness/run-pi-effort.sh`.

## Failing-first tests

- `pi/session-relaunch.test.ts`: "arms on agent_settled and not on agent_end", "a continuation before agent_settled leaves the record armed".

## Live proof

One Pi hop as AC-005 says. `PI_BLACKHOLE_PASSIVE=true` as the 031 harness sets it.

## Risks

- A Pi older than the event would never arm; the extension may need a fallback, decided from the installed version only.
- `agent_settled` carries `aborted`; an aborted run should not arm. Confirm from the type.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/009-pi-arm-on-agent-settled --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
