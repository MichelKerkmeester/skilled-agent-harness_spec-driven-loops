---
title: "Session Handover Hook: Context-Limit Handoff and Fresh-Session Handover"
description: "Shared core, per-runtime adapters, CLI and skilled-loop wrapper that hand unfinished work to a fresh session in the same terminal when a runtime nears its context limit."
trigger_phrases:
  - "session handover hook"
  - "skilled-loop relaunch"
  - "context limit handoff"
  - "opencode session handover"
  - "opencode context nudge"
  - "opencode relaunch plugin"
---

# Session Handover

> Shared adapters and the `skilled-loop` wrapper carry unfinished work into a fresh runtime session.

---

## 1. OVERVIEW

`session-handover/` holds the shared handoff logic and one adapter per automatic runtime. It also holds the CLI, the tests and the history lookup. `bin/history-lookup.mjs` is the runnable entry for the printed lookup command, and `history/` is the engine that reads the sender's earlier turns back. `handoff-protocol.md` explains the lookup end to end.

Each adapter asks for a handoff near its context threshold. The sender prepares a note and the adapter arms a matching record. After the runtime exits, `skilled-loop` relaunches it with a claim seed. That happens when the record is armed, fresh and below the hop cap. A record still pending at exit makes the wrapper print a manual claim command and consume the record.

`SKILLED_LOOP_MANUAL_TEMPLATE` builds that command from the name, model, provider and effort the loop carries, the record's live values first, plus the first launch's Pi extension flags. A hop that switched model therefore prints the model the session was last using, except on OpenCode 2, whose printed command carries no model. The killer uses the same template in its timeout notification.

Claude Code uses `PreToolUse` for Bash and `AskUserQuestion`, `PostToolUse`, `UserPromptSubmit`, `Stop` and `SessionStart`. Pi, OpenCode, Codex and Vibe use their host events or a plugin. Cursor and Devin ship on the command trigger only.

Start every runtime through `skilled-loop` for the loop, by hand or through the shell shim in QUICK START. Inside the loop the nudge asks for a hop. Outside it, the nudge asks only for a note the session keeps through auto-compaction.

The documents beside this one hold the deep behavior. Read `handoff-protocol.md`, `goal-carry-over.md`, `runtime-behavior.md`, `state-files.md` and `troubleshooting.md` first.

---

## 2. QUICK START

Start each runtime from the repository root:

```bash
bash .skilled/bin/skilled-loop claude "Work on the task and preserve unfinished work for the next session."
bash .skilled/bin/skilled-loop pi --provider openai --model gpt-6-luna -ne -e .pi/extensions/session-handover.ts
bash .skilled/bin/skilled-loop opencode
bash .skilled/bin/skilled-loop codex -m gpt-6-luna
bash .skilled/bin/skilled-loop cursor
bash .skilled/bin/skilled-loop devin
bash .skilled/bin/skilled-loop vibe
```

The wrapper accepts `skilled-loop [claude|pi|opencode|codex|cursor|devin|vibe] [args...]` and defaults to `claude`. Vibe's `--model` is headless-only, so a hop never replays it. The interactive relaunch keeps the configured `active_model`. OpenCode 2's root command has no model flag, so that command takes no `-m`; the wrapper starts it with `--standalone` and carries a hop's model through `OPENCODE_CONFIG_CONTENT`. On OpenCode 1, add `-m openai/gpt-6-luna`. The `cursor` arm launches the `cursor-agent` binary.

A hop rebuilds the launch in a fixed order rather than the first launch's order. It replaces the start prompt with the claim seed. Model, effort and name come from the relaunch record when it carries a usable value. The launch line supplies the rest.

The deny list holds the flags that select or continue a session and the flags a hop must not replay. They are not repeated:

- Claude `-c`, `--continue`, `-r`, `--resume`, `--fork-session`, `--from-pr`, `--session-id`, `--teleport`, `--cloud`, `-w`, `--worktree` and `--tmux`.
- Pi `-c`, `--continue`, `-r`, `--resume`, `--session`, `--session-id` and `--fork`.
- OpenCode `-c`, `--continue`, `-s`, `--session` and `--prompt`.
- Codex `-i`, `--image`, `--worktree`, `--last`, `--all` and `--include-non-interactive`.
- Devin `-c`, `--continue`, `-p`, `--print`, `-r`, `--resume` and `--prompt-file`.
- Cursor `--resume`, `--continue`, `-w`, `--worktree`, `--worktree-base` and `--skip-worktree-setup`.
- Vibe `-c`, `--continue`, `--resume`, `-p`, `--prompt`, `--prompt-file`, `--worktree` and `--model`.

