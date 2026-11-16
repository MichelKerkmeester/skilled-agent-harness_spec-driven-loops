---
title: "Shared DSH Helpers: Package Loader and Leaf Role"
description: "Two small helpers the DSH adapters share, one that loads the DSH message and tool packages from the running install and one that marks a fan-out leaf."
trigger_phrases:
  - "dsh shared helpers"
  - "dsh package loader"
  - "dsh lineage leaf"
version: 1.0.0.0
---

# Shared DSH Helpers: Package Loader and Leaf Role

---

## 1. OVERVIEW

This folder holds two helpers that the DSH adapters import by relative path. `dsh-llm.mjs` loads `@deepseek-ai/dsh-llm` and `@deepseek-ai/dsh-tools` from the DSH install that runs the plugin. This checkout carries no copy of those two packages, so a bare import fails.

`session-role.mjs` marks a fan-out leaf on a process-wide symbol that every plugin file can read. A leaf is a headless child composed with the lineage patch, so it skips stateful work. DSH reaches both helpers through relative links in `.dsh/plugins/repo-guards/adapters/`, one link for each helper.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-llm.mjs` | Loads the DSH message and tool packages from the running install. |
| `session-role.mjs` | Marks and reads the fan-out leaf flag. |

**The loader.** `loadDshLlm()` returns the `@deepseek-ai/dsh-llm` namespace and `loadDshTools()` returns `@deepseek-ai/dsh-tools`, which holds `defineTool`. Each call tries the bare specifier first, then retries through `createRequire` anchored at `process.argv[1]`. The promise is cached per specifier, so a later call reuses the first result.

A failed load is removed from the cache, so a later call retries. Every adapter that calls the loader declares `ERROR_POLICY = 'fail-open'` and logs the error through `ctx.logger.warn`.

**The marker.** `markLineageLeaf()` sets a `Symbol.for` key on `globalThis` to `true`. `isLineageLeaf()` reads that key back and answers `false` when nothing set it. Read the marker when an event fires, never while plugins apply. The loader does not wait for one row to finish applying before it applies the next.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/shared/tests/dsh-llm.test.mjs
```

The suite skips when `command -v dsh` fails. Otherwise it asserts that `loadDshLlm()` exposes `createUserMessage` and that `loadDshTools()` exposes `defineTool`. It also asserts that a bad anchor rejects and leaves the cache clean.

---

## 4. RELATED

- [`../README.md`](../README.md): the shared helpers README one level up.
- [`../../../skills/system-spec-kit/runtime/hooks/dsh/README.md`](../../../skills/system-spec-kit/runtime/hooks/dsh/README.md): the adapters that consume these helpers.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that links these files.
