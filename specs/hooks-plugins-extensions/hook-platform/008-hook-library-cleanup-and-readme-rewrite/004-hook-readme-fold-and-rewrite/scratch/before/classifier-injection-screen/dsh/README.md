---
title: "DSH Injection Screen: tools/post-execute Adapter"
description: "DeepSeek Harness adapter that screens fetched web and MCP results at tools/post-execute and attaches the advisory as extra context on an accepted result."
trigger_phrases:
  - "dsh injection screen"
  - "dsh tools post-execute"
  - "dsh fetch injection check"
version: 1.0.0.0
---

# DSH Injection Screen: tools/post-execute Adapter

---

## 1. OVERVIEW

`hooks/classifier-injection-screen/dsh/` holds the DSH adapter for the injection screen concern. It exports `registerClassifierInjectionScreen`, which registers one `tools/post-execute` handler. The handler screens results from `web_fetch`, `web_search` and any tool whose name starts with `mcp__`. When the screen flags, it attaches a user message with the advisory to `additionalContexts` on the accepted result.

The `.dsh/plugins/repo-guards/` bundle imports the adapter from this folder. The module declares `ERROR_POLICY = 'fail-open'`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `classifier-injection-screen.mjs` | `tools/post-execute` | Calls `next()`, returns early unless the result is accepted and the tool is screened, runs `screenAdvisory` on `result.content ?? result.value`, and returns the result with the advisory notice appended to `additionalContexts`. | Fails open. A throw is logged through `ctx.logger.warn` and the downstream result is returned unchanged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared `fetchedText` and `screenAdvisory` core this adapter calls.
- [`../tests/dsh-classifier-injection-screen.test.mjs`](../tests/dsh-classifier-injection-screen.test.mjs): the parity and fail-open tests for this adapter.
