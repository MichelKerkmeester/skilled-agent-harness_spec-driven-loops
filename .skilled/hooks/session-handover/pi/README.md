---
title: "Pi Session Handover: message_end, before_agent_start, turn_end, agent_end, agent_settled, agent_start, tool_call and session_compact Adapters"
description: "Pi extension and vitest suite for the relaunch loop, covering the mid-session nudge, the prompt seed, the settle-time arm and the compaction pointer."
trigger_phrases:
  - "pi session handover"
  - "pi relaunch extension"
  - "pi compaction pointer"
version: 1.0.0.0
---

# Pi Session Handover: message_end, before_agent_start, turn_end, agent_end, agent_settled, agent_start, tool_call and session_compact Adapters

---

## 1. OVERVIEW

`.skilled/hooks/session-handover/pi/` holds the Pi adapter for the session handover concern. As context fill nears the threshold, the adapter holds one nudge text for the session and gives it to the model when the run stops or a working turn leaves room for it. At the end of a run it arms the relaunch record and starts the process that ends the session.

Pi discovers every `.ts` entry in `.pi/extensions/` with no settings entry, so [the entry file](../../../../.pi/extensions/session-handover.ts) registers this folder. That entry is one line, `export { default } from '../../.skilled/hooks/session-handover/pi/session-handover.ts';`, and Pi calls the default export once at session start with the `ExtensionAPI` handle. The default export registers eight events: `message_end`, `before_agent_start`, `turn_end`, `agent_end`, `agent_settled`, `agent_start`, `tool_call` and `session_compact`. `.pi/settings.json` holds an empty `extensions` list, so no settings entry takes part in the registration.

Each handler reads the hook flags file before it acts and returns at once when the switch is off. Two early exits skip that read because the work cannot matter: `turn_end` on a turn with no tool call and `tool_call` on any tool but the two question dialogs. Every event reads the flags file again, so an edit reaches the next event without a restart.

The concern key is `session-handover`. Its kill switch is `SYSTEM_SESSION_HANDOVER_DISABLED`. `SYSTEM_SESSION_HANDOVER_PI_ENABLED` answers first when it holds a value, and `SYSTEM_SESSION_HANDOVER_ENABLED` answers otherwise. Pi is off while both are blank. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case. `SYSTEM_HOOKS_DISABLED` is the master switch, because `isHookEnabled` runs in `.skilled/hooks/shared/hook-flags.cjs` through the `.mjs` facade beside it.

Every handler catches its own error and returns `undefined`, so the host carries on with no handover text. The relaunch core and the withdraw module are checked at load, so a missing function fails that load, and the next event loads the modules again. An arm that throws logs `agent-settled-arm-error` and marks the record deferred, so the operator's next turn withdraws it. A killer spawn error is logged under the same event name and leaves the record armed. Neither the arm nor the withdrawal runs in a session the loop did not start, because both need `SKILLED_LOOP_ID`.

---

## 2. DIRECTORY TREE

The folder is flat. It holds no subfolder and no symlink.

| File | Responsibility |
|---|---|
| `session-handover.ts` | The adapter. It registers the eight events, loads four core modules on first use and runs the nudge, seed, arm, cancel and compaction paths. |
| `session-handover.test.ts` | The vitest suite. It calls the real adapter through a fake Pi API, with a mocked `spawn` and the shared fixture environment. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
env -u AI_SESSION_CHILD npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-handover/pi/session-handover.test.ts
```

Expected result: every test passes and the command exits 0.

The suite imports the real extension and swaps in a fake `ExtensionAPI` that records handlers and sent messages. It mocks `node:child_process` and points the state folder at a temp directory for each case. It clears every relaunch switch it inherits and the flags file path with them, but it does not clear `AI_SESSION_CHILD`. A dispatched worker shell carries that variable, and the nudge decision then returns `child-session` at any fill, so the nudge cases see no text. The command clears it, so a worker shell gives the same result as a plain one.

---

## 4. RELATED

- [Session handover folder](../README.md): the concern README, with the runtime matrix and the switch table.
- [Relaunch core](../lib/relaunch-core.cjs): the record read and the arm this adapter calls.
- [Nudge module](../lib/nudge.cjs): the thresholds and text the adapter reads.
- [Hook flags resolver](../../shared/hook-flags.cjs): the resolver behind every switch check.
- [Handoff protocol](../handoff-protocol.md): the note and relaunch flow the nudge starts.
- [Pi extensions mirror](../../../../.pi/extensions/README.md): the discovery folder that loads this adapter.
