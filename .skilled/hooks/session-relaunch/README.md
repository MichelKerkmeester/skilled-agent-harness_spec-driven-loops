---
title: "Session Relaunch Hook: Context-Limit Handoff and Fresh-Session Relaunch"
description: "Shared core, per-runtime adapters, CLI and skilled-loop wrapper that hand unfinished work to a fresh session in the same terminal when a runtime nears its context limit."
trigger_phrases:
  - "session relaunch hook"
  - "skilled-loop relaunch"
  - "context limit handoff"
---
# Session Relaunch

> Shared adapters and the `skilled-loop` wrapper carry unfinished work into a fresh runtime session.

---

## 1. OVERVIEW

The `session-relaunch/` folder holds the shared handoff logic, one adapter per automatic runtime, the CLI and the tests for the session relaunch loop. Each adapter asks for a handoff near its context threshold. The sender prepares a note and the adapter arms a matching record. After the runtime exits, `skilled-loop` relaunches it with a claim seed when the record is armed, fresh and below the hop cap. If a record is still pending at exit, the wrapper prints a manual claim command for the selected runtime and consumes the record. `SKILLED_LOOP_MANUAL_TEMPLATE` builds that command from the first launch's model, provider, name and Pi extension flags. The killer uses the same template in its timeout notification.

Claude Code uses `PreToolUse` for Bash, `PostToolUse`, `UserPromptSubmit`, `Stop` and, after a compaction, `SessionStart`. Pi, OpenCode, Codex and Hermes use their host events or a bridging plugin. Cursor and Devin ship on the command trigger only. Start every runtime through `skilled-loop` for the loop, by hand or through the shell shim in section 2. Inside the loop the nudge asks for a hop. Outside it, the nudge asks only for a note the session keeps through auto-compaction, as section 3 describes under Outside The Loop.

### Runtime adapter matrix

| Runtime | Trigger | Relaunch seed syntax | Model carry | Mirror form | Spike evidence | Verdict |
|---|---|---|---|---|---|---|
| Claude | automatic | `claude [--model <model>] "<seed>" [--name <name>]` | `--model`, `--model=` | [.claude/settings.json](../../../.claude/settings.json) hook entries | [SPIKE-REPORT.md](../../../specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/scratch/spike/SPIKE-REPORT.md) | AUTO |
| Pi | automatic | `pi [--provider <p>] [--model <model>] [-ne] [-e <path>] [--name <name>] "<seed>"` | `--model`, `--provider`, extension flags | `.pi/extensions/` symlink to `pi/session-relaunch.ts` | [SPIKE-REPORT.md](../../../specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md) | AUTO |
| OpenCode | automatic | `opencode [-m <model>] --prompt "<seed>"` | `-m`, `--model`, `--model=` | `.opencode/plugins/` plugin plus `opencode/` browsability symlink | [SPIKE-REPORT.md](../../../specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md) | AUTO |
| Codex | automatic | `codex --no-daemon [-m <model>] "<seed>"` | `-m`, `--model`, `--model=` | [.codex/hooks.json](../../../.codex/hooks.json) hook entries plus `.codex/hooks/` symlinks | [SPIKE-codex.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-codex.md) | AUTO |
| Cursor | `/speckit-handoff` | `cursor-agent [--model <model>] "<seed>"` | `--model`, `--model=` | [.cursor/commands/speckit-handoff.md](../../../.cursor/commands/speckit-handoff.md) symlink | [SPIKE-cursor-hermes.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-cursor-hermes.md) | COMMAND-ONLY |
| Hermes | automatic | `hermes chat [--provider <p>] [-m <model>] -q "<seed>"` | `-m`, `--model`, `--provider` | `.hermes/plugins/repo-guards/` bridges plus `.hermes/prompts/` | [SPIKE-cursor-hermes.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-cursor-hermes.md) | AUTO |
| Devin | `/speckit:handoff` | `devin [--model <model>] -- "<seed>"` | `--model`, `--model=` | none, [.devin/SYNC.md](../../../.devin/SYNC.md) carries no command surface | [SPIKE-devin.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-devin.md) | COMMAND-ONLY |

`skilled-loop` exports `SKILLED_LOOP_RUNTIME` with the selected runtime. It carries the first launch's model for every runtime. Pi and Hermes also carry their provider. Claude and Pi carry their name. Pi carries its extension flags. Relative Pi extension paths resolve against the wrapper's starting directory. `prepare` and `claim` require `--session <id>`. Only Claude can omit it and use `CLAUDE_CODE_SESSION_ID`. Other runtimes pass the id directly. Runtimes with no session-id variable, such as Devin or Cursor, run `uuidgen` once and reuse the value. `CLAUDE_PID` supplies Claude's process id for the shell-child check, and Stop keeps it as the killer target while it descends from the loop. `complete` requires only the note path.

### Automatic triggers on Codex and Hermes

Codex binds three repo hooks rendered from `hook-registry.json` into [.codex/hooks.json](../../../.codex/hooks.json). `prompt-seed.mjs` binds `UserPromptSubmit`: a `[session-relaunch]` prompt receives the claim-seed instructions, and a non-seed prompt first withdraws a record this session armed, as the Stop paragraph below describes, then runs the same threshold check as `context-nudge.mjs`, which binds `PostToolUse`. The Codex prompt payload carries only the prompt text, so any prompt other than a seed counts as the operator's. The Codex hook installer allows each script under one event only, so seed detection and the mid-session nudge are separate entry points over `shared.mjs`. The fill comes from the transcript rollout's latest `token_count` event: `last_token_usage.input_tokens` is the numerator and `cached_input_tokens` stays out because it is already inside that count. The window is `SESSION_RELAUNCH_WINDOW_TOKENS`, then the event's `model_context_window`. The nudge reaches the model as `hookSpecificOutput.additionalContext`, the envelope the repo's other Codex adapters emit. `stop-arm.mjs` accepts only payloads whose `hook_event_name` is `Stop`. It resolves the target, arms a matching pending record, then spawns the killer with `--transcript <transcript_path>`. A spawn failure leaves the record armed until the next Stop restarts its killer. Codex exports no pid variable, so the killer target resolves through the same ancestor rule the CLI's running-work check uses. `skilled-loop codex` always starts Codex with `--no-daemon` because its shared app-server daemon keeps the environment of the session that started it. In a git worktree, Codex reads its `hooks.json` from the main checkout, not the worktree. The automatic hop needs the session-relaunch rows in the main checkout's file. Each of those three rows, like the three session-relaunch rows in the Claude settings file, carries the repo's hook-drift fallback: a missing adapter prints a `mk-hook-drift host=<host> event=<event> adapter=<script>` line on stderr and still returns an envelope the host accepts. Claude's fallback adds `mkHookDrift: true`. Codex omits that key, because it rejects unknown keys, and answers its Stop event with `systemMessage` instead of `hookSpecificOutput`, because it rejects that envelope on Stop.

