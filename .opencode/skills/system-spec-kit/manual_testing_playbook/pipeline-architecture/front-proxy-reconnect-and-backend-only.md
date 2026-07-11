---
title: "EX-040 -- MCP front-proxy reconnect, SPECKIT_BACKEND_ONLY, and -32002 vs -32001"
description: "This scenario validates the MCP front-proxy reconnect contract for `EX-040`. It focuses on transparent backend RSS-recycle (-32001 retryable-recycle), SPECKIT_BACKEND_ONLY backend mode, and the -32002 fail-closed protocol-mismatch terminal reconnect."
version: 3.6.0.2
---

# EX-040 -- MCP front-proxy reconnect, SPECKIT_BACKEND_ONLY, and -32002 vs -32001

## 1. OVERVIEW

This scenario validates the MCP front-proxy reconnect contract for `EX-040`. The launcher front-proxy (`.opencode/bin/lib/launcher-session-proxy.cjs`, bridged by `bridgeStdioThroughSessionProxy` in `.opencode/bin/mk-spec-memory-launcher.cjs`) sits between an MCP client and the long-lived memory backend. When the backend recycles (for example on an RSS-driven restart), the proxy reattaches transparently so the client's session survives. When the backend's protocol version changes, the proxy fails closed and requires a client reconnect.

The two behaviors are distinguished by two JSON-RPC error codes with deliberately opposite semantics:

- **`-32001` `RETRYABLE_RECYCLE_ERROR`** — `{retryable: true}`, "backend recycled; retry". This is the LIVE retryable-recycle code: the proxy uses it to signal a transient backend recycle that the reattach loop handles transparently. It is NOT removed; only the index vector-drain outage path stopped surfacing its own `-32001` class, while the launcher's `-32001` recycle code is unchanged.
- **`-32002` `PROTOCOL_MISMATCH_ERROR`** — `{retryable: false}`, "backend protocol version changed; client reconnect required". This is non-retryable: the reattach loop transitions to a terminal `CLOSED` state and does not retry a version-mismatched backend.

`SPECKIT_BACKEND_ONLY=1` runs the memory server in backend mode: it skips connecting its own stdio transport so the front-proxy owns the client-facing transport instead.

The user-observable value is session resilience: a backend recycle is invisible to the client, while a true protocol drift fails fast with a clear reconnect signal rather than serving a mismatched backend.

---

## 2. SCENARIO CONTRACT

