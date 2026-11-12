---
title: "Pi Injection Screen: fetch_content Tool Result Adapter"
description: "Pi extension that screens fetch_content results and appends one advisory text block to the tool result when a section reads as instructions aimed at an AI agent."
trigger_phrases:
  - "pi injection screen"
  - "pi fetch_content screen"
  - "pi tool result injection check"
version: 1.0.0.0
---

# Pi Injection Screen: fetch_content Tool Result Adapter

---

## 1. OVERVIEW

`hooks/classifier-injection-screen/pi/` holds the Pi extension for the injection screen concern. Pi has no built-in fetch tool. The `pi-web-access` package registers `fetch_content`, whose result is a content block array. The extension listens at `tool_result` and appends one advisory text block to that result when the screen flags.

The extension default export is a factory that takes the Pi `ExtensionAPI`. `.pi/extensions/` holds the one-line entry file that re-exports it, so Pi loads it as an extension.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `classifier-injection-screen.ts` | `tool_result` for `fetch_content` | Checks the kill switch, calls `screenAdvisory` on the event content and returns the event content with one advisory text block appended when the screen flags. | Fails open. A disabled hook, a non-fetch tool, a blank advisory or a thrown error returns `undefined`, leaving the result untouched. |
| `classifier-injection-screen.test.ts` | `vitest` suite | Imports the factory with a stub `ExtensionAPI` and a stubbed screen. Covers the advisory append, non-fetch results, the kill switch and fail-open behavior. | Not applicable. No test reaches a backend or a live `jev` install. |

---

## 3. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared `fetchedText` and `screenAdvisory` core the extension imports.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the kill-switch resolver the extension calls.
