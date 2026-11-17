---
title: "Pi Overlay Guard: tool_call Adapter"
description: "Pi adapter that blocks an edit or write to a file a vendored tree's overlay owns and returns the engine's reason as the block reason."
trigger_phrases:
  - "pi overlay guard"
  - "pi tool call block"
  - "overlay owned file pi"
version: 1.0.0.0
---

# Pi Overlay Guard: tool_call Adapter

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/pi/` holds the Pi adapter for the overlay guard. The adapter registers `tool_call` with `pi.on("tool_call", ...)`. It blocks an edit or write to a file an overlay owns and returns the engine's refusal line as the block reason.

Pi discovers the adapter through `.pi/extensions/overlay-guard.ts`, a single line that re-exports the default export from this folder. That entry names no event. The adapter registers its own handler when Pi calls the default export with the `ExtensionAPI` handle. The hook registry at `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` records the entry as `"extension": "overlay-guard.ts"`.

The handler reads `event.toolName` first. Any name outside `edit` and `write` returns `undefined` at once, before the switch check or the core load. The handler then calls `isHookEnabled("overlay-guard")` from the facade at `.skilled/hooks/shared/hook-flags.mjs`. That facade reaches the shared resolver in `.skilled/hooks/shared/hook-flags.cjs`, so `SYSTEM_HOOKS_DISABLED` turns this adapter off as the master switch. The concern key is `overlay-guard` and its switch is `SYSTEM_OVERLAY_GUARD_DISABLED`.

When the concern is on, the handler imports `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` at call time. The path comes from `fileFieldPath(event.input)`. `evaluateWrite()` receives it with `ctx.cwd` as the session directory. Each note the core returns is written to stderr on its own line. A `deny` decision returns `{ block: true, reason }` with the engine line. Every other outcome returns `undefined`, so the write goes ahead.

A missing path returns `undefined` before the core runs. The core also allows at once when the tree holds neither `.skilled-overlays.json` nor `skilled-overlays/`, so a repository with no overlays starts no engine process. An import error or a core error lands in the catch block and returns `undefined`. The catch is deliberate: a guard bug must never block a write it could not judge.

---

## 2. DIRECTORY TREE

The folder is flat. It holds no test of its own. The suite that drives the adapter sits beside the core at `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`.

| File | Responsibility |
|---|---|
| `overlay-guard.ts` | The adapter. It filters the write tools, checks the concern switch and calls `evaluateWrite()` from `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs`. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes and `fail 0` prints in the summary. The `pi: edit and write map input.path to a block` case imports the `.pi/extensions` entry, records the `tool_call` handler and asserts a block for an owned path under `edit` and `write`. It also asserts `undefined` for an unowned path and for the `bash` tool.

---

## 4. RELATED

- [Overlay guard concern](../README.md): the folder README, with the decision table and the runtime coverage.
- [Shared core](../lib/overlay-guard.cjs): the policy this adapter calls, which asks the overlay engine and answers `allow` or `deny`.
- [Core suite](../lib/overlay-guard.test.cjs): the tests that drive this adapter through the Pi entry file.
- [Hook flags facade](../../shared/hook-flags.mjs): the switch check this adapter imports, which wraps the resolver in `.skilled/hooks/shared/hook-flags.cjs`.
- [Pi entry file](../../../../.pi/extensions/overlay-guard.ts): the one line Pi discovers.
- [Hook registry](../../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json): the record that lists this extension under `pi`.

<!-- readme-check
allow-ref .skilled-overlays.json | the overlay setting file sits at the root of a host repository that vendors Skilled, not in this checkout
-->
