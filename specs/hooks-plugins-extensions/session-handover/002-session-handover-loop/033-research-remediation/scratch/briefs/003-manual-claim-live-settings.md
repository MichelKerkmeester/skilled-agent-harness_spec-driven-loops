# Brief: 003-manual-claim-live-settings (R3)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/003-manual-claim-live-settings/`. Wave 4, after 004 is Complete; it is built last of the wrapper phases.

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../002-consume-locked-withdraw/spec.md`, Successor `../004-manual-claim-goal-binding/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

The printed manual claim command replays a template built once, before the loop starts: `SKILLED_LOOP_MANUAL_TEMPLATE=$(build_manual_command_template)` at `.skilled/bin/skilled-loop:637`, built from the first launch arguments (`build_manual_command_template` at `:402-420`, printed by `print_manual_command` at `:42-70`). A manual claim therefore starts on the first launch's model and effort even when the consumed record holds the sender's live ones. Cursor never arms (`.skilled/hooks/session-relaunch/README.md:193`), so its live reader `cursorSelectedModel` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:585-603`) only helps if the manual command uses the record's values.

## Design

When the wrapper prints a manual command after a consume, it rebuilds the template from the consumed live model and effort, applying the same validity checks and the same effort rule phase 001 set (effort from the live entry when the live model differs; none if absent). With no live values the template is the one built at `:637`. The template conflict check (`find_manual_template_conflict`) runs on the rebuilt template too.

## Scope for the builder

In: `.skilled/bin/skilled-loop` (template build and each `print_manual_command` call after `consume_record`), tests in `skilled-loop.test.cjs` and, for Cursor, `session-relaunch-cli.test.cjs` (~2368-2419 covers the Cursor reader).
Out: the reader itself, the relaunch argument path (phase 001), goal export (phase 004).

## Requirements

- REQ-001 A manual command printed after consume carries the consumed live model when it passes `model_is_valid`.
- REQ-002 It carries the effort chosen by the phase 001 rule, in the runtime's own flag.
- REQ-003 With no live values it prints exactly what it prints today.
- REQ-004 A Cursor record's live model from `cursorSelectedModel` reaches the printed command.
- REQ-005 The template conflict warning still fires for a carried value that holds the placeholder.

## Acceptance criteria

- AC-001 **Given** a Claude launch on Sonnet low and a consumed record with Opus medium on a declined hop, **When** the manual command prints, **Then** it holds the Opus model and `--effort medium` and not Sonnet. Verify: `skilled-loop.test.cjs`, red before.
- AC-002 **Given** a Cursor run whose record holds a live model, **When** the manual command prints, **Then** it holds `--model <that model>`. Verify: test.
- AC-003 **Given** a record with no live values, **When** the manual command prints, **Then** it equals the pre-change output. Verify: existing manual command tests pass unedited.
- AC-004 **Given** a live model that fails the model check, **When** the command prints, **Then** it keeps the launch model. Verify: test.

## Failing-first tests

- `skilled-loop.test.cjs`: "manual command carries the live model and effort", "manual command keeps the launch model for an invalid live model", "Cursor manual command carries the live Cursor model".

## Live proof

None required.

## Risks

- The template is exported for the CLI's own printing; rebuild only for the wrapper's post-consume prints.
- Shell quoting of the rebuilt arguments must use the existing `shell_quote_argument`.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/003-manual-claim-live-settings --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