- Objective: Verify transparent RSS-recycle, SPECKIT_BACKEND_ONLY backend mode, and the -32002 vs -32001 semantics.
- Real user request: `My memory daemon restarts itself sometimes. Does my MCP session survive, and how do I tell a normal recycle from a version mismatch?`
- Prompt: `Validate the front-proxy reconnect contract: confirm a backend recycle is transparent via -32001 retryable-recycle, SPECKIT_BACKEND_ONLY=1 puts the server in backend mode behind the proxy, and a protocol-version mismatch fails closed with -32002 (terminal CLOSED, non-retryable). Return a concise pass/fail verdict with cited error codes.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: a backend recycle reattaches transparently (`-32001` retryable-recycle, `retryable:true`); `SPECKIT_BACKEND_ONLY=1` makes the server skip its own stdio transport; a protocol-version mismatch surfaces `-32002` (`retryable:false`) and the proxy state goes terminal `CLOSED`.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if a recycle is transparent via `-32001`, backend-only mode behaves as documented, and a protocol mismatch fails closed via `-32002`.

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline-architecture validation operator, validate transparent backend recycle against the launcher front-proxy. Verify that when the backend recycles, the proxy reattaches and the client session survives, and that the retryable-recycle path uses -32001 with retryable:true. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Review the proxy error contract in `.opencode/bin/lib/launcher-session-proxy.cjs` (`RETRYABLE_RECYCLE_ERROR`, code `-32001`, `retryable:true`).
2. Drive an MCP session through the front-proxy and induce a backend recycle (RSS-driven restart) in a sandbox.
3. Confirm the proxy state transitions `REATTACHING` -> `CONNECTED` and the client session continues without a surfaced fatal error.

### Expected

The backend recycle is transparent: the reattach loop reconnects, the proxy returns to `CONNECTED`, and the retryable-recycle code is `-32001` with `retryable:true`. The `-32001` code is live, not removed.

### Evidence

Source contract review output:

```text
27: const RETRYABLE_RECYCLE_ERROR = Object.freeze({
28:   code: -32001,
29:   message: 'backend recycled; retry',
30:   data: { retryable: true },
31: });
```

Sandbox front-proxy transcript:

```text
CASE recycle start
RECYCLE_OUTPUT {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2025-06-18","serverInfo":{"name":"recycle-gen1","version":"1"},"capabilities":{}}}
RECYCLE_PROXY_LOG backend socket close; reattaching
RECYCLE_OUTPUT {"jsonrpc":"2.0","id":2,"error":{"code":-32001,"message":"backend recycled; retry","data":{"retryable":true}}}
RECYCLE_OUTPUT {"jsonrpc":"2.0","id":3,"result":{"backend":"recycle-gen2","method":"ping","tool":null}}
RECYCLE_OBSERVED transition=REATTACHING->CONNECTED retryableCode=-32001 retryable=true replayBackend=recycle-gen2 logs=["backend socket close; reattaching"]
```

### Pass / Fail

- **PASS**: the recycle reattached transparently and `-32001` carried `retryable:true`.

### Failure Triage

Inspect `RETRYABLE_RECYCLE_ERROR` and the `reattach()` loop in `.opencode/bin/lib/launcher-session-proxy.cjs` if a recycle surfaces a fatal error to the client.

---

### Prompt

```
As a pipeline-architecture validation operator, validate SPECKIT_BACKEND_ONLY backend mode against the memory server started with SPECKIT_BACKEND_ONLY=1. Verify the server does not connect its own stdio transport so the front-proxy owns the client-facing transport. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Start the memory server with `SPECKIT_BACKEND_ONLY=1` in a sandbox.
2. Confirm the server skips `new StdioServerTransport()` / `server.connect(transport)` (backend mode), per `mcp_server/context-server.ts`.
3. Confirm the front-proxy owns the client-facing transport instead.

### Expected

With `SPECKIT_BACKEND_ONLY=1`, `backendOnly` is true and the server does NOT connect its own stdio transport; the front-proxy bridges the client. With the flag absent or not `'1'`, the server connects its own stdio transport as before.

### Evidence

Source contract review output:

```text
2457:   const backendOnly = process.env.SPECKIT_BACKEND_ONLY === '1';
2458:   if (!backendOnly) {
2459:     transportConnectedAt = new Date().toISOString();
2460:     transport = new StdioServerTransport();
2461:     await server.connect(transport);
2462:   }
2470:     stdin: backendOnly ? null : undefined,
2484:   console.error(backendOnly
2485:     ? '[context-server] Context MCP server running on IPC socket only'
2486:     : '[context-server] Context MCP server running on stdio and IPC socket');
```

Blocked startup step:

```text
The command "Start the memory server with `SPECKIT_BACKEND_ONLY=1` in a sandbox" was not run because this task's BANNED OPERATIONS say: "Do NOT modify, create, or delete any file OTHER than the single scenario file named below." Starting the full memory server can create runtime database, lock, socket, and/or log artifacts, so the backend-only startup transcript precondition is missing under the current run constraints.
```

### Pass / Fail

- **BLOCKED**: the full backend-only startup command could not be run without violating the single-file write constraint; source inspection confirms the branch but no startup transcript was produced.

### Failure Triage

Inspect the `SPECKIT_BACKEND_ONLY` branch in `mcp_server/context-server.ts` (around the `backendOnly` guard) if the server still connects its own transport under the flag.

---

### Prompt

```
As a pipeline-architecture validation operator, validate fail-closed protocol-mismatch reconnect against the launcher front-proxy. Verify that a backend protocol-version change surfaces -32002 (retryable:false) and the proxy state goes terminal CLOSED rather than retrying the version-mismatched backend. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Review the proxy error contract in `.opencode/bin/lib/launcher-session-proxy.cjs` (`PROTOCOL_MISMATCH_ERROR`, code `-32002`, `retryable:false`).
2. Induce a protocol-version drift between the proxy and a sandbox backend.
3. Confirm the proxy surfaces `-32002` and transitions to terminal `CLOSED` (the reattach loop does not retry).

### Expected

A protocol-version mismatch surfaces `-32002` with `retryable:false` ("client reconnect required"); the proxy state becomes terminal `CLOSED` and the reattach loop does not retry the version-mismatched backend. This is the fail-closed path, distinct from the transparent `-32001` recycle.

### Evidence

Source contract review output:

```text
32: const PROTOCOL_MISMATCH_ERROR = Object.freeze({
33:   code: -32002,
34:   message: 'backend protocol version changed; client reconnect required',
35:   data: { retryable: false },
36: });
679:     const expectedProtocolVersion = tracker.getNegotiatedProtocolVersion();
680:     if (handshake.handshakeObserved
681:         && expectedProtocolVersion !== null
682:         && (handshake.protocolVersion ?? null) !== expectedProtocolVersion) {
687:       log(`backend protocol version drift: expected ${expectedProtocolVersion}, got ${handshake.protocolVersion ?? 'none'}; failing closed`);
689:       state = 'CLOSED';
690:       failPendingAndEndProtocolMismatch();
```

Sandbox front-proxy transcript:

```text
CASE protocol-mismatch start
MISMATCH_OUTPUT {"jsonrpc":"2.0","id":10,"result":{"protocolVersion":"2025-06-18","serverInfo":{"name":"mismatch-gen1","version":"1"},"capabilities":{}}}
MISMATCH_PROXY_LOG backend socket close; reattaching
MISMATCH_PROXY_LOG backend protocol version drift: expected 2025-06-18, got 2099-01-01; failing closed
MISMATCH_OUTPUT {"jsonrpc":"2.0","id":11,"error":{"code":-32002,"message":"backend protocol version changed; client reconnect required","data":{"retryable":false}}}
MISMATCH_OBSERVED terminal=CLOSED code=-32002 retryable=false logs=["backend socket close; reattaching","backend protocol version drift: expected 2025-06-18, got 2099-01-01; failing closed"]
```

### Pass / Fail

- **PASS**: a protocol mismatch surfaced `-32002` (`retryable:false`) and the proxy went terminal `CLOSED`.

### Failure Triage

Inspect `PROTOCOL_MISMATCH_ERROR` and the terminal-`CLOSED` branch (the "must not retry a version-mismatched backend" guard) in `.opencode/bin/lib/launcher-session-proxy.cjs` if a version mismatch is retried instead of failing closed.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Front-proxy: `.opencode/bin/lib/launcher-session-proxy.cjs` (`RETRYABLE_RECYCLE_ERROR` -32001, `PROTOCOL_MISMATCH_ERROR` -32002, reattach loop, terminal CLOSED)
- Proxy bridge: `.opencode/bin/mk-spec-memory-launcher.cjs` (`bridgeStdioThroughSessionProxy`)
- Backend-only mode: `mcp_server/context-server.ts` (`SPECKIT_BACKEND_ONLY` guard)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: EX-040
- Canonical root source: `manual_testing_playbook.md`
- Source anchors read: `.opencode/bin/lib/launcher-session-proxy.cjs` (`RETRYABLE_RECYCLE_ERROR` code -32001 L18-22, `PROTOCOL_MISMATCH_ERROR` code -32002 L23-26, terminal `CLOSED` guard L617-620); `.opencode/bin/mk-spec-memory-launcher.cjs` (`bridgeStdioThroughSessionProxy` L198); `mcp_server/context-server.ts` (`SPECKIT_BACKEND_ONLY` read L2126)
- Accuracy note: `-32001` is the LIVE retryable-recycle code (not removed); `-32002` is the terminal fail-closed protocol-mismatch code.
- Feature file path: `pipeline-architecture/front-proxy-reconnect-and-backend-only.md`
- Destructive: No — sandbox-only recycle/drift injection; no production data touched.
- Runtime policy: Real execution only; no mocked proxy.
