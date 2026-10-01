---
title: "Jev transport scripts"
description: "Shared transport that answers jev choice questions through the jev CLI or Pi's classifier runtime."
trigger_phrases:
  - "jev transport"
  - "pi classifier transport"
  - "cli-classifier shared scripts"
---

# Jev transport scripts

---

## 1. OVERVIEW

`shared/scripts/` holds `jev-transport.mjs`, the transport that answers a jev `choice` question through either the `jev` CLI or Pi's native classifier runtime. The CLI is the default and the fallback, and a Pi gate that fails prints exactly one skip line before the CLI runs, so a caller always receives a CLI-shaped outcome and never loses its bytes.

The module holds no credential. It calls into the Pi install that `pi` on `PATH` resolves to, and Pi resolves its own credential from its own store. The two `.cjs` callers require this file, so it ships no top-level await and reaches the Pi SDK with a lazy import inside the Pi branch only.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `jev-transport.mjs` | Defaults to the `jev` CLI and switches to Pi only when the `transport` option or the caller's `JEV_TRANSPORT` value reads `pi`. For a `choice` request it parses `--provider`, `-q`/`--question` and `-o`/`--option`, maps them to Pi's classifier context, and falls back to the CLI on each gate: package, model, credential and backend. |
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
