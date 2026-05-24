---
title: "Embedder Tests"
description: "Vitest coverage for embedding execution, sidecar behavior and hardening regressions."
trigger_phrases:
  - "embedder tests"
  - "sidecar worker tests"
  - "execution router tests"
---

# Embedder Tests

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)

## 1. OVERVIEW

`tests/embedders/` verifies server-side embedding behavior, especially execution routing and sidecar safety.

## 2. OWNERSHIP

These tests belong to `mcp_server/lib/embedders/`. Shared provider contract tests belong in `shared/` when they do not need MCP runtime wiring.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `execution-router.vitest.ts` | Covers routing between local and sidecar execution. |
| `sidecar-worker.vitest.ts` | Covers worker process behavior. |
| `sidecar-hardening.vitest.ts` | Guards sidecar failure and hardening paths. |
| `deep-review-remediation.vitest.ts` | Regression coverage from prior review findings. |

## 4. BOUNDARIES

- Use temp paths for runtime state.
- Do not rely on committed SQLite files.
- Mock external provider calls unless a test is explicitly a local integration check.

## 5. ENTRYPOINTS

Run the folder with Vitest from `mcp_server/`.

## 6. VALIDATION

```bash
npx vitest run tests/embedders
```
