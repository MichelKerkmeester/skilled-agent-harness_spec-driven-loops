---
title: "Session relaunch loop"
description: "Hands a session near its context limit to a fresh one through a structured handoff note and the skilled-loop wrapper."
trigger_phrases:
  - "Session relaunch loop"
  - "Claude session relaunch"
  - "Pi session relaunch"
  - "OpenCode session relaunch"
  - "Codex session relaunch"
  - "Hermes session relaunch"
  - "Cursor session relaunch"
  - "Devin session relaunch"
  - "/speckit:handoff session relaunch"
  - "skilled-loop claude"
  - "skilled-loop pi"
  - "skilled-loop opencode"
  - "skilled-loop codex"
  - "skilled-loop hermes"
  - "context handoff to a fresh session"
version: 1.0.1.0
---

# Session relaunch loop (skilled-loop)

---

## 1. OVERVIEW

Shares a structured context handoff across seven runtimes through adapter nudges, a validated note and a wrapper relaunch. Claude Code, Pi, OpenCode, Codex and Hermes run automatically through their adapters. Cursor and Devin run on the `/speckit:handoff` command trigger only.

An automatic adapter asks for a note near its context threshold, validates and prepares it, then arms it at its host's turn-end event. The skilled-loop wrapper starts the selected runtime with a claim seed when the record is armed, fresh and below the hop cap.

---

## 2. HOW IT WORKS

### Nudge, Prepare And Arm

Claude's context-nudge handles PostToolUse and UserPromptSubmit. It reads the latest main-chain assistant usage and compares it with the configured threshold. The default is 0.80. One additional nudge fires 0.05 above that level, and each level fires once. It accepts session ids matching [A-Za-z0-9_-]{1,128}. Transcript read errors produce no usage. Failed Claude settings reads are treated as absent while the resolver checks its next source or model default. If the operator says not to hand off, the nudge yields and the session keeps working. Auto-compaction remains the fallback.

Both `prepare` and `claim` require `--session <id>`. Only Claude can use `CLAUDE_CODE_SESSION_ID` instead. `CLAUDE_PID` supplies the runtime process id for the shell-child check only. Runtimes without a session-id variable generate an id with `uuidgen` and reuse it for the session.

Prepare validates the note before checking whether the caller runs under skilled-loop. The nudge passes `--runtime <name>`, which must name one of the seven runtimes. Outside the loop, that value overrides the environment or Claude default and the CLI prints the selected runtime's manual claim command before exiting 3. Inside the loop, a supplied runtime must match `SKILLED_LOOP_RUNTIME` or prepare exits 2. A live zsh, bash or sh child of the runtime process also exits 2. A successful prepare writes a pending record and exits 0. When a hop goes ahead, prepare marks each note already claimed by this session as `done`, adds `completed_at` and sets `superseded_by` to the new note's basename.

The note's Remaining work lists only unfinished task work. Note creation, continuity saving and prepare stay outside that section. Claude saves a bound packet with `/speckit:save`. Other runtimes pipe the save JSON to `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin --full-auto <spec-folder>`. Turn-end arming matches the event session id to the prepared record. Missing required payload data or background work leaves it pending. Otherwise, the adapter writes `status: armed` before starting the detached killer, so a killer spawn failure leaves the record armed.

### Killer And Wrapper

The killer polls transcript modification time every 100 ms. Once the transcript is idle, it confirms that the target descends from the loop and re-reads the record. It sends SIGTERM only when the record is armed. Without a transcript it treats elapsed idle time since start as the idle signal. In OpenCode's Bun-hosted plugin, the detached killer runs with node because process.execPath points to the OpenCode CLI.

SESSION_RELAUNCH_MAX_HOPS and SESSION_RELAUNCH_MAX_AGE_MIN both accept zero. Zero max hops declines every relaunch. Zero max age declines an armed record once its age is greater than zero. A corrupt relaunch file is logged and treated as absent, so should-relaunch declines with reason no-file. The command also treats EACCES, ENOTDIR or EISDIR while reading the record as absent. Other command errors exit 2. Context transcript and settings read errors return absent values instead of escaping as exceptions.

skilled-loop defaults to Claude when it receives no arguments or a prompt without a runtime name. The `cursor` arm launches the `cursor-agent` binary. It preserves the first launch arguments, including name flags. It scans name options only until --. Across hops, it carries model selection for all runtimes, the provider for Pi and Hermes, and Pi extension-selection flags. The wrapper applies the same value check to model, name, Pi extension and Pi or Hermes provider options. It leaves a value equal to `--` or starting with `-` in the first launch's arguments and does not carry it into later hops. Relative Pi extension paths are resolved against the wrapper's starting directory. Claude and Pi are the only runtimes with a launch-time name flag.

