---
title: "146 -- Dynamic server instructions (P1-6)"
description: "This scenario validates Dynamic server instructions (P1-6) for `146`. It focuses on Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning."
audited_post_018: true
version: 3.6.0.16
id: pipeline-architecture-dynamic-server-instructions-p1-6
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 146 -- Dynamic server instructions (P1-6)

## 1. OVERVIEW

This scenario validates Dynamic server instructions (P1-6) for `146`. It focuses on Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning.
- Real user request: `Please validate Dynamic server instructions (P1-6) against setInstructions() and tell me whether the expected signals are present: Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions.`
- Prompt: `Validate dynamic server instructions (P1-6) against setInstructions() and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if enabled mode emits overview with counts/channels and disabled mode yields empty string

---

## 3. TEST EXECUTION

### Prompt

```
Validate dynamic server instructions (P1-6) against setInstructions() and return pass/fail with cited evidence.
```

### Commands

1. Start the MCP server and capture startup logs
2. Verify `setInstructions()` was called with a non-empty instructions string
3. Verify instructions include: memory count, spec folder count, available channels, and active feature flags
4. If 11+ stale memories exist, verify a stale warning is included
5. Restart with `SPECKIT_DYNAMIC_INIT=false` and verify `setInstructions()` receives an empty string

### Expected

Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
node -e 'const { spawn } = require("node:child_process"); const child = spawn(process.execPath, ["dist/context-server.js"], { cwd: process.cwd(), env: { ...process.env } }); let out="", err=""; child.stdout.on("data", d => out += d); child.stderr.on("data", d => err += d); const msg = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "manual-playbook", version: "1.0.0" } } }); child.stdin.write(`Content-Length: ${Buffer.byteLength(msg)}\r\n\r\n${msg}`); setTimeout(() => { child.kill("SIGTERM"); setTimeout(() => child.kill("SIGKILL"), 500); }, 5000); child.on("exit", (code, signal) => { console.log("EXIT", JSON.stringify({ code, signal })); console.log("STDOUT_START"); console.log(out); console.log("STDOUT_END"); console.log("STDERR_START"); console.log(err); console.log("STDERR_END"); });'
```

Observed output:

```text
EXIT {"code":86,"signal":null}
STDOUT_START

STDOUT_END
STDERR_START
[context-server] ╔════════════════════════════════════════════════════════╗
[context-server] ║  WARNING: Native runtime changed since last install  ║
[context-server] ╠════════════════════════════════════════════════════════╣
[context-server] ║  Installed: Node v25.2.1 (MODULE_VERSION 141, darwin/arm64)          ║
[context-server] ║  Running:   Node v22.23.1 (MODULE_VERSION 127, darwin/arm64)         ║
[context-server] ║  Mismatch:  module ABI                                               ║
[context-server] ╠════════════════════════════════════════════════════════╣
[context-server] ║  Native modules may crash. Run:                         ║
[context-server] ║  bash scripts/setup/rebuild-native-modules.sh           ║
[context-server] ╚════════════════════════════════════════════════════════╝
[context-server] Detected runtime: unknown (hookPolicy=unknown)
[context-server] another live process holds the single-writer lock for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite (held by pid 29252 since 2026-07-02T12:29:43.062Z); refusing to open a second writer on the same database

STDERR_END
```

The MCP server exited before an `initialize` response could expose startup instructions, so the required checks for non-empty instructions, counts/channels, stale warning threshold behavior, and `SPECKIT_DYNAMIC_INIT=false` empty instructions could not be completed against this live repo state.

### Pass / Fail

- **BLOCKED**: The server cannot be started for this scenario because another live process holds the single-writer lock for `mcp_server/database/context-index.sqlite`; startup exits with code 86 before instructions can be observed.

### Failure Triage

Inspect `context-server.ts` `buildServerInstructions`, `startup-checks.ts`, and `SPECKIT_DYNAMIC_INIT` flag handling

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/dynamic_server_instructions_at_mcp_initialization.md](../../feature_catalog/pipeline_architecture/dynamic_server_instructions_at_mcp_initialization.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 146
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/dynamic_server_instructions_p1_6.md`
