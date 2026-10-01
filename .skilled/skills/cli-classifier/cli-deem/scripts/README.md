---
title: "cli-deem scripts"
description: "Local Deem client entrypoint and the Node tests that exercise it against an in-process fake server."
trigger_phrases:
  - "cli-deem scripts"
  - "deem client entrypoint"
  - "deem client tests"
---

# cli-deem scripts

---

## 1. OVERVIEW

`scripts/` holds the `cli-deem` packet's executable entrypoint and the tests that exercise it. `cli-deem.mjs` checks the local Deem server with `health`, then answers `noul`, `choice`, `score` and `run` questions in the field names a `jev` reader already parses. `health` prints the backend, the model id and the commit pair, and refuses a stub backend or a model other than the pin. The client accepts only a loopback URL and never starts or stops the server.

The tests spawn the client against an in-process fake server, so they never reach port 8300.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `cli-deem.mjs` | The client. Run it as `node cli-deem.mjs <subcommand>`. It accepts `health`, `noul`, `choice`, `score` and `run`, and parses `-q`/`--question`, `-s`/`--state`, `-o`/`--option`, `-l`/`--level`, `--value` and `--hook`. |
| `tests/` | The Node test suite for the client. The single `cli-deem.test.mjs` file spawns the client against an in-process fake server and runs with `node --test`. |

---

## 3. DIRECTORY TREE

```text
scripts/
+-- cli-deem.mjs    # Local Deem client entrypoint
`-- tests/          # Node test suite for the client
```

---

## 4. VALIDATION

Run the client test suite from the repository root:

```bash
node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/
```

Expected result: every test passes with exit 0. The suite uses an in-process fake server and never reaches port 8300.

---

## 5. RELATED

- [`cli-deem`](../README.md)
- [`cli-deem scripts tests`](./tests/README.md)
