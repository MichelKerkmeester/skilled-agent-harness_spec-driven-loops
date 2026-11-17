---
title: "DSH Post-Edit Quality: tools/post-execute Adapter"
description: "DSH adapter that runs the shared post-edit router after a file tool and attaches findings and the staleness banner to an accepted result."
trigger_phrases:
  - "dsh post edit quality"
  - "dsh quality context"
  - "dsh post execute checks"
version: 1.0.0.0
---

# DSH Post-Edit Quality: tools/post-execute Adapter

---

## 1. OVERVIEW

`.skilled/hooks/post-edit-quality/dsh/` holds the DSH adapter for the post-edit quality concern. It runs at `tools/post-execute` and acts only on a file tool, when the write is already on disk. Findings from the shared router reach the model as extra context on the accepted result. A clean edit adds nothing at all.

DSH loads the adapter through the `repo-guards` bundle. `.dsh/patches/guards.patch.yml` inserts the plugin from `.dsh/plugins/repo-guards/index.mjs`, and that file calls `registerPostEditQuality`. The bundle reaches this folder through `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs`, a relative link to `post-edit-quality.mjs` here. The adapter registers itself with `ctx.on('tools/post-execute', ...)`. The registration carries no matcher and no timeout, and the bundle calls the register function with no fallback around it. The handler filters on the tool name instead, so a tool outside the file set returns the downstream result at once. The other runtimes reach this concern through their own adapters.

The adapter checks the concern switch before it registers a handler, so a disabled concern leaves the event bare. The switch is `SK_CODE_POST_EDIT_QUALITY_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch, because both resolve through `.skilled/hooks/shared/hook-flags.mjs`. With either switch on, nothing registers and nothing prints.

After that check the handler calls `next()` first, then reads `exec.name` and the path in `exec.arguments`. A `write` call and an `edit` call each name one path there. An `apply_patch` call is in the tool set too, but the adapter reads only those path fields. A patch-body call names none of them, so it returns the downstream result at once. The path resolves against the session cwd at `exec.agent.session.header.cwd`, with `process.cwd()` as the fallback. A path that does not exist on disk returns the downstream result at once.

`core.runChecks()` runs under a 9000 ms hook budget, with an 8000 ms cap for each checker and a 500 ms minimum worth running. `core.runDistStalenessCheck()` then runs alone with an 8000 ms timeout of its own and no test of the budget left. Each finding formats as its `[label]` line and the checker output under it. Findings and a printed staleness banner share one notice, which is a user message from `loadDshLlm()` with the `repo-guards` source. That notice attaches only to a result whose `kind` is `accept`.

Every failure ends with the downstream result unchanged. A core throw logs one `repo-guards post-edit-quality:` warning through `ctx.logger.warn` and returns that result. A logging failure is swallowed, so the completed file operation is never affected. A missing checker is not a failure here: it adds a `quality-notice` that names the missing path.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `post-edit-quality.mjs` | The adapter. It gates on the concern switch, then runs the shared router for a file tool and attaches one notice to an accepted result. |

The folder is flat and holds no test of its own. The module exports `registerPostEditQuality` and `ERROR_POLICY` set to `fail-open`. The register function takes the plugin context and an options object that tests override, which carries the core, the switch resolver, the notice factory and a working directory. The suite that drives this adapter lives at `.skilled/hooks/post-edit-quality/tests/dsh-post-edit-quality.test.mjs`.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/dsh-post-edit-quality.test.mjs
```

Expected result: every test passes and the command exits 0. The first case compares the adapter against a direct core call on a plain file and asserts that the result comes back unchanged. The second asserts the fail-open policy. A core throw keeps the accepted result and writes one log line.

---

## 4. RELATED

- [the concern README](../README.md): the runtime coverage matrix and the switch table.
- [the shared router](../lib/post-edit-router.cjs): picks the checker for an edited path and runs it.
- [the switch resolver](../../shared/hook-flags.mjs): the module behind `isHookEnabled`.
- [the message loader](../../shared/dsh/dsh-llm.mjs): supplies `createUserMessage` for the notice.
- [the adapter suite](../tests/dsh-post-edit-quality.test.mjs): the cases that drive this file.
- [the repo-guards bundle](../../../../.dsh/plugins/repo-guards/index.mjs): calls `registerPostEditQuality`.
- [the adapter link](../../../../.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs): the relative link to this folder's adapter.
- [the guards patch](../../../../.dsh/patches/guards.patch.yml): inserts the bundle into a DSH run.
