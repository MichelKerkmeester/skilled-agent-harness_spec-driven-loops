---
title: "424 -- MCP Code Index Reconnecting Proxy"
description: "Manual check for the automated-test-backed mk-code-index launcher proxy that bridges stdio through a shared session socket and classifies frames so the code-index client can survive daemon recycles."
---

# 424 -- MCP Code Index Reconnecting Proxy

## 1. OVERVIEW

This scenario verifies that the mk-code-index launcher bridges its stdio through a shared session proxy and classifies protocol frames, giving the code-index client a reconnecting transport instead of a raw pass-through pipe. Before this, the mk-code-index launcher used a bare bridge with no reconnect, so a daemon recycle or owner disposal silently dropped the code-index transport with no recovery, unlike the mk-spec-memory front-proxy.

The check is automated-test-backed. A human runs the launcher syntax check, the code-index proxy unit suite, and a grep that proves the session-proxy bridge and the frame classifier are defined and wired into the launcher transport. Together they confirm the launcher routes stdio through the reconnecting proxy and understands the frames it forwards.

## 2. SCENARIO CONTRACT

- Objective: Confirm the mk-code-index launcher bridges stdio through a shared session proxy and classifies frames so the transport can reconnect across daemon recycles.
- Real user request: `mk-code-index keeps dropping after a recycle while mk-spec-memory survives. Does the code-index launcher have the same reconnecting proxy now?`
- Prompt: `Validate the mk-code-index reconnecting proxy and confirm stdio is bridged through the session proxy with frame classification.`
- Expected execution process: Run the launcher syntax check, run the code-index proxy unit tests, and grep for the session-proxy bridge and the frame classifier to confirm they are defined and wired into the transport path.
- Expected signals: `node --check` exits cleanly for the launcher; `launcher-code-index-proxy.vitest.ts` passes including the bridge and frame-classification cases; `bridgeStdioThroughSessionProxy` and `classifyCodeIndexFrame` appear at their definitions and at the transport call site.
- Desired user-visible outcome: The code-index client keeps its transport across daemon recycles and owner-session churn instead of silently disconnecting.
- Pass/fail: PASS only when syntax, unit tests, and proxy wiring all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
Validate the mk-code-index reconnecting proxy and confirm stdio is bridged through the session proxy with frame classification.
```

### Commands

1. `node --check .opencode/bin/mk-code-index-launcher.cjs`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-code-index-proxy.vitest.ts`
3. `rg -n "bridgeStdioThroughSessionProxy|classifyCodeIndexFrame" .opencode/bin/mk-code-index-launcher.cjs`

### Expected

- Command 1 exits with no syntax errors.
- Command 2 passes the code-index proxy suite, including the stdio-bridge case and the frame-classification case.
- Command 3 shows `bridgeStdioThroughSessionProxy` and `classifyCodeIndexFrame` at their definitions and at the transport call site that bridges stdio and classifies forwarded frames.

### Evidence

Shell transcript for all commands: the `node --check` exit status, the vitest pass summary for `tests/launcher-code-index-proxy.vitest.ts`, and the grep output showing the session-proxy bridge, the frame classifier, and the transport call site that wires them together.

### Pass / Fail

- **Pass**: the syntax check passes, the code-index proxy suite passes, and both the session-proxy bridge and the frame classifier are defined and wired into the transport path.
- **Fail**: the syntax check fails, any bridge or frame-classification case fails, or either helper is missing from the grep output or is not wired into the transport path.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the bridge case fails, confirm the launcher routes stdio through the session proxy rather than a raw pass-through pipe. If the frame-classification case fails, compare the classifier output against the expected frame types it forwards. If grep cannot find the helpers, confirm both the definitions and the transport call site exist.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/mcp-code-index-reconnecting-proxy.md](../../feature_catalog/14--pipeline-architecture/mcp-code-index-reconnecting-proxy.md)
- Spec packet: [../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy/implementation-summary.md](../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy/implementation-summary.md)

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 424
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/mcp-code-index-reconnecting-proxy.md`
