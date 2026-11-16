---
title: "Claude Injection Screen: WebFetch PostToolUse Adapter"
description: "Claude Code PostToolUse adapter that screens the text a WebFetch returned and adds one advisory line when a section reads as instructions aimed at an AI agent."
trigger_phrases:
  - "claude injection screen"
  - "claude webfetch screen"
  - "posttooluse injection check"
version: 1.0.0.0
---

# Claude Injection Screen: WebFetch PostToolUse Adapter

---

## 1. OVERVIEW

`hooks/classifier-injection-screen/claude/` holds the Claude Code adapter for the injection screen concern. The adapter runs at `PostToolUse` after a `WebFetch` call. It takes the fetched text, sends it through the shared screen, and writes one advisory line to `hookSpecificOutput.additionalContext` when a section flags. The fetch result always reaches the model unchanged.

Claude Code loads the hook from the registration that `sync-hook-registrations.cjs` renders out of `hook-registry.json`. The hook reads its kill switch through `isHookEnabled('injection-screen')` before it parses any payload.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `classifier-injection-screen-posttooluse.mjs` | `PostToolUse` for `WebFetch` | Parses the payload, checks the kill switch, extracts the fetched text, calls `screenAdvisory` and writes `hookSpecificOutput.additionalContext` with the advisory. | Fails open. A missing payload, a parse error, an absent `jev` CLI or a failed screen exits 0 with no output. |
| `classifier-injection-screen-posttooluse.test.mjs` | `node --test` suite | Spawns the hook with a payload on stdin and a stub `jev` first on `PATH`. Covers the advisory path, non-fetch tools, the kill switch and the failure paths. | Not applicable. The suite creates and removes its own fixture directories. |

---

## 3. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared text extraction and advisory line this adapter calls.
- [`../lib/classifier-screen-fetched-text.mjs`](../lib/classifier-screen-fetched-text.mjs): the section, call and flag logic behind `screenAdvisory`.
