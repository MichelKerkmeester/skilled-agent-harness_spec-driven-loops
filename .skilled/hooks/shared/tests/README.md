---
title: "Shared Hook Tests: DSH Loader, CLI Entry and Session Reader Suites"
description: "The CLI entry check, the DSH loader test and the fake plugin contexts that the DSH adapter suites drive, plus the session reader suites with their store builders and filesystem helpers."
trigger_phrases:
  - "dsh shared tests"
  - "dsh plugin test helpers"
  - "dsh loader test"
version: 1.0.0.0
---

# Shared Hook Tests: DSH Loader, CLI Entry and Session Reader Suites

---

## 1. OVERVIEW

`.skilled/hooks/shared/tests/` holds the shared test layer for the hook helpers under `.skilled/hooks/shared/`. `cli-entry.test.mjs` checks the CLI entry helper through a real path and through a symlinked folder. `dsh-llm.test.mjs` loads the DSH packages from the `dsh` binary on `PATH`. `dsh-plugin-harness.mjs` builds fake plugin contexts that the DSH adapter suites in sibling hook folders import.

`session-readers/` holds one suite per runtime reader and the cross-cutting suites. The store builders in `fixtures.mjs` write a runtime store into a temporary root. `helpers.mjs` supplies the filesystem helpers those suites share. A suite asserts reader behavior against its fixture and needs no live runtime.

Current state:

- Every suite at this level runs under `node --test`.
- Cursor is gated rather than read, because it has no confirmed capture point.
- The Vibe suite reads recorded journals kept under `session-readers/fixtures/vibe/`.
- The side-effect proof snapshots every store path the builders produce.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────╮
│ node --test                              │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ suite file in tests/ or session-readers/ │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ fixture builder or helper                │
│ writes a store under a temporary root    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ reader under test                        │
│ shared/session-readers/                  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ assertion on the returned result         │
╰──────────────────────────────────────────╯
```

The test layer sits beside the modules it exercises. A suite builds its store, calls the reader and asserts on the returned result. The DSH plugin test helpers follow a shorter path, because they only hand an adapter a fake context and record what the adapter registers.

Dependency direction: a suite reads `fixtures.mjs` and `helpers.mjs`. `fixtures.mjs` reads `dsh.mjs` and `pi.mjs` from `../session-readers/`, and `helpers.mjs` imports only Node built-ins.

---

## 3. DIRECTORY TREE

```text
tests/
+-- README.md
+-- cli-entry.test.mjs          # real-path and symlink entry checks
+-- dsh-llm.test.mjs            # loader check, skipped when dsh is absent
+-- dsh-plugin-harness.mjs      # fake plugin contexts for adapter suites
`-- session-readers/            # reader suites, store fixtures and helpers
    +-- fixtures/               # recorded Vibe journals
    +-- fixtures.mjs            # one store builder per fixture-backed runtime
    +-- helpers.mjs             # temporary roots, writers, file-open tracking
    +-- claude.test.mjs
    +-- codex.test.mjs
    +-- cursor.test.mjs
    +-- declarations.test.mjs
    +-- devin.test.mjs
    +-- dsh.test.mjs
    +-- identity.test.mjs
    +-- injected-text.test.mjs
    +-- matrix.test.mjs
    +-- opencode.test.mjs
    +-- pi.test.mjs
    +-- project.test.mjs
    +-- side-effects.test.mjs
    `-- vibe-reader.test.mjs
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `cli-entry.test.mjs` | Checks `isCliEntry()` from the shared CLI entry helper. A script run by its real path is the entry and so is one run through a symlinked folder, while a module that is only imported is not. |
| `dsh-llm.test.mjs` | Loads the DSH packages from the binary that `command -v dsh` prints, after a bad anchor is rejected and the cache stays clean. Skips when `dsh` is not installed. |
| `dsh-plugin-harness.mjs` | Fake plugin contexts, a fake agent, notice and message builders, temporary directory helpers and the enabled, disabled, leaf and interactive predicates. |
| `session-readers/` | The reader suites, the store builders in `fixtures.mjs` and the filesystem helpers in `helpers.mjs`. |

