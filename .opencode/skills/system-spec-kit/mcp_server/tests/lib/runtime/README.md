---
title: "Runtime Helper Tests"
description: "Focused coverage for shutdown hooks and timer registry behavior."
trigger_phrases:
  - "runtime helper tests"
  - "shutdown hook tests"
  - "timer registry tests"
---

# Runtime Helper Tests

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)

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
