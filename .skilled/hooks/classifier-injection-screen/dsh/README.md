---
title: "DSH Classifier Injection Screen: tools/post-execute Adapter"
description: "DeepSeek Harness (DSH) adapter that screens fetched web and MCP results at tools/post-execute and attaches the advisory as extra context on an accepted result."
trigger_phrases:
  - "dsh injection screen"
  - "dsh tools post-execute"
  - "dsh fetch injection check"
version: 1.0.0.0
---

# DSH Classifier Injection Screen: tools/post-execute Adapter

---

## 1. OVERVIEW

`.skilled/hooks/classifier-injection-screen/dsh/` holds the DSH adapter for the classifier injection screen concern. It runs at `tools/post-execute` and screens the results of fetched tools. A flagged result gains one user message in `additionalContexts`. A clean result comes back unchanged, so the session shows nothing.

The adapter screens `web_fetch` and `web_search`. It also screens any tool whose name starts with `mcp__`.

`.dsh/plugins/repo-guards/index.mjs` registers the adapter. Its `apply` function calls `registerClassifierInjectionScreen(ctx, options.classifierInjectionScreen)`. The bundle entry `.dsh/plugins/repo-guards/adapters/classifier-injection-screen.mjs` is a relative link to this file. The event name lives in the adapter, at `ctx.on('tools/post-execute', ...)`.

The switch check comes first. `registerClassifierInjectionScreen` returns before it registers a handler when `isEnabled('injection-screen')` is false. That resolver is `isHookEnabled` from `.skilled/hooks/shared/hook-flags.mjs`, so the concern switch is `SYSTEM_INJECTION_SCREEN_DISABLED` and `SYSTEM_HOOKS_DISABLED` is the master switch. The shared core holds a second gate, `JEV_FEATURE_INJECTION_SCREEN=0`, which leaves the handler in place and returns no advisory.

Each call runs `next()` first and keeps the downstream result. The handler returns that result unchanged unless the tool is screened and the downstream result is accepted. A throw inside the screen reaches `ctx.logger.warn` once and the downstream result returns unchanged. The module exports `ERROR_POLICY = 'fail-open'`. A logging failure changes nothing.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `classifier-injection-screen.mjs` | The adapter. It checks the switch, then registers the `tools/post-execute` handler. On an accepted result it reads the fetched text from `result.content ?? result.value` and appends the advisory to `additionalContexts`. |

The folder holds this adapter and no test of its own. The suite sits in `../tests/`. The bundle link in `.dsh/plugins/repo-guards/adapters/` points here, so both paths load one module.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/tests/dsh-classifier-injection-screen.test.mjs
```

Expected result: every test passes, the summary prints `fail 0` and the command exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the classifier injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared `fetchedText` and `screenAdvisory` core this adapter calls.
- [`../tests/dsh-classifier-injection-screen.test.mjs`](../tests/dsh-classifier-injection-screen.test.mjs): the parity and fail-open cases for this adapter.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that registers this adapter.