`pluginHarness()` records every handler, command and log line a context receives. Its `fire()` calls the first handler registered for an event. `adapterHarness()` keeps one handler per event, the last one registered. `fakeAgent()` records injected messages and scoped tool registrations for a fake session.

`fixtures.mjs` builds a store for Claude, Codex, Pi, OpenCode, Devin and DSH, then returns the options its reader needs. `presentStores()` builds all of them and lists the store paths the side-effect proof snapshots. `helpers.mjs` creates a temporary root and writes JSON or JSONL into it. `trackFileOpens()` patches the built-in file exports and re-syncs them, so a reader that imported a named function at load time still reports every path it opens.

The per-runtime suites cover Claude, Codex, Cursor, Devin, DSH, OpenCode, Pi and Vibe. `identity.test.mjs` covers traversal, a symlink escape, an id mismatch and a missing file. `injected-text.test.mjs` covers injected context that a reader may drop. `project.test.mjs` checks the projection against the published history entry schema. `matrix.test.mjs` covers Claude, Codex, Pi, OpenCode, Devin and DSH in the present, absent, mismatched and unreadable states, and asserts the Cursor gate in each of its rows. `side-effects.test.mjs` compares store hashes, sizes, modification times and the folder listing before and after a read. `declarations.test.mjs` rebuilds each reader declaration and compares it with the committed copy.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | A suite imports a reader from `../session-readers/` or the loader from `../dsh/dsh-llm.mjs`. No suite reads a live runtime store. |
| Fixtures | A store builder writes only under the root its suite makes with `withTemp()` or `withTempAsync()`. |
| Ownership | The shared fake plugin contexts live here, and most adapter suites in sibling hook folders import them. The MCP route guard suite builds its own fake context. |
| Cleanup | The helper removes its temporary root when the suite body returns. `cleanup()` removes a directory that `tempDir()` made. |

A projected read:

```text
╭──────────────────────────────────────────╮
│ readSession()                            │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ runtime reader selected by runtime name  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ store read, then neutral records         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ projectEntries()                         │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ items, or a failure code                 │
╰──────────────────────────────────────────╯
```

`loadSession()` returns the same records without the projection. Cursor's reader returns `capability_gated` before any file is opened while its switch is off, and `locator_unavailable` once the switch is on, because no store path is confirmed yet.

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `dsh-plugin-harness.mjs` | Module | The fake contexts and helpers most DSH adapter suites start from. |
| `session-readers/fixtures.mjs` | Module | Builds one runtime store and returns the options its reader needs. |
| `session-readers/helpers.mjs` | Module | Creates temporary roots, writes JSON or JSONL and tracks every file a reader opens. |
| `node --test` | CLI | Runs one suite file or every reader suite in the folder. |

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/shared/tests/cli-entry.test.mjs
```

Expected output: the summary reports `pass 3` and `fail 0`.

```bash
node --test .skilled/hooks/shared/tests/dsh-llm.test.mjs
```

Expected output: the summary reports `pass 1` and `fail 0` when `dsh` is on `PATH`. Without `dsh`, the loader test is skipped.

```bash
node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs
```

Expected output: the summary reports `fail 0`. The declaration check is skipped when the TypeScript compiler is not installed.

```bash
python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/hooks/shared/tests/README.md
```

Expected output: `PASS` for this file with no broken reference.

---

## 8. RELATED

- [the shared hooks README](../README.md) covers the helpers this folder tests.
- [the CLI entry helper](../cli-entry.mjs) holds `isCliEntry()`.
- [the DSH loader](../dsh/dsh-llm.mjs) is the module the loader test exercises.
- [the session reader dispatcher](../session-readers/index.mjs) holds `readSession()` and `loadSession()`.
- [the declaration builder](../session-reader-declarations.mjs) rebuilds the committed reader declarations.
