---
title: "Post-Edit Quality: Test Suite"
description: "node --test suites for the shared router, the DSH adapter and the Codex and Devin PostToolUse adapters."
trigger_phrases:
  - "post edit quality tests"
  - "checker dispatch tests"
  - "post edit adapter tests"
version: 1.0.0.0
---

# Post-Edit Quality: Test Suite

---

## 1. OVERVIEW

`tests/` holds the automated checks for the post-edit quality concern. Each file drives one adapter or the shared router against a throwaway project tree. Checker dispatch and project-root resolution therefore never touch this repository.

Run the whole set with `node --test .skilled/hooks/post-edit-quality/tests/`.

The suites cover three runtimes. Codex registers its adapter as `PostToolUse` on `apply_patch|edit` in `.codex/hooks.json`. Devin registers its adapter as `PostToolUse` on `^(edit|write)$` in `.devin/hooks.v1.json`. DSH registers on `tools/post-execute` through `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs`. The concern README holds the full runtime matrix.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `post-edit-router.test.cjs` | Drives the shared router: checker resolution, the extension table, the missing-checker notice and router silence. |
| `dsh-post-edit-quality.test.mjs` | Registers the DSH adapter on a stub context and pins parity plus the fail-open throw policy. |
| `codex-post-edit-quality.test.cjs` | Spawns the Codex adapter against a fixture project and pins the `edit` positive control. |
| `devin-post-edit-quality.test.cjs` | Spawns the Devin adapter against a fixture project and pins `write` and `edit` as edit events. |

`post-edit-router.test.cjs` resolves the comment-hygiene checker beside the router's real path first. A project copy of that checker does not override the hub copy. The suite also pins the languages the family table adds, and the built-in set that replaces a missing, broken or empty table.

A router copied alone into a fresh source root falls back to the project checker. Two entries naming the same missing checker give one `quality-notice`. A dedupe tracker then keeps that notice to one per session. The last case asserts the router writes nothing to stdout or stderr.

`codex-post-edit-quality.test.cjs` and `devin-post-edit-quality.test.cjs` spawn their adapter as a child process. Each child gets a sanitized environment: the disable switches are dropped and `HOOK_FLAGS_CONFIG` points at a file that does not exist. The fixture file carries a comment the real checker flags, so the advisory is observable.

Codex prints that advisory as plain text on stdout. Devin delivers it in a `hookSpecificOutput.additionalContext` envelope, and a clean edit prints nothing. Both suites use `read` as the negative control. Both also send a non-string `file_path` beside a valid `filePath`, which must not hide the path.

`dsh-post-edit-quality.test.mjs` imports the shared test helper from `../../shared/tests/dsh-plugin-harness.mjs`. One case checks that an ordinary file result survives with no core findings. The other makes the core throw and asserts the result still passes through, with one log line.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/
```

Expected result: every suite passes, with `fail 0`.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the router the suites exercise.
- [`../dsh/post-edit-quality.mjs`](../dsh/post-edit-quality.mjs): the DSH adapter under test.
- [`../codex/post-edit-quality.cjs`](../codex/post-edit-quality.cjs): the Codex adapter the suite spawns.
- [`../devin/post-edit-quality.cjs`](../devin/post-edit-quality.cjs): the Devin adapter the suite spawns.
