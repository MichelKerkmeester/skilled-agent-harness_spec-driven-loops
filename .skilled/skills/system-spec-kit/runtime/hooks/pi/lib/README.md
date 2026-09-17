---
title: "Pi Hooks Lib: Claude Adapter Proxy"
description: "Pi-specific spawnSync proxy into the compiled Claude lifecycle-hook dist files, shared by the Pi session bridges in the parent folder."
trigger_phrases:
  - "pi claude hook adapter"
  - "pi lifecycle proxy"
---

# Pi Hooks Lib: Claude Adapter Proxy

---

## 1. OVERVIEW

`hooks/pi/lib/` holds `claude-hook-adapter.ts`, the one shared utility the Pi session-lifecycle bridges in `../` (the parent `hooks/pi/` folder) use to reach the compiled Claude lifecycle-hook `dist/` files. It is a per-runtime proxy, the same role `hooks/devin/shared.ts` and `hooks/cursor/shared.ts` play for their own runtimes: `session-prime.js`, `user-prompt-submit.js` and `session-stop.js` stay the single owner of startup/prompt/stop state and transcript semantics, so Pi never re-derives that logic.

Current state:

- One file, two exported functions, no local state and no runtime-neutral policy of its own.
- Discovered by Pi only through the `.pi/extensions/lib/claude-hook-adapter.ts` symlink; Pi resolves the importing files' relative specifiers against that symlink base, not this folder's real path.
- Consumed by two callers today: `../session-start-context.ts` and `../session-stop-context.ts`.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    PI SESSION-LIFECYCLE BRIDGES                  │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────────┐      ┌───────────────────────────┐      ┌──────────────────────────┐
│ ../session-start-       │ ───▶ │ claude-hook-adapter.ts    │ ───▶ │ runtime/dist/hooks/claude │
│ context.ts              │      │ runClaudeHookAdapter()    │      │ session-prime.js          │
└────────────────────────┘      │ extractAdditionalContext()│      └──────────────────────────┘
┌────────────────────────┐      │ (spawnSync proxy)         │      ┌──────────────────────────┐
│ ../session-stop-        │ ───▶ │                           │ ───▶ │ runtime/dist/hooks/claude │
│ context.ts              │      └───────────────────────────┘      │ session-stop.js           │
└────────────────────────┘

Dependency direction: Pi session bridge ───▶ claude-hook-adapter.ts ───▶ compiled Claude dist file
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `claude-hook-adapter.ts` | Spawns a compiled Claude lifecycle-hook `dist` file with a synthesized JSON payload on stdin, and extracts `hookSpecificOutput.additionalContext` from a Claude hook's raw stdout. The only file in this folder. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node builtins only (`node:child_process`, `node:path`); no import of sibling `hooks/pi/*.ts` files, to keep this a one-directional proxy. |
| Exports | `runClaudeHookAdapter()` and `extractAdditionalContext()`, both named exports. |
| Ownership | Owns payload synthesis and stdout parsing for the Claude dist proxy only. Session-lifecycle policy (what to prime, when to stop) stays owned by the compiled Claude hook it spawns. |
| Failure mode | Every failure path (spawn error, non-zero exit, JSON parse failure) returns `null`; callers must already treat `null` as fail-open, this file never throws. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Pi session bridge (start or stop)        │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ runClaudeHookAdapter(projectDir,          │
│   filename, payload, timeoutMs)           │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ spawnSync compiled dist/hooks/claude/*.js │
│ with JSON payload on stdin                │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Raw stdout, or null on any failure        │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Caller reads raw text directly (session-  │
│ prime) or via extractAdditionalContext()  │
│ for the JSON-wrapped shape                │
╰──────────────────────────────────────────╯
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `runClaudeHookAdapter` | Function | Spawns `session-prime.js` or `session-stop.js` from `runtime/dist/hooks/claude/` with a synthesized payload; returns raw stdout or `null`. |
| `extractAdditionalContext` | Function | Parses a Claude hook's `hookSpecificOutput.additionalContext` field out of raw JSON stdout; returns `null` on any shape mismatch or parse error. |

---

## 6. VALIDATION

Run from the `runtime/` package root.

```bash
npx tsc --noEmit --composite false -p tsconfig.json
```

Expected result: exit 0, no type errors.

There is no dedicated unit test for this file. Its two callers (`../session-start-context.ts`, `../session-stop-context.ts`) exercise it indirectly; the cross-runtime `directive-lifecycle-adapter-parity.vitest.ts` suite covers the claude/codex/cursor/devin proxy shape but does not include a Pi case.

---

## 7. RELATED

- [`../README.md`](../README.md): the Pi session-lifecycle bridges that consume this file.
- [`../../../../../../../.pi/extensions/README.md`](../../../../../../../.pi/extensions/README.md): the discovery mirror and symlink map this file resolves imports against.