Hermes runs through the enabled `repo-guards` project plugin, so the operator changes nothing in the user config. The plugin bridges three events to the Node entry points under `hermes/`. `post_api_request` records each call's `usage` per session. `pre_llm_call` runs `context-nudge.mjs` and returns the seed text on a `[session-relaunch]` first turn or the handoff text once the fill crosses the threshold, appended to the turn's user message. `on_session_end` runs `session-end-arm.mjs` and accepts a missing event name from the bridge, but rejects a supplied name other than `on_session_end`. It arms a pending record for this session and detaches the killer with the Hermes process resolved by the ancestor rule. A killer spawn failure leaves the record armed until the next session end restarts its killer. Hermes fires `on_session_end` after every message, so the plugin keeps each session's recorded usage until `on_session_finalize` or `on_session_reset` clears it. The fill counts input plus cache read and cache write tokens, never output. The window is `SESSION_RELAUNCH_WINDOW_TOKENS`, then the event's `model_context_window`. If the event omits that field, the plugin resolves the window from Hermes model metadata. The 200-thousand-token default applies only when neither source provides a window. The nudge state logs which source supplied the window.

### Command-only runtimes: Cursor and Devin

Cursor ships on the command trigger for two reasons. Its spike evidence is source-only: the bundle's hook dispatch code was inspected, but no live payload was captured because the machine's Cursor credentials were expired and no permitted provider exists for Cursor. And `stop` is not wired in this repository's [.cursor/hooks.json](../../../.cursor/hooks.json), whose registered event list has no `stop`. Devin ships on the command trigger because its hook usage is unverified: the historical probe summarizes field names without a raw payload and current `SessionEnd` behavior is unknown, so an automatic arm cannot be proven.

Start a handoff by running `/speckit:handoff` inside the session. It writes the note and runs `prepare`. Outside `skilled-loop`, prepare prints the manual claim command and exits 3, and that line starts the hop by hand. Outside the loop a session runs this command only when the operator asks for a manual handoff. Otherwise it keeps working. The printed command uses the selected runtime's seed form: Claude, Pi, Codex and Cursor use the seed as a positional argument, OpenCode adds `--prompt`, Hermes adds `chat -q`, and Devin adds `--` before the seed. `!` in a handoff path sits in single quotes outside the seed's double quotes. For example, the CLI and wrapper print `...handoff /tmp/han"'!'"doff.md`, which interactive Bash preserves when history expansion is on. Cursor names a project command after its file, so in Cursor the command is `/speckit-handoff`, reached through [.cursor/commands/speckit-handoff.md](../../../.cursor/commands/speckit-handoff.md), a symlink to the canonical file. Devin has no command surface, so a Devin session reads [.skilled/commands/speckit/handoff.md](../../commands/speckit/handoff.md) directly and follows it. Under `skilled-loop`, a record prepared on a command-only runtime stays pending because no arm event exists for it, so the hop runs by launching the wrapper with the claim seed.

### Runtime Behavior And Limits

`SESSION_RELAUNCH_THRESHOLD` controls when each session is nudged. Keep the threshold well above a fresh session's startup fill plus its remaining work. Codex live runs at `0.12` chained hop after hop because each new session reached about 10% on startup alone. `SESSION_RELAUNCH_MAX_HOPS` caps completed relaunches and stops the chain once that limit is reached.

This repository's Pi setup needs `-ne -e` and the [.pi/extensions/session-relaunch.ts](../../../.pi/extensions/session-relaunch.ts) extension. Two installed Pi extensions both register `--fast`, so the default startup conflicts. The wrapper carries the selected extension flags across hops.

In the recorded live runs, OpenCode reported about 1M context tokens for `openai/gpt-6-luna`. Pi reported 272K for the same model. The live handoff results and operator inputs are in the [Pi and OpenCode playbook](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md).

---

## 2. STARTING THE LOOP

Start each runtime from the repository root through the wrapper:

~~~bash
bash .skilled/bin/skilled-loop claude "Work on the task and preserve unfinished work for the next session."
bash .skilled/bin/skilled-loop pi --provider openai --model gpt-6-luna -ne -e .pi/extensions/session-relaunch.ts
bash .skilled/bin/skilled-loop opencode -m openai/gpt-6-luna
bash .skilled/bin/skilled-loop codex -m gpt-6-luna
bash .skilled/bin/skilled-loop cursor
bash .skilled/bin/skilled-loop hermes chat --provider llmgateway -m gpt-6-luna
bash .skilled/bin/skilled-loop devin
~~~

The wrapper accepts `skilled-loop [claude|pi|opencode|codex|cursor|hermes|devin] [args...]` and defaults to `claude`. The `cursor` arm launches the `cursor-agent` binary. It keeps the first launch's arguments. Across hops, it preserves model selection for each runtime, the provider flag for Pi and Hermes, and Pi's extension flags. It resolves relative Pi extension paths against the starting directory before a hop changes directories. It carries `-n` or `--name` for Claude and Pi. The other runtimes have no launch-time name flag. For model, name, Pi extension and Pi or Hermes provider options, values equal to `--` or starting with `-` stay in the first launch's arguments and are not carried into relaunches.

The wrapper exports one loop id and starts `SKILLED_LOOP_HOPS` at 0. It relaunches only when a matching record is armed, fresh and below the configured hop limit.

### Run every session under the loop

Add one line to `~/.zshrc` or `~/.bashrc`, with the absolute path of the checkout that owns `.skilled`:

~~~bash
source /path/to/repo/.skilled/bin/skilled-loop-shell.sh
~~~

The shim defines `claude`, `pi`, `opencode`, `codex`, `hermes`, `devin` and `cursor-agent` as shell functions. Typing `claude` in a terminal then runs `bash <repo>/.skilled/bin/skilled-loop claude`, and `cursor-agent` runs the wrapper's `cursor` arm. A function hands the launch to the wrapper only when all of these hold:

- `SKILLED_LOOP_ID` is unset, so no loop is running yet.
- Standard input and standard output are both a terminal.
- The arguments open an interactive session. Subcommands such as `claude doctor`, `codex exec` or `opencode run`, print modes such as `-p`, one-shot modes such as `hermes -z`, version and help run the binary directly. Each list comes from that runtime's own `--help`. Codex `resume` and `fork`, Cursor `agent`, `ls` and `resume`, and `hermes chat` stay wrapped, because they open a session.
- A `.skilled/bin/skilled-loop` exists in the current directory or one of its parents. A `.skilled` that is a symlink counts, so the wrapper also starts in a repository that links this checkout's `.skilled`.

The automatic hop in a linking repository also needs that repository's runtime folders, because each runtime reads its hooks or plugins from the project it starts in. Link `.claude`, `.codex`, `.opencode`, `.pi` and `.hermes` from this checkout as well, or give each its own session-relaunch registration. A repository that links only `.skilled` starts under the wrapper but never receives the nudge, so its sessions hop only through `/speckit:handoff`.

