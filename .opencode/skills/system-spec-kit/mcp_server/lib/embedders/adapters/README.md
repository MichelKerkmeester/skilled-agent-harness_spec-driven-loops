---
title: "Embedder Adapter Compatibility"
description: "Server-local compatibility shims for canonical shared embedder adapters."
trigger_phrases:
  - "embedder adapters"
  - "ollama adapter"
  - "adapter compatibility"
---

# Embedder Adapter Compatibility

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)

## 1. OVERVIEW

`lib/embedders/adapters/` keeps server-local adapter import paths stable while canonical adapter code lives in `@spec-kit/shared`.

## 2. OWNERSHIP

This folder owns compatibility only. New adapter implementations belong under `shared/embeddings/adapters/`.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `ollama.ts` | Re-exports the canonical shared Ollama adapter. |

## 4. BOUNDARIES

- Keep files thin and dependency-free.
- Do not add provider logic or network behavior here.
- Keep imports pointed at `@spec-kit/shared/embeddings/adapters/*`.

## 5. ENTRYPOINTS

Existing server imports may continue to reference this folder. New shared consumers should import from `@spec-kit/shared` directly.

## 6. VALIDATION

Run from `mcp_server/`:

```bash
npm run typecheck
```
