---
title: "Pi Post-Edit Quality: tool_result Adapter"
description: "Pi extension that runs the shared checker router after an edit or write and appends findings and the staleness banner to the tool result."
trigger_phrases:
  - "pi post edit quality"
  - "pi tool result findings"
  - "pi comment hygiene"
version: 1.0.0.0
---

# Pi Post-Edit Quality: tool_result Adapter

---

## 1. OVERVIEW

`.skilled/hooks/post-edit-quality/pi/` holds the Pi adapter for the post-edit quality concern. It runs at `tool_result` and appends checker findings and the staleness banner to an `edit` or `write` result. The result carries that text as one more part in its content.

Pi has no JSON hook registration. It scans `.pi/extensions/` for one-line re-export entries. The entry for this adapter is `.pi/extensions/post-edit-quality.ts`. That file holds a single re-export statement that points back into this folder, with no event name of its own. The event is registered in the adapter, which calls `pi.on('tool_result', ...)` when Pi loads it.

The handler reads `event.toolName` first and returns at once unless the value is `edit` or `write`. It then reads `event.input.path` and returns unless that is a non-empty string. It resolves the path against `ctx.cwd` and returns when the file is not on disk.

On a match it imports `../lib/post-edit-router.cjs`. `resolveDispatch()` picks the checker entries. `runChecks()` runs them under `CLAUDE_HOOK_BUDGET_MS`. That call caps each checker at `CLAUDE_CHECKER_TIMEOUT_MS` and stops once less than `CLAUDE_MIN_CHECKER_MS` is left. `runDistStalenessCheck()` runs afterward with the same checker timeout.

Each finding is written as its `[label]` line and the checker output. Findings are separated by a blank line. The banner follows them. The handler appends the joined text as one text part and returns the new content. A clean edit adds nothing.

The adapter checks `isHookEnabled('post-edit-quality')` before it registers the handler, so the concern switch `SK_CODE_POST_EDIT_QUALITY_DISABLED` keeps the handler from registering. `SYSTEM_HOOKS_DISABLED` is the master switch. `../../shared/hook-flags.mjs` passes the call to the shared `hook-flags.cjs` resolver, which reads both.

Every failure ends the same way. A missing path, a missing file, an import error or a core throw returns `undefined` and adds nothing to the tool result. A missing checker is the one exception: it appends a `quality-notice` that names the missing path.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `post-edit-quality.ts` | The Pi `tool_result` adapter. It filters each result on the tool name and the edited path, then calls the shared router and appends what comes back. |

The folder is flat. `post-edit-quality.ts` is the only entry beside this README. Pi reaches it through the entry file named in OVERVIEW.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
(cd .skilled/skills/system-spec-kit && npx vitest run --project root runtime/tests/hook-adapter-path-parity.vitest.ts)
```

Expected result: the parity suite passes and exits 0. It scans `.pi/extensions/` for one-line re-export entries, resolves each target and asserts that the target file exists on disk, so a missing or renamed adapter fails here.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README, with the runtime coverage table.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this adapter imports.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the switch facade over the resolver the adapter calls.
- [`../../../../.pi/extensions/post-edit-quality.ts`](../../../../.pi/extensions/post-edit-quality.ts): the one-line entry file Pi discovers.
