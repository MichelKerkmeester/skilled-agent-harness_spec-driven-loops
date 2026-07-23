---
title: "Embedder Test Fixtures"
description: "Real-subprocess test harnesses for the embedder vitest suite in tests/embedders."
---

# Embedder Test Fixtures

---

## 1. OVERVIEW

`tests/embedders/__fixtures__/` holds subprocess harnesses used by `../` vitest specs that need a genuine OS process, not an in-process mock. The harness reuses the production embedder module's own exported functions and swaps in a fake, delay-controllable model loader so the test stays deterministic and network-independent.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `hf-model-server-shutdown-harness.cjs` | Spawned as a real child process by `hf-model-server-shutdown.vitest.ts`. Calls the production `createHfModelServer()` and `installShutdownHandlers()` from `bin/hf-model-server.cjs` with a fake `loadModel` (env-controlled load/embed delay via `TEST_HF_FAKE_LOAD_DELAY_MS` / `TEST_HF_FAKE_EMBED_DELAY_MS`), so the busy-shutdown regression test can send a real OS signal and observe real process exit behavior. |

## 3. CONSUMERS

- `../hf-model-server-shutdown.vitest.ts`

## 4. RELATED

- [`../README.md`](../README.md)
