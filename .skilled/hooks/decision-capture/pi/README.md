---
title: "Pi Decision Capture: tool_result and turn_end Adapters"
description: "Pi extension that queues answers from the question tools, rebuilds each event under the sweep key and shows the pending count at turn end."
trigger_phrases:
  - "pi decision capture"
  - "pi question capture"
  - "pi answer reminder"
version: 1.0.0.0
---

# Pi Decision Capture: tool_result and turn_end Adapters

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/pi/` holds the Pi adapter for the decision capture concern. Pi has no question tool of its own, so an answer arrives as a `tool_result` for a package tool. The adapter watches `ask_user_question` from `rpiv-ask-user-question` and `question` from `pi-plan-build`. Both names sit in `QUESTION_TOOLS` in `.skilled/hooks/decision-capture/bin/sweep-pi.mjs`.

Pi loads every `.ts` file in `.pi/extensions/` and calls its default export once at session start. The entry `.pi/extensions/decision-capture.ts` is one line that re-exports the adapter from this folder. The `pi` block of the `decision-capture` row in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` names the same file. No other runtime loads this adapter.

The factory checks `isHookEnabled('decision-capture')` before it registers anything. When the switch is off, no handler registers and the session sees nothing from this file. On `tool_result` the handler returns at once for a tool name outside `QUESTION_TOOLS`, an error result, a cancelled result or a missing session id.

A kept call is rebuilt as the two session-file lines the sweep reads, then mapped with `recoveredRecords`. The handler tags every record `source: 'hook'` and `appendRecords` writes the batch into the queue under the session id and the context `cwd`. A live record and a swept one share a key, so a question never queues twice.

On `turn_end` the handler needs a session id and a UI. It calls `takeNudge` and shows one `info` notice when the pending count has risen since the last report. The message names the count and points at `/speckit:save` with `--full-auto`.

The concern key is `decision-capture`. Its switch is `SYSTEM_DECISION_CAPTURE_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch, because `isHookEnabled` resolves through `.skilled/hooks/shared/hook-flags.cjs`. Every failure ends the same way: the handler returns `undefined` and prints nothing. Each handler catches its own error. An outer catch wraps the registration, so a broken queue never stops Pi loading.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `decision-capture.ts` | The adapter. It checks the switch, registers the `tool_result` and `turn_end` handlers and appends the recovered records. |
| `decision-capture.test.ts` | The `vitest` suite. It stubs `ExtensionAPI` and covers the capture, the skip paths, the reminder, the switch and a sweep over the same call. |

The folder is flat. It has no subfolder and no symlink.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/decision-capture/pi/decision-capture.test.ts
```

Expected result: every test passes and the command exits 0.

The suite builds a temporary project folder and points `HOOK_FLAGS_CONFIG` at a missing file there. It deletes `SYSTEM_HOOKS_DISABLED` and `SYSTEM_DECISION_CAPTURE_DISABLED` before each case, so a switch in your shell cannot decide one. It removes the folder afterwards.

---

## 4. RELATED

- [Decision capture folder](../README.md): the concern README, with the queue core and the runtime coverage.
- [Capture core](../lib/capture-core.mjs): the queue core that exports `appendRecords` and `takeNudge`.
- [Pi sweep](../bin/sweep-pi.mjs): the save-time reader that exports `QUESTION_TOOLS` and `recoveredRecords`.
- [Hook flags resolver](../../shared/hook-flags.cjs): the switch resolver this adapter calls.
- [Pi extensions mirror](../../../../.pi/extensions/README.md): the runtime folder that loads this adapter.
- [Hooks tree](../../README.md): the switch index and the coverage matrix.
