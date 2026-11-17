---
title: "DSH Shared Helpers: Loader and Leaf Marker for Adapters"
description: "Two small helpers the DSH adapters share, one that loads the DSH message and tool packages from the running install and one that marks a fan-out leaf."
trigger_phrases:
  - "dsh shared helpers"
  - "dsh package loader"
  - "dsh lineage leaf"
version: 1.0.0.0
---

# DSH Shared Helpers: Loader and Leaf Marker for Adapters

---

## 1. OVERVIEW

`.skilled/hooks/shared/dsh/` holds the two modules that the DSH adapters import by relative path. `dsh-llm.mjs` loads the DSH message and tool packages. `session-role.mjs` marks a fan-out leaf and answers whether this process is one.

Neither file registers a handler, so neither owns an event. They run inside the adapters that import them. `post-edit-quality.mjs` calls `loadDshLlm()` from its `tools/post-execute` handler. `prompt-advisor.mjs` reads `isLineageLeaf()` from its `agent/pre-step` handler to leave a leaf without a brief.

The bundle at `.dsh/plugins/repo-guards/index.mjs` registers the consuming adapters. `.dsh/patches/guards.patch.yml` inserts that bundle into a DSH run. The bundle names no event for either helper. The marker half is mounted by `.dsh/patches/lineage.patch.yml`, which inserts the `repo-guards-lineage-leaf` row, pointing at `.dsh/plugins/repo-guards/lineage-leaf.mjs`. That plugin imports the adapter link `.dsh/plugins/repo-guards/adapters/session-role.mjs`, which resolves into this folder. No patch names the loader. `.dsh/plugins/repo-guards/adapters/` holds one link per helper. Node resolves a link to its real path before it loads the module, so the link and a direct import reach one module instance.

`loadDshLlm()` takes the entry script path, `process.argv[1]` by default. Its first attempt is a bare `import('@deepseek-ai/dsh-llm')`. When that rejects it resolves the package through `createRequire(realpathSync(argv1))`, anchored at the running `dsh` binary, because this checkout holds no copy of the package. `loadDshTools()` does the same for `@deepseek-ai/dsh-tools`, which `goal-manage.mjs` uses for `defineTool`. The promise is cached per specifier, so a later call reuses the first result. A rejection deletes that cache entry, so a later call retries.

`markLineageLeaf()` writes `true` to `globalThis` under `Symbol.for('skilled.repo-guards.lineage-leaf')`. `isLineageLeaf()` returns `true` only for that value and `false` when nothing set it. Read the marker when an event fires, never while plugins apply, because the loader does not wait for one row to finish applying before it applies the next.

Neither file reads an environment variable or checks a switch. Most adapters that import one check their concern switch in their register function. `goal-context.mjs` and `spec-gate-classify.mjs` check none, and `git-preflight-advisory.mjs` and `prompt-advisor.mjs` check inside their handlers. The marker has no error path. A missing marker reads as `false`. A rejected load reaches the caller. Every adapter that calls the loader declares `ERROR_POLICY = 'fail-open'` and writes one warning through `ctx.logger.warn`.

---

## 2. DIRECTORY TREE

The folder is flat. Two modules sit beside this README.

| File | Responsibility |
|---|---|
| `dsh-llm.mjs` | The loader. `loadDshLlm(argv1)` and `loadDshTools(argv1)` import one DSH package each and cache the promise per specifier. |
| `session-role.mjs` | The marker. `markLineageLeaf()` sets the process-wide symbol and `isLineageLeaf()` reads it. |

---

## 3. VALIDATION

Run the commands from the repository root.

```bash
node --test .skilled/hooks/shared/tests/dsh-llm.test.mjs
```

Expected result: every test passes and the command exits 0. When `command -v dsh` fails, the case skips instead.

```bash
node --test .dsh/plugins/repo-guards/tests/bundle.test.mjs
```

Expected result: every test passes and the command exits 0. The marker case reads `false` before the lineage plugin applies and `true` after.

---

## 4. RELATED

- [the shared helpers folder](../README.md): the other shared modules beside this folder.
- [the spec kit DSH adapters](../../../skills/system-spec-kit/runtime/hooks/dsh/README.md): the adapters in that skill that import these files.
- [the repo-guards bundle](../../../../.dsh/plugins/repo-guards/README.md): the plugin bundle that registers the consuming adapters.
- [the adapter link table](../../../../.dsh/plugins/repo-guards/adapters/README.md): the event each consuming adapter registers.
- [the lineage patch](../../../../.dsh/patches/lineage.patch.yml): the row that mounts the marker plugin.
