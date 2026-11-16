---
title: "Pi Decision Capture: tool_result Answers and turn_end Reminder"
description: "Pi extension that queues answered question tools, recovers them under the sweep key and notifies the operator once per waiting answer batch."
trigger_phrases:
  - "pi decision capture"
  - "pi question capture"
  - "pi answer reminder"
version: 1.0.0.0
---

# Pi Decision Capture: tool_result Answers and turn_end Reminder

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/pi/` holds the Pi extension for the decision capture concern. Pi ships no built-in question tool, so the answers arrive through a package tool. `ask_user_question` comes from the `rpiv-ask-user-question` package and `question` from `pi-plan-build`. The extension listens at `tool_result` for both tool names.

The handler rebuilds the event as the two session-file lines the Pi sweep reads. It maps them with `recoveredRecords` and appends the records under the same key. A live record and a swept one therefore share a key and never queue twice.

A second handler runs at `turn_end`, where it calls `takeNudge` for the session. When answers wait, it calls `ui.notify` once with the save reminder.

Pi loads the extension through `.pi/extensions/decision-capture.ts`, a one-line file that re-exports the default. Pi's registration is the `pi` block of the `decision-capture` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, which names `decision-capture.ts`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `decision-capture.ts` | The extension. It checks the kill switch, registers the `tool_result` and `turn_end` handlers and appends the recovered records. |
| `decision-capture.test.ts` | The `vitest` suite. It stubs the `ExtensionAPI` and covers the queue, the skip paths, the reminder and the kill switch. |

The factory returns before it registers a handler when the `decision-capture` concern is off. `SYSTEM_DECISION_CAPTURE_DISABLED=1` sets that switch, and `SYSTEM_HOOKS_DISABLED=1` turns every hook off the same way.

On `tool_result`, the handler returns `undefined` for a tool name outside `QUESTION_TOOLS`, a failed call, a cancelled call or a missing session id. A kept call becomes two lines, an assistant `toolCall` message and a `toolResult` message. `recoveredRecords` maps the lines and each record carries the tag `source: 'hook'`. `appendRecords` writes the batch to the queue under the session id when the mapper returns records.

On `turn_end`, the handler returns `undefined` unless the session has a UI and a session id. `takeNudge` returns the waiting count only when it has risen since the last report, and a positive count becomes one `ui.notify` call with type `info`. The message names the count and points at `/speckit:save` with `--full-auto`.

Every handler catches its own error and returns `undefined`. An outer catch wraps the registration, so a failure never stops Pi loading. The save-time sweep reads the same session file and recovers what the live capture missed.

The suite builds a stub `ExtensionAPI` that collects handlers. It covers an answered option queued under the sweep key and the `question` tool. Further cases cover a cancelled result, an error result, another tool name and a missing session id. The kill switch case proves that no handler registers. One case runs the sweep over the same transcript and proves it recovers nothing.

---

## 3. VALIDATION

Run this command from the repository root to exercise the suite.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/decision-capture/pi/decision-capture.test.ts
```

Expected result: every case passes and the command exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the decision capture concern, its adapters and its switches.
- [`../bin/sweep-pi.mjs`](../bin/sweep-pi.mjs): the sweep that exports `QUESTION_TOOLS` and `recoveredRecords`.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core that exports `appendRecords` and `takeNudge`.
