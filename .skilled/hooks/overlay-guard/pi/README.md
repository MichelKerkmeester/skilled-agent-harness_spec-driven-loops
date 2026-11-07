---
title: "Overlay Guard: Pi tool_call Extension"
description: "Pi extension that blocks an edit or write to a file a vendored tree's overlay owns and returns the engine's reason as the block reason."
trigger_phrases:
  - "pi overlay guard"
  - "pi tool call block"
  - "overlay owned file pi"
version: 1.0.0.0
---

# Overlay Guard: Pi tool_call Extension

---

## 1. OVERVIEW

`pi/` holds the real Pi extension for the overlay guard. Pi discovers it through the relative symlink `.pi/extensions/overlay-guard.ts`, and the imports are written for that link base. The extension handles the `edit` and `write` tools, resolves `event.input.path` against `ctx.cwd`, and returns `{block: true, reason}` when the overlay engine says the path is owned.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.ts`](./overlay-guard.ts) | `tool_call` | Filters on `edit` and `write`, checks `isHookEnabled('overlay-guard')`, dynamic-imports the core and calls `evaluateWrite()`. A deny result becomes `{block: true, reason}`. | Fails open. A missing path, an import error or a core error returns `undefined`, so the write proceeds. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this extension imports.
- [`../../../../.pi/extensions/overlay-guard.ts`](../../../../.pi/extensions/overlay-guard.ts): the link Pi discovers.
