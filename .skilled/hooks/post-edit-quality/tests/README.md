---
title: "Post-Edit Quality Tests: Router and Adapter Suites"
description: "node --test suites for the shared router, the DSH adapter and the Codex and Devin PostToolUse adapters."
trigger_phrases:
  - "post edit quality tests"
  - "checker dispatch tests"
  - "post edit adapter tests"
version: 1.0.0.0
---

# Post-Edit Quality Tests: Router and Adapter Suites

---

## 1. OVERVIEW

`.skilled/hooks/post-edit-quality/tests/` holds the `node --test` suites for the post-edit quality concern. Most cases build a temporary project tree, so checker dispatch and project-root lookup run against a fixture. The router and DSH suites load the code in the same process. The Codex and Devin suites spawn their adapter as a child process.

The router suite covers checker resolution, the extension table, the missing-checker notice and router silence. The DSH suite covers parity with a direct core call and the fail-open throw policy. The Codex suite covers `edit` and the Devin suite covers `write` and `edit`. Both check that a read raises no finding and check the finding each adapter prints for an edit.

---

## 2. ARCHITECTURE

The split is in how a suite reaches the code. An in-process suite loads the module and reads the value it returns. A child-process suite runs the adapter the way a runtime runs it, so the case can read the exit status as well.

```text
node --test .skilled/hooks/post-edit-quality/tests/
         │
         ├─────────────────────┐
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ in process       │  │ child process    │
│ router, DSH      │  │ Codex, Devin     │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
┌─────────────────────────────────────────┐
│ the checkers the router runs            │
└─────────────────────────────────────────┘

Dependency direction: suites ───▶ router or adapter ───▶ checkers
```

---

## 3. FILES

The folder is flat. Each file is one `node --test` suite.

| File | Responsibility |
|---|---|
| `post-edit-router.test.cjs` | The shared router: checker resolution, the extension table, the missing-checker notice and router silence. |
| `dsh-post-edit-quality.test.mjs` | The DSH adapter on a fake context: parity with a direct core call and the fail-open throw policy. |
| `codex-post-edit-quality.test.cjs` | The Codex adapter, spawned as a child process against a fixture project. |
| `devin-post-edit-quality.test.cjs` | The Devin adapter, spawned as a child process against a fixture project. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Fixture | Most cases build a temporary project tree and remove it when the case ends. A few router cases pass a literal project path instead. |
| Environment | A spawned child gets a copy of the current environment with the disable names removed. |
| Checker | The router resolves the comment-hygiene checker beside its own real path first and in the project folder second. |
| Output | The router prints nothing and leaves reporting to its adapters. |
| Ownership | Test cases only. The code under test lives in the folders above. |

A router case edits a file in a temporary project. The hub copy of the checker wins in both directions. A project with no checker of its own still reaches the hub copy, and a project that ships its own copy does not replace it.

The router reads the extensions it dispatches from the checker's family table and keeps a built-in set for a table it cannot read. One case copies the router alone into a fresh source root with no checker and no table beside it, which is the state a partial install leaves behind. That copy falls back to the project checker. A checker that is missing becomes one `quality-notice` finding that names the path, and a dedupe tracker keeps the notice to one per session.

The silence case swaps the process streams and the console methods, then asserts each one stayed empty.

The Codex and Devin suites spawn their adapter with `process.execPath`, so each case sees the exit status a runtime sees. The child gets a copy of the environment with these disable names removed: `SYSTEM_HOOKS_DISABLED`, `MK_HOOKS_DISABLED`, `SK_CODE_POST_EDIT_QUALITY_DISABLED` and `MK_POST_EDIT_QUALITY_DISABLED`. `HOOK_FLAGS_CONFIG` points at a file in the fixture that does not exist, so a persisted switch cannot turn the hook into a silent no-op.

Each fixture carries a comment with an ADR reference, which the checker flags. The Codex suite asserts the advisory as plain text on stdout. The Devin suite reads it from `hookSpecificOutput.additionalContext`, and a clean edit prints nothing at all. A read event is the negative control in both suites, and both send a non-string `file_path` beside a valid `filePath` to prove the path is not lost.

The DSH suite registers the adapter on a fake context from the shared helpers. One case compares the adapter with a direct core call on a plain text file, then asserts the accepted result comes back unchanged. The other gives the adapter a core that throws, asserts `ERROR_POLICY` is `fail-open` and keeps the accepted result with one log line.

---

## 5. VALIDATION

Run the whole folder from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/
```

Expected result: `pass 15` and `fail 0`, with exit status 0.

Run one suite while you work on it.

```bash
node --test .skilled/hooks/post-edit-quality/tests/dsh-post-edit-quality.test.mjs
```

Expected result: `pass 2` and `fail 0`, with exit status 0.

---

## 6. RELATED

- [the concern README](../README.md): the runtime coverage table and the switch table.
- [the shared router](../lib/post-edit-router.cjs): the module the router suite exercises and each adapter calls.
- [the DSH adapter](../dsh/post-edit-quality.mjs): the module the DSH suite registers on a fake context.
- [the Codex adapter](../codex/post-edit-quality.cjs): the file the Codex suite spawns.
- [the Devin adapter](../devin/post-edit-quality.cjs): the file the Devin suite spawns.
- [the shared test helpers](../../shared/tests/README.md): the fake context and temporary directory helpers the DSH suite uses.