In every other case the function runs `command <binary> "$@"`. `skilled_loop_resolve <runtime> [args...]` prints the wrapper path the shim would use, or nothing. It skips the terminal check, so you can call it from a script to see the decision. A wrapped `hermes` launch also gets `HERMES_ENABLE_PROJECT_PLUGINS=1`, because Hermes loads the relaunch bridge only as a project plugin. Other launches and your shell stay without it. `repo-guards` must still be listed under `plugins.enabled` in `~/.hermes/config.yaml`. Claude, Pi, OpenCode, Codex and Hermes then hop on their own near the context threshold. Cursor and Devin run under the wrapper too, but they hop only after `/speckit:handoff`, as section 1 describes. An alias with the same name still takes precedence over the function, so remove a `claude` alias before you rely on the shim. Agent tool shells, such as Claude Code's, are rebuilt from a function snapshot that drops names starting with a single underscore, so every helper the shim's functions call keeps a plain `skilled_loop_` name.

---

## 3. HANDOFF PROTOCOL

Claude's `context-nudge` handles `PostToolUse` and `UserPromptSubmit`. It reads the latest main-chain assistant usage from the Claude transcript and compares the fill ratio with the configured threshold. The default threshold is 0.80. One more nudge fires 0.05 above that level. Each level fires once. A withdrawn or cancelled hand-over earns one extra nudge, as the Stop paragraph below describes. The adapter accepts session ids matching `[A-Za-z0-9_-]{1,128}`. Transcript read errors produce no usage. The reader starts with the last 256 KiB of the transcript. When that tail holds no assistant row, for example after a tool result larger than the tail, it widens the read up to 16 MiB before it reports no usage. The Codex reader widens the same way. Failed Claude settings reads are treated as absent.

The nudge reports the fill as `[session-relaunch] Context is about N% full.`, or as `[session-relaunch] Context is past the configured window (over 100% full).` when the ratio is above 1. It then lets the session finish instead: `If the remaining work fits in a few more steps, finish it instead and skip these steps.` A session with more work left does the handoff steps now, before any other work, so a fresh session continues before auto-compaction has to. The nudge gives the operator the last word. If the operator has told the session not to hand off, it skips the note, continuity save and prepare steps, keeps working and leaves auto-compaction as the fallback. The nudge names a handoff note under `.skilled/skills/.state/session-relaunch/handoffs/` and a prepare command. The path resolves under the repository that holds the concern, so a runtime started in a subdirectory still writes under the repo root. The note needs flat frontmatter and four non-empty sections: Goal, Done, Remaining work and In-flight state. The Remaining work section lists only unfinished task work. Note creation, continuity saving and `prepare` are handoff steps. When `spec_folder` is a packet path, Claude uses `/speckit:save`. Other runtimes send the save JSON to the [continuity writer](../../../.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js) with `--stdin --full-auto <spec-folder>` before prepare. `spec_folder` holds the repo-relative packet path, `none` when Gate 3 was answered D) Skip or empty when Gate 3 was never answered. The nudge fills it from `SYSTEM_SPEC_FOLDER` when that names a valid packet and prints it empty otherwise, so the model never copies a placeholder that prepare rejects. A seed whose note path is not absolute adds nothing to the receiving session's context on any runtime.

The `/speckit:handoff` command writes the note and runs `prepare`. The direct CLI form is:

~~~bash
node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff <note-path> --session <session-id> --runtime <runtime>
~~~

Prepare validates the note first. An invalid note exits 2. Outside `skilled-loop`, it prints a manual claim command and exits 3 without checking for running shell children. Inside the loop, a live child of the runtime process exits 2 when its command name is `sh`, `bash`, `zsh`, `fish`, `dash`, `ksh`, `mksh`, `tcsh`, `csh`, `nu` or `pwsh`. A leading `-` is stripped before that lookup, so a login shell still matches. Any other child program is not detected. That includes a single simple command a tool shell replaces itself with: OpenCode runs `zsh -c 'sleep 45'` as a `sleep` child, so prepare goes ahead, while `sleep 45; echo done` keeps the shell and is refused. On Claude, Codex, Pi and OpenCode, the arm withdrawal below and the killer's idle wait keep such a turn from being cut off. The runtime pid comes from `CLAUDE_PID` while that process descends from the loop. Otherwise, and on runtimes without the variable, the check resolves the runtime as the direct child of the loop on prepare's ancestor chain. When no runtime resolves, it logs `running-work-check-skipped` and skips. A shell that is prepare's own ancestor does not count. `--runtime` must name one of Claude, Pi, OpenCode, Codex, Cursor, Hermes or Devin. Outside `skilled-loop` it overrides the environment or Claude default. Inside the loop, a supplied value must match `SKILLED_LOOP_RUNTIME` or prepare exits 2. The nudge includes the selected runtime in its prepare command. A successful prepare writes a pending record and exits 0. At the hop cap it writes no record, prints the hop-limit line with the manual claim command and exits 3.

Every arm path asks the core whether the record is armable: its loop id, session id and runtime must match the arming session, where a record with no runtime counts as Claude's. A pending record arms. An armed record re-arms only when no killer is live for the loop, and the re-arm restamps `armedAt`, `armId` and the cwd, so a record whose killer died is fresh again when the next arm event fires. Stop matches the event session id to the stored record. A pending record stays pending when `transcript_path` is missing. The hook logs `missing-transcript-path` and returns. While background tasks remain it leaves the record as it is, pending or armed, so a respawned killer never ends live work. A pending record it defers this way gains a `deferredAt` stamp. When the operator types a prompt in that session, the `UserPromptSubmit` nudge withdraws the session's record if it is deferred or already armed. The killer signals an armed session after a few quiet seconds, so a new turn that runs one long tool would otherwise be ended mid-turn and relaunched onto the old note. Claude, Codex, Pi, OpenCode and `cancel` all withdraw through one helper, `lib/withdraw.cjs`. It disarms the record under the record lock with reason `user-message` (`cancelled` for the command), grants the extra nudge below and writes a `withdrawn` line to the hop history. The Claude and Codex hooks also log `withdrawn` and tell the session to keep working. The note stays open as it was. The killer stands down on a record disarmed after Stop, both at its timeout and in its last read before the signal. The session also gets exactly one more context nudge, whatever level it had spent. That nudge never lands on the withdraw prompt. It comes once the fill is one step (0.05) above the fill at the first check at or past the threshold after the withdraw, and the withdrawn notice says so. The nudge is the cue to update the note and hand over again. A background task's own completion arrives as a `<task-notification>` prompt and never withdraws the record, because that completion is what the deferral waits for. A record that was prepared and never deferred is not withdrawn either, and neither is a Claude seed prompt. Stop then resolves the killer target before it arms: `CLAUDE_PID` while that process descends from the loop, otherwise the loop's direct child on the hook's ancestor chain, never the `bash -c` shell the hook runs under. When neither resolves, it logs `stop-arm-error stage=target-pid` and the record stays pending. Otherwise Stop arms the record and starts the detached killer.

