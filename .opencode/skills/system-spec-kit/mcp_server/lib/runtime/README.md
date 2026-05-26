---
title: "Runtime Safety Helpers"
description: "Shutdown, timer and runtime guard utilities for the mk-spec-memory MCP process."
trigger_phrases:
  - "runtime guard"
  - "shutdown hooks"
  - "timer registry"
---

# Runtime Safety Helpers

## 1. OVERVIEW

`lib/runtime/` owns process-lifetime helpers for mk-spec-memory. These modules keep shutdown paths deterministic and prevent long-lived timers from leaking across tests or daemon sessions.

## 2. OWNERSHIP

The MCP server owns this folder. Shared process primitives that must be reused across skills should move to a shared package only after another package has a real caller.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `memory-runtime-guard.ts` | Guards runtime memory behavior and process assumptions. |
| `shutdown-hooks.ts` | Registers and drains shutdown callbacks. |
| `timer-registry.ts` | Tracks timers so tests and shutdown can clean them. |

## 4. BOUNDARIES

- Do not register MCP tools here.
- Do not perform database migrations here.
- Avoid importing handlers; runtime helpers sit below handlers.

## 5. ENTRYPOINTS

Runtime modules import these helpers directly. Tests cover the shutdown and timer contracts under `tests/lib/runtime/`.

## 6. VALIDATION

Run from `mcp_server/`:

```bash
npx vitest run tests/lib/runtime
npm run typecheck
```
