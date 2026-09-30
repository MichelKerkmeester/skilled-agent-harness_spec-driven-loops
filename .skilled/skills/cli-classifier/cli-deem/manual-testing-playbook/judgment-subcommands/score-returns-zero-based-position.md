---
id: "DEE-007"
title: "DEE-007 -- Score returns a zero-based position"
description: "This scenario validates that score prints the zero-based position of the chosen level and rekeys the probabilities by position, for `DEE-007`."
version: 0.1.0.0
---

# DEE-007 -- Score returns a zero-based position

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-007`.

---

## 1. OVERVIEW

`cli-deem score` sends the levels lowest first and Deem answers with `level`, the label text. The client replaces that field with `score`, the zero-based position of the label in the submitted list, and rekeys the probabilities by position.

### Why This Matters

A caller that reads a position must not receive a label, and a caller that averages probabilities needs them keyed by a stable index rather than by presentation text. This scenario proves both translations and the drop of the original `level` field.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `score` prints the zero-based position of the chosen level in `score` and rekeys `probabilities` by position.
- Real user request: `Ask Deem how severe this incident is.`
- Prompt: `Ask Deem how severe this incident is.`
- Expected execution process: the stub harness in §3 starts a server that answers with a known score body keyed by level text, runs `cli-deem score -q ... -s ... -l ... -l ... -l ...` against it, forwards the client's streams and exits with the client's status. Capture stdout and stderr separately.
- Expected signals: stdout is one JSON line with `"score":1`, no `level` field and `"probabilities":{"0":0.05,"1":0.75,"2":0.2}`, the exit status is `0`, and stderr is empty.
- Evidence: the command, the stub body, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads `"score": 1` for the second level and probabilities keyed `"0"`, `"1"` and `"2"`.
- Pass/fail: PASS when `score` is the zero-based position of the stub's `level`, no `level` field remains, every probability key is a position, the exit status is 0 and stderr is empty. FAIL when `score` carries text, `level` survives, a probability stays keyed by text, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const http = require("node:http");
const { spawn } = require("node:child_process");
const body = JSON.stringify({ model: "deem-0.8-v1", answers: { answer: { level: "degraded", probabilities: { "no user impact": 0.05, degraded: 0.75, outage: 0.2 }, expected: "degraded", confidence: 0.7, temperature: 0 } } });
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
| DEE-007 | Score returns a zero-based position | Confirm `score` prints the zero-based position of the chosen level in `score` and rekeys `probabilities` by position | `Ask Deem how severe this incident is.` | 1. `bash: node -e '<inline stub harness>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs score -q ... -s ... -l ... -l ... -l ...` | stdout one JSON line with `"score":1`, no `level` field and `"probabilities":{"0":0.05,"1":0.75,"2":0.2}`, exit `0`, stderr empty | The command, the stub body, complete stdout, complete stderr and the exit status | PASS when `score` is the zero-based position of the stub's `level`, no `level` field remains, every probability key is a position, the exit status is 0 and stderr is empty. FAIL when `score` carries text, `level` survives, a probability stays keyed by text, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker | 1. Exit 1 `score level is absent` means the stub's `level` text is not one of the submitted `-l` labels, so compare them byte for byte. 2. A label in `score` means the position lookup ran against the wrong list, so check the level order in the argument list. 3. Probabilities keyed by labels mean the rekey loop did not run, so inspect `translateAnswer` |

### Recorded Result

Observed while authoring: exit 0, stderr empty, and stdout was `{"model":"deem-0.8-v1","answers":{"answer":{"probabilities":{"0":0.05,"1":0.75,"2":0.2},"expected":"degraded","confidence":0.7,"temperature":0,"score":1}}}`. Verdict PASS.

### Failure Triage

1. Exit 1 with `score level is absent` means the stub's `level` text is not one of the submitted `-l` labels. Compare the strings byte for byte.
2. A label in `score` means the position lookup ran against the wrong list. Check that the `-l` flags are lowest first.
3. Probabilities keyed by labels mean the rekey loop did not run. Inspect `translateAnswer` in `scripts/cli-deem.mjs`.

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
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | The level order, the position lookup and the probabilities rekey |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server case `score translates a level to its zero-based position` |
| [wire-contract.md](../../references/wire-contract.md) | The answer field list and what passes through unchanged |

---

## 5. SOURCE METADATA

- Group: Judgment Subcommands
- Playbook ID: DEE-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `judgment-subcommands/score-returns-zero-based-position.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
