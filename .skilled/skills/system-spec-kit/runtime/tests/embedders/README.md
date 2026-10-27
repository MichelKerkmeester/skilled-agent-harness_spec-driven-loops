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

---

## 2. OWNERSHIP

These tests belong to `runtime/lib/embedders/`. Shared provider contract tests belong in `shared/` when they do not need runtime-package wiring.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `hf-local-client.vitest.ts` | Covers the hf-local HTTP client contract. |
| `hf-local-model-identity.vitest.ts` | Covers the model identity the hf-local provider reports. |
| `hf-model-server.vitest.ts` | Covers local model-server lifecycle and health behavior. |
| `hf-model-server-perimeter.vitest.ts` | Covers the loopback bind guard on the model server. |
| `hf-model-server-shutdown.vitest.ts` | Covers the shutdown failsafe on a live model-server process. |
| `model-server-perimeter.vitest.ts` | Covers the model-server socket perimeter. |
| `launcher-model-server-idle-eviction.vitest.ts` | Covers idle eviction of a launcher-supervised model server. |
| `launcher-model-server-live-two-launcher.vitest.ts` | Covers two launchers sharing one live model-server process. |
| `launcher-model-server-single-writer-cluster.vitest.ts` | Covers single-writer supervision with no orphaned server. |

---

## 4. BOUNDARIES

- Use temp paths for runtime state.
- Do not rely on committed SQLite files.
- Mock external provider calls unless a test is explicitly a local integration check.

---

## 5. ENTRYPOINTS

Run the folder with Vitest from `runtime/`.

---

## 6. VALIDATION

```bash
npx vitest run tests/embedders
```