A matching armed record is consumed only when it is fresh and below the hop cap. `spec_folder` carries three states: a repo-relative packet path, `none` when Gate 3 was answered D) Skip or empty when Gate 3 was never answered. The wrapper adds the path or `none` to the claim seed. The receiver resumes a packet path, skips Gate 3 for `none`, and asks Gate 3 when the field is empty. AGENTS.md states that a relaunch hop is the same session. The receiving runtime claims the note and continues only its task work. It never runs prepare on an already claimed note.

`SESSION_RELAUNCH_THRESHOLD` controls when each session is nudged. Keep it well above a fresh session's startup fill plus its remaining work. Codex live runs chained hop after hop at `0.12` because each fresh session reached about 10% on startup alone. `SESSION_RELAUNCH_MAX_HOPS` caps completed relaunches and stops the chain at that limit. Use a low hop cap for live checks.

### Pi And OpenCode Adapters

Pi checks usage on message_end and sends the nudge with deliverAs: 'nextTurn', so it arrives on the next turn. It captures a matching seed in before_agent_start and arms the Pi record on agent_end. Its killer-path resolver walks up from the current directory, so it can find killer.cjs from a repository subdirectory. tsconfig.pi.json includes the Pi extension entry for type-checking.

OpenCode reads message.updated and message.part.updated. It pushes the active nudge on every request until the current session's matching relaunch record exists. It reuses only same-session notes whose status is open. An armed record suppresses nudges until it is older than SESSION_RELAUNCH_MAX_AGE_MIN. It then treats the record as stale and resumes nudging. Outside skilled-loop, it keeps nudging until the handoff note exists. A matching claim seed is queued for experimental.chat.system.transform and the relaunch record is armed on session.idle.

The wrapper's Pi relaunch carries provider and model selection together with -ne and each -e extension selection from the initial launch. In this repository, start Pi with -ne -e .pi/extensions/session-relaunch.ts because two installed extensions both register --fast. OpenCode is started with -m <provider/model>. The wrapper preserves that model selection across hops.

In the recorded live runs, OpenCode reported about 1M context tokens for openai/gpt-6-luna and Pi reported 272K. These reported window sizes differ by runtime.

### Codex Adapter

Codex binds three repo hooks rendered from hook-registry.json into .codex/hooks.json, one script per event because the Codex hook installer allows each script under one event only. `prompt-seed.mjs` on UserPromptSubmit returns claim-seed instructions for a `[session-relaunch]` prompt and runs the threshold check for any other prompt. `context-nudge.mjs` on PostToolUse runs the same check mid-session. `stop-arm.mjs` accepts only `hook_event_name: Stop`. It arms a matching pending record before spawning the killer with `--transcript <transcript_path>`, so a spawn failure leaves the record armed.

The fill reads the rollout's latest `token_count` event at `transcript_path`. The numerator is `last_token_usage.input_tokens`, which already contains the cached share, so `cached_input_tokens` is not added. The window is `SESSION_RELAUNCH_WINDOW_TOKENS`, then the event's `model_context_window`. The nudge reaches the model as `hookSpecificOutput.additionalContext`. Codex exports no pid variable, so the killer target resolves through the ancestor rule the CLI's running-work check uses.

### Hermes Adapter

Hermes runs through the enabled `repo-guards` project plugin, which bridges its plugin hooks to the Node entry points under `hermes/`. `post_api_request` records each call's `usage` per session. `pre_llm_call` returns the context adapter's seed text on a `[session-relaunch]` first turn or the handoff text once the fill crosses the threshold, appended to the turn's user message. `on_session_end` accepts a missing event name from the plugin bridge and rejects a supplied name other than `on_session_end`. It arms a pending record for this session before detaching the killer with the Hermes process resolved by the ancestor rule, so a spawn failure leaves the record armed.

Hermes fires `on_session_end` after every message, so the plugin arms there and keeps each session's recorded usage until `on_session_finalize` or `on_session_reset` clears it. The fill counts input plus cache read and cache write tokens, never output. The window is `SESSION_RELAUNCH_WINDOW_TOKENS`, then the context length in the event. If the event has no window, the plugin asks Hermes model metadata for the model window. The 200-thousand-token default is used only when neither source has a value. The chosen source is logged.

### Command-Only Runtimes

