---
id: "DEE-007"
title: "DEE-007 -- Score returns the expected level"
description: "This scenario validates that score prints the expected level and keeps the index-keyed probabilities and the legend, for `DEE-007`."
version: 0.1.0.0
---

# DEE-007 -- Score returns the expected level

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-007`.

---

## 1. OVERVIEW

`cli-deem score` sends the levels lowest first and Deem answers with `score`, the expected level — a float from `0` to the last level index — plus a `legend` naming each index and `probabilities` keyed by index. The client range-checks `score` and passes the answer through.

### Why This Matters

A caller that thresholds on the score needs the number Deem computed, and a caller that reads probabilities needs them keyed by the level index it submitted, not by presentation text. This scenario proves the range check and the pass-through of `score`, `legend` and `probabilities` against a stub whose answer is known.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `score` prints the expected level in `score` and keeps `probabilities` keyed by level index.
- Real user request: `Ask Deem how severe this incident is.`
- Prompt: `Ask Deem how severe this incident is.`
- Expected execution process: the stub harness in §3 starts a server that answers with a known score body — a fractional `score`, a `legend` and index-keyed `probabilities` — runs `cli-deem score -q ... -s ... -l ... -l ... -l ...` against it, forwards the client's streams and exits with the client's status. Capture stdout and stderr separately.
- Expected signals: stdout is one JSON line with `"score":1.15`, a `legend` naming the three levels and `"probabilities":{"0":0.05,"1":0.75,"2":0.2}`, the exit status is `0`, and stderr is empty.
- Evidence: the command, the stub body, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads a `score` float inside the level range, probabilities keyed `"0"`, `"1"` and `"2"` and a `legend` naming each level.
- Pass/fail: PASS when `score` is a number from `0` to the last level index, `probabilities` stay keyed by index, `legend` names each level, the exit status is 0 and stderr is empty. FAIL when `score` is absent, not a number or out of range, a probability arrives keyed by text, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const http = require("node:http");
const { spawn } = require("node:child_process");
const body = JSON.stringify({ model: "deem-0.8-v1", answers: { answer: { type: "score", score: 1.15, legend: { "0": "no user impact", "1": "degraded", "2": "outage" }, probabilities: { "0": 0.05, "1": 0.75, "2": 0.2 }, confidence: 0.7, x_temperature: 0 } } });
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(body);
});
server.listen(0, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + server.address().port;
  const child = spawn(process.execPath, [".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs", "score", "-q", "How severe is this incident?", "-s", "Checkout is failing for every user.", "-l", "no user impact", "-l", "degraded", "-l", "outage"], {
    env: { ...process.env, CLI_DEEM_URL: url },
    stdio: ["ignore", "inherit", "inherit"],
  });
  child.on("exit", (code) => {
    server.close();
    process.exit(code ?? 1);
  });
});
'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEE-007 | Score returns the expected level | Confirm `score` prints the expected level in `score` and keeps `probabilities` keyed by level index | `Ask Deem how severe this incident is.` | 1. `bash: node -e '<inline stub harness>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs score -q ... -s ... -l ... -l ... -l ...` | stdout one JSON line with `"score":1.15`, a `legend` naming the three levels and `"probabilities":{"0":0.05,"1":0.75,"2":0.2}`, exit `0`, stderr empty | The command, the stub body, complete stdout, complete stderr and the exit status | PASS when `score` is a number from `0` to the last level index, `probabilities` stay keyed by index, `legend` names each level, the exit status is 0 and stderr is empty. FAIL when `score` is absent, not a number or out of range, a probability arrives keyed by text, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker | 1. Exit 1 `score is not a number in range` means the stub's `score` is missing, not a number or outside the level range, so restore the body named above. 2. A missing `legend` or `probabilities` means the stub body changed, so compare it with the body named above. 3. Exit 3 means the envelope's model was not the pin, so check the stub's `model` field |

### Recorded Result

Observed while authoring: exit 0, stderr empty, and stdout was `{"model":"deem-0.8-v1","answers":{"answer":{"type":"score","score":1.15,"legend":{"0":"no user impact","1":"degraded","2":"outage"},"probabilities":{"0":0.05,"1":0.75,"2":0.2},"confidence":0.7,"x_temperature":0}}}`. Verdict PASS.

### Failure Triage

1. Exit 1 with `score is not a number in range` means the stub's `score` is missing, not a number or outside the level range. Restore the body named above.
2. A missing `legend` or `probabilities` means the stub body changed. Compare it with the body named above.
3. Exit 3 means the envelope's `model` was not the pin. Check the stub's `model` field against `deem-0.8-v1`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [score-level.md](../../feature-catalog/judgment-subcommands/score-level.md) | Feature-catalog source describing the score subcommand |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | The levels request and the `score` range check |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server case `score validates and passes through the real answer shape` |
| [wire-contract.md](../../references/wire-contract.md) | The answer field list and what passes through unchanged |

---

## 5. SOURCE METADATA

- Group: Judgment Subcommands
- Playbook ID: DEE-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `judgment-subcommands/score-returns-zero-based-position.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
