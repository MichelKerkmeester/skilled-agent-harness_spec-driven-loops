---
id: "DEE-005"
title: "DEE-005 -- Noul returns a probability"
description: "This scenario validates that noul --value prints one number in [0, 1] and exits 0, for `DEE-005`."
version: 0.1.0.0
---

# DEE-005 -- Noul returns a probability

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-005`.

---

## 1. OVERVIEW

`cli-deem noul` sends one question as `instructions` and Deem answers with `noul`, a probability. The client range-checks it in `[0, 1]` and passes the answer through in the field name a reader written for `jev` output already parses. With `--value` it prints only the number.

### Why This Matters

The point of the client is that a `jev` reader needs no second parser. This scenario proves the range check and the pass-through against a stub whose answer is known, so the operator can tell the client's validation from the model's opinion.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `noul --value` prints one number in `[0, 1]` and exits 0.
- Real user request: `Ask Deem for a probability that this request needs a reply today.`
- Prompt: `Ask Deem for a probability that this request needs a reply today.`
- Expected execution process: the stub harness in §3 starts a server that answers the `systemone` request with a known `noul` body, runs `cli-deem noul -q ... -s ... --value` against it, forwards the client's streams and exits with the client's status. Capture stdout and stderr separately.
- Expected signals: stdout is `0.87`, the exit status is `0`, and stderr is empty.
- Evidence: the command, the stub body, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads a probability between 0 and 1 with exit 0.
- Pass/fail: PASS when stdout is one number in `[0, 1]`, the exit status is 0 and stderr is empty. FAIL when stdout is not a number or carries the whole envelope despite `--value`. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const http = require("node:http");
const { spawn } = require("node:child_process");
const body = JSON.stringify({ model: "deem-0.8-v1", answers: { answer: { type: "noul", noul: 0.87, x_confidence: 0.9, x_temperature: 0 } } });
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(body);
});
server.listen(0, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + server.address().port;
  const child = spawn(process.execPath, [".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs", "noul", "-q", "Does this message ask for a reply today?", "-s", "Please restore service today.", "--value"], {
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
| DEE-005 | Noul returns a probability | Confirm `noul --value` prints one number in `[0, 1]` and exits 0 | `Ask Deem for a probability that this request needs a reply today.` | 1. `bash: node -e '<inline stub harness>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs noul -q ... -s ... --value` | stdout `0.87`, exit `0`, stderr empty | The command, the stub body, complete stdout, complete stderr and the exit status | PASS when stdout is one number in `[0, 1]`, the exit status is 0 and stderr is empty. FAIL when stdout is not a number or carries the whole envelope despite `--value`. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker | 1. Exit 1 `noul is not a number in [0, 1]` means the stub body changed, so restore the body named above. 2. A whole envelope on stdout means `--value` was dropped, so check the argument list. 3. Exit 3 means the envelope's model was not the pin, so check the stub's `model` field |

### Recorded Result

Observed while authoring: stdout was `0.87`, stderr was empty and the exit status was 0. Verdict PASS.

### Failure Triage

1. Exit 1 with `noul is not a number in [0, 1]` means the stub body changed. Restore the body named above, where `noul` is a number in `[0, 1]`.
2. A whole envelope on stdout means `--value` was dropped. Check the argument list in the harness.
3. Exit 3 means the envelope's `model` was not the pin. Check the stub's `model` field against `deem-0.8-v1`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [noul-probability.md](../../feature-catalog/judgment-subcommands/noul-probability.md) | Feature-catalog source describing the noul subcommand |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | `buildQuestion`, `judge` and the `noul` range check |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server case `noul passes through real shape and reads stdin state` |
| [wire-contract.md](../../references/wire-contract.md) | The request field list and the answer field list |

---

## 5. SOURCE METADATA

- Group: Judgment Subcommands
- Playbook ID: DEE-005
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `judgment-subcommands/noul-returns-probability.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
