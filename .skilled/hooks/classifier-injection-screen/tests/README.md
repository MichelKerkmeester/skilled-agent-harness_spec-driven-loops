---
title: "Injection Screen Tests: DSH Adapter Parity Suite"
description: "node --test suite that checks the DeepSeek Harness (DSH) injection screen adapter against the shared core and asserts its fail-open throw policy."
trigger_phrases:
  - "dsh injection screen tests"
  - "injection screen parity tests"
  - "dsh adapter fail-open tests"
version: 1.0.0.0
---

# Injection Screen Tests: DSH Adapter Parity Suite

---

## 1. OVERVIEW

`tests/` holds the DSH suite for the classifier injection screen. Both cases register the real adapter. The parity case also runs the real shared core. The shared test helpers build the fake plugin context. The suite fires the `tools/post-execute` handler from it and reads the accepted result and the recorded log lines.

The suite covers both sides of the adapter's contract. One case checks that a fetched result with no text passes through with no advisory attached. The other checks that a throwing core leaves the result accepted and logs one warning. Neither case reaches the Jev gate, because the parity case returns before the gate check and the throw case replaces the core. The suite runs without `jev` on PATH.

This folder holds no runtime code. A runtime that keeps its suite beside its adapter does so in the adapter's folder. The DSH adapter folder holds no test, so its suite lives here.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-classifier-injection-screen.test.mjs` | The `node --test` suite for the DSH adapter. |

The parity case asks the core for the text in an empty block array, then for a verdict on that text. The verdict must be null. The case registers the adapter with the same core and with a notice factory that calls `assert.fail` if it ever runs. The adapter's fail-open catch would swallow that call, so the case rests on its two checks of the returned result. It fires the handler with a `web_fetch` call and an empty content array. The handler returns the accepted result with no `additionalContexts`, so the adapter adds nothing when there is nothing to screen.

The throw case reads `ERROR_POLICY` from the adapter and asserts `fail-open`. It then registers the adapter with a stub core whose `screenAdvisory` throws. The tool name is `mcp__sample__lookup`, so the case fails if the adapter stops screening MCP results. The handler returns the accepted result and records one `ctx.logger.warn` line.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/tests/
```

Expected result: `pass 2` and `fail 0`, with exit status 0.

---

## 4. RELATED

- [The injection screen concern](../README.md): its decision rule and its switches.
- [The DSH adapter](../dsh/classifier-injection-screen.mjs): the handler under test.
- [The shared core](../lib/classifier-injection-advisory.mjs): the text extraction and gate checks behind the adapter.
- [The shared DSH test helpers](../../shared/tests/README.md): the fake plugin context and result helpers the suite imports from `dsh-plugin-harness.mjs`.
- [The repo-guards bundle](../../../../.dsh/plugins/repo-guards/README.md): the DSH plugin that registers the adapter.
