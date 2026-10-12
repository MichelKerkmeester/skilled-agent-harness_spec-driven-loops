---
title: "CC-005 -- The Pi transport scorer runs with zero model calls"
description: "This scenario validates that the offline Pi transport scorer prints its transport census with zero model calls and that its live arms stay dormant behind their usage gates, for `CC-005`."
version: 0.3.0.0
---

# CC-005 -- The Pi transport scorer runs with zero model calls

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-005`.

---

## 1. OVERVIEW

This scenario validates that `score-pi-transport.mjs` prints its transport census without calling a classifier model, and that a live arm without `--out` refuses before any stdout line. A stub `jev` first on `PATH` logs every census probe and the scorer's own test file injects a fake classifier runtime, so no real backend and no real model call is reached.

### Why This Matters

The paired run uses the same Jev provider host for both arms. With the default `JEV_PROVIDER=official`, the CLI uses the official provider and Pi uses `typesafe/jev-latest`; `openrouter` maps to Pi `openrouter/typesafe/jev-1.13`. `vercel` and `custom` have no Pi mapping, so the paired run refuses them. The `--pi` and `--cli` arms can spend money. The default census must call no model, and an armed switch without `--out` must refuse before it prints a line.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the default run prints the transport census with no model call and no `calls.jsonl` or `report.json`, and that `--pi` without `--out` exits 2 before any stdout line.
- Real user request: `Run the Pi transport scorer with a fake jev on my PATH and show me its census runs without a model call`
- Prompt: `Run the Pi transport scorer with a fake jev on my PATH and show me its census runs without a model call`
- Expected execution process: Build a stub `jev` in a temp folder, run the scorer once with no switch and once with `--pi` without `--out`, then run the scorer's test file, whose cases inject a fake classifier runtime and a stub `jev`.
- Expected signals: The default run exits 0 with the census lines in order and `jev identity: provider=official auth=ok`, the stub log holds only the `--version` and `auth status --provider official` probes with no `choice` call, and no `--out` folder exists. The refused run exits 2 with an empty stdout and one `[score-pi-transport] --pi needs --out <dir> so every call is recorded` line on stderr. The test run reports every case passing with `fail 0` and no network call.
- Desired user-visible outcome: A verdict that the scorer stayed on its zero-call census and the live arm never started.
- Pass/fail: PASS if the default run exits 0 with the census lines, the stub log holds only the two census probes, `--pi` without `--out` exits 2 with an empty stdout, and the test run passes with `fail 0`. FAIL if the default run calls `jev choice`, calls a classifier model or writes a run file, if the refused invocation prints a stdout line or exits with another code, or if a test fails or reaches a network. SKIP only when Node.js is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: STUB="$(mktemp -d)"`
2. `bash: printf '%s\n' '#!/bin/sh' 'echo "$*" >> "$(dirname "$0")/calls.log"' '[ "$1" = --version ] && { echo "jev 0.6.2"; exit 0; }' '[ "$1" = auth ] && exit 0' 'exit 3' > "$STUB/jev" && chmod +x "$STUB/jev"`
3. `bash: PATH="$STUB:$PATH" node .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs > "$STUB/census.txt"; echo "exit=$?"`
4. `bash: cat "$STUB/calls.log"`
5. `bash: node .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs --pi > "$STUB/refused.txt" 2> "$STUB/refused.err"; echo "exit=$?"; test -s "$STUB/refused.txt" && echo "stdout not empty" || echo "stdout empty"; cat "$STUB/refused.err"`
6. `bash: node --test .skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-005 | The Pi transport scorer runs with zero model calls | Confirm the default run prints the census with no model call and no run file, and that `--pi` without `--out` refuses before any stdout line | `Run the Pi transport scorer with a fake jev on my PATH and show me its census runs without a model call` | Steps 1 to 6 above, in order, from the repository root | Step 3: `exit=0` and the census lines, including `jev: path=<stub>/jev version=0.6.2 provider=official`, `jev identity: provider=official auth=ok`, `baseline: path=specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl rows=111 choice=333 rows_with_3_full_maps=111` and `replay: rows=111 calls=333 key_source=recorded`. Step 4: exactly the two census probes, `--version` and `auth status --provider official`, and no `choice` line. Step 5: `exit=2`, `stdout empty` and one `[score-pi-transport] --pi needs --out <dir> so every call is recorded` stderr line. Step 6: every case passes with `fail 0` and no network call | `$STUB/census.txt`, `$STUB/calls.log`, the two refused-run files, each exit line and the test run summary | PASS if the default run exits 0 with the census lines, the stub log holds only the two census probes, `--pi` without `--out` exits 2 with an empty stdout, and the test run passes with `fail 0`. FAIL if the default run calls `jev choice`, calls a classifier model or writes a run file, if the refused invocation prints a stdout line or exits with another code, or if a test fails or reaches a network. SKIP only when Node.js is unavailable, recorded as the blocker | 1. A `choice` line in the stub log means an arm started without its switch: check the armed branch in `main`. 2. A stdout line from the refused run means usage was checked after the census: check the `parseArgs` block in `main`. 3. A failing test means the injected runtime path changed: fix the scorer or its test rather than this scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [pi-transport-comparison.md](../../feature-catalog/measurements/pi-transport-comparison.md) | Feature-catalog source describing the scorer's contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [score-pi-transport.mjs](../../benchmark/pi-transport/score-pi-transport.mjs) | The scorer, its census and its usage gates |
| [score-pi-transport.test.mjs](../../benchmark/pi-transport/tests/score-pi-transport.test.mjs) | The automated cases on stub binaries and an injected runtime |

---

## 5. SOURCE METADATA

- Group: Measurements
- Playbook ID: CC-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `measurements/pi-transport-comparison.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
