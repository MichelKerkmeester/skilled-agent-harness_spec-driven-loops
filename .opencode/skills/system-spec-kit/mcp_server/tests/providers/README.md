---
title: "Provider Tests"
description: "Focused provider-adjacent runtime tests for retry and retention behavior."
trigger_phrases:
  - "provider tests"
  - "retry retention"
  - "provider runtime"
---

# Provider Tests

## 1. OVERVIEW

`tests/providers/` covers provider-adjacent runtime behavior that does not belong to the shared provider registry.

## 2. OWNERSHIP

The MCP server owns these tests when the behavior depends on server runtime policy. Shared provider behavior belongs under `shared/`.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `retry-retention.vitest.ts` | Guards retry retention behavior. |

## 4. BOUNDARIES

- Mock external network calls.
- Do not require API keys.
- Keep shared provider manifest tests out of this folder.

## 5. ENTRYPOINTS

Run from `mcp_server/`.

## 6. VALIDATION

```bash
npx vitest run tests/providers
```
