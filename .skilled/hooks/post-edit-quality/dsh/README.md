---
title: "Post-Edit Quality: DSH tools/post-execute Adapter"
description: "DSH adapter that runs the shared checker router after an accepted write and attaches findings and the staleness banner as additional context."
trigger_phrases:
  - "dsh post edit quality"
  - "dsh quality context"
  - "dsh post execute checks"
version: 1.0.0.0
---

# Post-Edit Quality: DSH tools/post-execute Adapter

---

## 1. OVERVIEW

`dsh/` holds the DSH adapter that runs the post-edit quality check. DSH loads it through `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs`, a relative link to this file. `.dsh/patches/guards.patch.yml` inserts the `repo-guards` bundle, which registers the adapter on `tools/post-execute`. DSH is the only runtime that runs this adapter, so no other registration exists.

The adapter calls `next()` first, so the file is already written when it runs. It then checks `write`, `edit` and `apply_patch` results, and attaches the notice only to a result that comes back as `accept`.

Findings and the staleness banner are wrapped in a user message by `loadDshLlm()`. The adapter appends that message to `additionalContexts` on the accepted result.

The adapter fails open by contract, so a core throw never blocks the write. A missing file or a non-accept result returns the downstream result unchanged.

Setting `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` makes `registerPostEditQuality` return before it registers a handler.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `post-edit-quality.mjs` | The `tools/post-execute` adapter that DSH runs after a write, edit or patch. |

The module exports `registerPostEditQuality` and `ERROR_POLICY = 'fail-open'` for the bundle and its tests. The register function accepts the plugin context and an options object that tests override. The options carry the core, the switch resolver, the notice factory and a working directory.

The handler reads the edited path from `arguments.path`, `file_path` or `filePath`. It resolves that path against the session cwd or against `process.cwd()`. A path that does not exist on disk returns the downstream result at once.

The handler calls `resolveDispatch()` and `runChecks()` under the Claude budget constants. That is a 9000 ms hook budget with an 8000 ms cap per checker. A separate `runDistStalenessCheck()` call then runs with its own 8000 ms timeout and no check on the budget left.

Each finding is formatted as its `[label]` line followed by the checker output, and findings are separated by a blank line. The staleness banner is appended after them when the checker prints one. A single notice carries both and attaches only to an `accept` result.

`loadDshLlm()` supplies `createUserMessage`, which wraps the text with the `repo-guards` source. A core throw logs `repo-guards post-edit-quality: <error>` through `ctx.logger.warn` and returns the downstream result. A logging failure is swallowed, so the completed file operation is never affected.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/dsh-post-edit-quality.test.mjs
```

Expected result: every test passes, with `fail 0` in the summary. The suite covers core parity and the fail-open throw policy.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router that resolves the edited file and runs the checker.
- [`../../shared/dsh/dsh-llm.mjs`](../../shared/dsh/dsh-llm.mjs): the loader that supplies `createUserMessage` for the notice.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that loads this adapter on `tools/post-execute`.
- [`../../../../.dsh/patches/guards.patch.yml`](../../../../.dsh/patches/guards.patch.yml): the patch that inserts the bundle into a DSH run.
