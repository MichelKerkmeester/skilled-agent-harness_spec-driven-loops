---
title: "Jev transport scripts"
description: "Shared transport that answers jev choice and noul questions through the jev CLI or Pi's classifier runtime, preferring Pi when its preflight passes."
trigger_phrases:
  - "jev transport"
  - "pi classifier transport"
  - "cli-classifier shared scripts"
---

# Jev transport scripts

---

## 1. OVERVIEW

`shared/scripts/` holds `jev-transport.mjs`, the transport that answers a jev `choice` or `noul` question through either the `jev` CLI or Pi's native classifier runtime. With no transport named it tries Pi first and the CLI answers wherever Pi cannot, with no skip line. A route that asked for Pi by name prints exactly one skip line before the CLI runs on a failed gate, so either way the caller receives a CLI-shaped outcome and never loses its bytes.

The module holds no credential. It calls into the Pi install that `pi` on `PATH` resolves to, and Pi resolves its own credential from its own store or the caller's environment (for the `official` provider, `TYPESAFE_API_KEY`). The module never reads it. The `.cjs` callers require this file, so it ships no top-level await and reaches the Pi SDK with a lazy import inside the Pi branch only.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `jev-transport.mjs` | Tries Pi by default when the call names no transport and the preflight passes: the pinned Pi 0.99.2 package, the mapped model and a credential Pi can read. `JEV_TRANSPORT=jev` forces the CLI, while `JEV_TRANSPORT=pi` or the per-call `transport: 'pi'` option asks for Pi and prints one skip line when Pi cannot answer. It maps a `choice` or `noul` request to Pi's classifier context, with the state under the `text` key, and falls back to the CLI on each failed gate and on a backend failure. `score` and `run` stay on the CLI. Every outcome names the route that answered, `pi` or `jev`, and the model that answered, and a Pi answer's payload carries its token usage. |
| `tests/` | Holds `jev-transport.test.mjs`, the `node --test` suite for the module. Both backends are stubs, so no test opens a socket, calls a model or needs a key. |

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs
```

Expected result: the runner reports every test passing and exits 0. The suite reaches no real backend and opens no socket.

---

## 4. RELATED

- [`cli-classifier shared tier`](../README.md)
- [`cli-classifier packet`](../../README.md)
