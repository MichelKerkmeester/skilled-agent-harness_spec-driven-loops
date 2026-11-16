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

`tests/` holds the DSH suite for the injection screen concern. The suite imports the real shared core and the real adapter. It drives the adapter through the shared DSH plugin test helpers. It runs a parity case and a throw case against the real adapter. Together they confirm that the adapter and the shared library agree. They also confirm that the adapter's declared error policy holds.

This folder holds no runtime adapter, only the suite that exercises one. The per-runtime suites sit beside their adapters, in `claude/`, `devin/` and `pi/`. The `.dsh/plugins/repo-guards/` bundle registers the DSH adapter on `tools/post-execute` at load time. This suite is the only place that handler runs under test.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-classifier-injection-screen.test.mjs` | The `node --test` suite for the DSH adapter. |

The parity case screens a fetched result that carries no text. `fetchedText([])` returns null, so `screenAdvisory` returns null for that input. The adapter then leaves the accepted result alone, with no `additionalContexts`.

The throw case first asserts that `ERROR_POLICY` equals `fail-open`. It then stubs a core whose `screenAdvisory` throws on every call. The adapter catches the throw and returns the accepted result unchanged. The throw reaches `ctx.logger.warn` once, which the suite asserts as a single log line.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/tests/
```

Expected result: both cases pass and the run reports no failures.

---

## 4. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../dsh/classifier-injection-screen.mjs`](../dsh/classifier-injection-screen.mjs): the adapter under test.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared core the parity case compares against.
- [`../../shared/tests/`](../../shared/tests/): the shared DSH plugin test helpers that build the plugin context and handlers.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the DSH plugin bundle that registers the adapter.
