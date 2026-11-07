---
title: "Session Relaunch: Test Fixtures"
description: "Payload, rollout, usage and helper fixtures that drive the session-relaunch suites for Claude, Codex, Pi and OpenCode."
trigger_phrases:
  - "session relaunch fixtures"
  - "runtime payload fixtures"
  - "relaunch test data"
version: 1.0.0.0
---

# Session Relaunch: Test Fixtures

---

## 1. OVERVIEW

`tests/fixtures/` holds the inert payloads and two small Node helpers that the session relaunch suites read. The payloads reproduce the event shapes each runtime sends, along with transcript, rollout and usage records, so a suite can exercise fill reading and record handling without a live runtime. Most files are data. The helpers are plain CommonJS programs, and `relaunch-env.cjs` removes inherited switches so a developer's shell cannot decide a case.

---

## 2. WHAT EACH FILE DOES

| File | Role | What it holds | On error |
|---|---|---|---|
| [`codex-rollout-token-count.json`](./codex-rollout-token-count.json) | Codex fill fixture | A `token_count` event with `last_token_usage` and `model_context_window` set to 258400. | Inert data. |
| [`codex-spawn-recorder.cjs`](./codex-spawn-recorder.cjs) | Spawn recorder | Replaces `child_process.spawn` so a killer launch writes its command, arguments and options to `CODEX_KILLER_ARGS_FILE`. | Returns a stub with `unref()` for the killer and passes every other call through. |
| [`codex-stop.json`](./codex-stop.json) | Codex Stop payload | `hook_event_name: Stop` with a transcript path, a cwd and `stop_hook_active: false`. | Inert data. |
| [`codex-user-prompt-submit.json`](./codex-user-prompt-submit.json) | Codex prompt payload | `hook_event_name: UserPromptSubmit` with a prompt. | Inert data. |
| [`nested-run.cjs`](./nested-run.cjs) | Ancestry helper | Runs a command through an outer runtime and a nested shell so the ppid chain the killer reads can be reproduced. Exports `runNested()`. | Rejects on a spawn error, otherwise returns the child exit code, stdout and stderr. |
| [`opencode-assistant-message-updated.json`](./opencode-assistant-message-updated.json) | OpenCode fill fixture | A `message.updated` event with `tokens`, `modelID` and `providerID`. | Inert data. |
| [`payload-post-tool-use.json`](./payload-post-tool-use.json) | Claude PostToolUse payload | A `Bash` call with a tool response and an effort level. | Inert data. |
| [`payload-stop.json`](./payload-stop.json) | Claude Stop payload | `hook_event_name: Stop` with `stop_hook_active: false`. | Inert data. |
| [`payload-user-prompt-submit.json`](./payload-user-prompt-submit.json) | Claude prompt payload | `hook_event_name: UserPromptSubmit` with a prompt. | Inert data. |
| [`pi-assistant-message-end.json`](./pi-assistant-message-end.json) | Pi fill fixture | A `message_end` event with `contextUsage` and `usage`. | Inert data. |
| [`relaunch-env.cjs`](./relaunch-env.cjs) | Environment helper | Builds the list of relaunch, goal and flags-file keys a sandbox drops, and exports `withoutRelaunchSwitches()` and `clearRelaunchSwitches()`. | The copy variant leaves its input unchanged, the clear variant returns the same object. |
| [`transcript-usage.jsonl`](./transcript-usage.jsonl) | Claude transcript fixture | Three assistant rows with token usage, including one sidechain row. | Inert data. |

---

## 3. RELATED

- [`../README.md`](../README.md): the tests README for the session relaunch suites.
- [`../../README.md`](../../README.md): the concern README with the state files and runtime matrix.
- [`../../pi/session-relaunch.test.ts`](../../pi/session-relaunch.test.ts): the suite that consumes several of these fixtures.
- [`../../../shared/hook-flags.cjs`](../../../shared/hook-flags.cjs): the resolver `relaunch-env.cjs` reads its switch names from.
