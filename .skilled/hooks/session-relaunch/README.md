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

Claude Code uses `PostToolUse`, `UserPromptSubmit` and `Stop`. Pi, OpenCode, Codex and Hermes use their host events or a bridging plugin. Cursor and Devin ship on the command trigger only. Start every runtime through `skilled-loop` for the loop.

### Runtime adapter matrix

| Runtime | Trigger | Relaunch seed syntax | Model carry | Mirror form | Spike evidence | Verdict |
|---|---|---|---|---|---|---|
| Claude | automatic | `claude [--model <model>] "<seed>" [--name <name>]` | `--model`, `--model=` | [.claude/settings.json](../../../.claude/settings.json) hook entries | [SPIKE-REPORT.md](../../../specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/scratch/spike/SPIKE-REPORT.md) | AUTO |
| Pi | automatic | `pi [--provider <p>] [--model <model>] [-ne] [-e <path>] [--name <name>] "<seed>"` | `--model`, `--provider`, extension flags | `.pi/extensions/` symlink to `pi/session-relaunch.ts` | [SPIKE-REPORT.md](../../../specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md) | AUTO |
| OpenCode | automatic | `opencode [-m <model>] --prompt "<seed>"` | `-m`, `--model`, `--model=` | `.opencode/plugins/` plugin plus `opencode/` browsability symlink | [SPIKE-REPORT.md](../../../specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md) | AUTO |
| Codex | automatic | `codex --no-daemon [-m <model>] "<seed>"` | `-m`, `--model`, `--model=` | [.codex/hooks.json](../../../.codex/hooks.json) hook entries plus `.codex/hooks/` symlinks | [SPIKE-codex.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-codex.md) | AUTO |
| Cursor | `/speckit:handoff` | `cursor-agent [--model <model>] "<seed>"` | `--model`, `--model=` | [.cursor/commands/speckit-handoff.md](../../../.cursor/commands/speckit-handoff.md) symlink | [SPIKE-cursor-hermes.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-cursor-hermes.md) | COMMAND-ONLY |
| Hermes | automatic | `hermes chat [--provider <p>] [-m <model>] -q "<seed>"` | `-m`, `--model`, `--provider` | `.hermes/plugins/repo-guards/` bridges plus `.hermes/prompts/` | [SPIKE-cursor-hermes.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-cursor-hermes.md) | AUTO |
| Devin | `/speckit:handoff` | `devin [--model <model>] -- "<seed>"` | `--model`, `--model=` | none, [.devin/SYNC.md](../../../.devin/SYNC.md) carries no command surface | [SPIKE-devin.md](../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-devin.md) | COMMAND-ONLY |

`skilled-loop` exports `SKILLED_LOOP_RUNTIME` with the selected runtime. It carries the first launch's model for every runtime. Pi and Hermes also carry their provider. Claude and Pi carry their name. Pi carries its extension flags. Relative Pi extension paths resolve against the wrapper's starting directory. `prepare` and `claim` require `--session <id>`. Only Claude can omit it and use `CLAUDE_CODE_SESSION_ID`. Other runtimes pass the id directly. Runtimes with no session-id variable, such as Devin or Cursor, run `uuidgen` once and reuse the value. `CLAUDE_PID` supplies Claude's process id for the shell-child check, and Stop keeps it as the killer target while it descends from the loop. `complete` requires only the note path.

### Automatic triggers on Codex and Hermes