Cursor ships on the command trigger because its evidence is source-only and `stop` is not wired in this repository's `.cursor/hooks.json`. Devin ships on the command trigger because its hook usage is unverified. On both, `/speckit:handoff` writes the note and runs prepare. Outside skilled-loop, prepare prints one runtime-specific manual claim command and exits 3. A prepared record stays pending because no arm event exists for these runtimes. When the runtime exits with a pending record, the wrapper also prints its manual claim command and preserves the runtime exit code. When a path contains `!`, the printed seed places the bang in single quotes outside the double quotes, as in `/tmp/han"'!'"doff.md`. Interactive Bash keeps the path intact when history expansion is on. If the wrapper cannot decode the record returned by `should-relaunch`, it prints `warning: could not read the relaunch record`, consumes the record and exits 1 without a manual claim command.

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | Handler | Reads hook input and returns threshold or claim-seed context. |
| .skilled/hooks/session-relaunch/claude/stop-arm.mjs | Handler | Arms a matching prepared record on Stop and starts the killer. |
| .skilled/hooks/session-relaunch/codex/prompt-seed.mjs | Handler | Answers `[session-relaunch]` seeds and runs the nudge check on UserPromptSubmit. |
| .skilled/hooks/session-relaunch/codex/context-nudge.mjs | Handler | Runs the rollout-usage threshold check on PostToolUse. |
| .skilled/hooks/session-relaunch/codex/shared.mjs | Shared | Shared payload, threshold and emit logic for the Codex entry points. |
| .skilled/hooks/session-relaunch/codex/stop-arm.mjs | Handler | Arms a matching pending record on Stop and starts the killer with its transcript. |
| .skilled/hooks/session-relaunch/hermes/context-nudge.mjs | Handler | Returns seed or handoff context for the plugin's pre_llm_call bridge. |
| .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs | Handler | Arms a matching pending record on on_session_end and starts the killer. |
| .hermes/plugins/repo-guards/__init__.py | Handler | Bridges Hermes plugin hooks to the adapters and keeps per-session usage. |
| .skilled/hooks/session-relaunch/pi/session-relaunch.ts | Handler | Sends context nudges, injects a relaunch seed, arms Pi records and resolves the killer path from repository subdirectories. |
| .opencode/plugins/session-relaunch.js | Handler | Queues OpenCode nudge or seed text for a system transform and arms a matching record on idle. |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Script | Validates notes, prepares records and updates note status. |
| .skilled/hooks/session-relaunch/lib/context-usage.cjs | Shared | Reads Claude and Codex transcript usage, calculates Pi, OpenCode and Hermes token fills and resolves context windows. |
| .skilled/hooks/session-relaunch/lib/nudge.cjs | Shared | Builds the nudge and seed text and owns per-session level state. |
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | Shared | Validates handoffs and handles relaunch and note state. |
| .skilled/hooks/session-relaunch/lib/killer.cjs | Script | Waits for transcript idle, signals the target and handles timeout. |
| .skilled/bin/skilled-loop | Script | Wraps the seven runtimes and launches eligible relaunches with runtime-specific seed arguments. |
| tsconfig.pi.json | TypeScript config | Includes the Pi extension entry so the adapter is type-checked. |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | Shared | Declares the Claude and Codex hook bindings rendered into each runtime's config. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs | Node test | Checks Claude nudge and Stop adapter behavior. |
| .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs | Node test | Checks Codex seed, threshold, arming and registration behavior. |
| .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs | Node test | Checks Hermes usage, seed, window sources, arming and pid lookup. |
| .skilled/hooks/session-relaunch/tests/nudge.test.cjs | Node test | Checks the shared nudge text, levels and seed parsing. |
| .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts | Vitest | Checks Pi nudge, seed injection and agent-end arming. |
| .opencode/plugins/tests/session-relaunch.test.cjs | Node test | Checks OpenCode event handling, transform injection and idle arming. |
| .skilled/hooks/session-relaunch/tests/context-usage.test.cjs | Node test | Checks transcript parsing, runtime usage calculations and window resolution. |
| .skilled/hooks/session-relaunch/tests/killer.test.cjs | Node test | Checks process supervision, timeout and lock behavior. |
| .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs | Node test | Checks note states and relaunch decisions. |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs | Node test | Checks prepare, claim, complete and CLI refusal paths. |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | Node test | Checks wrapper relaunch and per-runtime seed arguments with stub runtimes. |
| .hermes/plugins/repo-guards/tests/test_repo_guards.py | Automated test | Checks the plugin bridge, including the relaunch context and arm paths. |

---

## 4. SOURCE METADATA

- Group: Context Preservation
- Canonical catalog source: feature-catalog.md
- Feature file path: context-preservation/session-relaunch-loop.md

Related references:
- [Resource map template](resource-map-template.md)
- [Claude session relaunch scenarios](../../manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md)
- [Pi and OpenCode session relaunch scenarios](../../manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md)
- [Codex, Cursor, Hermes and Devin session relaunch scenarios](../../manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md)
