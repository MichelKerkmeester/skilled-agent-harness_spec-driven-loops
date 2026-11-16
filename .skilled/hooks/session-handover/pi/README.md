---
title: "Session Handover: Pi Extension"
description: "Pi extension and vitest suite for the relaunch loop, covering the mid-session nudge, the prompt seed, the settle-time arm and the compaction pointer."
trigger_phrases:
  - "pi session handover"
  - "pi relaunch extension"
  - "pi compaction pointer"
version: 1.0.0.0
---

# Session Handover: Pi Extension

---

## 1. OVERVIEW

`pi/` holds the Pi extension for session handover and its vitest suite. Pi discovers the extension through the one-line entry file `.pi/extensions/session-handover.ts`. The extension registers `message_end`, `before_agent_start`, `agent_start`, `turn_end`, `agent_end`, `agent_settled`, `tool_call` and `session_compact`.

The extension answers to the concern key `session-handover` and reloads the flags file per event. The extension runs one handoff step per event, as follows.

- `message_end` measures fill and holds the nudge text for that session.
- `before_agent_start` answers a seed taken from the prompt's first block.
- `turn_end` steers a held nudge into a running loop once that turn's tools ran.
- `agent_end` delivers the held nudge as a follow-up when the loop ended instead.
- `agent_settled` arms the record once no turn can undo it and spawns the killer.
- `agent_start` cancels an arm and steers the withdrawn notice to the model.
- `tool_call` blocks the `question` and `ask_user_question` tools while the record can still be armed.
- `session_compact` resets the pointer and points the session at its open note.

Every handler catches its own error and returns `undefined` to the host. A core module that lacks a function it calls fails the load instead. A failed module load is retried on the next event. A killer spawn error is logged and the record stays armed.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `session-handover.ts` | The extension. It registers eight events and runs the nudge, seed, arm, cancel and compaction paths. |
| `session-handover.test.ts` | The vitest suite. It covers the nudge, seed, arm, cancel and compaction paths with a mocked `spawn` and the shared fixture environment. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the handoff protocol.
- [`../lib/nudge.cjs`](../lib/nudge.cjs): the text and threshold logic the extension imports from it.
- [`../../../../.pi/extensions/session-handover.ts`](../../../../.pi/extensions/session-handover.ts): the one-line entry file through which Pi discovers the extension.