Pi checks usage at `message_end` and holds the nudge for `agent_end`, because the message that crosses the threshold usually carries the prepare call itself. At `agent_end` it re-checks the pending or fresh armed record and the hop limit, then sends the held text with `deliverAs: 'followUp'` and `triggerTurn: true`, so the nudge reaches the model without an operator turn. Its adapter finds `killer.cjs` by walking up from any repository subdirectory. `tsconfig.pi.json` includes the extension entry so the adapter is type-checked. OpenCode adds its active nudge to the system prompt on every request while this session has no pending or fresh armed record. When `SKILLED_LOOP_ID` is set but names no record, it keeps the nudge only while the planned note file does not exist. It keeps a claim seed in the system prompt until the note leaves `open` or a new non-seed user message arrives, then arms the record on `session.idle`.

Pi and OpenCode both withdraw an arm when the session they armed starts a new turn. The OpenCode killer runs without `--transcript`, so it only waits its idle time. The Pi killer watches the session file, but Pi writes an assistant message only once it completes, so a turn that is still thinking looks idle. A turn the operator starts just after the arm would otherwise be signalled mid-turn. OpenCode disarms on a new user message and Pi on `agent_start`, each through the shared withdraw helper and only for an armed record whose `sessionId` is its own. The record ends `disarmed` with reason `user-message`, the session gets the extra nudge, the hop history lists the note as withdrawn, the plugin logs `arm-cancelled`, and the killer logs `killer-no-armed-record` and stands down. The note stays open and the wrapper prints no claim command for it, because `should-relaunch` reports the record as `withdrawn`. OpenCode also drops the nudge it held, so the extra nudge replaces the old one instead of repeating it on the next turn.

The shared nudge module gives every adapter the note path and the same suppression rules. Outside `skilled-loop`, with `SKILLED_LOOP_ID` unset or empty, the nudge never asks for `prepare`, because prepare could only print a manual claim command and a session that stopped there would wait for a hand-off nobody runs. It asks for the note and `keep` instead, as Outside The Loop below describes. A re-nudge reuses the note this session already has open, matched on `session_id` and a `status` of `open`, and only takes a new name when no such note exists. A new note is named `<UTC stamp>-<session id>.md` with the full id, because OpenCode and Pi ids start with a shared time-based prefix and two sessions nudged in the same second would otherwise plan the same note. An open note under the older eight-character name is still found and reused. A record that is pending, or armed and still inside `SESSION_RELAUNCH_MAX_AGE_MIN`, means the handoff steps already ran, so no adapter nudges. An armed record past the age limit is stale, cannot relaunch and no longer silences the nudge. The age limit resolves the way the wrapper resolves its switches, from the hook config file with the environment taking precedence. On Claude Code the nudge stays silent for a tool call that carries an `agent_id`, because a sub-agent or fork reports its parent's session and transcript, so its fill and its note would be the parent's.

Inside the loop, no adapter nudges once `SKILLED_LOOP_HOPS` reaches `SESSION_RELAUNCH_MAX_HOPS`, because a record prepared there could not relaunch. Every seed handler reads the note path back out of the seed, so the claim instructions it adds name the real note.

Codex reads the latest `token_count` record in the rollout named by the payload's `transcript_path` and nudges through `additionalContext` on `PostToolUse`. Its `UserPromptSubmit` entry point handles seed prompts and runs the same nudge check, because Codex binds each script to one event. Its `Stop` adapter accepts only `hook_event_name: Stop` and passes `transcript_path` to the killer. Claude, Codex and Hermes write the armed state before starting the killer, so a killer spawn failure does not return the record to pending.

In Hermes the `repo-guards` plugin keeps each session's `post_api_request` usage in memory, returns the context adapter's text on `pre_llm_call` for a seed first turn or a threshold crossing, and arms the matching record on `on_session_end`, which fires after every message. `on_session_finalize` and `on_session_reset` drop the recorded usage. When Hermes does not include a context window in the event, the plugin resolves it from Hermes model metadata. The Hermes killer runs without `--transcript`, so idle means the configured idle time has elapsed since it started.

Every arm path restarts a killer for an armed record that has no live killer owner: Claude Stop, Codex Stop, Hermes session end, OpenCode `session.idle` and Pi `agent_end`. It does nothing while a killer owns the lock. A record left armed by a failed spawn is therefore recovered by the next arm event.

The killer polls transcript mtime every 100 ms. When the transcript stays unchanged for `--idle-ms` (3000 ms by default), it confirms the target is a descendant of the loop and re-reads the record. It sends SIGTERM only when the record is still armed, below the hop cap and still fresh at the end of the SIGTERM grace period by the wrapper's own age rule. At or above the cap it unarms the record with reason `hop-cap`, logs `killer-hop-cap` and sends neither a signal nor a notification. A record that would be stale by then is unarmed with reason `stale` and logged as `killer-stale`, so the killer never ends a session the wrapper would refuse to relaunch. The OpenCode plugin runs on Bun, so it starts the killer with `node` instead of `process.execPath`, which points to the OpenCode CLI. The `--loop-id` value must be greater than 1. If the record is no longer armed, the killer logs `killer-no-armed-record`. If the target exits during the SIGTERM call, it logs `target-gone`.

The idle deadline (`--timeout-ms`, 30000 ms by default) does not shorten the 5000 ms grace period after SIGTERM. If the idle deadline passes before the transcript is idle, or the target stays alive through the grace period, the killer disarms the record with reason `killer-timeout` and attempts a macOS notification with the manual claim command. Its title reads `Session relaunch needs attention (killer timed out)`, and when `SKILLED_LOOP_MANUAL_TEMPLATE` is unusable a subtitle says the template was ignored and gives the reason.

A single failed transcript read is not a vanish. The killer gives up only when the transcript has stayed unreadable for 1 s without a break (`TRANSCRIPT_MISSING_GRACE_MS`). That give-up follows the timeout path: the record is disarmed with `killer-timeout` and the notification is attempted.

