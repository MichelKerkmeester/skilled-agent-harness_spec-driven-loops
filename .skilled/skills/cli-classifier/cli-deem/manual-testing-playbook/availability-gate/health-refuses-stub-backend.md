---
id: "DEE-002"
title: "DEE-002 -- Health refuses the stub backend"
description: "This scenario validates that a health body whose backend is stub exits 3 with a refused-backend error, for `DEE-002`."
version: 0.1.0.0
---

# DEE-002 -- Health refuses the stub backend

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-002`.

---

## 1. OVERVIEW

Deem's stub backend answers `status` `ok` with uniform logits, so a `noul` question against it returns 0.5 every time. The client therefore checks the backend field, not only the status field.

### Why This Matters

A caller that trusted `status` `ok` would read a stub 0.5 as a judgment. This scenario proves the stub is refused before anything can be measured. The health check order is reachability, then body shape, then backend, then model, so this refusal happens before the commit pair is read.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a health body with `backend` set to `stub` exits 3 with `refused backend: stub` on stderr and an empty stdout.
- Real user request: `Check Deem's health while a stub backend answers on the port.`
- Prompt: `Check Deem's health while a stub backend answers on the port.`
- Expected execution process: the stub harness in §3 starts a server that answers every request with the stub health body, runs `cli-deem health` against it, forwards the client's streams and exits with the client's status. Capture stdout and stderr separately.
- Expected signals: stderr carries `{"ok":false,"error":"refused backend: stub"}`, the exit status is `3`, and stdout is empty.
- Evidence: the command, the stub body, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads the `refused backend: stub` error and treats Deem as unavailable rather than trusting a flat stub answer.
- Pass/fail: PASS when the exit status is 3, stderr names `refused backend: stub` and stdout is empty. FAIL when the exit status is 0 or any other class, or when stdout carries a health body. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const http = require("node:http");
const { spawn } = require("node:child_process");
const body = JSON.stringify({ status: "ok", model: "deem-0.8-v1", backend: "stub" });
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
| DEE-002 | Health refuses the stub backend | Confirm a health body with `backend` set to `stub` exits 3 with `refused backend: stub` on stderr and an empty stdout | `Check Deem's health while a stub backend answers on the port.` | 1. `bash: node -e '<inline stub harness>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health against the stub` | stderr `{"ok":false,"error":"refused backend: stub"}`, exit `3`, stdout empty | The command, the stub body, complete stdout, complete stderr and the exit status | PASS when the exit status is 3, stderr names `refused backend: stub` and stdout is empty. FAIL when the exit status is 0 or any other class, or when stdout carries a health body. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker | 1. Exit 0 means the backend check was skipped, so inspect `isAcceptedBackend`. 2. Another exit class means the stub body is malformed, so print the body and compare it with the health field list in `references/wire-contract.md`. 3. Confirm the client reads `backend` rather than trusting `status` alone |

### Recorded Result

Observed while authoring: stdout was empty, stderr carried `{"ok":false,"error":"refused backend: stub"}` and the exit status was 3. Verdict PASS.

### Failure Triage

1. Exit 0 means the backend check was skipped entirely. Inspect `isAcceptedBackend` in `scripts/cli-deem.mjs`.
2. Another exit class means the stub body is malformed. Print the stub body and compare it with the health field list in `references/wire-contract.md`.
3. If the client passes a stub body, confirm it reads `backend` rather than trusting `status` alone.

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
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | The backend check and the exit mapping |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server cases `health refuses a stub backend` and `health refuses an ensemble that contains stub` |
| [wire-contract.md](../../references/wire-contract.md) | Why the stub 0.5 must not read as a judgment |

---

## 5. SOURCE METADATA

- Group: Availability Gate
- Playbook ID: DEE-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `availability-gate/health-refuses-stub-backend.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
