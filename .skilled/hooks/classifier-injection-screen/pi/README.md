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

`.skilled/hooks/classifier-injection-screen/pi/` holds the Pi extension for the injection screen concern. Pi ships no built-in fetch tool, so the `pi-web-access` package registers `fetch_content`. That tool returns a content block array. The extension listens at `tool_result` and appends one advisory text block when the screen flags.

The default export is a factory that takes the Pi `ExtensionAPI`. Pi loads it through `.pi/extensions/classifier-injection-screen.ts`, a one-line file that re-exports the factory. Pi's registration is the `injection-screen` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, which names the extension file `classifier-injection-screen.ts`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `classifier-injection-screen.ts` | The extension. It checks the kill switch, screens a `fetch_content` result and appends one advisory text block. |
| `classifier-injection-screen.test.ts` | The `vitest` suite. It stubs the `ExtensionAPI` and the screen, so no test reaches a backend. |

The factory returns before it registers a handler when `SYSTEM_INJECTION_SCREEN_DISABLED=1` is set. The master switch `SYSTEM_HOOKS_DISABLED=1` turns the hook off the same way. A tool name other than `fetch_content` returns `undefined` and leaves the result untouched. A blank advisory returns `undefined` too, so the fetched blocks reach the model unchanged. A thrown screen error returns `undefined`, because a screen bug must never alter the fetch.

The handler passes the fetched text to `screenAdvisory` and appends what comes back. A flagged result returns the event content with one advisory text block appended. The suite imports the factory with a stub `ExtensionAPI` and a stubbed screen. It covers the advisory append, a non-fetch result, the kill switch and a thrown screen. No test reaches a backend or a live `jev` install.

---

## 3. VALIDATION

Run this command from the repository root to exercise the suite.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.test.ts
```

Expected result: every case passes and the command exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared `fetchedText` and `screenAdvisory` core that the extension imports.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the kill-switch resolver that the extension calls before it registers.