Codex binds three repo hooks rendered from `hook-registry.json` into [.codex/hooks.json](../../../.codex/hooks.json). `prompt-seed.mjs` binds `UserPromptSubmit`: a `[session-relaunch]` prompt receives the claim-seed instructions, and a non-seed prompt runs the same threshold check as `context-nudge.mjs`, which binds `PostToolUse`. The Codex hook installer allows each script under one event only, so seed detection and the mid-session nudge are separate entry points over `shared.mjs`. The fill comes from the transcript rollout's latest `token_count` event: `last_token_usage.input_tokens` is the numerator and `cached_input_tokens` stays out because it is already inside that count. The window is `SESSION_RELAUNCH_WINDOW_TOKENS`, then the event's `model_context_window`. The nudge reaches the model as `hookSpecificOutput.additionalContext`, the envelope the repo's other Codex adapters emit. `stop-arm.mjs` accepts only payloads whose `hook_event_name` is `Stop`. It resolves the target, arms a matching pending record, then spawns the killer with `--transcript <transcript_path>`. A spawn failure leaves the record armed until the next Stop restarts its killer. Codex exports no pid variable, so the killer target resolves through the same ancestor rule the CLI's running-work check uses. `skilled-loop codex` always starts Codex with `--no-daemon` because its shared app-server daemon keeps the environment of the session that started it. In a git worktree, Codex reads its `hooks.json` from the main checkout, not the worktree. The automatic hop needs the session-relaunch rows in the main checkout's file. Each of those three rows, like the three session-relaunch rows in the Claude settings file, carries the repo's hook-drift fallback: a missing adapter prints a `mk-hook-drift host=<host> event=<event> adapter=<script>` line on stderr and still returns an envelope the host accepts. Claude's fallback adds `mkHookDrift: true`. Codex omits that key, because it rejects unknown keys, and answers its Stop event with `systemMessage` instead of `hookSpecificOutput`, because it rejects that envelope on Stop.

Hermes runs through the enabled `repo-guards` project plugin, so the operator changes nothing in the user config. The plugin bridges three events to the Node entry points under `hermes/`. `post_api_request` records each call's `usage` per session. `pre_llm_call` runs `context-nudge.mjs` and returns the seed text on a `[session-relaunch]` first turn or the handoff text once the fill crosses the threshold, appended to the turn's user message. `on_session_end` runs `session-end-arm.mjs` and accepts a missing event name from the bridge, but rejects a supplied name other than `on_session_end`. It arms a pending record for this session and detaches the killer with the Hermes process resolved by the ancestor rule. A killer spawn failure leaves the record armed until the next session end restarts its killer. Hermes fires `on_session_end` after every message, so the plugin keeps each session's recorded usage until `on_session_finalize` or `on_session_reset` clears it. The fill counts input plus cache read and cache write tokens, never output. The window is `SESSION_RELAUNCH_WINDOW_TOKENS`, then the event's `model_context_window`. If the event omits that field, the plugin resolves the window from Hermes model metadata. The 200-thousand-token default applies only when neither source provides a window. The nudge state logs which source supplied the window.

### Command-only runtimes: Cursor and Devin

Cursor ships on the command trigger for two reasons. Its spike evidence is source-only: the bundle's hook dispatch code was inspected, but no live payload was captured because the machine's Cursor credentials were expired and no permitted provider exists for Cursor. And `stop` is not wired in this repository's [.cursor/hooks.json](../../../.cursor/hooks.json), whose registered event list has no `stop`. Devin ships on the command trigger because its hook usage is unverified: the historical probe summarizes field names without a raw payload and current `SessionEnd` behavior is unknown, so an automatic arm cannot be proven.

Start a handoff by running `/speckit:handoff` inside the session. It writes the note and runs `prepare`. Outside `skilled-loop`, prepare prints the manual claim command and exits 3, and that line starts the hop by hand. The printed command uses the selected runtime's seed form: Claude, Pi, Codex and Cursor use the seed as a positional argument, OpenCode adds `--prompt`, Hermes adds `chat -q`, and Devin adds `--` before the seed. `!` in a handoff path sits in single quotes outside the seed's double quotes. For example, the CLI and wrapper print `...handoff /tmp/han"'!'"doff.md`, which interactive Bash preserves when history expansion is on. Cursor reaches the command through [.cursor/commands/speckit-handoff.md](../../../.cursor/commands/speckit-handoff.md), a symlink to the canonical file. Devin has no command surface, so a Devin session reads [.skilled/commands/speckit/handoff.md](../../commands/speckit/handoff.md) directly and follows it. Under `skilled-loop`, a record prepared on a command-only runtime stays pending because no arm event exists for it, so the hop runs by launching the wrapper with the claim seed.

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

---

## 3. HANDOFF PROTOCOL

Claude's `context-nudge` handles `PostToolUse` and `UserPromptSubmit`. It reads the latest main-chain assistant usage from the Claude transcript and compares the fill ratio with the configured threshold. The default threshold is 0.80. One more nudge fires 0.05 above that level. Each level fires once. The adapter accepts session ids matching `[A-Za-z0-9_-]{1,128}`. Transcript read errors produce no usage. Failed Claude settings reads are treated as absent.

