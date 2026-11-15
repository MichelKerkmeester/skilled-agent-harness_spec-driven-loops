# Brief: 001-model-effort-atomic-replay (R1)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/`. Wave 1. Phases 002, 004 and 003 follow it on the same wrapper path.

spec.md metadata: Parent Spec `../spec.md`, Predecessor None (first child), Successor `../002-consume-locked-withdraw/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

A relaunch can start on the sender's new model with the first launch's effort. The wrapper takes the live model at `.skilled/bin/skilled-loop:789-800` and the live effort separately at `:814-823`; when the record has a live model but no live effort, `SKILLED_LOOP_EFFORT` keeps the launch value. So a Claude Code session launched `--model claude-sonnet-5-5 --effort low` and switched inside the session to Opus at medium can relaunch as Opus low. The arm path merges live settings key by key (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:806-816`, `armLocked` at `:790`), so an arm that brings a new model and no effort keeps an effort recorded for the old model. Effort flags per runtime: Claude `--effort`, Codex `-c model_reasoning_effort="X"`, Pi `--thinking` (`skilled-loop:189-200`, `:545-567`). Confirmed: `gpt-6-luna` returns HTTP 400 for effort `minimal` on Codex, so a stale effort can break a launch.

Claude's live values come from `readClaudeSettings` (`.skilled/hooks/session-relaunch/lib/context-usage.cjs:153-173`), which reads the last main-chain assistant entry. A `/model` or `/effort` switch with no assistant turn after it is invisible to that reader.

## The rule to implement

- Live model differs from the launch model: effort comes only from the same live entry. No live effort means the effort flag is dropped and the runtime default applies.
- Live model equals the launch model: the launch effort may stand when no live effort is present.
- At arm time, a new model without an effort clears the recorded effort.
- Model and effort only. The Pi and Hermes provider block at `skilled-loop:801-812` stays as it is.

## Scope for the builder

In: `.skilled/bin/skilled-loop` (live settings block ~785-830), `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (`armLocked` ~800-820), tests in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` and `relaunch-core.test.cjs`, README lines about replay (`.skilled/hooks/session-relaunch/README.md:37-45`).
Out: provider logic, the Cursor reader, manual command template (phase 003), consume (phase 002).

## Investigation item

Find whether Claude Code writes anything to its session JSONL when `/model` or `/effort` switches before the next assistant turn. Run a live session, switch, exit without a turn, and read the transcript tail. If an entry is written, extend `readClaudeSettings` to read it, with a test. If not, record the limit in the README and the implementation summary with the transcript lines read.

## Requirements

- REQ-001 When the consumed live model differs from the launch model, the relaunch effort is the live effort or none.
- REQ-002 When the live model equals the launch model and no live effort exists, the launch effort stands.
- REQ-003 An arm with a new model and no effort leaves the record with no `effort` field.
- REQ-004 Claude, Codex and Pi each render the chosen effort in their own flag, or none.
- REQ-005 The provider block is unchanged; existing provider tests pass unedited.
- REQ-006 The Claude `/model` and `/effort` logging question is answered with transcript evidence.

## Acceptance criteria

- AC-001 **Given** a Claude launch `--model claude-sonnet-5-5 --effort low` and a consumed record with model `claude-opus-5-5` and no effort, **When** the wrapper relaunches, **Then** the arguments carry the Opus model and no `--effort`. Verify: new test in `skilled-loop.test.cjs`, red before, green after.
- AC-002 **Given** the same launch and a record with model Opus and effort `medium`, **When** it relaunches, **Then** the arguments carry `--effort medium`; Codex gets `-c model_reasoning_effort="medium"` and Pi `--thinking medium` in the matching cases. Verify: table test across the three runtimes.
- AC-003 **Given** a record with live model equal to the launch model and no live effort, **When** it relaunches, **Then** the launch effort stands. Verify: test.
- AC-004 **Given** an armed record with model A and effort high, **When** `armLocked` runs with settings `{ model: B }`, **Then** the written record has model B and no effort. Verify: `relaunch-core.test.cjs` test.
- AC-005 **Given** a live Claude session launched through the wrapper as Sonnet low and switched to Opus medium, **When** it hops, **Then** the receiver process arguments show the Opus model and `--effort medium`. Verify: harness run, receiver args and `relaunch.log` hop line saved under `scratch/`. Codex (`gpt-6-luna`) and Pi (`openai/gpt-6-luna`) hops recorded the same way.
- AC-006 **Given** a `/model` or `/effort` switch with no later assistant turn, **When** the transcript tail is read, **Then** the finding (entry and reader change, or documented limit) is in the implementation summary. Verify: quoted transcript lines.

## Failing-first tests

- `skilled-loop.test.cjs`: "relaunch drops the launch effort when the live model changed without an effort", "relaunch takes effort from the live entry when the live model changed" (Claude, Codex, Pi rows), "relaunch keeps the launch effort when the live model is the launch model".
- `relaunch-core.test.cjs`: "arm with a new model and no effort clears the recorded effort".

## Live proof

Copy `specs/hooks/023-session-relaunch-loop/031-relaunch-model-and-effort/scratch/harness/run-claude-effort.sh` (and `run-codex-effort.sh`, `run-pi-effort.sh`) into this child's `scratch/harness/`. The Claude run switches to Opus medium inside the session before the prepare. Claude uses its own models; Codex and Pi use `gpt-6-luna`.

## Risks

- The Claude switch may not reach the transcript before exit, so the live proof may need a turn after the switch; the investigation item decides.
- Codex rejects some efforts per model; dropping the flag is the safe fallback.
- Phases 002 to 004 rebase on this change.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
