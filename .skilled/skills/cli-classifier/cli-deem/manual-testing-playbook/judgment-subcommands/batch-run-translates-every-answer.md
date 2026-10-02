---
id: "DEE-008"
title: "DEE-008 -- A batched run translates every answer"
description: "This scenario validates that run - reads a Deem-shaped request from stdin and prints one translated answer per key, for `DEE-008`."
version: 0.1.0.0
---

# DEE-008 -- A batched run translates every answer

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-008`.

---

## 1. OVERVIEW

`cli-deem run` takes a request file or `-` for stdin written in Deem's own shape, counts the questions and options before sending, and validates each answer by its type. A batch that lists options without keys keeps Deem's option text, because there is no key to map back to.

### Why This Matters

A batch is the one path where the caller composes Deem's request shape directly, so the client cannot own the question text. This scenario proves the caps are read from that shape, the model is still checked and every answer comes back translated under its own key.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `run -` sends a two-question Deem-shaped batch and prints one translated answer per key.
- Real user request: `Send one Deem-shaped batch and translate every answer.`
- Prompt: `Send one Deem-shaped batch and translate every answer.`
- Expected execution process: the stub harness in §3 starts a server that answers with a `noul` value and a `choice` text, then runs `cli-deem run -` with the request piped to stdin, forwards the client's streams and exits with the client's status. Capture stdout and stderr separately.
- Expected signals: stdout is one JSON line with `"urgency":{"noul":0.62}` and `"queue":{"choice":"Payment or refund problem"}`, the exit status is `0`, and stderr is empty.
- Evidence: the command, the piped request, the stub body, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads one answer per question key, with `noul` passed through and the batch `choice` keeping Deem's option text.
- Pass/fail: PASS when every request key has one translated answer, `noul` carries the stub's number, the batch `choice` keeps the option text, the exit status is 0 and stderr is empty. FAIL when a key is missing, an answer is untranslated, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const http = require("node:http");
const { spawn } = require("node:child_process");
const request = { state: "Please restore service today.", questions: { urgency: { type: "noul", instructions: "Does this ask for a reply today?" }, queue: { type: "choice", instructions: "Which team owns this?", options: ["Payment or refund problem", "Product or account problem"] } } };
const body = JSON.stringify({ model: "deem-0.8-v1", answers: { urgency: { noul: 0.62 }, queue: { choice: "Payment or refund problem" } } });
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(body);
});
server.listen(0, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + server.address().port;
  const child = spawn(process.execPath, [".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs", "run", "-"], {
    env: { ...process.env, CLI_DEEM_URL: url },
    stdio: ["pipe", "inherit", "inherit"],
  });
  child.stdin.end(JSON.stringify(request));
  child.on("exit", (code) => {
    server.close();
    process.exit(code ?? 1);
  });
});
'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEE-008 | A batched run translates every answer | Confirm `run -` sends a two-question Deem-shaped batch and prints one translated answer per key | `Send one Deem-shaped batch and translate every answer.` | 1. `bash: node -e '<inline stub harness>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs run - with the request piped to stdin` | stdout one JSON line with `"urgency":{"noul":0.62}` and `"queue":{"choice":"Payment or refund problem"}`, exit `0`, stderr empty | The command, the piped request, the stub body, complete stdout, complete stderr and the exit status | PASS when every request key has one translated answer, `noul` carries the stub's number, the batch `choice` keeps the option text, the exit status is 0 and stderr is empty. FAIL when a key is missing, an answer is untranslated, or the exit status is not 0. SKIP only when the environment cannot bind an ephemeral loopback port, naming that sandbox blocker | 1. Exit 2 `request must be an object containing state and questions` means the piped JSON shape is wrong, so compare it with the request above. 2. Exit 2 `invalid request JSON` means stdin did not carry the request, so check the harness feeds `JSON.stringify(request)`. 3. Exit 1 `unknown question` means the stub answered a key that was not in the request, so align the two key sets |

### Recorded Result

Observed while authoring: exit 0, stderr empty, and stdout was `{"model":"deem-0.8-v1","answers":{"urgency":{"noul":0.62},"queue":{"choice":"Payment or refund problem"}}}`. Verdict PASS.

### Failure Triage

1. Exit 2 with `request must be an object containing state and questions` means the piped JSON shape is wrong. Compare it with the request object above.
2. Exit 2 with `invalid request JSON` means stdin did not carry the request. Check that the harness feeds `JSON.stringify(request)` before the client reads stdin.
3. Exit 1 with `unknown question` means the stub answered a key that was not in the request. Align the stub answer keys with the request keys.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [batched-run.md](../../feature-catalog/judgment-subcommands/batched-run.md) | Feature-catalog source describing the run subcommand |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | `questionSpecs`, the two caps and the per-key validation |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server cases `run passes through real noul and score answer shapes` and `run sends a file of 64 noul questions` |
| [wire-contract.md](../../references/wire-contract.md) | The question and option caps and the batch answer rules |

---

## 5. SOURCE METADATA

- Group: Judgment Subcommands
- Playbook ID: DEE-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `judgment-subcommands/batch-run-translates-every-answer.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