The nudge reports the fill as `[session-relaunch] Context is about N% full.`, or as `[session-relaunch] Context is past the configured window (over 100% full).` when the ratio is above 1. It then lets the session finish instead: `If the remaining work fits in a few more steps, finish it instead and skip these steps.` A session with more work left does the handoff steps now, before any other work, so a fresh session continues before auto-compaction has to. The nudge gives the operator the last word. If the operator has told the session not to hand off, it skips the note, continuity save and prepare steps, keeps working and leaves auto-compaction as the fallback. The nudge names a handoff note under `.skilled/skills/.state/session-relaunch/handoffs/` and a prepare command. The path resolves under the repository that holds the concern, so a runtime started in a subdirectory still writes under the repo root. The note needs flat frontmatter and four non-empty sections: Goal, Done, Remaining work and In-flight state. The Remaining work section lists only unfinished task work. Note creation, continuity saving and `prepare` are handoff steps. When `spec_folder` is a packet path, Claude uses `/speckit:save`. Other runtimes send the save JSON to the [continuity writer](../../../.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js) with `--stdin --full-auto <spec-folder>` before prepare. `spec_folder` holds the repo-relative packet path, `none` when Gate 3 was answered D) Skip or empty when Gate 3 was never answered. The nudge fills it from `SYSTEM_SPEC_FOLDER` when that names a valid packet and prints it empty otherwise, so the model never copies a placeholder that prepare rejects. A seed whose note path is not absolute adds nothing to the receiving session's context on any runtime.

The `/speckit:handoff` command writes the note and runs `prepare`. The direct CLI form is:

~~~bash
node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff <note-path> --session <session-id> --runtime <runtime>
~~~

Prepare validates the note first. An invalid note exits 2. Outside `skilled-loop`, it prints a manual claim command and exits 3 without checking for running shell children. Inside the loop, a live child of the runtime process exits 2 when its command name is `sh`, `bash`, `zsh`, `fish`, `dash`, `ksh`, `mksh`, `tcsh`, `csh`, `nu` or `pwsh`. A leading `-` is stripped before that lookup, so a login shell still matches. Any other child program is not detected. The runtime pid comes from `CLAUDE_PID` while that process descends from the loop. Otherwise, and on runtimes without the variable, the check resolves the runtime as the direct child of the loop on prepare's ancestor chain. When no runtime resolves, it logs `running-work-check-skipped` and skips. A shell that is prepare's own ancestor does not count. `--runtime` must name one of Claude, Pi, OpenCode, Codex, Cursor, Hermes or Devin. Outside `skilled-loop` it overrides the environment or Claude default. Inside the loop, a supplied value must match `SKILLED_LOOP_RUNTIME` or prepare exits 2. The nudge includes the selected runtime in its prepare command. A successful prepare writes a pending record and exits 0. At the hop cap it writes no record, prints the hop-limit line with the manual claim command and exits 3.

Every arm path asks the core whether the record is armable: its loop id, session id and runtime must match the arming session, where a record with no runtime counts as Claude's. A pending record arms. An armed record re-arms only when no killer is live for the loop, and the re-arm restamps `armedAt` and the cwd, so a record whose killer died is fresh again when the next arm event fires. Stop matches the event session id to the stored record. A pending record stays pending when `transcript_path` is missing. The hook logs `missing-transcript-path` and returns. While background tasks remain it leaves the record as it is, pending or armed, so a respawned killer never ends live work. Stop then resolves the killer target before it arms: `CLAUDE_PID` while that process descends from the loop, otherwise the loop's direct child on the hook's ancestor chain, never the `bash -c` shell the hook runs under. When neither resolves, it logs `stop-arm-error stage=target-pid` and the record stays pending. Otherwise Stop arms the record and starts the detached killer.

Pi checks usage at `message_end` and holds the nudge for `agent_end`, because the message that crosses the threshold usually carries the prepare call itself. At `agent_end` it re-checks the pending or fresh armed record and the hop limit, then sends the held text with `deliverAs: 'followUp'` and `triggerTurn: true`, so the nudge reaches the model without an operator turn. Its adapter finds `killer.cjs` by walking up from any repository subdirectory. `tsconfig.pi.json` includes the extension entry so the adapter is type-checked. OpenCode adds its active nudge to the system prompt on every request while this session has no pending or fresh armed record, and outside `skilled-loop` while the planned note file does not exist. It keeps a claim seed in the system prompt until the note leaves `open` or a new non-seed user message arrives, then arms the record on `session.idle`.

