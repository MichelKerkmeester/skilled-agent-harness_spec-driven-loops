---
title: "Session Handover: Test Fixtures"
description: "Payload, rollout, usage and helper fixtures that drive the session-handover suites for Claude, Codex, Pi and OpenCode."
trigger_phrases:
  - "session handover fixtures"
  - "runtime payload fixtures"
  - "relaunch test data"
version: 1.0.0.0
---

# Session Handover: Test Fixtures

---

## 1. OVERVIEW

This folder holds the inert payloads and the Node helpers the suites read. The payloads reproduce the event shapes each runtime sends, plus transcript, rollout and usage records. A suite reads them instead of a live runtime, so fill reading and record handling stay testable.

Most files are data, while the helpers are plain CommonJS programs. `relaunch-env.cjs` removes inherited switches, so a developer's shell cannot decide a case.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `codex-rollout-token-count.json` | A `token_count` event with `last_token_usage` totals and `model_context_window` at 258400. |
| `codex-spawn-recorder.cjs` | Replaces `child_process.spawn` so a killer launch records its command, arguments and options. |
| `codex-stop.json` | A Codex Stop payload with `hook_event_name: Stop`, a transcript path, a cwd and `stop_hook_active: false`. |
| `codex-user-prompt-submit.json` | A Codex prompt payload with `hook_event_name: UserPromptSubmit` and a prompt. |
| `nested-run.cjs` | Runs a command through an outer runtime and a nested shell, so the ppid chain the killer reads can be reproduced. |
| `opencode-assistant-message-updated.json` | A `message.updated` event with `tokens`, `modelID` and `providerID`. |
| `payload-post-tool-use.json` | A Claude PostToolUse payload with a `Bash` call, a tool response and an effort level. |
| `payload-stop.json` | A Claude Stop payload with `hook_event_name: Stop` and `stop_hook_active: false`. |
| `payload-user-prompt-submit.json` | A Claude prompt payload with `hook_event_name: UserPromptSubmit` and a prompt. |
| `pi-assistant-message-end.json` | A `message_end` event with `contextUsage` and `usage`. |
| `relaunch-env.cjs` | Builds the list of relaunch, goal and flags-file keys a sandbox drops. Exports `withoutRelaunchSwitches()` and `clearRelaunchSwitches()`. |
| `transcript-usage.jsonl` | Three assistant rows with token usage, including one sidechain row. |

`codex-spawn-recorder.cjs` writes the recorded call to `CODEX_KILLER_ARGS_FILE` and returns a stub with `unref()` for the killer. Every other call passes through to the original spawn. `nested-run.cjs` exports `runNested()`, which rejects on a spawn error and otherwise returns the exit code, stdout and stderr. The copy variant of `relaunch-env.cjs` leaves its input unchanged, while the clear variant returns the same object.

---

## 3. RELATED

- [`../README.md`](../README.md): the tests README for the session handover suites.
- [`../../README.md`](../../README.md): the concern README with the state files and runtime matrix.
- [`../../pi/session-handover.test.ts`](../../pi/session-handover.test.ts): the Pi suite that imports `relaunch-env.cjs`.
- [`../../../shared/hook-flags.cjs`](../../../shared/hook-flags.cjs): the resolver `relaunch-env.cjs` reads its switch names from.
