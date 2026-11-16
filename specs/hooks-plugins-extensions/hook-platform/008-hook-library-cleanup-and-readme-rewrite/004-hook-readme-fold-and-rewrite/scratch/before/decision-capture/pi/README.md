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

`hooks/decision-capture/pi/` holds the Pi extension for the decision capture concern. The extension listens at `tool_result` for the question tools Pi can raise, rebuilds the event as the two session-file lines the Pi sweep reads, and appends the recovered records under the same key.

A second handler runs at `turn_end`. When the session is interactive and `takeNudge` reports waiting answers, it calls `ui.notify` once with the save reminder. `.pi/extensions/` holds a one-line entry file that re-exports the real file under `.skilled/hooks/decision-capture/pi/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `decision-capture.ts` | `tool_result` and `turn_end` | On `tool_result`, skips a failed or cancelled call, rebuilds the question and answer lines, maps them with `recoveredRecords` and appends the records tagged `source: 'hook'`. On `turn_end`, notifies the operator when answers wait. | Fails open. Every handler catches its own errors, and an outer catch keeps a failure from stopping Pi loading. |
| `decision-capture.test.ts` | `vitest` suite | Builds a stub `ExtensionAPI` and covers the answer queue, the non-question and cancelled paths, the reminder and the fail-open behavior. | Not applicable. |

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../bin/sweep-pi.mjs`](../bin/sweep-pi.mjs): the sweep that exports `QUESTION_TOOLS` and `recoveredRecords`.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core the extension appends through.
