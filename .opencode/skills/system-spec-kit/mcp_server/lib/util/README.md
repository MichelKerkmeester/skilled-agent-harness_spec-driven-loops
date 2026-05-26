---
title: "Small Utility Helpers"
description: "Narrow utility helpers that are not part of the broader shared utils surface."
trigger_phrases:
  - "lib util"
  - "environment utility"
  - "small helpers"
---

# Small Utility Helpers

## 1. OVERVIEW

`lib/util/` holds narrow utilities that do not fit the older `lib/utils/` module map.

## 2. OWNERSHIP

The MCP server owns these helpers. Promote a helper to `shared/utils/` only when another package needs the same contract.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `env.ts` | Reads and normalizes small environment-driven values. |

## 4. BOUNDARIES

- Keep this folder small.
- Do not add database, network or MCP registration logic here.
- Prefer explicit imports over a catch-all utility barrel.

## 5. ENTRYPOINTS

Callers import `env.ts` directly.

## 6. VALIDATION

Run from `mcp_server/`:

```bash
npm run typecheck
```
