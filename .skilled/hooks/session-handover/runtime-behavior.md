---
title: "Session Handover Runtime Behavior"
description: "Per-runtime adapter matrix, model and effort carry, Codex triggers, command-only runtimes, limits and the shell shim that starts a runtime under the loop."
trigger_phrases:
  - "session handover runtime matrix"
  - "model and effort across a hop"
  - "codex session handover hooks"
  - "command-only handoff cursor devin"
  - "skilled-loop shell shim"
importance_tier: "normal"
contextType: "reference"
---

# Session Handover Runtime Behavior

## 1. OVERVIEW

This document covers how each runtime adapter starts a handover. It lists the seed syntax, the model carry and the mirror form. It covers the Codex triggers, the command-only runtimes and the runtime limits. It ends with the shell shim that starts a runtime under the loop.

---

## 2. RUNTIME ADAPTER MATRIX

| Runtime | Trigger | Relaunch seed syntax | Model carry | Mirror form | Verdict |
|---|---|---|---|---|---|
| Claude | automatic | `claude [--model <model>] "<seed>" [--name <name>]` | `--model`, `--model=` | [.claude/settings.json](../../../.claude/settings.json) hook entries | AUTO |
| Pi | automatic | `pi [--provider <p>] [--model <model>] [-ne] [-e <path>] [--name <name>] "<seed>"` | `--model`, `--provider`, extension flags | `.pi/extensions/` one-line entry file that re-exports `pi/session-handover.ts` | AUTO |
| OpenCode | automatic | `opencode [-m <model>] --prompt "<seed>"`, and on OpenCode 2 `opencode --standalone --prompt "<seed>"` | `-m`, `--model`, `--model=` on OpenCode 1 only | `.opencode/plugins/` plugin plus `opencode/` browsability symlink | AUTO |
| Codex | automatic | `codex --no-daemon [-m <model>] "<seed>"` | `-m`, `--model`, `--model=` | [.codex/hooks.json](../../../.codex/hooks.json) hook entries plus `.codex/hooks/` symlinks | AUTO |
| Cursor | `/speckit-handoff` | `cursor-agent [--model <model>] "<seed>"` | `--model`, `--model=` | [.cursor/commands/speckit-handoff.md](../../../.cursor/commands/speckit-handoff.md) symlink | COMMAND-ONLY |
| Devin | `/speckit:handoff` | `devin [--model <model>] -- "<seed>"` | `--model`, `--model=` | none, [.devin/SYNC.md](../../../.devin/SYNC.md) carries no command surface | COMMAND-ONLY |
| Vibe | automatic from a context nudge, and under `skilled-loop` a typed `/speckit-handoff` arms too | `vibe "<seed>"` | none, because `--model` is headless-only | [.vibe/hooks.toml](../../../.vibe/hooks.toml) entries for `turn-start`, `turn-end` and `compaction-post-tool`, plus [.vibe/prompts/speckit-handoff.md](../../../.vibe/prompts/speckit-handoff.md) for the manual start | AUTO |

The OpenCode 2 root command has no model flag. So `-m`, `--model` and `--model=` apply on OpenCode 1 only.

On Vibe under `skilled-loop`, a typed `/speckit-handoff` arms, because the session reads its id from the `session-id` command. Outside the loop it prepares a manual start with a `uuidgen` id. That id is never armed, so the route prints the claim command.

`skilled-loop` exports `SKILLED_LOOP_RUNTIME` with the selected runtime. It carries the first launch's model for every runtime except Vibe, whose `--model` is headless-only, and OpenCode 2, whose root command has no model flag. Pi also carries its provider. Claude and Pi carry their name. Pi carries its extension flags. Relative Pi extension paths resolve against the wrapper's starting directory.

`prepare` and `claim` require `--session <id>`. Claude can omit it and use `CLAUDE_CODE_SESSION_ID`. Vibe under `skilled-loop` can omit it too.

Vibe gives its tools no session id, so the turn-start hook records the id it sees for the loop, and `session-id --runtime vibe` prints it. Other runtimes pass the id directly. Runtimes with no session-id variable, such as Devin, Cursor or Vibe outside the loop, run `uuidgen` once and reuse the value. `CLAUDE_PID` supplies Claude's process id for the shell-child check, and Stop keeps it as the killer target while it descends from the loop. `complete` requires only the note path.

---

## 3. MODEL AND EFFORT ACROSS A HOP

A relaunched session starts on the model and effort the sender was using, where the runtime can be told them at launch. The wrapper replays the first launch's model and effort flags on every relaunch, in each runtime's own syntax.

At `prepare` the CLI also reads the sender's latest values from its own session log on Claude and Codex and from the CLI config on Cursor. The Pi extension adds them when it arms. All of them keep the values on the relaunch record, never in the note.

