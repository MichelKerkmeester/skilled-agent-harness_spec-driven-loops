---
title: "Shared Hook Tests: DSH Loader Test and Session Reader Suites"
description: "The DSH loader test, the fake plugin contexts the DSH adapter suites drive, and the session reader suites with their store fixtures and filesystem helpers."
trigger_phrases:
  - "dsh shared tests"
  - "dsh plugin test helpers"
  - "dsh loader test"
version: 1.0.0.0
---

# Shared Hook Tests: DSH Loader Test and Session Reader Suites

---

## 1. OVERVIEW

`.skilled/hooks/shared/tests/` holds the shared test layer for the DSH adapters and the session reader suites. The loader test checks that the package loader resolves from the running DSH binary. The helper module builds fake plugin contexts that record handlers, logs and registered commands. An adapter suite fires one event and asserts the result without a live runtime.

`session-readers/` holds one suite per runtime plus the cross-cutting suites. The per-runtime suites cover Claude, Codex, Cursor, Devin, DSH, OpenCode, Pi and Vibe. Cursor is gated rather than read, because it has no confirmed capture point. The cross-cutting suites cover identity, injected text, projection, the runtime-by-state matrix and side effects. One suite rebuilds every reader declaration and compares it with the committed copy.

---

## 2. DIRECTORY TREE

```text
tests/
+-- README.md
+-- dsh-llm.test.mjs
+-- dsh-plugin-harness.mjs
`-- session-readers/   one suite per runtime, plus fixtures and helpers
```

| File | Responsibility |
|---|---|
| `dsh-llm.test.mjs` | The `node --test` suite for the loader. It skips when `command -v dsh` fails. |
| `dsh-plugin-harness.mjs` | The fake plugin contexts, agents, notices and predicates the DSH adapter suites import. |
| `session-readers/` | The reader suites, their store fixtures and their filesystem helpers. |

The loader suite asserts that `loadDshLlm()` exposes `createUserMessage` and that `loadDshTools()` exposes `defineTool`. It loads a bad anchor first, so a rejected path cannot poison the cache. The suite asserts behavior, so it has no error path of its own.

`pluginHarness()` records every handler, command and log line an adapter registers. Its `fire()` calls the first handler registered for an event. `adapterHarness()` keeps one handler per event, the last one registered. `fakeAgent()` records injected messages and scoped tool registrations for a fake session. `plainNotice()` and `humanMessage()` build messages, and `noticeText()` reads one back. `tempDir()` and `cleanup()` create and remove a temporary directory for a suite.

`pluginHarness().fire()` throws when the named event has no registered handler. The module also exports the `enabled`, `disabled`, `leaf` and `interactive` predicates. It exports the `accept` and `allow` handlers as well.

`fixtures.mjs` writes each store into a temporary root and returns the options its reader needs. `helpers.mjs` creates temporary directories and writes JSON and JSONL files. It also records every path a reader opens, even through a named import. The `session-readers/fixtures/vibe/` folder holds redacted copies of recorded Vibe journals.

---

## 3. VALIDATION

Run the commands from the repository root.

```bash
node --test .skilled/hooks/shared/tests/dsh-llm.test.mjs
```

Expected result: the suite passes. On a machine without `dsh`, it skips instead.

```bash
node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs
```

Expected result: every test passes. The store-unchanged check confirms each reader leaves its fixture store untouched. The declaration check is skipped when the TypeScript compiler is not installed.

---

## 4. RELATED

- [`../README.md`](../README.md): the shared helpers README for the whole hooks tree.
- [`../dsh/dsh-llm.mjs`](../dsh/dsh-llm.mjs): the loader the test exercises.
- [`../dsh/session-role.mjs`](../dsh/session-role.mjs): the leaf marker the `leaf` predicate stands in for.
- [`../session-readers/index.mjs`](../session-readers/index.mjs): the dispatcher every reader suite calls.
