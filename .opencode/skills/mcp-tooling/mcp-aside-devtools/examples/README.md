---
title: "Aside Devtools - Example Scripts"
description: "Runnable bash scripts for the three Aside lanes: agent tasks with session continuation, deterministic REPL evidence capture, and the MCP stdio handshake probe."
trigger_phrases:
  - "aside examples"
  - "aside example scripts"
  - "aside workflow scripts"
version: 1.0.0.0
---

# Aside Devtools - Example Scripts

> Runnable bash scripts covering the three lanes of `mcp-aside-devtools`: the natural-language agent task, the deterministic REPL evidence workflow, and the MCP stdio handshake probe.

---

## 1. OVERVIEW

Each script is a working workflow and an honest capability boundary: it exercises only research-verified commands, verifies artifacts independently of tool responses, and reports UNKNOWN or version-drift states instead of papering over them.

**Prerequisites for all scripts**: macOS, the `aside` CLI installed (`command -v aside`), and — for anything touching the browser — a signed-in Aside account. See [INSTALL_GUIDE.md](../INSTALL_GUIDE.md).

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

**Purpose:** Deterministic evidence workflow — open a tab, capture a screenshot, verify the artifact by PNG magic bytes.

```bash
./repl-evidence-capture.sh                          # https://example.com → /tmp/aside-evidence
./repl-evidence-capture.sh https://example.org ./my-evidence
```

**What it verifies:**
- `openTab(url)` round trip (the documented REPL entry point)
- `page.screenshot({ path })` writes a real file
- File exists, size > 0, first four bytes are PNG magic `89504e47` — independent of the tool response

**Honest boundaries:** bound-page result shapes are untested territory; the script gates on the artifact, not the response. A "not bound to a browser profile" error is a binding state, not an auth failure.

**Exit codes:** `0` artifact verified; `1` any step or verification failed.

---

### 2.3 mcp-handshake-probe.sh

**Purpose:** Prove the `aside mcp` stdio transport and refresh the version-pinned tool-inventory fixture.

```bash
./mcp-handshake-probe.sh                 # fixtures → /tmp/aside-mcp-probe
./mcp-handshake-probe.sh ./fixtures
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

The command surface is version-pinned. Capture `aside --help` for the installed version before scripting flags — especially around the unresolved `-m provider/model` vs `--model`/`--provider` spelling.

### Artifact-evidence standard

Every artifact needs independent proof: a screenshot is a non-empty PNG-magic file; structured capture must parse and contain a known marker. Transport success is never sufficient.

---

## 4. TROUBLESHOOTING

| Symptom | Fix |
|---|---|
| `aside not found` | Install via the official curl installer (operator-invoked); ensure `~/.local/bin` on PATH |
| `not bound to a browser profile` | Binding state, not auth — see [`references/troubleshooting.md`](../references/troubleshooting.md) |
| Probe reports inventory drift | Save the new fixture, rediscover, re-evaluate the workflow before invoking |
| Task pauses mid-run | Human-only boundary (approval/MFA/CAPTCHA/vault) — act in the Aside app, then resume |

---

## 5. SEE ALSO

- `../SKILL.md` — lane router and full rule set
- `../references/aside-cli-reference.md` — verified command surface
- `../references/mcp-wiring.md` — handshake, discovery, registration posture
- `../scripts/doctor.sh` — read-only diagnostics combining these checks
