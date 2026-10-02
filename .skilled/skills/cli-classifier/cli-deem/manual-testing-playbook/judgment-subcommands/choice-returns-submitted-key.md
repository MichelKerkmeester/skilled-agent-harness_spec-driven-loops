---
id: "DEE-006"
title: "DEE-006 -- Choice returns the submitted key"
description: "This scenario validates that choice prints the submitted key and rekeys the probabilities by key, for `DEE-006`."
version: 0.1.0.0
---

# DEE-006 -- Choice returns the submitted key

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-006`.

---

## 1. OVERVIEW

Deem stores option text and answers with the chosen description, while the caller submitted `KEY=DESCRIPTION` pairs. The client maps the chosen text back to its key and rekeys the probabilities the same way, so a caller reads keys rather than descriptions.

### Why This Matters

A caller that switched on keys would misread a description. This scenario proves both halves of the map, the `choice` field and the `probabilities` object, against a stub whose option text is known.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `choice` prints one submitted key in `choice` and rekeys `probabilities` by key.
- Real user request: `Ask Deem which team owns this billing problem.`
- Prompt: `Ask Deem which team owns this billing problem.`
- Expected execution process: the stub harness in §3 starts a server that answers with a known choice body keyed by description, runs `cli-deem choice -q ... -s ... -o billing=... -o support=...` against it, forwards the client's streams and exits with the client's status. Capture stdout and stderr separately.
- Expected signals: stdout is one JSON line with `"choice":"billing"` and `"probabilities":{"billing":0.81,"support":0.19}`, the exit status is `0`, and stderr is empty.
- Evidence: the command, the stub body, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads `billing` or `support` in the `choice` field with the probabilities keyed the same way.
- Pass/fail: PASS when `choice` is one of the submitted keys, every probability key is a submitted key, the exit status is 0 and stderr is empty. FAIL when a description appears in `choice`, a probability key is a description, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const http = require("node:http");
const { spawn } = require("node:child_process");
const body = JSON.stringify({ model: "deem-0.8-v1", answers: { answer: { choice: "Payment or refund problem", probabilities: { "Payment or refund problem": 0.81, "Product or account problem": 0.19 }, confidence: 0.8, x_temperature: 0 } } });
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(body);
});
server.listen(0, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + server.address().port;
  const child = spawn(process.execPath, [".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs", "choice", "-q", "Which team owns this?", "-s", "The invoice total is wrong.", "-o", "billing=Payment or refund problem", "-o", "support=Product or account problem"], {
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
| DEE-006 | Choice returns the submitted key | Confirm `choice` prints one submitted key in `choice` and rekeys `probabilities` by key | `Ask Deem which team owns this billing problem.` | 1. `bash: node -e '<inline stub harness>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs choice -q ... -s ... -o billing=... -o support=...` | stdout one JSON line with `"choice":"billing"` and `"probabilities":{"billing":0.81,"support":0.19}`, exit `0`, stderr empty | The command, the stub body, complete stdout, complete stderr and the exit status | PASS when `choice` is one of the submitted keys, every probability key is a submitted key, the exit status is 0 and stderr is empty. FAIL when a description appears in `choice`, a probability key is a description, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker | 1. Exit 1 `choice is not a known description` means the stub's option text does not match a submitted description, so compare them byte for byte. 2. A description in `choice` means the key map was not applied, so inspect `translateAnswer`. 3. Exit 2 means the `-o` pairs are not `KEY=DESCRIPTION`, so fix the argument syntax |

### Recorded Result

Observed while authoring: exit 0, stderr empty, and stdout was `{"model":"deem-0.8-v1","answers":{"answer":{"choice":"billing","probabilities":{"billing":0.81,"support":0.19},"confidence":0.8,"x_temperature":0}}}`. Verdict PASS.

### Failure Triage

1. Exit 1 with `choice is not a known description` means the stub's option text does not match a submitted description. Compare the two strings byte for byte.
2. A description in `choice` means the key map was not applied. Inspect `translateAnswer` in `scripts/cli-deem.mjs`.
3. Exit 2 before any request means the `-o` pairs are not `KEY=DESCRIPTION`. Fix the argument syntax.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [choice-selection.md](../../feature-catalog/judgment-subcommands/choice-selection.md) | Feature-catalog source describing the choice subcommand |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | The `KEY=DESCRIPTION` parse, the key map and the probabilities rekey |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server cases `choice translates descriptions back to the submitted keys` and `choice --value prints only the submitted key` |
| [wire-contract.md](../../references/wire-contract.md) | The option cap, the duplicate refusals and the answer field list |

---

## 5. SOURCE METADATA

- Group: Judgment Subcommands
- Playbook ID: DEE-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `judgment-subcommands/choice-returns-submitted-key.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
