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

`pi/` holds the real Pi extension for the overlay guard. Pi discovers it through the one-line entry file `.pi/extensions/overlay-guard.ts`, which re-exports it. The extension loads from this folder, so its imports are relative to this folder.

It handles the `edit` and `write` tools and reads the path from `event.input.path`. It resolves that path against `ctx.cwd` through the shared core. A deny answer becomes `{block: true, reason}`, with the engine's own reason.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.ts` | The Pi extension. It registers a `tool_call` handler and blocks an owned path. |

The handler runs only for the `edit` and `write` tools. It returns `undefined` at once for any other tool name. It also returns `undefined` when `isHookEnabled('overlay-guard')` reports the concern is off.

Otherwise it dynamic-imports `../lib/overlay-guard.cjs` and calls `evaluateWrite()` with that path. It passes `ctx.cwd` as the session directory, so a relative path resolves there. Each note the core returns goes to stderr, and a `deny` decision returns `{block: true, reason}`. Every other outcome returns `undefined`, so the write goes ahead.

A missing path returns `undefined` before the core runs. An import error or a core error lands in the catch block, which returns `undefined`.

---

## 3. VALIDATION

Run the command below from the repository root, where the path resolves.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes, including the Pi case for `edit` and `write`.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README, with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this extension imports, which judges the path.
- [`../../../../.pi/extensions/overlay-guard.ts`](../../../../.pi/extensions/overlay-guard.ts): the one-line entry file through which Pi discovers this extension.