The killer lock stores its owner pid, a creation timestamp and an expiry timestamp. The expiry is the idle timeout plus 5000 ms of signal wait, 3000 ms of notification time and a 60000 ms margin. A lock past its expiry, or a two-field lock from an earlier build that is older than 10 minutes, does not count as a live owner even while its pid exists, because that pid may by then belong to an unrelated process. A live owner or a lock younger than five seconds without a readable owner pid logs `killer-lock-held`. Taking over a stale lock first acquires a takeover mutex, the `<lock>.takeover` directory, whose `owner` file records the pid and token of the killer that holds it. The mutex is reclaimed only when that owner is dead. A mutex with no owner file is reclaimed once it is older than 30 s. The reclaim is an atomic rename. A live holder keeps exclusion only while the directory stays younger than the 10-minute hold bound, because a real holder holds the mutex for a re-check, an unlink and a create, never minutes. Past that bound the recorded pid counts as reused and the mutex is reclaimed. A killer that cannot acquire the mutex logs `killer-lock-held`. The mutex holder re-checks the lock, logs `killer-lock-stale`, removes the lock and retries once. Leftover `.stale-` takeover directories older than 30 s are swept under the mutex. The killer writes its pid and a random token to the mutex `owner` file. On release it renames the directory to a private `.stale-` name and removes it only when the inode it recorded and the token both still match, and otherwise renames it back. One window remains, and it needs three killers racing on the same loop's takeover: if a third killer recreates the mutex path while a mismatched directory is being renamed back, the displaced directory stays under its `.stale-` name until the stale sweep, and while it does, two killers can both pass the re-check, one can remove the lock the other just created with its exclusive open, and both then supervise the loop. Directories offer no atomic compare-and-delete, which is why the window remains. The killer releases the lock file the same way: it removes the file only while the recorded owner pid is its own, and logs `killer-lock-not-owned` when a contender has taken it over. An owner file that cannot be read fails the killer with `killer-error` and exit code 1. The exceptions are a non-directory at the mutex path, which has no owner file and is judged by age, and an owner read that fails with `ENOENT` or `EACCES`, which counts as no owner. If releasing the mutex fails after the takeover has finished, the killer logs `killer-mutex-release-error` with the error code. The takeover result stands: the killer keeps the lock it acquired and continues supervising.

After the selected runtime exits, `skilled-loop` declines unless the record is armed, fresh and below the hop limit. It consumes an eligible record, increments the hop count and launches that runtime with a seed that carries the Gate 3 answer:

~~~text
[session-relaunch] claim and continue handoff <note-path> | Spec folder: <spec-folder> (carried from the handoff; Gate 3 answered in the sending session)
[session-relaunch] claim and continue handoff <note-path> | Spec folder: none (Gate 3 answered D, Skip, in the sending session)
~~~

If the record is still pending when the runtime exits, `skilled-loop` prints the runtime-specific manual claim command on stdout and preserves the runtime's exit code. The core fills that command from `SKILLED_LOOP_MANUAL_TEMPLATE`. When a carried model, name, provider or Pi extension value contains the template's `@@HANDOFF@@` placeholder, the wrapper prints an error naming the value on stderr, then the plain command, and turns a clean runtime exit into exit 1. The CLI's `prepare` warns on stderr the same way when the template holds no placeholder or more than one. For a valid repo-relative `spec_folder`, the wrapper adds a `Spec folder:` suffix with the packet path. When the field is `none`, it adds a Skip suffix. An empty field adds no suffix, so the receiver asks Gate 3 as usual. A valid path carries the sending session's answer across the hop. AGENTS.md states that a relaunch hop is the same session. The receiver claims the note and reads its four sections. For a packet path, it runs `/speckit:resume`. For `none`, it skips resume and treats Gate 3 as answered D) Skip. It works only on the task's Remaining work. It never runs `prepare` for the claimed note. It runs `complete` when the task work ends:

~~~bash
node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs claim <note-path> --session <new-session-id>
node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs complete <note-path>
~~~

### Goal Packet

A note can carry an optional `goal_packet` frontmatter field: the repo-relative directory of the packet whose `goal.md` holds the sending session's goal. `prepare` and `keep` own the field. Each call resolves the sender's goal again and writes the result: the packet when the sender has a goal that can be proven, and no field at all when it has none. A value already in the note is replaced or removed, so a note prepared again after its goal ended stops handing the goal on, and a value written by hand does not survive. Where the goal is found depends on the sender's runtime:

| Sender | Where the goal is read |
|---|---|
| OpenCode, Pi, Devin, Cursor, Hermes | The session's active goal record under `.skilled/skills/.state/goal/`, which names the bound packet. A paused, completed or cleared goal counts as none. |
| Claude | The newest goal entry in the session log. A goal that is met, failed or cleared counts as none. The packet is the spec folder, one of its parent packets or a packet the goal text names, and its `goal.md` must carry the goal's opening line. With no readable log the goal cannot be proven, so no field is written. |
| Codex | Nowhere, so no field is written. Codex keeps a goal per thread in `goals_1.sqlite` under its home, with the objective text and a status and no packet, and no populated record has been read from it. A spec folder that holds a `goal.md` does not show that the sender had a goal, so a Codex hand-over carries no goal packet. |

A written value is checked the way `spec_folder` is: a repo-relative packet path whose directory and `goal.md` stay inside the repository once links are followed, in this checkout or in the working directory the note names. A resolver that finds nothing, cannot prove the goal or cannot read its source leaves the field out and never fails the hand-over. The note carries the path and never the goal text, because a copy would go stale while `goal.md` changes. A note written before this field claims and hands over unchanged.

`claim` ends its output with a `Goal packet: <path>` line when the packet still holds a `goal.md`. `consume` reports the packet as `goal_packet`, and `skilled-loop` exports it as `SESSION_RELAUNCH_GOAL_PACKET` to the relaunched session only. The wrapper removes the variable from the first launch and from any hop whose note carries no packet. Binding the goal in the receiving runtime is the receiving adapter's work: this layer records the packet and passes it on. `SESSION_RELAUNCH_GOAL=0` turns all of it off. `prepare` and `keep` then neither write, replace nor remove the field, and `claim` and the wrapper pass nothing on.

### Outside The Loop

A session started without `skilled-loop`, such as one opened before the shell shim was sourced, cannot relaunch. Auto-compaction then shortens its context to a summary, and the summary drops detail: merge decisions, open conflicts and exact next steps. At the threshold the nudge therefore says the session cannot relaunch and asks it to write the same note, run `/speckit:save` when a packet is bound, and then run `keep`:

~~~bash
node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs keep --handoff <note-path> --session <session-id> --runtime <runtime>
~~~

`keep` validates the note the way `prepare` does, closes this session's earlier claimed notes, appends a `note-kept` line to the hop history, prints the `claim` and `complete` commands and exits 0. The session keeps working. While this session has an open note, the nudge stays quiet, so writing the note does not set off the reminder 0.05 higher. Inside the loop `keep` refuses with exit 2 and names `prepare`. On Claude Code, the `compact-pointer` hook on `SessionStart` reads the event's `source`. After a compaction it resets this session's nudge level, so the next fill nudges again, and adds the claim instructions for the session's open note, so the compacted session claims the note, works its Remaining work and completes it. It adds nothing while a prepared hop owns the note. When the record for that note was withdrawn or cancelled and the session has not written to the note since, the hook logs `compact-pointer-stale-note` and tells the session to read the note for background only and not to claim it. The note predates the work done since the withdraw, so the session updates it at the next nudge. Pi does the same on `session_compact` and OpenCode on `session.compacted`: each resets the session's nudge level, drops a nudge it still holds, because that text quotes the fill the compaction freed, and sends the claim instructions for the open note, with Pi's sent as a hidden message and OpenCode's added to the next system prompt. Each logs `compact-pointer`. When the record for the note was withdrawn and the session has not written to the note since, Pi and OpenCode send the same read-only note text Claude does and log `compact-pointer-stale-note` instead. OpenCode keeps that text in the system prompt only while the withdrawal stands. Codex and Hermes have no compaction hook here, so their sessions follow the claim command `keep` printed. Before it resets the nudge level or points at a note, the hook skips when the event carries no `transcript_path`, when the transcript file is not named `<session_id>.jsonl`, or when a forked sub-agent's transcript under `<session-folder>/subagents/` holds a compaction record from the last 5 seconds. A fork carries its parent's session id, so without that last check a fork's compaction would point the fork at the parent's note and reset the parent's nudge level. Each skip appends a `compact-pointer-skipped` line to `relaunch.log` with its reason. On Claude Code a `PreToolUse` guard, `claude/subagent-guard.mjs`, denies `claim`, `complete`, `keep` and `prepare` when the call comes from a sub-agent or fork, which Claude Code marks with an `agent_id`, because such a call would act on the parent's note. `history` stays allowed.

