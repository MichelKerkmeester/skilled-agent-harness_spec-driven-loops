---
id: "DEE-003"
title: "DEE-003 -- Health refuses a model other than the pin"
description: "This scenario validates that a health body whose model is not the pin exits 3 with a refused-model error, for `DEE-003`."
version: 0.1.0.0
---

# DEE-003 -- Health refuses a model other than the pin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-003`.

---

## 1. OVERVIEW

The model id `deem-0.8-v1` is a launch label, and the client requires it in both the health body and every answer envelope. A server started without the pinned id reports `deem-1.5`, its own default.

### Why This Matters

A different server can hold port 8300 and answer with another model id. A caller that ignored the model field would attribute that server's answers to the pinned Deem install. This scenario proves the client refuses the wrong id before it reads the commit pair.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a health body whose `model` is `deem-1.5` exits 3 with `refused model: deem-1.5, expected deem-0.8-v1` on stderr and an empty stdout.
- Real user request: `Check Deem's health while a server that is not the pinned model answers.`
- Prompt: `Check Deem's health while a server that is not the pinned model answers.`
- Expected execution process: the stub harness in §3 starts a server that answers every request with a `torch` health body carrying the wrong model id, runs `cli-deem health` against it, forwards the client's streams and exits with the client's status. Capture stdout and stderr separately.
- Expected signals: stderr carries `{"ok":false,"error":"refused model: deem-1.5, expected deem-0.8-v1"}`, the exit status is `3`, and stdout is empty.
- Evidence: the command, the stub body, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads `refused model: deem-1.5, expected deem-0.8-v1` and knows a different server owns the port.
- Pass/fail: PASS when the exit status is 3, stderr names the refused model and the expected pin, and stdout is empty. FAIL when the exit status is 0 or any other class, or when stdout carries a health body. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const http = require("node:http");
const { spawn } = require("node:child_process");
const body = JSON.stringify({ status: "ok", model: "deem-1.5", backend: "torch" });
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(body);
});
server.listen(0, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + server.address().port;
  const child = spawn(process.execPath, [".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs", "health"], {
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
| DEE-003 | Health refuses a model other than the pin | Confirm a health body whose `model` is `deem-1.5` exits 3 with a refused-model error and an empty stdout | `Check Deem's health while a server that is not the pinned model answers.` | 1. `bash: node -e '<inline stub harness>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health against the stub` | stderr `{"ok":false,"error":"refused model: deem-1.5, expected deem-0.8-v1"}`, exit `3`, stdout empty | The command, the stub body, complete stdout, complete stderr and the exit status | PASS when the exit status is 3, stderr names the refused model and the expected pin, and stdout is empty. FAIL when the exit status is 0 or any other class, or when stdout carries a health body. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker | 1. Exit 0 means the model check was skipped, so inspect the `PINNED_MODEL` comparison. 2. Exit 4 means the client never reached the body, so check the stub bound `127.0.0.1`. 3. A different model string in stderr means the stub body changed, so restore the body named above |

### Recorded Result

Observed while authoring: stdout was empty, stderr carried `{"ok":false,"error":"refused model: deem-1.5, expected deem-0.8-v1"}` and the exit status was 3. Verdict PASS.

### Failure Triage

1. Exit 0 means the model check was skipped. Inspect the `PINNED_MODEL` comparison in `scripts/cli-deem.mjs`.
2. Exit 4 means the client never reached the body. Check that the stub bound `127.0.0.1` and that the harness passed its port to `CLI_DEEM_URL`.
3. A different model string in stderr means the stub body changed. Restore the body named above before judging the client.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [health-check.md](../../feature-catalog/availability-check/health-check.md) | Feature-catalog source describing the health check |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | The model check and the exit mapping |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server case `health refuses a model other than the pin` |
| [model-pin.md](../../references/model-pin.md) | What the pin names and why a server can report another id |

---

## 5. SOURCE METADATA

- Group: Availability Gate
- Playbook ID: DEE-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `availability-gate/health-refuses-wrong-model.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
