---
title: "Shared DSH Tests: Loader Test and Plugin Helpers"
description: "A loader test that skips when dsh is absent plus the fake plugin contexts, agents, notices and predicates used by the DSH adapter suites."
trigger_phrases:
  - "dsh shared tests"
  - "dsh plugin test helpers"
  - "dsh loader test"
version: 1.0.0.0
---

# Shared DSH Tests: Loader Test and Plugin Helpers

---

## 1. OVERVIEW

`shared/tests/` holds the shared test layer for the DSH adapters. The loader test checks that the package loader resolves from the running DSH binary. The helper module builds fake plugin contexts that record handlers, logs and registered commands, so an adapter suite can fire one event and assert the result without a live runtime.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`dsh-llm.test.mjs`](./dsh-llm.test.mjs) | `node --test` suite | Skips when `command -v dsh` fails. Otherwise asserts that `loadDshLlm()` exposes `createUserMessage`, that `loadDshTools()` exposes `defineTool`, and that a bad anchor does not poison the cache. | Not applicable, the suite asserts behavior. |
| `dsh-plugin-harness.mjs` | Shared test helpers | Exports `pluginHarness()`, `adapterHarness()`, `fakeAgent()`, notice factories, temp-directory helpers and the `enabled`, `disabled`, `leaf`, `interactive`, `accept` and `allow` predicates. | `pluginHarness().fire()` throws when the named event has no registered handler. |

---

## 3. RELATED

- [`../README.md`](../README.md): the shared helpers README for the whole hooks tree.
- [`../dsh/dsh-llm.mjs`](../dsh/dsh-llm.mjs): the loader the test exercises.
- [`../dsh/session-role.mjs`](../dsh/session-role.mjs): the leaf marker the helpers model.