The shared nudge module gives every adapter the note path and the same suppression rules. A re-nudge reuses the note this session already has open, matched on `session_id` and a `status` of `open`, and only takes a new timestamped name when no such note exists. A record that is pending, or armed and still inside `SESSION_RELAUNCH_MAX_AGE_MIN`, means the handoff steps already ran, so no adapter nudges. An armed record past the age limit is stale, cannot relaunch and no longer silences the nudge. The age limit resolves the way the wrapper resolves its switches, from the hook config file with the environment taking precedence.

No adapter nudges once `SKILLED_LOOP_HOPS` reaches `SESSION_RELAUNCH_MAX_HOPS`, because a record prepared there could not relaunch. Every seed handler reads the note path back out of the seed, so the claim instructions it adds name the real note.

Codex reads the latest `token_count` record in the rollout named by the payload's `transcript_path` and nudges through `additionalContext` on `PostToolUse`. Its `UserPromptSubmit` entry point handles seed prompts and runs the same nudge check, because Codex binds each script to one event. Its `Stop` adapter accepts only `hook_event_name: Stop` and passes `transcript_path` to the killer. Claude, Codex and Hermes write the armed state before starting the killer, so a killer spawn failure does not return the record to pending.

In Hermes the `repo-guards` plugin keeps each session's `post_api_request` usage in memory, returns the context adapter's text on `pre_llm_call` for a seed first turn or a threshold crossing, and arms the matching record on `on_session_end`, which fires after every message. `on_session_finalize` and `on_session_reset` drop the recorded usage. When Hermes does not include a context window in the event, the plugin resolves it from Hermes model metadata. The Hermes killer runs without `--transcript`, so idle means the configured idle time has elapsed since it started.

Every arm path restarts a killer for an armed record that has no live killer owner: Claude Stop, Codex Stop, Hermes session end, OpenCode `session.idle` and Pi `agent_end`. It does nothing while a killer owns the lock. A record left armed by a failed spawn is therefore recovered by the next arm event.

The killer polls transcript mtime every 100 ms. When the transcript stays unchanged for `--idle-ms` (3000 ms by default), it confirms the target is a descendant of the loop and re-reads the record. It sends SIGTERM only when the record is still armed, below the hop cap and still fresh at the end of the SIGTERM grace period by the wrapper's own age rule. At or above the cap it unarms the record with reason `hop-cap`, logs `killer-hop-cap` and sends neither a signal nor a notification. A record that would be stale by then is unarmed with reason `stale` and logged as `killer-stale`, so the killer never ends a session the wrapper would refuse to relaunch. The OpenCode plugin runs on Bun, so it starts the killer with `node` instead of `process.execPath`, which points to the OpenCode CLI. The `--loop-id` value must be greater than 1. If the record is no longer armed, the killer logs `killer-no-armed-record`. If the target exits during the SIGTERM call, it logs `target-gone`.

The idle deadline (`--timeout-ms`, 30000 ms by default) does not shorten the 5000 ms grace period after SIGTERM. If the idle deadline passes before the transcript is idle, or the target stays alive through the grace period, the killer disarms the record with reason `killer-timeout` and attempts a macOS notification with the manual claim command.

A single failed transcript read is not a vanish. The killer gives up only when the transcript has stayed unreadable for 1 s without a break (`TRANSCRIPT_MISSING_GRACE_MS`). That give-up follows the timeout path: the record is disarmed with `killer-timeout` and the notification is attempted.

