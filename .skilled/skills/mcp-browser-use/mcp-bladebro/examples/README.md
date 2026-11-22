---
title: "Bladebro - Example Scripts"
description: "Runnable bash scripts for the Bladebro CLI: an isolated agent-browser read with a verified marked screenshot, a two-step plan, and read-only reads against a running browser through attach."
trigger_phrases:
  - "bladebro examples"
  - "bladebro example scripts"
  - "bladebro workflow scripts"
version: 1.0.1.0
---

# Bladebro - Example Scripts

> Runnable bash scripts for the `mcp-bladebro` mode: an isolated agent-browser read, a two-step plan and read-only attach reads against a browser the operator runs.

---

## 1. OVERVIEW

Each script runs only commands the installed Bladebro 4.8.2 lists in `bladebro help`, judges every step by its exit code and its `ok` field, and checks artifacts on disk rather than trusting a response. The two agent-browser scripts run in a scratch `BLADE_HOME`, so they never reach the shared data root or another daemon. The attach script drives a browser the operator already runs, so it runs only on an explicit operator request.

**Prerequisites for all scripts**: macOS with `bladebro` on PATH (`command -v bladebro`). Installing it is an operator decision, see [INSTALL-GUIDE.md](../INSTALL-GUIDE.md). The attach script also needs `curl`, and `jq` or `python3` to print its eval result.

| Script | Mutation class | Browser it drives |
|---|---|---|
| `agent-browser-read.sh` | Browser-side only; copies one PNG into `OUT_DIR` | A Bladebro-owned agent browser in a scratch `BLADE_HOME` |
| `run-step-plan.sh` | Browser-side only | A Bladebro-owned agent browser in a scratch `BLADE_HOME` |
| `attach-read.sh` | Read-only on the page; navigates the attached tab once | The operator's running browser, on its debug port |

---

## 2. AVAILABLE SCRIPTS

### 2.1 agent-browser-read.sh

**Purpose:** Read one page on an isolated agent browser and prove the marked screenshot is a real PNG.

```bash
./agent-browser-read.sh                                   # https://example.com, PNG to ${TMPDIR:-/tmp}/bladebro-agent-read
./agent-browser-read.sh https://example.com ./<out-dir>
```

**What it does:**
- Creates a scratch `BLADE_HOME`, sets `BLADE_LANE=agent` and `BLADE_NO_UPDATE_CHECK=1`, so a fresh daemon starts with those settings
- Runs `see content <url> --json`, `see model --json` and `vision --marks --json`, each checked by exit code and `"ok":true`
- Checks the `image_path` file exists, is non-empty and starts with the PNG magic bytes `89504e47`, then copies it to `OUT_DIR`
- On exit, stops the daemon under the same scratch `BLADE_HOME` and deletes that folder

**Exit codes:** `0` every read passed and the PNG was verified; `1` `bladebro` is missing, a read failed or the PNG check failed; `2` invalid arguments.

---

### 2.2 run-step-plan.sh

**Purpose:** Run a navigate-then-read plan in one `bladebro run` call and confirm it completed.

```bash
./run-step-plan.sh                       # https://example.com
./run-step-plan.sh https://example.org
```

**What it does:**
- Writes `[{"action":"navigate","url":"<url>"},{"action":"see","mode":"content"}]` to a temporary plan file
- Runs `bladebro run @<plan-file> --format json` in a scratch `BLADE_HOME` and requires `"status":"completed"`
- Accepts only plain `http(s)` URLs with no quotes, backslashes or spaces, because the URL is written into JSON
- On exit, stops the scratch daemon and deletes the scratch home and the plan file

**Exit codes:** `0` the plan completed; `1` `bladebro` is missing, the plan exited non-zero or stopped early; `2` invalid arguments.

---

### 2.3 attach-read.sh

**Purpose:** Read a site the operator confirmed through the browser the operator already runs, without copying its profile.

```bash
# Operator first: quit the browser fully, then start it with a fixed debug port
open -a "<browser app>" --args --remote-debugging-port=9333

./attach-read.sh --port 9333 https://<confirmed-site>
```

**What it does:**
- Probes `http://127.0.0.1:<port>/json/version` and stops when no `Browser` line answers
- Runs `see content <url> --port <N> --json`, `see model --port <N> --json` and an `act eval` that returns two booleans, whether the tab is on the target host and whether the title looks like a sign-in page, and never the hostname itself
- Prints only exit codes, the `ok` result and the eval line, never page text, so no signed-in content reaches the output
- Never clicks, types, launches, quits or kills a browser; starting the browser and closing the port stay with the operator

**Exit codes:** `0` the port answered and every read passed; `1` `bladebro` or `curl` is missing, the port did not answer or a read failed; `2` invalid arguments.

---

## 3. COMMON PATTERNS

### Preflight before anything

```bash
command -v bladebro && bladebro doctor && bladebro --version
```

The packet is pinned to 4.8.2. On any other version, re-check each flag with `bladebro help <command>` before running a script.

### Isolate with a scratch data root

A running daemon keeps its launch settings, so `BLADE_HOME` and `BLADE_LANE` must be set before the first command starts one. Pointing each run at its own `BLADE_HOME` also means `bladebro stop` reaches only that run's daemon.

### Artifact evidence

A screenshot counts only when the file exists, is non-empty and starts with the PNG magic bytes. A response that says it saved an image is not proof.

---

## 4. TROUBLESHOOTING

| Symptom | Fix |
|---|---|
| `bladebro not found` | The operator installs the pinned release, see [INSTALL-GUIDE.md](../INSTALL-GUIDE.md); the scripts never install it |
| A read exits 1 | Read the `text` field: it carries the page state for recovery. Do not retry a mutation before inspecting the destination |
| A read exits 2 | A usage error: re-check the flag against `bladebro help <command>` on the installed version |
| `no browser answered on port` | The browser was still running when it was started with the port. Quit it fully, then start it again with `--remote-debugging-port` |
| The eval reports `true` for sign-in | The running browser holds no session for the site. That fails the precondition, not Bladebro |
| `Chrome launch failed: no page target available` | Seen in clone mode with the Aside binary; use attach instead, see [`../references/browser-lanes.md`](../references/browser-lanes.md) |

---

## 5. SEE ALSO

- [`../SKILL.md`](../SKILL.md): the lane rule, the browser lanes and the safety rules
- [`../references/cli-reference.md`](../references/cli-reference.md): the five tools, the output envelope and configuration
- [`../references/browser-lanes.md`](../references/browser-lanes.md): the agent browser and the `rb` lanes, including attach
- [`../feature-catalog/feature-catalog.md`](../feature-catalog/feature-catalog.md): the current capability inventory
- [`../scripts/doctor.sh`](../scripts/doctor.sh): read-only diagnostics, including the MCP stdio handshake