`consume` hands them to the wrapper, and a value read from the log beats the launch flag for that hop. The value that was used then carries to later hops that record none.

Model and effort move as one set, because an effort is chosen for one model and another model may reject it. When the hop's model differs from the launch model and the record carries no usable effort, the wrapper drops the launch effort. The receiver then starts on the runtime's default effort.

An arm that records a new model without an effort removes the effort the record held. A launch with no model flag has no model to compare, so its effort stands. A live model equal to the launch model keeps the launch effort too.

- **Claude:** model from `--model`, effort from `--effort` (`low`, `medium`, `high`, `xhigh`, `max`). The session log's last main-chain assistant entry supplies `requestedModel` or the response model, plus `effort`. A `/model` or `/effort` switch is written to the log as soon as it is confirmed. It lands as a local command entry and its stdout. A switch confirmed after that assistant entry wins for its field, so it reaches the relaunch without another turn. `/effort` takes the level from its `Set effort level to <level>` line. `/model` takes the id typed after it, and the picker leaves that empty. The picker confirms with a display name such as `Opus 5.5`, which proves a switch but not an id. The model then reads as unproven and the launch model stands. A new model drops the old turn's effort, while an `/effort` switch of its own still counts. A cancelled command changes nothing.
- **Codex:** model from `-m`, effort from `-c model_reasoning_effort=<level>` or `--config`. The wrapper replays it as `-c model_reasoning_effort="<level>"`. The rollout's last `turn_context` supplies `model` and `effort`.
- **Pi:** model and provider as before, effort from `--thinking` (`off` up to `max`). A `:<thinking>` suffix on the model travels inside the model. The extension hands the session's current model, provider and thinking level to the record when it arms it. The provider is used only together with a live model the wrapper accepted. A launch `--model openai/gpt-6-luna` and a recorded `openai` plus `gpt-6-luna` are the same model, so that hop keeps the launch thinking level when the record has none. A recorded provider that differs from the launch provider counts as a model switch. That covers `--provider X` and the `X/model` form. Such a hop drops the launch thinking level when the record has none. A launch that names no provider has nothing to compare, so a provider change on the same model keeps the launch thinking level. When the plan-build extension is loaded, the sender's Plan or Build mode is replayed too. The hop starts with `--plan` or `--build` for the mode the sender was last in, in place of the launch flag.
- **Cursor:** the model, with any bracketed `effort=` inside it. At `prepare` the CLI reads the current `model` from `~/.cursor/cli-config.json`. When `selectedModel` names the same model, its parameters are added as `<modelId>[<id>=<value>,...]`. Cursor rewrites `model` on every switch but `selectedModel` only for a parameterized choice, so a `selectedModel` naming another model is stale and is ignored. The file is shared by every Cursor session. So the CLI uses it only when it changed after the wrapper launched this hop. The wrapper records that moment as `SKILLED_LOOP_LAUNCHED_AT`. An older file may hold another session's choice, and the auto model has no id to pass, so in either case the launch flag stands.
- **Devin:** the model only, because it has no effort flag. It reads no live value.
- **OpenCode 2:** nothing, because its root command takes no model or effort flag. The receiver starts on the configured default.

The Claude Stop adapter stamps a non-empty `payload.permission_mode` on the armed record as `permissionMode`, and `consume` prints it. A Claude hop and the manual claim command carry a usable live mode as `--permission-mode`. A launch `--permission-mode` is captured into `SKILLED_LOOP_PERMISSION_MODE`, so a hop with no usable live mode keeps the launch value.

On a hop, a live `plan` mode keeps the launch mode and prints `note: the sender was in plan mode, the receiver starts in the launch mode` on stderr. A live `bypassPermissions` is replayed only when the launch line already carried `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions`. The wrapper never adds either flag of its own.

On a hop, any other live mode the wrapper cannot replay keeps the launch mode with a `warning:` line on stderr. Codex, Pi, OpenCode, Cursor and Devin record no permission mode, so a live permission mode never reaches their sessions.

Claude and Pi carry the session name across a hop. On Claude, `prepare` records the last `custom-title` entry's `customTitle` from the session log as `name` ahead of `SKILLED_LOOP_NAME`, so a `/rename` reaches the receiver. A session with no rename and no launch name records the last `ai-title` entry's `aiTitle`, the title Claude generated. The receiver keeps that title with a number and is not given a new one.

Pi carries the name from its launch line. The wrapper strips the number it wrote for the sender, exports the stem and relaunches with `--name` set to the stem plus the next number. So the first receiver is `<stem> (2)` and every later receiver counts up without the suffixes stacking.

On a hop, a record name that starts with `-` or holds a control character is ignored with a `warning:` line on stderr and the launch name stands. A manual claim prints the stem with no number.