The killer lock stores its owner pid, a creation timestamp and an expiry timestamp. The expiry is the idle timeout plus 5000 ms of signal wait, 3000 ms of notification time and a 60000 ms margin. A lock past its expiry, or a two-field lock from an earlier build that is older than 10 minutes, does not count as a live owner even while its pid exists, because that pid may by then belong to an unrelated process. A live owner or a lock younger than five seconds without a readable owner pid logs `killer-lock-held`. Taking over a stale lock first acquires a takeover mutex, the `<lock>.takeover` directory, whose `owner` file records the pid of the killer that holds it. The mutex is reclaimed only when that owner is dead. A mutex with no owner file is reclaimed once it is older than 30 s. The reclaim is an atomic rename. A live holder keeps exclusion only while the directory stays younger than the 10-minute hold bound, because a real holder holds the mutex for a re-check, an unlink and a create, never minutes. Past that bound the recorded pid counts as reused and the mutex is reclaimed. A killer that cannot acquire the mutex logs `killer-lock-held`. The mutex holder re-checks the lock, logs `killer-lock-stale`, removes the lock and retries once. Leftover `.stale-` takeover directories older than 30 s are swept under the mutex. The killer records the inode of the mutex directory it creates and, on release, removes the path only while that inode still matches, so it never removes a takeover directory it did not create. The killer releases the lock file the same way: it removes the file only while the recorded owner pid is its own, and logs `killer-lock-not-owned` when a contender has taken it over. An owner file that cannot be read fails the killer with `killer-error` and exit code 1. The exceptions are a non-directory at the mutex path, which has no owner file and is judged by age, and an owner read that fails with `ENOENT` or `EACCES`, which counts as no owner. If releasing the mutex fails after the takeover has finished, the killer logs `killer-mutex-release-error` with the error code. The takeover result stands: the killer keeps the lock it acquired and continues supervising.

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

---

## 4. STATE FILES

The relaunch record uses `XDG_RUNTIME_DIR/skilled-relaunch` when `XDG_RUNTIME_DIR` is set. When it is unset, the record uses `skilled-relaunch-<uid>` under the operating system temporary directory, because a shared temp directory would otherwise let the first user on a host create a directory the second user cannot own. The directory must be a real directory owned by the current user. A symlink, a plain file or a foreign owner fails with `relaunch state directory must be a real directory owned by the current user: <dir>`, and a directory that passes is set to mode 0700. Its filename is `relaunch-<loop-id>.json`.

| Relaunch status | Meaning |
|---|---|
| pending | Prepare accepted the note. The runtime's arm event has not armed the record yet. |
| armed | The runtime's arm event armed the record and started the killer: `Stop` on Claude and Codex, `agent_end` on Pi, `session.idle` on OpenCode and session end on Hermes. |
| disarmed | The killer ended the record without a relaunch. A session that never went idle before the deadline, a transcript unreadable for 1 s and a session still running after the SIGTERM grace period end with reason `killer-timeout`. A record whose hop count already reached `SESSION_RELAUNCH_MAX_HOPS` ends with reason `hop-cap`, and one past its age limit ends with reason `stale`; in both cases the killer sends no signal. |

A corrupt relaunch file is treated as absent. `should-relaunch` declines it with reason `no-file` and logs `corrupt-relaunch-file`. The CLI also treats `EACCES`, `ENOTDIR` and `EISDIR` while reading the record as absent. Other errors return exit 2.

The handoff note has a separate status field:

| Note status | Meaning |
|---|---|
| open | Written and ready for a receiving session. |
| claimed | The receiving session claimed it. The note records `claimed_by` and `claimed_at`. |
| done | The receiving session completed the handoff, or `prepare` closed an earlier note of this session when it prepared a successor hop. |

When a new hop goes ahead, `prepare` marks as `done` every other note this session claimed and every other open note this session wrote, adds `completed_at` and sets `superseded_by` to the new note's basename.

The hook keeps per-session nudge levels in `nudge-<session-id>.json` in the same runtime state directory. The hooks and wrapper append events to `relaunch.log` on a best-effort basis. The killer appends its events there too. A failed append in the killer is not swallowed. Each event is one line, appended under fsync at mode 0600, with the mode re-pinned on every append. When the previous last line has no newline, as after a partial write, the new event starts on its own line, so concurrent writers keep one event per line. A short write, from a full disk or a file-size limit, throws `relaunch log short write: wrote X of Y bytes to <path>` instead of losing the event quietly. The killer lock file stores the owner pid, the creation timestamp and the expiry stamp. A lock past its expiry counts as stale, so a reused pid cannot keep the loop pinned. Active or newly created locks log `killer-lock-held`. Stale locks log `killer-lock-stale` before the killer removes and retries them.

