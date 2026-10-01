---
title: "cli-deem scripts tests"
description: "Fake-server tests for the cli-deem client: health gates, judgment round trips, request caps and exit codes."
trigger_phrases:
  - "cli-deem script tests"
  - "cli-deem fake-server tests"
  - "deem client tests"
---

# cli-deem scripts tests

---

## 1. OVERVIEW

`tests/` holds the `node:test` suite for the `cli-deem` client. Each test spawns `../cli-deem.mjs` against an in-process fake HTTP server on an ephemeral loopback port, records every request and asserts the printed answer, the error text and the exit code. The fake server keeps the suite away from the Deem server on port 8300.

The 34 cases cover the `health` gates, the `noul`, `choice`, `score` and `run` round trips, the option and question caps, the loopback URL rule, both timeout budgets and the unreachable-server path.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `cli-deem.test.mjs` | Spawns the client against a fake server and checks the health gates, the judgment round trips, the caps and the exit codes. |

---

## 3. VALIDATION

Run the suite from the repository root:

```bash
node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/
```

Expected result: all 34 tests pass and the process exits 0.

---

## 4. RELATED

- [`cli-deem`](../../README.md)
- [`cli-classifier`](../../../README.md)
