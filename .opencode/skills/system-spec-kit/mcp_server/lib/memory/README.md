---
title: "Memory Runtime Helpers"
description: "Small memory-specific utilities for audit retention and bounded in-process caches."
trigger_phrases:
  - "memory runtime helpers"
  - "audit rotation"
  - "bounded cache"
---

# Memory Runtime Helpers

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)

## 1. OVERVIEW

`lib/memory/` contains focused helpers for memory runtime behavior that is too small or cross-cutting for a handler module.

## 2. OWNERSHIP

This folder is owned by the MCP server runtime. It can support search, save and retention paths, but it should not define public MCP tool contracts.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `audit-rotation.ts` | Rotates append-only memory/search audit files. |
| `bounded-cache.ts` | Provides a bounded in-memory cache primitive. |

## 4. BOUNDARIES

- Keep durable persistence in `lib/storage/` or handler-owned modules.
- Keep generic utilities in `lib/utils/`.
- Do not add generated data files to this folder.

## 5. ENTRYPOINTS

Callers import individual helpers directly. There is no folder-level barrel.

## 6. VALIDATION

Run from `mcp_server/`:

```bash
npx vitest run tests/lib/memory
npm run typecheck
```
