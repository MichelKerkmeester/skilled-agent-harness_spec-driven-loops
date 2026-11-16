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

`shared/dsh/` holds two helpers that the DSH adapters import. `dsh-llm.mjs` loads `@deepseek-ai/dsh-llm` and `@deepseek-ai/dsh-tools` from the DSH install that runs the plugin, because this checkout carries no copy of those packages. `session-role.mjs` marks a fan-out leaf on a process-wide symbol so a disposable child can skip stateful work. DSH reaches both through relative links in `.dsh/plugins/repo-guards/adapters/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`dsh-llm.mjs`](./dsh-llm.mjs) | Shared loader | Exports `loadDshLlm()` and `loadDshTools()`. Each tries the bare specifier, then retries anchored at `process.argv[1]` with `createRequire`, and caches the promise per specifier. | A failed load is removed from the cache so a later call retries, and the caller logs and continues. |
| [`session-role.mjs`](./session-role.mjs) | Shared marker | Exports `markLineageLeaf()` and `isLineageLeaf()`. The marker is read at event time because the loader may apply the lineage row and the guards row in either order. | None, the helper is a symbol write and a symbol read. |

---

## 3. RELATED

- [`../README.md`](../README.md): the shared helpers README for the whole hooks tree.
- [`../../../skills/system-spec-kit/runtime/hooks/dsh/README.md`](../../../skills/system-spec-kit/runtime/hooks/dsh/README.md): the adapters that consume these helpers.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that links these files.
