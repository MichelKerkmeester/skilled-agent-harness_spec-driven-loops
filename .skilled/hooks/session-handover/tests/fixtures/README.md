---
title: "Test Fixtures: Captured runtime payloads for the session handover suites"
description: "Payload, rollout, usage and helper fixtures that drive the session-handover suites for Claude, Codex, Pi, OpenCode and Vibe."
trigger_phrases:
  - "session handover fixtures"
  - "runtime payload fixtures"
  - "relaunch test data"
version: 1.0.0.0
---

# Test Fixtures: Captured runtime payloads for the session handover suites

---

## 1. OVERVIEW

`fixtures/` holds the inert payloads and the Node helpers that the session handover suites load by name. Each payload reproduces an event shape a runtime sends, so a case reads a file instead of starting a live runtime.

The folder is flat. The next section lists every file in it.

The Claude payloads follow the hook event shapes. The Codex set mirrors them and adds a rollout token count. An OpenCode message update and a Pi message end cover the usage readers on those runtimes. `transcript-usage.jsonl` holds Claude transcript rows with token usage.

Current state:

- Payloads are data only. The helpers touch the filesystem and child processes, nothing else.
- A suite requires a helper by relative path. Nothing here is published or installed.
- A suite reads a payload by file name, so a rename breaks the suite that reads it.
- `relaunch-env.cjs` is also read by the Pi suite and by the OpenCode plugin suite.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `codex-rollout-token-count.json` | A Codex `token_count` event whose `last_token_usage` and `total_token_usage` totals match, with `model_context_window` at 258400. |
| `codex-spawn-recorder.cjs` | A preload that replaces `child_process.spawn` so a killer launch writes its command and arguments to `CODEX_KILLER_ARGS_FILE`. |
| `codex-stop.json` | A Codex Stop payload with a rollout path and `stop_hook_active: false`. |
| `codex-user-prompt-submit.json` | A Codex prompt payload with `hook_event_name: UserPromptSubmit` and the prompt text. |
| `nested-run.cjs` | Runs a command from a runtime started inside the loop session's shell tool. |
| `opencode-assistant-message-updated.json` | An OpenCode `message.updated` event for a finished assistant message, with the `tokens` block and `modelID`. |
| `payload-post-tool-use.json` | A Claude `PostToolUse` payload for a `Bash` call, carrying the tool response and an effort level. |
| `payload-stop.json` | A Claude `Stop` payload with `stop_hook_active: false` and empty background task and cron lists. |
| `payload-user-prompt-submit.json` | A Claude prompt payload with `hook_event_name: UserPromptSubmit` and the prompt text. |
| `pi-assistant-message-end.json` | A Pi `message_end` event with `contextUsage` and a `usage` block whose `cost` prices the input, output and cache fields with a total. |
| `relaunch-env.cjs` | Builds the switch and flags-file key list a sandbox drops. Exports `withoutRelaunchSwitches()` and `clearRelaunchSwitches()`. |
| `transcript-usage.jsonl` | Three assistant rows with token usage, the last one a sidechain row. |

`codex-spawn-recorder.cjs` runs as a Node preload inside the hook process, so the recorded call is the one that launches `killer.cjs`. A call whose first argument does not end in `killer.cjs` reaches the original spawn.

`withoutRelaunchSwitches()` returns a copy of the environment and leaves its input unchanged. `clearRelaunchSwitches()` deletes the same keys from the object it is given and returns that object.

`runNested()` rejects on a spawn error. Otherwise it returns the exit code with the captured standard output and error.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Loading | A suite requires a helper by relative path from its own file. |
| Payload shape | A payload reproduces a captured event. A case spreads the file and overrides the fields it needs, so an edited field reaches every case that spreads it. |
| Environment | A sandbox drops every inherited relaunch switch and `HOOK_FLAGS_CONFIG` before it sets its own. |
| Switch names | `relaunch-env.cjs` builds its key list from `hook-flags.cjs`, so a runtime added to that resolver is dropped without an edit here. |

### Main flow

```text
test file
   │
   ▼
runNested({ argv, env, cwd, input })
   │  writes outer.cjs and nested.cjs into a temp directory
   ▼
outer.cjs          stands in for the loop's own runtime
   │  spawnSync('/bin/sh', ['-c', ...])
   ▼
/bin/sh -c         keeps a shell between the two runtimes
   │
   ▼
nested.cjs         the runtime the shell tool started
   │  spawnSync(process.execPath, argv)
   ▼
the command under test, whose exit status travels back
```

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `withoutRelaunchSwitches(env)` | Function | Returns a copy of the environment without the relaunch switches or `HOOK_FLAGS_CONFIG`. |
| `clearRelaunchSwitches(env)` | Function | Deletes the same keys from the object it is given and returns it. |
| `runNested(options)` | Function | Runs a command from a runtime started inside the loop session's shell tool. |
| `HERMETIC_DROP_KEYS` | Constant | The full key list both environment helpers drop. |
| `codex-spawn-recorder.cjs` | Preload | Records a killer launch through `NODE_OPTIONS`. |

---

## 5. VALIDATION

Run from the repository root. This suite reads four of the data files here.

```bash
node --test .skilled/hooks/session-handover/tests/context-usage.test.cjs
```

Expected result: the run exits `0` with every case passing.

```text
ℹ tests 36
ℹ pass 36
ℹ fail 0
```

The totals grow as cases are added, so the invariant is `fail 0`.

---

## 6. RELATED

- [Session handover tests](../README.md): the suites that read these files.
- [Session handover concern](../../README.md): the hook overview and the switch table.
- [Shared hook flags](../../../shared/hook-flags.cjs): the resolver that supplies the switch names.
- [Codex adapter tests](../codex-adapters.test.cjs): the suite that preloads the spawn recorder.
