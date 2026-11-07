---
title: "Session Relaunch: Pi Extension"
description: "Pi extension and vitest suite for the relaunch loop, covering the mid-session nudge, the prompt seed, the settle-time arm and the compaction pointer."
trigger_phrases:
  - "pi session relaunch"
  - "pi relaunch extension"
  - "pi compaction pointer"
version: 1.0.0.0
---

# Session Relaunch: Pi Extension

---

## 1. OVERVIEW

`pi/` holds the real Pi extension for session relaunch and its vitest suite. Pi discovers the extension through the relative symlink `.pi/extensions/session-relaunch.ts`. The extension registers `message_end`, `before_agent_start`, `agent_start`, `agent_end`, `agent_settled` and `session_compact`. It holds a nudge until the run settles, arms the record at the settle, withdraws an arm when a new turn starts and points a compacted session back at its open note.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`session-relaunch.ts`](./session-relaunch.ts) | Extension, six events | Measures fill from `message_end`, answers a seed in `before_agent_start`, delivers a held nudge on `agent_end`, arms on `agent_settled`, cancels an arm on `agent_start` and resets the pointer on `session_compact`. | Fails open. Each handler catches and returns `undefined`. |
| [`session-relaunch.test.ts`](./session-relaunch.test.ts) | Vitest suite | Covers the nudge, seed, arm, cancel and compaction paths with a mocked `spawn` and the shared fixture environment. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the handoff protocol.
- [`../lib/nudge.cjs`](../lib/nudge.cjs): the text and threshold logic the extension imports.
- [`../../../../.pi/extensions/session-relaunch.ts`](../../../../.pi/extensions/session-relaunch.ts): the link Pi discovers.
