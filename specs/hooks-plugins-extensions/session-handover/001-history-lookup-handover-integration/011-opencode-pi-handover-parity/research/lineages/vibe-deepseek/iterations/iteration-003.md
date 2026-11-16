# Iteration 3: Model and reasoning effort carry on relaunch

## Focus

Whether the sender's model and reasoning effort reach the receiver on each runtime, because decision D2 requires receivers to run on DeepSeek V4.1 Flash at max thinking. A hop that silently drops the model turns a parity test into a test of whatever the runtime defaults to, and a hop that drops the effort turns a max-thinking receiver into a default-thinking one.

## Actions Taken

1. Read `resolveSessionSettings` in `lib/relaunch-core.cjs`, the CLI-side reader of the sender's live settings.
2. Read the Pi extension's `liveSettings`, which reads the host's model, provider and thinking level.
3. Read the OpenCode plugin for any model or effort read.
4. Read the wrapper's `effort_is_valid`, `append_effort_arguments`, `apply_consumed_live_settings` and `build_relaunch_arguments`.
5. Read both live scorecards' `carry` blocks.

## Findings

1. `resolveSessionSettings` has branches for `claude`, `codex` and `cursor` only. Every other runtime, including `pi` and `opencode`, falls to `return none`, so the CLI-side prepare record carries no model and no effort for them. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1121]

2. Pi closes that gap from its own extension: `liveSettings` reads `ctx.model.id`, `ctx.model.provider` and `pi.getThinkingLevel()`, and the arm path writes them onto the record. Pi therefore carries model, provider and effort. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:461]

3. The OpenCode plugin never reads a model or an effort. Its only model access is `input?.model?.limit?.context`, which sizes the context window; nothing is written to the record. [SOURCE: .opencode/plugins/session-handover.js:575]

4. `effort_is_valid` has no `opencode:` case, so an OpenCode effort would be rejected even if one were recorded. [SOURCE: .skilled/bin/skilled-loop:216]

5. `append_effort_arguments` has cases for `claude`, `codex` and `pi` only, so no OpenCode relaunch ever receives a thinking level. [SOURCE: .skilled/bin/skilled-loop:405]

6. `build_relaunch_arguments` drops the model on OpenCode 2 by design: the comment records that OpenCode 2's root command has no model flag and a replayed `-m` would end the launch with a usage error, so `-m` is appended only on OpenCode 1. [SOURCE: .skilled/bin/skilled-loop:775]

7. Pi's relaunch appends `--provider`, `--model`, `--thinking` and the plan or build mode, so a Pi hop replays all three carried values. [SOURCE: .skilled/bin/skilled-loop:753]

8. Neither live run proved the carry: the Pi scorecard records `model: unobservable, effort: unobservable` and the OpenCode scorecard records `model: not-set, effort: not-set`. The OpenCode run passed 5/5 because the harness launched both sessions on the same default, not because the model carried. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/scorecard.json]

9. `live_model_voids_launch_effort` deliberately drops the launch effort when the live model differs and brings no usable effort of its own, because some models reject an effort chosen for another. That rule is correct and is not the OpenCode gap. [SOURCE: .skilled/bin/skilled-loop:312]

## Ruled Out

- "The OpenCode model carries because the plugin reads `input.model`." It reads only `limit.context`, a number, and writes nothing to the record.
- "The Pi carry is broken because `resolveSessionSettings` has no Pi branch." The Pi extension supplies the values itself, so the missing branch is harmless on Pi.

## Dead Ends

- Looking for a `--thinking` flag on OpenCode's CLI. The wrapper's own comment states OpenCode 2 has no model flag on its root command, so there is no flag to append; the fix has to be a config write or a per-session setting, not a launch argument.

## Edge Cases

- Ambiguous input: "model and effort carry" could mean the record carries them or the relaunch replays them. Both were traced; they fail at different points on OpenCode.
- Contradictory evidence: none.
- Missing dependencies: the Pi scorecard's `relaunchArgs` is null, so the Pi relaunch line could not be read from the run; the wrapper's argument builder is the evidence instead.
- Partial success: the carry is proven by code path, not by an observed relaunch line on either runtime.

## Sources Consulted

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1121`
- `.skilled/hooks/session-handover/pi/session-handover.ts:461`
- `.opencode/plugins/session-handover.js:575`
- `.skilled/bin/skilled-loop:216`
- `.skilled/bin/skilled-loop:312`
- `.skilled/bin/skilled-loop:405`
- `.skilled/bin/skilled-loop:753`
- `.skilled/bin/skilled-loop:775`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/scorecard.json`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/scorecard.json`

## Assessment

- New information ratio: 0.85
- Questions addressed: model and effort carry on relaunch
- Questions answered: Does model and reasoning effort carry across the relaunch on each runtime, and what breaks when it does not?

## Reflection

- What worked and why: tracing the value from three places at once — the record writer, the record reader and the argument builder — showed that Pi and OpenCode fail at different stages. Pi's writer is the extension and its reader is the wrapper; OpenCode has neither.
- What did not work and why: expecting one shared reader to cover every runtime. `resolveSessionSettings` is a per-runtime switch, so a runtime added later silently gets nothing.
- What I would do differently: read the wrapper's `build_relaunch_arguments` first, because it names which runtimes can replay a model at all and would have narrowed the search immediately.

## Recommended Next Focus

The remaining known limits: `AI_SESSION_CHILD` leaking into test sandboxes and the double nudge from two hooks.

## Fixes Named

- Give the OpenCode plugin a `liveSettings` equivalent that reads the session's model and effort and writes them onto the prepare record, mirroring the Pi extension. [SOURCE: .opencode/plugins/session-handover.js:575]
- Add an `opencode:` case to `effort_is_valid` and an `opencode)` case to `append_effort_arguments` so a recorded effort can be replayed in whatever form OpenCode 2 accepts. [SOURCE: .skilled/bin/skilled-loop:216]
- Make the scorecard's `carry` block observable on both runtimes by recording the relaunch line, so a future run proves the carry instead of reporting `unobservable`. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/scorecard.json]
