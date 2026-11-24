---
title: "Aside Devtools - Example Scripts"
description: "Runnable bash scripts for the three Aside lanes: agent tasks with session continuation, deterministic REPL evidence capture, and the MCP stdio handshake probe."
trigger_phrases:
  - "aside examples"
  - "aside example scripts"
  - "aside workflow scripts"
version: 1.0.4.0
---

# Aside Devtools - Example Scripts

> Runnable bash scripts covering the three lanes of `mcp-aside-devtools`: the natural-language agent task, the deterministic REPL evidence workflow, and the MCP stdio handshake probe.

---

## 1. OVERVIEW

Each script is a working workflow and an honest capability boundary: it exercises only research-verified commands, verifies artifacts independently of tool responses, and reports UNKNOWN or version-drift states instead of papering over them.

**Prerequisites for all scripts**: macOS, the `aside` CLI installed (`command -v aside`), and, for anything touching the browser, a signed-in Aside account. See [INSTALL-GUIDE.md](../INSTALL-GUIDE.md).

---

## 2. AVAILABLE SCRIPTS

### 2.1 agent-task-session.sh

**Purpose:** Run a natural-language browser-agent task, optionally continuing a prior session or selecting an account.

```bash
./agent-task-session.sh "Open https://example.com and summarize the page"
./agent-task-session.sh "Continue: download the report" --session <id>
./agent-task-session.sh "Check my dashboard" --account <id>
```

**What it enforces:**
- Preflight version fixture + read-only account state (built-in models fail closed when signed out)
- `--account` only where documented (direct tasks and `exec`), never invented for `repl`/`mcp`
- Pause states (approval, MFA, CAPTCHA, vault unlock) are reported as human-only boundaries, never retried blindly

**Exit codes:** `0` task run returned; non-zero passthrough from `aside` with triage guidance.

---

### 2.2 repl-evidence-capture.sh

**Purpose:** Deterministic evidence workflow: open a tab, capture a screenshot, verify the artifact by PNG magic bytes.

```bash
./repl-evidence-capture.sh                          # https://example.com, writes ./tmp/ in the REPL session folder
./repl-evidence-capture.sh https://example.org ./tmp/<evidence-dir>
```

**What it verifies:**
- `openTab(url)`, `page.screenshot({ path })` and the file check all run in one `aside repl` evaluation
- The REPL's `fs` global reads the file back, and the logged JSON must show size > 0 and PNG magic `89504e47`
- The output must carry no error or `[WARN]` line, because an `aside repl` error still exits 0

**Honest boundaries:** bound-page result shapes are untested territory; the script gates on the artifact, not the response. A "not bound to a browser profile" error is a binding state, not an auth failure.

**Status on Aside 1.26.626.1517.** The script uses the one-evaluation form from [`manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md`](../manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md) (ASD-007), which passed live. Each separate `aside repl` call starts with `page` null. The REPL redirects a `/tmp` path into its session folder and removes the session files when it exits. So the script writes to `./tmp/` and checks the file with `fs` inside the same evaluation. The REPL removes the PNG when it exits, so the logged JSON line is the evidence to keep. The second argument must stay under `./tmp`. An absolute path or a folder outside `./tmp` is rejected. It has not yet been run as a script against a live Aside.

**Exit codes:** `0` artifact verified, `1` any step or verification failed.

---

### 2.3 mcp-handshake-probe.sh

**Purpose:** Prove the `aside mcp` stdio transport and refresh the version-pinned tool-inventory fixture.

```bash
./mcp-handshake-probe.sh                 # fixtures → /tmp/aside-mcp-probe
./mcp-handshake-probe.sh ./<fixtures-dir>
```

**What it does:**
- Spawns `aside mcp`, sends JSON-RPC `initialize` → `notifications/initialized` → `tools/list`
- Prints serverInfo, protocol version, and discovered tools (parsed with `jq` when available)
- Flags drift when the inventory differs from the documented single `repl` tool
- Watchdog-kills the child so no server process leaks

**Exit codes:** `0` handshake succeeded; `1` no initialize response (stderr distinguishes a dead stdio child from an unavailable Aside daemon/browser).

---

## 3. COMMON PATTERNS

### Preflight before anything

```bash
command -v aside && aside --version 2>&1 && aside --help 2>&1 > /tmp/aside-help-fixture.txt
```

### Fixture-first flag usage

The command surface is version-pinned. Capture `aside --help` for the installed version before scripting flags. On 1.26.626.1517 it defines both `-m, --model` (which also accepts `provider/model`) and `-p, --provider`.

### Artifact-evidence standard

Every artifact needs independent proof: a screenshot is a non-empty PNG-magic file; structured capture must parse and contain a known marker. Transport success is never sufficient.

---

## 4. TROUBLESHOOTING

| Symptom | Fix |
|---|---|
| `aside not found` | Install via the official curl installer (operator-invoked); ensure `~/.local/bin` on PATH |
| `not bound to a browser profile` | Binding state, not auth: see [`references/troubleshooting.md`](../references/troubleshooting.md) |
| Probe reports inventory drift | Save the new fixture, rediscover, re-evaluate the workflow before invoking |
| Task pauses mid-run | Human-only boundary (approval/MFA/CAPTCHA/vault), act in the Aside app, then resume |

---

## 5. SEE ALSO

- `../SKILL.md`: full rule set and the lane-routing prose
- `../ROUTER.md#3-machine-router`: machine router, intent map, resource map and loading levels
- `../references/aside-cli-reference.md`: verified command surface
- `../references/mcp-wiring.md`: handshake, discovery, registration posture
- `../scripts/doctor.sh`: read-only diagnostics combining these checks
