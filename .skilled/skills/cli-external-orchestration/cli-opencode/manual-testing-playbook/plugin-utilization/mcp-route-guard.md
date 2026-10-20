---
title: "CO-043 -- mcp-route-guard live utilization on OpenCode 1 and 2"
description: "This scenario validates mcp-route-guard for `CO-043`. It focuses on confirming that a native MCP call to a server the Code Mode manifest covers logs a WARN advisory on both OpenCode versions."
version: 1.0.0.0
---

# CO-043 -- mcp-route-guard live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-043`.

---

## 1. OVERVIEW

The `mcp-route-guard` plugin watches `tool.execute.before`. When the tool is a native MCP call to a server that the Code Mode manifest also covers, it logs a WARN advisory to `.skilled/logs/mcp-route-guard.log`. It never blocks the call.

### Why This Matters

A native MCP call returns its full payload into the model context, while the same server reached through Code Mode costs far less context. If the guard stops matching, operators lose the only signal that a cheaper route exists, and the session quietly pays the larger context cost. This scenario drives a stub server named `mobbin`, a manifest family, and checks the advisory on both versions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-043` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that a native MCP call to the `mobbin` stub returns `pong-stub` and logs `[mcp-route-guard] WARN: mcp-route-guard: native call to "mobbin"` on OpenCode 1 and OpenCode 2.
- Real user request: `When a session calls an MCP server natively that Code Mode could route instead, does the guard actually tell me, or does it stay quiet?`
- Prompt (v1): `Call the mobbin_ping tool and print its output, then reply DONE.`
- Prompt (v2): `Call the ping tool of the mobbin MCP server and print its output, then reply DONE.`
- Expected execution process: Register `plugin-utilization/mcp-stub.mjs` as `mobbin` through `CFG_EXTRA` in the version's config shape, run the matching prompt on each version with `AI_SESSION_CHILD=1`, and read the tool result and the new log line from the evidence.
- Expected signals: the tool returns `pong-stub`, and `effects.txt` shows `[mcp-route-guard] WARN: mcp-route-guard: native call to "mobbin" -- Code Mode can route this family via the "mobbin" manual`.
- Evidence requirements: Capture events, capture JSON, effects and exit for both versions, then read the tool result and the watchdog log line from those files.
- Desired user-visible outcome: A per-version verdict with the tool output and the advisory line.
- Pass/fail: PASS if the call returns `pong-stub` and the WARN line is appended on that version. FAIL if the call errors, the output differs, or no advisory is written.
- Failure triage: Confirm the stub path in `CFG_EXTRA` is absolute and that the config shape matches the version (`mcp` on v1, `mcp.servers` on v2). On v2 the model reaches the server through the Code Mode `execute` tool as `tools.mobbin.ping()`, so read the tool result from the `execute` call.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: resolve the absolute path of `plugin-utilization/mcp-stub.mjs` and confirm `.utcp_config.json` lists `mobbin` as a covered family.
2. v1 run: run the v1 prompt with `CFG_EXTRA` using the `mcp` shape and `AI_SESSION_CHILD=1`.
3. v1 check: read the `mobbin_ping` tool result and grep the effects file for the WARN line.
4. v2 run: run the v2 prompt with `CFG_EXTRA` using the `mcp.servers` shape and `AI_SESSION_CHILD=1`.
5. v2 check: read the `execute` tool result and grep the v2 effects file for the WARN line.
6. Cleanup: none; the stub exits with the session.

### Exact Command Sequence

```bash
export EVIDENCE_DIR=${EVIDENCE_DIR:-${TMPDIR:-/tmp}/plugin-utilization}
export REPO_ROOT="$(git rev-parse --show-toplevel)"
export STUB="$REPO_ROOT/.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/mcp-stub.mjs"
AI_SESSION_CHILD=1 CFG_EXTRA="{\"mcp\":{\"mobbin\":{\"type\":\"local\",\"command\":[\"node\",\"$STUB\"]}}}" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 mcp-route-guard "Call the mobbin_ping tool and print its output, then reply DONE."
AI_SESSION_CHILD=1 CFG_EXTRA="{\"mcp\":{\"servers\":{\"mobbin\":{\"type\":\"local\",\"command\":[\"node\",\"$STUB\"]}}}}" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 mcp-route-guard "Call the ping tool of the mobbin MCP server and print its output, then reply DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/mcp-route-guard.v1.events.jsonl"
grep -E '\[mcp-route-guard\] WARN: mcp-route-guard: native call to "mobbin"' "$EVIDENCE_DIR/mcp-route-guard.v1.effects.txt"
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/mcp-route-guard.v2.events.jsonl"
grep -E '\[mcp-route-guard\] WARN: mcp-route-guard: native call to "mobbin"' "$EVIDENCE_DIR/mcp-route-guard.v2.effects.txt"
cat "$EVIDENCE_DIR/mcp-route-guard.v1.exit" "$EVIDENCE_DIR/mcp-route-guard.v2.exit"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-043 | mcp-route-guard live utilization on OpenCode 1 and 2 | Confirm a native `mobbin` call logs the Code Mode advisory on both versions | `Call the mobbin_ping tool and print its output, then reply DONE.` on v1, `Call the ping tool of the mobbin MCP server and print its output, then reply DONE.` on v2 | 1. Resolve the stub path and register `mobbin` through `CFG_EXTRA` -> 2. Run `mcp-route-guard` on v1 -> 3. Read the tool result and WARN line -> 4. Run on v2 with the `mcp.servers` shape -> 5. Repeat both reads | Tool returns `pong-stub` and `[mcp-route-guard] WARN: mcp-route-guard: native call to "mobbin"` is appended | `mcp-route-guard.v1.txt`, `mcp-route-guard.v2.txt` | PASS if both the output and the WARN line appear on that version; FAIL if either is missing | Confirm the stub path is absolute and the `CFG_EXTRA` shape matches the version; on v2 read the `execute` call |

### Recorded Run (2026-10-20)

- v1: PASS. `mobbin_ping` returned `pong-stub` and `mcp-route-guard.log` gained the WARN line.
- v2: PASS. On v2 the model called the server through `execute` as `tools.mobbin.ping()`, returned `pong-stub`, and the WARN line was appended.
- Evidence: `mcp-route-guard.v1.txt` and `mcp-route-guard.v2.txt` under `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/mcp-route-guard.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/mcp-route-guard.js` | Plugin entry: `tool.execute.before` advisory for native MCP calls |
| `.opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` | Core manifest lookup and advisory writer |
| `.utcp_config.json` | Code Mode manifest that defines the covered `mobbin` family |
| `plugin-utilization/mcp-stub.mjs` | Stub MCP server registered as `mobbin` for the run |
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session per version and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-043
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/mcp-route-guard.md`