---

## 5. SWITCHES AND DEFAULTS

Hook switches resolve from the environment and the optional `.skilled/hooks/hook-flags.env` file. An environment value takes precedence over the file value.

| Switch | Default | Behavior |
|---|---|---|
| `SYSTEM_SESSION_RELAUNCH_DISABLED` | unset, enabled | Set to `1` to disable the context-nudge and Stop-arm hooks. |
| `SYSTEM_HOOKS_DISABLED` | unset, off | A truthy value disables hooks across the repository. `MK_HOOKS_DISABLED` is a supported alias. |
| `SESSION_RELAUNCH_THRESHOLD` | `0.80` | Context fill ratio that triggers the first nudge. Invalid values use `0.80`. Valid values are greater than 0 and at most 1. |
| `SESSION_RELAUNCH_WINDOW_TOKENS` | unset, resolved automatically | A positive value overrides Claude settings. Otherwise the resolver checks the project-local settings override, then the project settings, from the session cwd up to the repository root, and the settings file in the home directory for `autoCompactWindow`. Outside a repository only the cwd is checked. If none is usable, a model name containing `[1m]` uses a one-million-token fallback. Other models use a 200-thousand-token fallback. |
| `SESSION_RELAUNCH_MAX_HOPS` | `10` | Highest completed hop count allowed. The cap is enforced at three points: the wrapper declines a record at or above it, `prepare` at that count writes no record, prints its hop-limit line with the manual claim command and exits 3, and the killer unarms the record with reason `hop-cap` and signals nothing. No adapter nudges at the cap. Zero is accepted and declines every hop. Unset, empty, negative, non-integer or non-numeric values use 10. |
| `SESSION_RELAUNCH_MAX_AGE_MIN` | `10` | Maximum age in minutes for an armed relaunch record. Zero is accepted and makes any older record stale. Unset, empty, negative or non-numeric values use 10. |
| `SESSION_RELAUNCH_REPO_ROOT` | unset, the install root | Absolute path to the repository that holds the concern. Planned handoff note paths resolve under it, so a runtime started in a subdirectory still writes under the repo root. The generic `REPO_ROOT` is not read. |
| `SKILLED_LOOP_HOPS` | `0` | Wrapper-managed completed-hop count. It must be a non-negative integer. |

The wrapper accepts `-n` or `--name` with a value, and `--name=value`. The first launch keeps the original name argument. The wrapper copies the name to later hops. A `--` argument ends the name scan, so later values are passed through as Claude arguments.

The killer CLI requires `--loop-id` and `--target-pid`. `--transcript` is optional: the Claude and Codex Stop hooks and the Pi arm pass it (Pi passes its session file when the path resolves). The Hermes arm and the OpenCode plugin do not. Without it, idle means the configured idle time has elapsed since the killer started. The loop id must be greater than 1 and match `SKILLED_LOOP_ID`. The defaults are `--idle-ms 3000` and `--timeout-ms 30000`. The killer polls every 100 ms. `--no-notify` defaults to off. Without it, a timeout attempts a notification. The Stop hook starts the killer without `--no-notify`.

`prepare` receives the note through `--handoff <path>`, while `claim` and `complete` receive it positionally. Both `prepare` and `claim` require `--session <id>`. Only Claude Code can omit the flag and use `CLAUDE_CODE_SESSION_ID`. A successful prepare exits 0 and leaves the record pending for Stop to arm. Outside `skilled-loop`, prepare prints the manual claim command and exits 3, and inside the loop it does the same at the hop cap. A refused prepare exits 2. The CLI prints its usage and exits 0 when it gets no command, `--help` or `-h`, and a wrong option prints the error plus that subcommand's usage line and exits 2.

---

## 6. TROUBLESHOOTING

A prepare exit code of 2 means the note or loop cannot be prepared. Common reasons include:

- The handoff path is missing, outside the handoffs directory or resolves outside that directory.
- The handoffs directory is reached through a symlink below the repository root.
- The note has invalid flat frontmatter, a non-open status, a different supplied session id, a missing required field or an empty required section.
- No session id reached `prepare` or `claim`. Only Claude can fall back to `CLAUDE_CODE_SESSION_ID`. Other runtimes must pass `--session`.
- `SYSTEM_SESSION_RELAUNCH_DISABLED` or the master hook switch disables the concern.
- Inside `skilled-loop`, the runtime still has a live child shell from the list in section 3. The prepare command does not run this check outside the loop.
- `SKILLED_LOOP_HOPS` is not a non-negative integer.

