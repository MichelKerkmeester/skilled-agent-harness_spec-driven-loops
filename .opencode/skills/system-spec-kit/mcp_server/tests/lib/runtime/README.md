---
title: "Runtime Helper Tests"
description: "Focused coverage for shutdown hooks and timer registry behavior."
trigger_phrases:
  - "runtime helper tests"
  - "shutdown hook tests"
  - "timer registry tests"
---

# Runtime Helper Tests

## 1. OVERVIEW

`tests/lib/runtime/` verifies process-lifetime helpers under `lib/runtime/`.

## 2. OWNERSHIP

These tests mirror the runtime helper folder and should stay focused on process cleanup contracts.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `shutdown-hooks.vitest.ts` | Covers shutdown callback registration and drain behavior. |
| `timer-registry.vitest.ts` | Covers tracked timers and cleanup behavior. |

## 4. BOUNDARIES

- Avoid real process exits.
- Clean any timers created during tests.
- Do not start the MCP stdio server from these tests.

## 5. ENTRYPOINTS

Run from `mcp_server/`.

## 6. VALIDATION

```bash
npx vitest run tests/lib/runtime
```
