---
title: "DSH Injection Screen: tools/post-execute Adapter"
description: "DeepSeek Harness (DSH) adapter that screens fetched web and MCP results at tools/post-execute and attaches the advisory as extra context on an accepted result."
trigger_phrases:
  - "dsh injection screen"
  - "dsh tools post-execute"
  - "dsh fetch injection check"
version: 1.0.0.0
---

# DSH Injection Screen: tools/post-execute Adapter

---

## 1. OVERVIEW

`classifier-injection-screen.mjs` is the DSH adapter for the injection screen concern. It exports `registerClassifierInjectionScreen`, which registers one `tools/post-execute` handler on the plugin context. The handler screens results from `web_fetch`, `web_search` and any tool whose name starts with `mcp__`.

The handler calls `next()` first and keeps the downstream result. It returns that result unchanged unless the tool is screened and the result is accepted. A flagged result gains a user message with the advisory in `additionalContexts`.

The module declares `ERROR_POLICY = 'fail-open'`, and a try/catch around the screen keeps a throw from changing the result. A throw inside the screen reaches `ctx.logger.warn` and the downstream result returns unchanged. The adapter wraps that log call, so a logging failure changes nothing either.

`registerClassifierInjectionScreen` returns before it registers anything when the `injection-screen` concern is off. The `.dsh/plugins/repo-guards/` bundle imports the adapter from this folder at load time. The `.dsh/plugins/repo-guards/adapters/classifier-injection-screen.mjs` entry is a link to this file, so one copy serves both paths.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `classifier-injection-screen.mjs` | The DSH adapter for the injection screen concern. |

The file exports `registerClassifierInjectionScreen`, which registers one `tools/post-execute` handler. The handler reads the fetched text from `result.content ?? result.value` and passes it to `screenAdvisory`. A non-empty advisory becomes a user message, which the handler appends to `additionalContexts`.

The screen itself comes from `../lib/classifier-injection-advisory.mjs`, which supplies `fetchedText` and `screenAdvisory`. The concern check calls `isHookEnabled` from `../../shared/hook-flags.mjs`, the shared switch resolver.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/tests/
```

The suite covers parity with the shared core and the fail-open throw policy. It asserts that a result with no text to screen keeps no `additionalContexts`. It also asserts that a throwing core logs once and returns the accepted result.

---

## 4. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared `fetchedText` and `screenAdvisory` core this adapter calls.
- [`../tests/dsh-classifier-injection-screen.test.mjs`](../tests/dsh-classifier-injection-screen.test.mjs): the parity and fail-open tests for this adapter.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the DSH plugin bundle that registers this adapter.
