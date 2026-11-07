---
title: "Devin Injection Screen: webfetch PostToolUse Adapter"
description: "Devin CLI PostToolUse adapter that screens the text a webfetch returned and adds one advisory line when a section reads as instructions aimed at an AI agent."
trigger_phrases:
  - "devin injection screen"
  - "devin webfetch screen"
  - "devin posttooluse injection check"
version: 1.0.0.0
---

# Devin Injection Screen: webfetch PostToolUse Adapter

---

## 1. OVERVIEW

`hooks/classifier-injection-screen/devin/` holds the Devin CLI adapter for the injection screen concern. The adapter runs at `PostToolUse` for the `webfetch` tool. It screens the page text and writes one advisory line to `hookSpecificOutput.additionalContext` when a section flags. The fetch result always reaches the model unchanged.

Devin loads the hook from the registration that `sync-hook-registrations.cjs` renders out of `hook-registry.json`. The Hermes `repo-guards` plugin also runs this adapter for its `web_extract` tool through `transform_tool_result`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `classifier-injection-screen-posttooluse.mjs` | `PostToolUse` for `webfetch` | Checks the kill switch, parses the payload, reads the page text from `tool_response.output`, calls `screenAdvisory` and writes `hookSpecificOutput.additionalContext` with the advisory. | Fails open. A missing payload, a parse error, an absent `jev` CLI or a failed screen exits 0 with no output. |
| `classifier-injection-screen-posttooluse.test.mjs` | `node --test` suite | Spawns the hook with a payload on stdin and a stub `jev` first on `PATH`. Covers the advisory path, non-fetch tools, the kill switch and the failure paths. | Not applicable. The suite creates and removes its own fixture directories. |

---

## 3. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared text extraction and advisory line this adapter calls.
- [`../claude/README.md`](../claude/README.md): the Claude Code sibling that screens `WebFetch`.
