---
title: "Session Relaunch: Hermes Adapters"
description: "Hermes bridge adapters for the pre-LLM nudge and the session-end arm, with usage recorded per API call and the window taken from model metadata."
trigger_phrases:
  - "hermes session relaunch"
  - "hermes pre llm call"
  - "hermes session end arm"
version: 1.0.0.0
---

# Session Relaunch: Hermes Adapters

---

## 1. OVERVIEW

`hermes/` holds the Hermes adapters for session relaunch. The enabled `repo-guards` project plugin bridges `pre_llm_call` to `context-nudge.mjs` and `on_session_end` to `session-end-arm.mjs`. The nudge returns seed text on a first turn or handoff text once the fill crosses the threshold. The arm accepts a missing event name from the bridge but rejects any supplied name other than `on_session_end`. Hermes fires `on_session_end` after every message, so the plugin keeps each session's usage until `on_session_finalize` or `on_session_reset` clears it.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`context-nudge.mjs`](./context-nudge.mjs) | `pre_llm_call` bridge | Reads Hermes usage, resolves the window from the event or model metadata and appends seed or handoff text to the turn's user message. The default window is 200000 tokens. | Exits quietly. A missing session id or usage value adds no text. |
| [`session-end-arm.mjs`](./session-end-arm.mjs) | `on_session_end` bridge | Validates the event, arms the pending record and detaches `../lib/killer.cjs` with the Hermes process resolved by the ancestor rule. A killer spawn failure leaves the record armed for the next session end. | Exits quietly. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the Hermes bridge notes.
- [`../lib/context-usage.cjs`](../lib/context-usage.cjs): the Hermes usage reader.
- [`../lib/killer.cjs`](../lib/killer.cjs): the detached process the arm starts.
