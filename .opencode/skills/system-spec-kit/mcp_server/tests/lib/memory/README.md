---
title: "Memory Helper Tests"
description: "Focused coverage for memory audit rotation and bounded cache helpers."
trigger_phrases:
  - "memory helper tests"
  - "audit rotation tests"
  - "bounded cache tests"
---

# Memory Helper Tests

## 1. OVERVIEW

`tests/lib/memory/` verifies small memory helper modules without starting the MCP server.

## 2. OWNERSHIP

These tests mirror `lib/memory/`.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `audit-rotation.vitest.ts` | Covers JSONL audit rotation behavior. |
| `bounded-cache.vitest.ts` | Covers cache eviction and bounds. |

## 4. BOUNDARIES

- Use temporary audit files.
- Do not touch `mcp_server/data/search-decisions.jsonl`.
- Keep runtime database setup out of these tests.

## 5. ENTRYPOINTS

Run from `mcp_server/`.

## 6. VALIDATION

```bash
npx vitest run tests/lib/memory
```