When prepare exits 3, start Claude through skilled-loop or use the printed manual claim command. At the hop cap, prepare writes no record, logs `prepare-declined reason=hop-cap`, and its first line reads `[session-relaunch] hop limit reached; continue in this session (auto-compaction remains the fallback)`. A corrupt relaunch JSON file is a decline with reason `no-file`. An unreadable Claude transcript yields no context usage, and unreadable Claude settings files are skipped as absent.

If the killer logs `killer-no-armed-record`, it found no armed record before signalling. `killer-hop-cap` means the record's hop count already reached `SESSION_RELAUNCH_MAX_HOPS`, so the killer unarmed it with reason `hop-cap` and sent no signal. `killer-stale` means the record would pass `SESSION_RELAUNCH_MAX_AGE_MIN` before the wrapper could read it, so the killer unarmed it with reason `stale` and sent no signal. `killer-manual-template` means `SKILLED_LOOP_MANUAL_TEMPLATE` did not hold exactly one note placeholder, so the timeout notice fell back to the plain manual command. `killer-lock-held` means another killer owns the lock or is creating it. `killer-lock-stale` means the owner process is gone or the unreadable lock is older than five seconds. `killer-lock-not-owned` means the lock no longer named this killer's pid when it exited, because a stall past the expiry let a contender take it over, so the killer left the file in place for its new owner. `target-gone` marks a target that exited between the final liveness check and SIGTERM. The killer polls every 100 ms. The idle timeout defaults to 30000 ms and the separate post-signal grace period is 5000 ms. If either wait expires while Claude remains alive, the killer disarms the record and logs `killer-timeout`. A transcript that stays unreadable for 1 s also ends with `killer-timeout`. `killer-timeout-superseded` replaces it when a later prepare armed a different note during the wait. The killer then logs the `watched` and `current` note paths and neither disarms nor notifies, because the newer note still needs its own killer. A signal probe that fails with `EPERM` means the pid belongs to another user's process, so the killer treats its target as gone instead of signalling it. `killer-lock-held` also appears while another killer holds the `<lock>.takeover` mutex. If an armed record has no live killer, the next arm event starts one. A live killer that owns the lock blocks that restart by design. `killer-error` with exit code 1 means the takeover mutex's owner file could not be read, for example because the owner path is a directory. The killer stops before the takeover and the armed record stays armed for the next arm event. `killer-mutex-release-error` means the `<lock>.takeover` directory could not be removed after the takeover finished. The takeover result stands and the killer keeps the lock it acquired, so this line does not mean the handoff failed. A leftover mutex is reclaimed by the next takeover once its owner is dead, or once it has no owner file and is older than 30 s.

When Claude exits with code 130 and a relaunch record is eligible, the wrapper prints the manual claim command and exits 130 without relaunching. If the saved cwd is missing or the cwd or handoff path contains CR or LF, it prints the command and exits 1. A record that names no handoff or no cwd is declined with reason `incomplete-record`, and the wrapper keeps the runtime's exit code. Before a relaunch the wrapper checks the note state that `consume` reports, because a claim seed for any note that is not open fails in the fresh session. A note in another state prints `warning: the handoff note is <state>; not relaunching`. A failed consume, which also loses the Gate 3 answer, prints `warning: could not read the consumed relaunch record; not relaunching`. Both print the manual command and exit 1. On the other exit paths a consume failure prints a warning and the wrapper continues with the exit it was already handling. If the wrapper cannot decode the record returned by `should-relaunch`, it prints `warning: could not read the relaunch record` and consumes the record. It exits 1 when `should-relaunch` approved the hop and exits with the runtime's own exit code when `should-relaunch` declined. Neither path prints a manual claim command. Other `should-relaunch` failures with status 2 or higher print a warning and preserve Claude's exit code.

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
|   +-- context-nudge.mjs
|   +-- stop-arm.mjs
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
|   +-- killer.cjs
|   +-- nudge.cjs
|   +-- relaunch-core.cjs
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
