---
title: "Pi Injection Screen: tool_result Adapter"
description: "Pi extension that screens fetch_content results and appends one advisory text block to the tool result when a section reads as instructions aimed at an AI agent."
trigger_phrases:
  - "pi injection screen"
  - "pi fetch_content screen"
  - "pi tool result injection check"
version: 1.0.0.0
---

# Pi Injection Screen: tool_result Adapter

---

## 1. OVERVIEW

`.skilled/hooks/classifier-injection-screen/pi/` holds the Pi adapter for the injection screen concern. It runs at `tool_result` and screens the text a `fetch_content` call returned. A flagged page gains one advisory text block on the tool result, so the warning sits beside the fetched text. The fetch always completes.

The `fetch_content` tool comes from the `pi-web-access` package, which `.pi/settings.json` lists in `packages`. Pi loads this adapter through `.pi/extensions/classifier-injection-screen.ts`, a one-line file that re-exports the factory. Pi picks up every `*.ts` entry in that folder without a settings entry, as the [extensions README](../../../../.pi/extensions/README.md) records. The `pi` block of the `injection-screen` record in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` names the same file.

The factory calls `isHookEnabled('injection-screen')` before it registers a handler, so a session with the concern off never reaches the handler. The concern switch is `SYSTEM_INJECTION_SCREEN_DISABLED`. The call goes through `hook-flags.mjs` to `hook-flags.cjs`, so `SYSTEM_HOOKS_DISABLED` is the master switch here.

Inside the handler the adapter reads `event.toolName` first and returns unless the name is `fetch_content`. It then passes `fetchedText(event.content)` to `screenAdvisory`. Every path that finds nothing to add returns `undefined`. The tool result keeps the content it had. That covers a non-fetch tool, a blank page, `JEV_FEATURE_INJECTION_SCREEN=0`, a `jev` CLI that is not ready, a page with no flagged section and a thrown screen.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `classifier-injection-screen.ts` | The adapter. It checks the concern switch and appends the advisory block to a `fetch_content` result. |
| `classifier-injection-screen.test.ts` | The `vitest` suite. It drives the factory with a stub `ExtensionAPI` and a stub screen. |

---

## 3. VALIDATION

The suite stubs the screen, so no case reaches a backend or a live `jev` install.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.test.ts
```

Expected result: every test passes and the command exits 0.

---

## 4. RELATED

- [Injection screen README](../README.md): the concern and the switches that turn it off.
- [Shared advisory core](../lib/classifier-injection-advisory.mjs): the `fetchedText` and `screenAdvisory` functions this adapter calls.
- [Shared switch resolver](../../shared/hook-flags.mjs): the `isHookEnabled` facade the factory calls before it registers.
- [Pi extension entry](../../../../.pi/extensions/classifier-injection-screen.ts): the one-line file that re-exports this adapter.
