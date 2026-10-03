---
title: "Jev transport tests"
description: "Node test cases for the shared jev transport, run against a recorded child-process factory and a recorded classifier runtime."
trigger_phrases:
  - "jev transport tests"
  - "pi transport tests"
  - "shared scripts tests"
---

# Jev transport tests

---

## 1. OVERVIEW

`tests/` holds the `node:test` suite for `../jev-transport.mjs`. The cases cover transport selection, the `choice` request and payload mapping, both call paths of `spawnClassifierCall`, and the module's CommonJS reach.

Both backends are stubs: a recorded child-process factory for the `jev` CLI and a recorded classifier runtime for Pi. No case opens a socket, calls a model or needs a key.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `jev-transport.test.mjs` | Tests `resolveTransport`, `choiceRequestFrom`, `classifierContextFor` and `choicePayloadFor`, both `spawnClassifierCall` paths with the package, model, credential and backend fallbacks, the timeout and spawn-error outcomes, the answering model on both routes, Pi's token usage, and the module's CommonJS reach. |

---

## 3. VALIDATION

Run the suite from the repository root:

```bash
node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs
```

Expected result: the runner reports every test passing and exits 0. The suite reaches no real backend and opens no socket.

---

## 4. RELATED

- [`Jev transport scripts`](../README.md)
- [`cli-classifier shared tier`](../../README.md)