Options documented by each runtime's help are replayed with their values. An unknown option followed by a bare word makes the wrapper warn and decline the hop. Relative Pi extension paths resolve against the starting directory before a hop changes directories.

The wrapper exports one loop id and starts `SKILLED_LOOP_HOPS` at 0, even when the shell it starts from carries a count from another loop. It relaunches only when a record is armed, fresh and below the hop limit.

The session-handover hooks ship on for Claude Code and off for every other runtime. Set `SYSTEM_SESSION_HANDOVER_ENABLED=1` in `.skilled/hooks/hook-flags.env` or the environment to turn them on everywhere. Turn one runtime on or off with its own `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED`. Without an enable flag only Claude Code sessions are nudged. Auto-compaction stays the fallback on the others.

Then add one line to `~/.zshrc` or `~/.bashrc`, with the absolute path of the checkout that owns `.skilled`:

```bash
source /path/to/repo/.skilled/bin/skilled-loop-shell.sh
```

The shim defines `claude`, `pi`, `opencode`, `codex`, `devin`, `cursor-agent`, `vibe` and `skilled-loop` as shell functions. Its rules, the trusted-checkout list and the wrapper checksum note are in `runtime-behavior.md`.

---

## 3. RUNTIME COVERAGE

The table folds every runtime entry into one place. A row names the event and the entry file.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PostToolUse`, `UserPromptSubmit` | `claude/handover-context-nudge.mjs` | This folder. | `hookSpecificOutput.additionalContext` with the nudge text. |
| Claude | `Stop` | `claude/handover-stop-arm.mjs` | This folder. | `systemMessage` with no `decision` key, for a deferral or a hop that could not arm. A successful arm prints nothing. |
| Claude | `SessionStart` | `claude/handover-compact-pointer.mjs` | This folder. | `hookSpecificOutput.additionalContext` with the claim instructions or the stale-note text. |
| Claude | `PreToolUse` | `claude/handover-subagent-guard.mjs` | This folder. | `permissionDecision: deny` with the reason, for a sub-agent call or a question dialog. |
| Codex | `UserPromptSubmit` | `codex/handover-prompt-seed.mjs` | This folder. | `hookSpecificOutput.additionalContext` with the claim seed or the nudge. |
| Codex | `PostToolUse` | `codex/handover-context-nudge.mjs` | This folder. | `hookSpecificOutput.additionalContext` with the nudge text. |
| Codex | `Stop` | `codex/handover-stop-arm.mjs` | This folder. | `systemMessage` naming the cause, for a Stop that could not arm. A successful arm prints nothing and logs to `relaunch.log`. |
| Codex | `SessionStart` | `codex/handover-compact-pointer.mjs` | This folder. | `hookSpecificOutput.additionalContext` with the claim instructions or the stale-note text. |
| Pi | `before_agent_start`, `message_end`, `turn_end`, `agent_end`, `agent_start`, `agent_settled`, `session_compact`, `tool_call` | `pi/session-handover.ts` | This folder. | The claim instructions appended to the system prompt, a steered message, a follow-up message, a hidden compaction message and a blocked `question` tool. |
| OpenCode | `experimental.chat.system.transform`, `message.part.updated`, `message.updated`, `session.compacted`, `session.created`, `session.deleted`, `session.idle`, `session.updated`, `tool.execute.before` | `opencode/session-handover.js` | `.opencode/plugins/session-handover.js` | The nudge, the claim seed and the withdrawn notice in the system prompt. A thrown error on the `question` tool. |
| Vibe | `pre_agent`, `post_agent`, `post_tool` | `vibe/handover-parts.mjs` | This folder. | `additional_context` with the hand-over text on `pre_agent` and `post_tool`. Nothing on `post_agent`, which arms the record. |
| Cursor | `/speckit-handoff` | None | None | Nothing automatic. The command prints the manual claim command. |
| Devin | `/speckit:handoff` | None | None | Nothing automatic. The command prints the manual claim command. |

Claude, Codex and Pi register in `hook-registry.json`. Claude's rows land in `.claude/settings.json`. Codex's rows land in `.codex/hooks.json`, and `.codex/hooks/` holds a link to each adapter. Pi registers through `.pi/extensions/session-handover.ts`, a one-line entry file that re-exports `pi/session-handover.ts`.

OpenCode loads `.opencode/plugins/session-handover.js` as a plugin. The `opencode/` subfolder holds one link to that file for browsing. Vibe registers in `.vibe/hooks.toml` under `turn-start`, `turn-end` and `compaction-post-tool`, and those entries import `vibe/handover-parts.mjs`.

Cursor and Devin have no entry here. Their handoff runs from `/speckit-handoff` in Cursor and `/speckit:handoff` in Devin.

Each adapter catches its own errors. Claude and Codex exit 0 with no envelope, except that each Stop hook prints a `systemMessage` when it cannot arm. Pi and OpenCode return from the handler. Vibe logs the error and returns an empty context part, or null from the turn-end arm.

The suppression rules and the delivery order are in `handoff-protocol.md`. The seed syntax and the model carry are in `runtime-behavior.md`.

---

## 4. DIRECTORY TREE

```text
session-handover/
+-- README.md
+-- handoff-protocol.md
+-- goal-carry-over.md
+-- runtime-behavior.md
+-- state-files.md
+-- troubleshooting.md
+-- bin/
|   +-- README.md
|   +-- history-lookup.mjs
|   `-- session-handover.cjs
+-- history/
|   +-- README.md
|   +-- lib/
|   `-- tests/
+-- claude/
|   +-- README.md
|   +-- handover-compact-pointer.mjs
|   +-- handover-context-nudge.mjs
|   +-- handover-stop-arm.mjs
|   `-- handover-subagent-guard.mjs
+-- codex/
|   +-- README.md
|   +-- handover-compact-pointer.mjs
|   +-- handover-context-nudge.mjs
|   +-- handover-prompt-seed.mjs
|   +-- handover-stop-arm.mjs
|   `-- shared.mjs
+-- lib/
|   +-- README.md
|   +-- context-usage.cjs
|   +-- goal-handover.cjs
|   +-- hop-history.cjs
|   +-- killer.cjs
|   +-- nudge.cjs
|   +-- relaunch-core.cjs
|   `-- withdraw.cjs
+-- opencode/
|   `-- session-handover.js -> .opencode/plugins/session-handover.js
+-- pi/
|   +-- README.md
|   +-- session-handover.test.ts
|   `-- session-handover.ts
+-- vibe/
|   `-- handover-parts.mjs
`-- tests/  Node test files, payload fixtures and a README
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `bin/session-handover.cjs` | The CLI. It runs `prepare`, `keep`, `claim`, `complete`, `cancel`, `consume`, `should-relaunch`, `hand-over`, `history`, `window` and `session-id`. |
| `bin/history-lookup.mjs` | The runnable entry for the printed history lookup command. |
| `history/` | The history lookup engine: TypeScript source in `lib/`, its gitignored build in `dist/` and its Vitest suites in `tests/`. |
| `lib/relaunch-core.cjs` | The handoff note, the relaunch record, the arm rules and the locks. |
| `lib/nudge.cjs` | The nudge text, the suppression rules and `questionHoldReason`. |
| `lib/killer.cjs` | The idle wait, the SIGTERM and the timeout path. |
| `lib/context-usage.cjs` | The fill readers for each runtime. |
| `lib/withdraw.cjs` | The one withdraw helper every adapter and `cancel` use. |
| `lib/hop-history.cjs` | The `hop-history.log` writer and reader. |
| `lib/goal-handover.cjs` | The `goal_packet` field and the per-runtime goal lookup. |
| `claude/handover-context-nudge.mjs` | The Claude nudge on `PostToolUse` and `UserPromptSubmit`. |
| `claude/handover-stop-arm.mjs` | The Claude arm on `Stop`. |
| `claude/handover-compact-pointer.mjs` | The Claude pointer on `SessionStart`. |
| `claude/handover-subagent-guard.mjs` | The Claude `PreToolUse` guard for a sub-agent call and a question dialog. |
| `codex/shared.mjs` | The Codex entry points over one nudge check. |
| `pi/session-handover.ts` | The Pi extension. |
| `vibe/handover-parts.mjs` | The Vibe context part and the turn-end arm. |
| `.opencode/plugins/session-handover.js` | The OpenCode plugin. |
| `.skilled/hooks/shared/hook-flags.cjs` | The switch resolver every adapter calls. |

---

## 6. CONFIGURATION

Hook switches resolve from the environment and the optional `.skilled/hooks/hook-flags.env` file. An environment value takes precedence over the file value. Each `SYSTEM_SESSION_HANDOVER_*` switch also reads its second spelling `SYSTEM_IN_SESSION_HANDOVER_*` while the main switch is unset or blank. The main name wins when both hold a value.

| Switch | Default | Behavior |
|---|---|---|
| `SYSTEM_SESSION_HANDOVER_ENABLED` | unset, on for Claude Code and off elsewhere | `1` turns on the nudge, Stop-arm and compact-pointer hooks and `prepare`. `0` turns them off on Claude Code too, except the goal-command start claim, which the compact pointer still delivers. While off, auto-compaction stays the fallback. |
| `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` | unset, falls back to `SYSTEM_SESSION_HANDOVER_ENABLED`, then to the runtime's default | One flag each for `CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR`, `DEVIN` and `VIBE`. A non-empty value wins over `SYSTEM_SESSION_HANDOVER_ENABLED` for that runtime. `1` turns them on and `0` turns them off. Each key is read from the environment first, then from `hook-flags.env`. |
| `SYSTEM_SESSION_HANDOVER_DISABLED` | unset | `1` disables the same hooks. It wins over `SYSTEM_SESSION_HANDOVER_ENABLED` and every per-runtime enable flag. |
| `SYSTEM_HOOKS_DISABLED` | unset, off | A truthy value disables hooks across the repository. `MK_HOOKS_DISABLED` is a supported alias. |
| `SESSION_HANDOVER_THRESHOLD` | `0.80` | Context fill ratio that triggers the first nudge. Valid values are greater than 0 and at most 1. Invalid values use `0.80`. |
| `SESSION_HANDOVER_WINDOW_TOKENS` | unset, resolved automatically | Read from the environment only. A positive value overrides Claude settings. Otherwise the resolver reads `autoCompactWindow` from `.claude/settings.local.json` and then `.claude/settings.json` in each directory from the session cwd up to the repository root, then from the home settings file. Outside a repository only the cwd is checked. A model name containing `[1m]` uses a one-million-token fallback. With an unknown window the Claude nudge is skipped. |
| `SESSION_HANDOVER_MAX_HOPS` | `10` | Highest completed hop count allowed. The wrapper declines a record at or above it. `prepare` writes no record and exits 3. The killer unarms the record with reason `hop-cap` and signals nothing. Zero is accepted and declines every hop. Unset, empty, negative, non-integer or non-numeric values use 10. |
| `SESSION_HANDOVER_MAX_AGE_MIN` | `10` | Maximum age in minutes for an armed relaunch record. Zero is accepted and makes any older record stale. Unset, empty, negative or non-numeric values use 10. |
| `SESSION_HANDOVER_NOTIFY_HOPS` | unset, off | `1` sends a macOS notice titled "Session handed over" on each relaunch. It names the runtime, the session folder and the note's goal. |
| `SESSION_HANDOVER_GOAL` | unset, on | `0`, `false`, `off` or `no` stops the hand-over from carrying the sender's goal packet. Also read from `.skilled/hooks/hook-flags.env`. |
| `SESSION_HANDOVER_GOAL_PACKET` | wrapper-managed | Exported by `skilled-loop` when the consumed note carries a usable goal packet, or when a first launch starts from the printed manual claim command's seed and that note carries one. Never set it by hand. |
| `SKILLED_LOOP_CLAIM_SEED` | wrapper-managed | Exported by `skilled-loop` to a Claude receiver that starts on the goal command. Never set it by hand. |
| `SESSION_HANDOVER_REPO_ROOT` | unset, the install root | Absolute path to the repository that holds the concern. Planned note paths resolve under it. The generic `REPO_ROOT` is not read. |
| `SKILLED_LOOP_HOPS` | `0` | Wrapper-managed completed-hop count. It must be a non-negative integer. |

A per-runtime flag applies after the environment and file read. So a file `SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED=0` beats an environment `SYSTEM_SESSION_HANDOVER_ENABLED=1` for Claude. `SYSTEM_SESSION_HANDOVER_ENABLED=1` with `SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED=0` is on for every runtime except Claude.

Inside the loop no adapter nudges at the hop cap. `prepare` at that count prints its hop-limit line with the manual claim command.

The wrapper accepts `-n` or `--name` with a value and `--name=value`. The first launch keeps the original name argument. The wrapper copies the name to later hops. A `--` argument ends the name scan, so later values are passed through as Claude arguments.

The killer CLI requires `--loop-id` and `--target-pid`. `--transcript` is optional. The Claude and Codex Stop hooks and the Pi and Vibe arms pass it, and Pi passes its session file when the path resolves while Vibe passes its journal folder. The OpenCode plugin does not. Without it, idle means the configured idle time has elapsed since the killer started.

The loop id must be greater than 1 and match `SKILLED_LOOP_ID`. The defaults are `--idle-ms 3000` and `--timeout-ms 30000`. The killer polls every 100 ms. `--no-notify` defaults to off, so a timeout attempts a notification. The Stop hook starts the killer without `--no-notify`.

`prepare` receives the note through `--handoff <path>`, while `claim` and `complete` receive it positionally. Both `prepare` and `claim` require `--session <id>`. Claude Code can omit the flag and use `CLAUDE_CODE_SESSION_ID`. On a Vibe session under `skilled-loop`, `prepare` can also omit it and use the id the turn-start hook recorded, while `claim` there must pass `--session`. A successful prepare exits 0 and leaves the record pending for the runtime's own arm event. Outside `skilled-loop`, prepare prints the manual claim command and exits 3. Inside the loop it does the same at the hop cap. A refused prepare exits 2.

`keep --handoff <path>` takes the same `--session` and `--runtime` options. It exits 0 outside the loop and exits 2 inside it.

`history [--last <count>]` prints the latest hop-history lines, 20 by default. It prints `no hop recorded yet` with the file path when the log is empty, then the open-notes line when any note is still open. It exits 0.

`window` prints the configured Claude context window or the settings needed to configure it, and exits 0.

`cancel [--loop-id <id>]` calls off the loop's prepared hand-over. The loop id defaults to `SKILLED_LOOP_ID`. A loop id inherited by a nested run is dropped first, and an explicit `--loop-id` still names the loop to cancel. It withdraws a pending or armed record through the same helper the adapters use, with reason `cancelled`.

It logs `cancel`, writes a `withdrawn` line to the hop history, grants the session one more nudge and leaves the note open. It exits 0. With no prepared hand-over it exits 1. The nudge names this command inside the loop.

`hand-over --handoff <path> [--hop <n>] [--runtime <runtime>]` records the hand-over. It does not consume the record and prints nothing. When the note is `open`, it writes the `handed-over` line and sends the optional notice. For any other note state it writes neither. The wrapper calls plain `consume`, reads the note state from its output and runs `hand-over` only for an open note. It ignores its exit status.

The CLI prints its usage and exits 0 when it gets no command, `--help` or `-h`. A wrong option prints the error plus that subcommand's usage line and exits 2.

The record statuses, the note statuses and the hop-history events are in `state-files.md`. The killer's log lines and the wrapper warnings are in `troubleshooting.md`.

---

## 7. VALIDATION

Run every session-handover Node test file from the repository root. The glob picks up a new test file without an edit here.

```bash
node --test .skilled/hooks/session-handover/tests/*.test.cjs
```

Expected result: every test passes.

```bash
node .skilled/hooks/session-handover/bin/session-handover.cjs --help
```

Expected result: the usage listing and exit 0.

The history engine builds and tests on its own. Build the spec-kit runtime first, because the engine reads the hook state the runtime compiles. The handover suite's claim tests import the engine's build, so build it before running them too.

```bash
npm --prefix .skilled/skills/system-spec-kit/runtime run build
npm --prefix .skilled/hooks/session-handover/history run build
npm --prefix .skilled/hooks/session-handover/history test
```

Expected result: both builds exit 0 and every history suite passes. A provisioned worktree builds the engine for you. The dist-freshness check reports it when its build is missing or older than its source.

---

## 8. RELATED

- [`handoff-protocol.md`](./handoff-protocol.md): the nudge, the note, prepare, the arm and the killer.
- [`goal-carry-over.md`](./goal-carry-over.md): the `goal_packet` field and the per-runtime goal lookup.
- [`runtime-behavior.md`](./runtime-behavior.md): the adapter matrix, the model carry and the shell shim.
- [`state-files.md`](./state-files.md): the relaunch record, the note status and the hop history.
- [`troubleshooting.md`](./troubleshooting.md): the exit codes, the killer log lines and the wrapper warnings.
- [`history/README.md`](./history/README.md): the history lookup engine, its operations and its refusal codes.
- [`../README.md`](../README.md): the hooks tree and the switch index.
- [`../injection-contract.md`](../injection-contract.md): what these hooks inject and how visible it is.
- [`../../bin/README.md`](../../bin/README.md): the `skilled-loop` wrapper.
- [`../../commands/speckit/handoff.md`](../../commands/speckit/handoff.md): the `/speckit:handoff` command.
- [`../../skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md`](../../skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md): the feature entry.
- [`../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-claude.md`](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-claude.md): the Claude scenarios.
- [`../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-pi-opencode.md`](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-pi-opencode.md): the Pi and OpenCode scenarios.
- [`../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-command-runtimes.md`](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-command-runtimes.md): the Codex, Cursor and Devin scenarios.
