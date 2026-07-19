---
title: "Embedder Tests"
description: "Vitest coverage for embedding execution routing, local model-server behavior, and hardening regressions."
trigger_phrases:
  - "embedder tests"
  - "execution router tests"
---

# Embedder Tests

## 1. OVERVIEW

`tests/embedders/` verifies server-side embedding behavior, especially execution routing, local model-server behavior, and provider hardening.

## 2. OWNERSHIP

These tests belong to `mcp-server/lib/embedders/`. Shared provider contract tests belong in `shared/` when they do not need MCP runtime wiring.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `execution-router.vitest.ts` | Covers direct routing across local, Ollama, and cloud providers. |
| `hf-local-client.vitest.ts` | Covers the hf-local HTTP client contract. |
| `hf-model-server.vitest.ts` | Covers local model-server lifecycle and health behavior. |
| `launcher-model-server.vitest.ts` | Covers launcher-supervised model-server behavior. |
| `deep-review-remediation.vitest.ts` | Regression coverage from prior review findings. |

## 4. BOUNDARIES

- Use temp paths for runtime state.
- Do not rely on committed SQLite files.
- Mock external provider calls unless a test is explicitly a local integration check.

## 5. ENTRYPOINTS

Run the folder with Vitest from `mcp-server/`.

## 6. VALIDATION

```bash
npx vitest run tests/embedders
```