### Sub-Agents And Nested Runs

An OpenCode `task` sub-agent is a child session with its own id. The plugin records every session whose `session.created` or `session.updated` event carries `info.parentID` and skips it everywhere, so a child never gets a nudge, a seed or an arm. Pi has no built-in sub-agent.

A runtime started from inside a looped session, such as `claude -p` or `pi -p` run from a tool shell, inherits `SKILLED_LOOP_ID` without being the loop's runtime. The Claude, Pi and OpenCode adapters and the `prepare`, `keep` and `cancel` commands check the process tree first (the Codex and Hermes adapters do not): when two or more processes sit between the host runtime and the loop pid, the run is nested, so it logs `loop-nested-run` and drops every `SKILLED_LOOP_` variable from its own environment. That includes `SKILLED_LOOP_MANUAL_TEMPLATE` and the carried model, name and provider values, which would otherwise make the nested run print the outer loop's command. A nested run then behaves as a session outside the loop, and `prepare` there exits 3 instead of arming the outer loop. `cancel` drops the inherited loop id the same way, so it never cancels the outer hand-over unless you pass `--loop-id`. The check fails open, so a process table it cannot read leaves the variables in place.

---

## 4. STATE FILES

The relaunch record uses `XDG_RUNTIME_DIR/skilled-relaunch` when `XDG_RUNTIME_DIR` is set. When it is unset, the record uses `skilled-relaunch-<uid>` under the operating system temporary directory, because a shared temp directory would otherwise let the first user on a host create a directory the second user cannot own. The directory must be a real directory owned by the current user. A symlink, a plain file or a foreign owner fails with `relaunch state directory must be a real directory owned by the current user: <dir>`, and a directory that passes is set to mode 0700. Its filename is `relaunch-<loop-id>.json`.

| Relaunch status | Meaning |
|---|---|
| pending | Prepare accepted the note. The runtime's arm event has not armed the record yet. |
| armed | The runtime's arm event armed the record and started the killer: `Stop` on Claude and Codex, `agent_end` on Pi, `session.idle` on OpenCode and session end on Hermes. |
| disarmed | The record ended without a relaunch. A session that never went idle before the deadline, a transcript unreadable for 1 s and a session still running after the SIGTERM grace period end with reason `killer-timeout`. A record whose hop count already reached `SESSION_RELAUNCH_MAX_HOPS` ends with reason `hop-cap`, and one past its age limit ends with reason `stale`. In both cases the killer sends no signal. A new turn in the arming session ends the record with reason `user-message` on Pi and OpenCode, and so does an operator prompt over an armed record on Claude and Codex or over a deferred one on Claude. `cancel` ends a pending or armed record with reason `cancelled`. `should-relaunch` reports both of those reasons as `withdrawn` and every other record that is not armed as `not-armed`. |

A corrupt relaunch file is treated as absent. `should-relaunch` declines it with reason `no-file` and logs `corrupt-relaunch-file`. The CLI also treats `EACCES`, `ENOTDIR` and `EISDIR` while reading the record as absent. Other errors return exit 2.

The handoff note has a separate status field:

| Note status | Meaning |
|---|---|
| open | Written and ready for a receiving session. |
| claimed | The receiving session claimed it. The note records `claimed_by` and `claimed_at`. |
| done | The receiving session completed the handoff, or `prepare` closed an earlier note of this session when it prepared a successor hop. |

When a new hop goes ahead, `prepare` marks as `done` every other note this session claimed and every other open note this session wrote, adds `completed_at` and sets `superseded_by` to the new note's basename.

The hook keeps per-session nudge levels in `nudge-<session-id>.json` in the same runtime state directory. After a withdraw or a `cancel` the file also holds the one extra nudge as a `rearm` field. The field starts pending and becomes a fill floor, the fill at the first check at or past the threshold plus 0.05, without nudging on that check. A delivered nudge or a compaction writes the level alone and so spends the grant. Every write to a relaunch record (prepare, arm, disarm, defer, withdraw and the removal `consume` makes) and the claim and completion of a note run under a lock beside the file, so two writers cannot both act on the same read. A lock that cannot be taken lets the write go ahead without it. The hooks and wrapper append events to `relaunch.log` on a best-effort basis. The killer appends its events there too. A failed append in the killer is not swallowed. Each event is one line, appended under fsync at mode 0600, with the mode re-pinned on every append. When the previous last line has no newline, as after a partial write, the new event starts on its own line, so concurrent writers keep one event per line. A short write, from a full disk or a file-size limit, throws `relaunch log short write: wrote X of Y bytes to <path>` instead of losing the event quietly. The killer lock file stores the owner pid, the creation timestamp and the expiry stamp. A lock past its expiry counts as stale, so a reused pid cannot keep the loop pinned. Active or newly created locks log `killer-lock-held`. Stale locks log `killer-lock-stale` before the killer removes and retries them.

### Hop History

`relaunch.log` sits in a temporary directory the system clears, so it is no record of past hops. Each hop therefore also appends one line to `.skilled/skills/.state/session-relaunch/hop-history.log`, beside the handoff notes. That folder is gitignored and persists. A repository that links this checkout's `.skilled` writes to the same file, and each line carries the session's folder so you can tell them apart.

| Event | Written when |
|---|---|
| `handed-over` | The wrapper passed its last checks and relaunched, so the session handed over. `should-relaunch` writes nothing, because the wrapper can still decline after it approves. The line carries the hop number. |
| `claimed` | A session claimed the note. The line ends with the first eight characters of the claiming session's id, and `history` prints them as `by <id>`. The note's file name names the session that wrote it, so a session that claimed its own note shows the same id in both. |
| `done` | The fresh session completed the note. |
| `withdrawn` | The session called off its prepared hand-over, through `cancel`, an operator prompt over a deferred or armed Claude record, a prompt over an armed Codex record or a new turn over an armed Pi or OpenCode record. The note stays open with that session. |
| `timed-out` | The old session did not end in time, so the killer disarmed the record and no hop ran. |
| `note-kept` | A session outside the loop wrote its note and ran `keep`, so it continues in place and claims the note after auto-compaction. |

