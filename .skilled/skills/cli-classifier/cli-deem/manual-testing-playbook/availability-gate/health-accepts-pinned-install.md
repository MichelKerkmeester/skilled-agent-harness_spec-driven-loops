---
id: "DEE-004"
title: "DEE-004 -- Health accepts a pinned install and prints the commit pair"
description: "This scenario validates that a healthy pinned body plus a fixture home holding models/current and a git source tree exits 0 with the backend, the model pin and both commits, for `DEE-004`."
version: 0.1.0.0
---

# DEE-004 -- Health accepts a pinned install and prints the commit pair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-004`.

---

## 1. OVERVIEW

A health check passes only when the response and the install on disk agree. The response names the backend and the model id. The disk holds the checkpoint link behind `models/current` and the server source checkout at `src`, and the client turns both into the commit pair.

### Why This Matters

The model id survives every update while `deem-0.8-v1` never names the weights. The commit pair is what a kept result is measured against, so a caller that cannot read it cannot decide whether a result still holds. This scenario proves the passing path and the two values it prints, without touching the machine's real install.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a pinned health body plus a fixture home with a `models/current` link and a git `src` exits 0 with `torch`, `deem-0.8-v1` and both commit values.
- Real user request: `Check Deem's health against a pinned install and show me the commit pair.`
- Prompt: `Check Deem's health against a pinned install and show me the commit pair.`
- Expected execution process: the harness in §3 builds a throwaway `CLI_DEEM_HOME` under the system temp directory with a `models/current` symlink and a one-commit git `src`, starts a stub server that answers the pinned health body, runs `cli-deem health` with both `CLI_DEEM_URL` and `CLI_DEEM_HOME` set, then removes the fixture. Capture stdout and stderr separately.
- Expected signals: one JSON line on stdout with `"ok":true`, `"backend":"torch"`, `"model":"deem-0.8-v1"`, `"model_commit"` equal to the basename behind `models/current` and `"source_commit"` equal to the fixture repository's `HEAD`. The exit status is `0` and stderr is empty.
- Evidence: the command, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads one JSON line naming `torch`, `deem-0.8-v1`, the model commit behind `models/current` and the source commit of the checkout.
- Pass/fail: PASS when the exit status is 0, all five fields hold and stderr is empty. FAIL when a check is refused, a commit value is empty, or the exit status is not 0. SKIP only when the machine cannot create a temporary git repository, naming git as the sandbox blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node -e '
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { spawn, execFileSync } = require("node:child_process");
const home = fs.mkdtempSync(path.join(os.tmpdir(), "deem-home-"));
const modelCommit = "8cbabbb2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
fs.mkdirSync(path.join(home, "models", modelCommit), { recursive: true });
fs.symlinkSync(path.join("models", modelCommit), path.join(home, "models", "current"));
const src = path.join(home, "src");
fs.mkdirSync(src);
execFileSync("git", ["init", "-q", src]);
fs.writeFileSync(path.join(src, "server.py"), "# pinned source tree\n");
execFileSync("git", ["-C", src, "add", "."]);
execFileSync("git", ["-C", src, "-c", "user.email=stub@example.com", "-c", "user.name=Stub", "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", "commit", "-q", "-m", "stub"], { env: { ...process.env, GIT_AUTHOR_DATE: "2020-01-01T00:00:00Z", GIT_COMMITTER_DATE: "2020-01-01T00:00:00Z" } });
const body = JSON.stringify({ status: "ok", model: "deem-0.8-v1", backend: "torch" });
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(body);
});
server.listen(0, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + server.address().port;
  const child = spawn(process.execPath, [".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs", "health"], {
    env: { ...process.env, CLI_DEEM_URL: url, CLI_DEEM_HOME: home },
    stdio: ["ignore", "inherit", "inherit"],
  });
  child.on("exit", (code) => {
    server.close();
    fs.rmSync(home, { recursive: true, force: true });
    process.exit(code ?? 1);
  });
});
'
```

The fixture commit disables hooks with `-c core.hooksPath=/dev/null` because this workspace points `core.hooksPath` at a global commit-message validator. The fixture is a throwaway repository outside the project, so the validator does not apply to it.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEE-004 | Health accepts a pinned install and prints the commit pair | Confirm a pinned body plus a fixture home with a `models/current` link and a git `src` exits 0 with the backend, the model pin and both commits | `Check Deem's health against a pinned install and show me the commit pair.` | 1. `bash: node -e '<inline stub harness and fixture home>'` -> 2. `bash: the harness runs node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health against the stub and the fixture home` | One JSON line with `"ok":true`, `"backend":"torch"`, `"model":"deem-0.8-v1"`, `model_commit` equal to the link basename and `source_commit` equal to the fixture `HEAD`, exit `0`, stderr empty | The command, complete stdout, complete stderr and the exit status | PASS when the exit status is 0, all five fields hold and stderr is empty. FAIL when a check is refused, a commit value is empty, or the exit status is not 0. SKIP only when the machine cannot create a temporary git repository, naming git as the sandbox blocker | 1. Exit 2 `missing checkpoint link` means `models/current` was not created, so check `CLI_DEEM_HOME` points at the fixture. 2. Exit 2 `missing source tree` means `git -C "$home/src" rev-parse HEAD` failed, so check the fixture repository. 3. Exit 4 means the stub did not answer, so check that it bound `127.0.0.1` before the client ran |

### Recorded Result

Observed while authoring: exit 0 and one stdout line, `{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"8cbabbb2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","source_commit":"a6535b984bb1bd03248d65f61f2b3fef2e7f3509"}`. The `source_commit` value is the fixture repository's `HEAD` and follows from the fixed author and committer dates in the command. Verdict PASS.

### Failure Triage

1. Exit 2 with `missing checkpoint link` means `models/current` was not created. Check that `CLI_DEEM_HOME` points at the fixture and that the symlink exists.
2. Exit 2 with `missing source tree` means `git -C "$home/src" rev-parse HEAD` failed. Check that the fixture repository has one commit.
3. Exit 4 means the stub did not answer. Check that the server bound `127.0.0.1` before the client ran.

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
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | The commit-pair reads and the exit mapping |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server case `health prints the pinned model and the commit pair` |
| [model-pin.md](../../references/model-pin.md) | What the two commit values name |

---

## 5. SOURCE METADATA

- Group: Availability Gate
- Playbook ID: DEE-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `availability-gate/health-accepts-pinned-install.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
