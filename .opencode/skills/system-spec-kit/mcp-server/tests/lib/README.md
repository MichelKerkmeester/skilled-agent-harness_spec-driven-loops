---
title: "Library Helper Tests"
description: "Nested Vitest suites for focused lib helper coverage."
trigger_phrases:
  - "lib helper tests"
  - "tests lib"
  - "runtime helper tests"
---

# Library Helper Tests

## 1. OVERVIEW

`tests/lib/` groups focused tests for helper modules under `mcp-server/lib/`.

## 2. OWNERSHIP

Each child folder mirrors the production folder it tests. Keep tests close to the helper boundary rather than folding them into broad handler suites.

## 3. KEY FILES

| Path | Responsibility |
|---|---|
| `memory/` | Tests memory helper behavior. |
| `runtime/` | Tests shutdown and timer helpers. |

## 4. BOUNDARIES

- Use isolated temp state.
- Do not import test helpers from production source.
- Prefer focused assertions over end-to-end MCP startup.

## 5. ENTRYPOINTS

Run child folders directly when changing one helper area.

## 6. VALIDATION

```bash
npx vitest run tests/lib
```