Each line holds the time, the event, the runtime, the hop number, the session folder, the first line of the note's Goal and the note's filename, separated by tabs. A failed write never fails the hop. Read the latest lines with `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history`, or `history --last <count>`, and `/doctor:setup` shows the last one. When a handoff note is still `open`, both add a line such as `open notes: 2 handoff notes not claimed yet, oldest <filename>`, so a hand-over nobody finished is visible. A note whose newest history line is `withdrawn` is counted apart, as `1 withdrawn note still with its session`, because its session holds it and nobody left it unclaimed. Handing the note over again makes it unclaimed work once more. Set `SESSION_RELAUNCH_NOTIFY_HOPS=1` for a macOS notice each time a session hands over.

---

## 5. SWITCHES AND DEFAULTS

Hook switches resolve from the environment and the optional `.skilled/hooks/hook-flags.env` file. An environment value takes precedence over the file value.

| Switch | Default | Behavior |
|---|---|---|
| `SYSTEM_SESSION_RELAUNCH_DISABLED` | unset, enabled | Set to `1` to disable the context-nudge, Stop-arm and compact-pointer hooks. |
| `SYSTEM_HOOKS_DISABLED` | unset, off | A truthy value disables hooks across the repository. `MK_HOOKS_DISABLED` is a supported alias. |
| `SESSION_RELAUNCH_THRESHOLD` | `0.80` | Context fill ratio that triggers the first nudge. Invalid values use `0.80`. Valid values are greater than 0 and at most 1. |
| `SESSION_RELAUNCH_WINDOW_TOKENS` | unset, resolved automatically | A positive value overrides Claude settings. Otherwise the resolver checks the project-local settings override, then the project settings, from the session cwd up to the repository root, and the settings file in the home directory for `autoCompactWindow`. Outside a repository only the cwd is checked. If none is usable, a model name containing `[1m]` uses a one-million-token fallback. Other models use a 200-thousand-token fallback. |
| `SESSION_RELAUNCH_MAX_HOPS` | `10` | Highest completed hop count allowed. The cap is enforced at three points: the wrapper declines a record at or above it, `prepare` at that count writes no record, prints its hop-limit line with the manual claim command and exits 3, and the killer unarms the record with reason `hop-cap` and signals nothing. Inside the loop, no adapter nudges at the cap. Zero is accepted and declines every hop. Unset, empty, negative, non-integer or non-numeric values use 10. |
| `SESSION_RELAUNCH_MAX_AGE_MIN` | `10` | Maximum age in minutes for an armed relaunch record. Zero is accepted and makes any older record stale. Unset, empty, negative or non-numeric values use 10. |
| `SESSION_RELAUNCH_NOTIFY_HOPS` | unset, off | Set to `1` for a macOS notice titled "Session handed over" each time the wrapper relaunches a session. It names the runtime, the session folder and the note's goal. Off by default, so a clone shows no notice until its owner sets it. |
| `SESSION_RELAUNCH_GOAL` | unset, on | Set to `0`, `false`, `off` or `no` to stop the hand-over from carrying the sender's goal packet. Also read from `.skilled/hooks/hook-flags.env`. |
| `SESSION_RELAUNCH_GOAL_PACKET` | wrapper-managed | Exported by `skilled-loop` to the relaunched session when the consumed note carries a usable goal packet. Never set it by hand. |
| `SESSION_RELAUNCH_REPO_ROOT` | unset, the install root | Absolute path to the repository that holds the concern. Planned handoff note paths resolve under it, so a runtime started in a subdirectory still writes under the repo root. The generic `REPO_ROOT` is not read. |
| `SKILLED_LOOP_HOPS` | `0` | Wrapper-managed completed-hop count. It must be a non-negative integer. |

The wrapper accepts `-n` or `--name` with a value, and `--name=value`. The first launch keeps the original name argument. The wrapper copies the name to later hops. A `--` argument ends the name scan, so later values are passed through as Claude arguments.

The killer CLI requires `--loop-id` and `--target-pid`. `--transcript` is optional: the Claude and Codex Stop hooks and the Pi arm pass it (Pi passes its session file when the path resolves). The Hermes arm and the OpenCode plugin do not. Without it, idle means the configured idle time has elapsed since the killer started. The loop id must be greater than 1 and match `SKILLED_LOOP_ID`. The defaults are `--idle-ms 3000` and `--timeout-ms 30000`. The killer polls every 100 ms. `--no-notify` defaults to off. Without it, a timeout attempts a notification. The Stop hook starts the killer without `--no-notify`.

`prepare` receives the note through `--handoff <path>`, while `claim` and `complete` receive it positionally. Both `prepare` and `claim` require `--session <id>`. Only Claude Code can omit the flag and use `CLAUDE_CODE_SESSION_ID`. A successful prepare exits 0 and leaves the record pending for Stop to arm. Outside `skilled-loop`, prepare prints the manual claim command and exits 3, and inside the loop it does the same at the hop cap. A refused prepare exits 2. `keep --handoff <path>` takes the same `--session` and `--runtime` options, exits 0 outside the loop and exits 2 inside it. `history [--last <count>]` prints the latest hop-history lines, 20 by default, or `no hop recorded yet` with the file path, then the open-notes line when any note is still open, and exits 0. `cancel [--loop-id <id>]` calls off the loop's prepared hand-over, with the loop id defaulting to `SKILLED_LOOP_ID`. A loop id inherited by a nested run is dropped first, and an explicit `--loop-id` still names the loop to cancel. It withdraws a pending or armed record through the same helper the adapters use, with reason `cancelled`. It logs `cancel`, writes a `withdrawn` line to the hop history, grants the session one more nudge and leaves the note open. It exits 0. With no prepared hand-over it exits 1. The nudge names this command inside the loop, for a session the operator asks to stay after prepare. `hand-over --handoff <path> [--hop <n>] [--runtime <runtime>]` records the hand-over. It does not consume the record and prints nothing. When the note is `open`, it writes the `handed-over` line and sends the optional notice. For any other note state it writes neither. The wrapper calls plain `consume`, reads the note state from its output and runs `hand-over` only for an open note it is about to relaunch, ignoring its exit status. The CLI prints its usage and exits 0 when it gets no command, `--help` or `-h`, and a wrong option prints the error plus that subcommand's usage line and exits 2.

---

## 6. TROUBLESHOOTING

A prepare exit code of 2 means the note or loop cannot be prepared. Common reasons include:

- The handoff path is missing, outside the handoffs directory or resolves outside that directory.
- The handoffs directory is reached through a symlink below the repository root.
- The note has invalid flat frontmatter, a non-open status, a different supplied session id, a missing required field or an empty required section.
- The note's `spec_folder` is a packet path that does not exist as a directory in the repository. `keep` refuses it the same way.
- The receiving session shows no `Goal packet:` line, or the note has no `goal_packet`. `prepare` and `keep` write it only when the sender's goal can be proven, so a Codex sender, a Claude session whose log cannot be read and a session whose goal has ended all leave it out. A `goal_packet` the note carried is removed on the next call in the same cases.
- No session id reached `prepare` or `claim`. Only Claude can fall back to `CLAUDE_CODE_SESSION_ID`. Other runtimes must pass `--session`.
- `SYSTEM_SESSION_RELAUNCH_DISABLED` or the master hook switch disables the concern.
- Inside `skilled-loop`, the runtime still has a live child shell from the list in section 3. The prepare command does not run this check outside the loop.
- `SKILLED_LOOP_HOPS` is not a non-negative integer.