A level outside the runtime's list is dropped with a `warning:` line on stderr. A logged model that does not look like a model id is ignored the same way. So a bad value never stops a relaunch.

---

## 4. AUTOMATIC TRIGGERS ON CODEX

Codex binds four repo hooks rendered from `hook-registry.json` into [.codex/hooks.json](../../../.codex/hooks.json). `handover-prompt-seed.mjs` binds `UserPromptSubmit`. A `[session-handover]` prompt receives the claim-seed instructions. A non-seed prompt first withdraws a record this session armed or a failed Stop deferred, then runs the same threshold check as `handover-context-nudge.mjs`, which binds `PostToolUse`.

The Codex prompt payload carries only the prompt text, so any prompt other than a seed counts as the operator's. The Codex hook installer allows each script under one event only, so seed detection and the mid-session nudge are separate entry points over `shared.mjs`.

The fill comes from the transcript rollout's latest `token_count` event. `last_token_usage.input_tokens` is the numerator and `cached_input_tokens` stays out because it is already inside that count. The window is `SESSION_HANDOVER_WINDOW_TOKENS`, then the event's `model_context_window`. The nudge reaches the model as `hookSpecificOutput.additionalContext`, the envelope the repo's other Codex adapters emit.

`handover-stop-arm.mjs` accepts only payloads whose `hook_event_name` is `Stop`. It resolves the target, arms a matching pending record, then spawns the killer with `--transcript <transcript_path>`. A spawn failure leaves the record armed until the next Stop restarts its killer.

A Stop that cannot arm stamps `deferredAt` on the pending record. It cannot arm when it carried no transcript path, found no session process below the loop or the arm threw. It then prints one `systemMessage` that names the cause and ends with `Your next prompt withdraws the hand-over, and a later nudge asks for a new one.` `handover-compact-pointer.mjs` binds `SessionStart` and acts only on `source: compact`.

Codex exports no pid variable, so the killer target resolves through the same ancestor rule the CLI's running-work check uses. `skilled-loop codex` always starts Codex with `--no-daemon` because its shared app-server daemon keeps the environment of the session that started it. In a git worktree, Codex reads its `hooks.json` from the main checkout, not the worktree. The automatic hop needs the session-handover rows in the main checkout's file.

Each of those four rows, like the session-handover rows in the Claude settings file, carries the repo's hook-drift fallback. A missing adapter prints a `mk-hook-drift host=<host> event=<event> adapter=<script>` line on stderr and still returns an envelope the host accepts. Claude's fallback adds `mkHookDrift: true`. Codex omits that key, because it rejects unknown keys. It answers its Stop event with `systemMessage` instead of `hookSpecificOutput`, because it rejects that envelope on Stop.

---

## 5. COMMAND-ONLY RUNTIMES: CURSOR AND DEVIN

Cursor ships on the command trigger for two reasons. Its evidence is source-only: the bundle's hook dispatch code is inspected, but no live payload is captured, because no Cursor credentials or permitted provider are available for a live run. The second reason is that `stop` is not wired in this repository's [.cursor/hooks.json](../../../.cursor/hooks.json), whose registered event list has no `stop`.

Devin ships on the command trigger because its hook usage is unverified. The only probe summarizes field names without a raw payload, and `SessionEnd` behavior is unknown, so an automatic arm cannot be proven.

Start a handoff by running `/speckit:handoff` inside the session. It writes the note and runs `prepare`. Outside `skilled-loop`, prepare prints the manual claim command and exits 3. That line starts the hop by hand. While the concern is off, prepare refuses in both places. Outside the loop a session runs this command only when the operator asks for a manual handoff. Otherwise it keeps working.

The printed command uses the selected runtime's seed form. Claude, Pi, Codex and Cursor use the seed as a positional argument, OpenCode adds `--prompt`, and Devin adds `--` before the seed. `!` in a handoff path sits in single quotes outside the seed's double quotes. For example, the CLI and wrapper print `...handoff /tmp/han"'!'"doff.md`, which interactive Bash preserves when history expansion is on.

Cursor names a project command after its file, so in Cursor the command is `/speckit-handoff`. It is reached through [.cursor/commands/speckit-handoff.md](../../../.cursor/commands/speckit-handoff.md), a symlink to the canonical file. Devin has no command surface, so a Devin session reads [.skilled/commands/speckit/handoff.md](../../commands/speckit/handoff.md) directly and follows it.

Under `skilled-loop`, a record prepared on a command-only runtime stays pending because no arm event exists for it. So the hop runs by launching the wrapper with the claim seed. On Cursor and Devin a successful prepare says the handoff is prepared and nothing ends this session. It tells the session to exit and run the claim command the wrapper prints.

---

## 6. RUNTIME BEHAVIOR AND LIMITS

