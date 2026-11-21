---
title: "runtime test support: skip fsync"
description: "Suite-wide Vitest setup that skips the flush to disk in every test worker and in the node children tests spawn."
trigger_phrases:
  - "skip fsync test setup"
  - "runtime test setup file"
  - "vitest setupFiles skip-fsync"
---

# Test Support: Skip Fsync

---

## 1. OVERVIEW

`_support/` holds the suite-wide test setup for the runtime. It makes every test run skip the flush to disk. Durable writes were most of the suite's run time, and no test can observe durability without a power loss. Writes and renames still happen.

The setup reaches two places. The Vitest worker loads the patch directly. Every `node` child a test spawns inherits it through `NODE_OPTIONS`, not through any import.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `skip-fsync.ts` | The Vitest setup file. It loads the preload into the current worker with `createRequire(import.meta.url)(preload)`, then appends `--require "<absolute path to skip-fsync-preload.cjs>"` to `NODE_OPTIONS`. It skips the append when the flag is already there. |
| `skip-fsync-preload.cjs` | Replaces `fs.fsyncSync` and `fs.fdatasyncSync` with no-ops, then calls `syncBuiltinESMExports()` so ESM `node:fs` imports see the patch. CommonJS with `'use strict'`. |

---

## 3. HOW IT LOADS

[`../../vitest.config.ts`](../../vitest.config.ts) names `skip-fsync.ts` in the `setupFiles` entry of its `shared` block. Both the `parallel` and `serial` projects spread that block, so every test file gets the setup.

`../../package.json` does not reference this folder. Its `test` script (`vitest run --no-coverage`) picks the setup up only through `vitest.config.ts`.

```text
vitest.config.ts  shared.setupFiles
        │
        ▼
skip-fsync.ts ───▶ require(skip-fsync-preload.cjs)     patches this worker
        │
        ▼
NODE_OPTIONS += --require "<path>/skip-fsync-preload.cjs"
        │
        ▼
node child processes spawned by a test                patched on startup
```

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Patched calls | Only `fs.fsyncSync` and `fs.fdatasyncSync`. Async `fs.fsync`, `fs.fdatasync` and `FileHandle.sync()` still flush. |
| Child processes | Any `node` process that inherits a test's environment gets the patch, tools included. A child started with an environment that drops `NODE_OPTIONS` runs with real fsync. |
| Real fsync | Remove the `setupFiles` entry from `vitest.config.ts` to run the suite against real fsync. |

---

## 5. VALIDATION

Run the complete runtime test configuration from the repository root.

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts
```

Expected result: Vitest reports every test file passed, and its `Duration` line includes a `setup` time for this folder's setup file.

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime overview](../../README.md)