When prepare exits 3, start the runtime through `skilled-loop`, by hand or through the shell shim in section 2, or use the printed manual claim command. At the hop cap, prepare writes no record, logs `prepare-declined reason=hop-cap`, and its first line reads `[session-relaunch] hop limit reached; continue in this session (auto-compaction remains the fallback)`. A corrupt relaunch JSON file is a decline with reason `no-file`. An unreadable Claude transcript yields no context usage, and unreadable Claude settings files are skipped as absent.

If the killer logs `killer-no-armed-record`, it found no armed record before signalling. `killer-hop-cap` means the record's hop count already reached `SESSION_RELAUNCH_MAX_HOPS`, so the killer unarmed it with reason `hop-cap` and sent no signal. `killer-stale` means the record would pass `SESSION_RELAUNCH_MAX_AGE_MIN` before the wrapper could read it, so the killer unarmed it with reason `stale` and sent no signal. `killer-manual-template` means `SKILLED_LOOP_MANUAL_TEMPLATE` did not hold exactly one note placeholder, so the timeout notice fell back to the plain manual command and its subtitle carries the same reason. `killer-lock-held` means another killer owns the lock or is creating it. `killer-lock-stale` means the owner process is gone or the unreadable lock is older than five seconds. `killer-lock-not-owned` means the lock no longer named this killer's pid when it exited, because a stall past the expiry let a contender take it over, so the killer left the file in place for its new owner. `target-gone` marks a target that exited between the final liveness check and SIGTERM. The killer polls every 100 ms. The idle timeout defaults to 30000 ms and the separate post-signal grace period is 5000 ms. If either wait expires while Claude remains alive, the killer disarms the record and logs `killer-timeout`. A transcript that stays unreadable for 1 s also ends with `killer-timeout`. A record that `cancel` disarmed while the killer watched it gets no timeout: the killer logs `killer-timeout-superseded`, writes no history line and sends no notification. `killer-timeout-superseded` replaces it when a later prepare armed a different note, or re-armed the same note with a new `armedAt` or `armId`, during the wait. The killer then logs the `watched` and `current` note paths and neither disarms nor notifies, because the newer note still needs its own killer. A signal probe that fails with `EPERM` means the pid belongs to another user's process, so the killer treats its target as gone instead of signalling it. `killer-lock-held` also appears while another killer holds the `<lock>.takeover` mutex. If an armed record has no live killer, the next arm event starts one. A live killer that owns the lock blocks that restart by design. `killer-error` with exit code 1 means the takeover mutex's owner file could not be read, for example because the owner path is a directory. The killer stops before the takeover and the armed record stays armed for the next arm event. `killer-mutex-release-error` means the `<lock>.takeover` directory could not be removed after the takeover finished. The takeover result stands and the killer keeps the lock it acquired, so this line does not mean the handoff failed. A leftover mutex is reclaimed by the next takeover once its owner is dead, or once it has no owner file and is older than 30 s.

When the relaunched session ends before it claims its seeded note, for example after an interrupt during the hop, the wrapper prints `warning: the relaunched session ended before claiming <note>; its handoff note was not claimed` and the manual claim command.

When Claude exits with code 130 and a relaunch record is eligible, the wrapper prints the manual claim command and exits 130 without relaunching. If the saved cwd is missing or the cwd or handoff path contains CR or LF, it prints the command and exits 1. A record that names no handoff or no cwd is declined with reason `incomplete-record`, and the wrapper keeps the runtime's exit code. Before a relaunch the wrapper checks the note state that `consume` reports, because a claim seed for any note that is not open fails in the fresh session. A note in another state prints `warning: the handoff note is <state>; not relaunching`. A failed consume, which also loses the Gate 3 answer, prints `warning: could not read the consumed relaunch record; not relaunching`. Both print the manual command and exit 1. Only when the note is open does the wrapper run `hand-over`, which writes the `handed-over` line, and then relaunch. On the other exit paths a consume failure prints a warning and the wrapper continues with the exit it was already handling. If the wrapper cannot decode the record returned by `should-relaunch`, it prints `warning: could not read the relaunch record` and consumes the record. It exits 1 when `should-relaunch` approved the hop and exits with the runtime's own exit code when `should-relaunch` declined. Neither path prints a manual claim command. When `should-relaunch` declines with reason `withdrawn`, the session called off its hand-over and kept working. The wrapper consumes the record, prints `warning: the prepared hand-over was withdrawn in the session; <note> stays open and out of date`, prints no manual claim command and exits with the runtime's own exit code. Other `should-relaunch` failures with status 2 or higher print a warning and preserve Claude's exit code.

---

## 7. TESTS

Run every session-relaunch Node test file from the repository root. The glob picks up a new test file without an edit here:

~~~bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs
~~~

---

## 8. DIRECTORY TREE

```text
session-relaunch/
+-- bin/session-relaunch.cjs
+-- claude/
|   +-- compact-pointer.mjs  (SessionStart after a compaction)
|   +-- context-nudge.mjs
|   +-- stop-arm.mjs
|   +-- subagent-guard.mjs  (PreToolUse, Bash from a sub-agent)
+-- codex/
|   +-- context-nudge.mjs    (PostToolUse)
|   +-- prompt-seed.mjs      (UserPromptSubmit)
|   +-- shared.mjs
|   `-- stop-arm.mjs         (Stop)
+-- hermes/
|   +-- context-nudge.mjs    (pre_llm_call bridge)
|   `-- session-end-arm.mjs  (on_session_end bridge)
+-- pi/
|   +-- session-relaunch.ts
|   `-- session-relaunch.test.ts
+-- opencode/
|   `-- session-relaunch.js (browsability symlink -> ../../../plugins/session-relaunch.js)
+-- lib/
|   +-- context-usage.cjs
|   +-- hop-history.cjs
|   +-- killer.cjs
|   +-- nudge.cjs
|   +-- relaunch-core.cjs
|   `-- withdraw.cjs
`-- tests/ Node test files, one per area plus the adapter conformance table, and payload fixtures
```

---

## 9. RELATED

- [Hooks index](../README.md)
- [Injection contract](../injection-contract.md)
- [skilled-loop entrypoint](../../bin/README.md)
- [/speckit:handoff](../../commands/speckit/handoff.md)
- [System-spec-kit feature entry](../../skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md)
- [Claude session relaunch scenarios](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md)
- [Pi and OpenCode session relaunch scenarios](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md)
- [Codex, Cursor, Hermes and Devin session relaunch scenarios](../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md)