`SESSION_HANDOVER_THRESHOLD` controls when each session is nudged. Keep the threshold well above a fresh session's startup fill plus its remaining work. Codex live runs at `0.12` chained hop after hop because each new session reached about 10% on startup alone. `SESSION_HANDOVER_MAX_HOPS` caps completed relaunches and stops the chain once that limit is reached.

This repository's Pi setup needs `-ne -e` and the [.pi/extensions/session-handover.ts](../../../.pi/extensions/session-handover.ts) extension. Two installed Pi extensions both register `--fast`, so the default startup conflicts. The wrapper carries the selected extension flags across hops.

In the recorded live runs, OpenCode reported about 1M context tokens for `openai/gpt-6-luna`. Pi reported 272K for the same model. The live handoff results and operator inputs are in the [Pi and OpenCode playbook](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-pi-opencode.md).

---

## 7. LAUNCHING A RUNTIME UNDER THE LOOP

The shim defines `claude`, `pi`, `opencode`, `codex`, `devin`, `cursor-agent` and `skilled-loop` as shell functions. The `skilled-loop` function runs the wrapper from the checkout that owns the sourced shim, so a pasted manual claim works from any directory and without the terminal check. Typing `claude` in a terminal then runs `bash <repo>/.skilled/bin/skilled-loop claude`, and `cursor-agent` runs the wrapper's `cursor` arm. A function hands the launch to the wrapper only when all of these hold:

- `SKILLED_LOOP_ID` is unset, so no loop is running yet.
- Standard input and standard output are both a terminal.
- The arguments open an interactive session. Subcommands such as `claude doctor`, `codex exec` or `opencode run`, print modes such as `-p`, version and help run the binary directly. Each list comes from that runtime's own `--help`. Codex `resume` and `fork` stay wrapped, and so do Cursor `agent`, `ls` and `resume`, because they open a session.
- A `.skilled/bin/skilled-loop` exists in the current directory or one of its parents. A `.skilled` that is a symlink counts, so the wrapper also starts in a repository that links this checkout's `.skilled`.

The shim resolves only wrappers inside the sourced checkout or a linked worktree registered to it. It also accepts an absolute checkout listed in `SKILLED_LOOP_TRUSTED_CHECKOUTS` as a colon-separated value. An unset or empty variable trusts no extra checkout.

The automatic hop in a linking repository also needs that repository's runtime folders, because each runtime reads its hooks or plugins from the project it starts in. Link `.claude`, `.codex`, `.opencode` and `.pi` from this checkout as well, or give each its own session-handover registration. A repository that links only `.skilled` starts under the wrapper but never receives the nudge, so its sessions hop only through `/speckit:handoff`.

A wrapper runs the code it read when it started, so a change to `.skilled/bin/skilled-loop` reaches no hop of a loop that is already running. The wrapper takes a checksum of its own file before the first launch and compares it before each hop. When the file changed, it prints one line on stderr: `note: skilled-loop changed on disk after this loop started, restart the wrapper to run the new code`.

It also appends a `wrapper-changed` line with the loop id to `relaunch.log`, so an unattended hop that scrolls the note away still leaves a record. A checksum that comes back empty, because a checkout replaced the file for a moment, is not a change and prints and logs nothing. The hop still goes ahead on the code the loop started with. Exit the session and start the runtime again to pick the change up.

In every other case the function runs `command <binary> "$@"`. `skilled_loop_resolve <runtime> [args...]` prints the wrapper path the shim would use, or nothing. It skips the terminal check, so you can call it from a script to see the decision. Claude then hops on its own near the context threshold, and Pi, OpenCode and Codex do too once their `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` or `SYSTEM_SESSION_HANDOVER_ENABLED` flag is on. Cursor and Devin run under the wrapper too, but they hop only after `/speckit:handoff`.

An alias with the same name still takes precedence over the function, so remove a `claude` alias before you rely on the shim. Agent tool shells, such as Claude Code's, are rebuilt from a function snapshot that drops names starting with a single underscore. So every helper the shim's functions call keeps a plain `skilled_loop_` name.

---

## 8. RELATED

- [`README.md`](./README.md) - the overview and the switches.
- [`handoff-protocol.md`](./handoff-protocol.md) - the handoff protocol and the note format.
- [`skilled-loop`](../../bin/skilled-loop) - the wrapper that relaunches a runtime.
- [`skilled-loop-shell.sh`](../../bin/skilled-loop-shell.sh) - the shell shim.
- [`relaunch-core.cjs`](./lib/relaunch-core.cjs) - the relaunch record, arm and `should-relaunch` core.
- [`session-handover.cjs`](./bin/session-handover.cjs) - the `prepare`, `claim` and `complete` CLI.
- [`shared.mjs`](./codex/shared.mjs) - the shared runner the four Codex entry points call.
- [`session-handover.ts`](./pi/session-handover.ts) - the Pi extension.
