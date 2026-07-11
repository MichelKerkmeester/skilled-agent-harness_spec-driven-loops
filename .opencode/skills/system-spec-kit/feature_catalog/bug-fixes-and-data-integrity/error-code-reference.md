---
title: "Error code reference (E429, -32001, -32002)"
description: "Unifies the scattered error-code mentions: E429 scan rate-limit, -32001 retryable recycle (STILL LIVE in the launcher proxy), and -32002 non-retryable protocol fail-closed, with retry semantics and source anchors for each."
trigger_phrases:
  - "error code reference"
  - "E429 rate limited"
  - "-32001 retryable recycle error"
  - "-32002 protocol mismatch"
  - "which mcp error codes are retryable"
version: 3.6.0.3
---

# Error code reference (E429, -32001, -32002)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Three error codes are easy to confuse because they come from different subsystems and have different retry semantics. This file unifies them into one reference so an operator debugging a failure can answer the only question that matters at the call site: is this safe to retry? `E429` is the index-scan rate-limit code from the handler envelope. `-32001` and `-32002` are JSON-RPC error codes emitted by the launcher's reconnecting session proxy during a daemon recycle.

The most important distinction: **`-32001` is retryable and still live**, while **`-32002` is non-retryable and tells the client to reconnect from scratch**.

---

## 2. HOW IT WORKS

### Error code table

| Code | Class | Retryable | Meaning | Where it comes from |
|------|-------|-----------|---------|---------------------|
| `E429` | Handler envelope (`RATE_LIMITED`) | Legacy / registered (not raised on the routine scan path) | **Legacy.** The `RATE_LIMITED: 'E429'` code is still registered, but the `memory_index_scan` lease/cooldown guard no longer rejects routine overlapping or too-soon scans with it. Instead, an overlapping or too-soon scan now coalesces onto the in-progress or recently completed scan and returns a `coalesced:true` SUCCESS envelope (`status: 'coalesced'`) carrying the `reason` (`lease_active` for an overlapping fresh scan, `cooldown` for too soon after a completed scan), `waitSeconds`, and `nextPollAfterMs`. | `lib/errors/core.ts` (`RATE_LIMITED: 'E429'`, registered); coalesced success returned by `handlers/memory-index.ts` via `lib/response/envelope.ts` |
| `-32001` | Launcher proxy (`RETRYABLE_RECYCLE_ERROR`, `{ retryable: true }`) | Yes — retry the request | The backend daemon recycled in place and an in-flight non-replayable request (or a reattach-budget exhaustion) could not be transparently replayed. The message is "backend recycled; retry". | `.opencode/bin/lib/launcher-session-proxy.cjs` (`RETRYABLE_RECYCLE_ERROR`) |
| `-32002` | Launcher proxy (`PROTOCOL_MISMATCH_ERROR`, `{ retryable: false }`) | No — reconnect from scratch | A re-handshaked backend negotiated a different protocol version than the client originally negotiated. The proxy fails closed (terminal `CLOSED` state) rather than serve a silently broken protocol contract. | `.opencode/bin/lib/launcher-session-proxy.cjs` (`PROTOCOL_MISMATCH_ERROR`) |

### Why -32001 is still live (and what changed)

`-32001` is the launcher session proxy's `RETRYABLE_RECYCLE_ERROR` and is the proxy's primary recycle signal. It is emitted for in-flight non-replayable requests during an in-place daemon recycle and when the reattach loop exhausts its attempt budget. It is NOT removed.

What changed historically is unrelated to the proxy: the index vector-drain *outage* path stopped surfacing its own `-32001`-class error. That is a different surface from the launcher proxy. The proxy's `-32001` remains the canonical "backend recycled; retry" contract, so any client retry logic keyed on `-32001` is still correct.

### How a client should handle each code

- **`E429`** (legacy): no longer raised on the routine scan path. A routine overlapping or too-soon scan returns a `coalesced:true` SUCCESS envelope instead — treat that success as "your scan joined the active/recent one"; if you need a fresh result, poll again after the returned `nextPollAfterMs`/`waitSeconds`. The lease/cooldown guard exists to prevent overlapping and crash-leftover scans.
- **`-32001`**: retry the same request. The recycle is transparent for replayable read-mostly tools (the proxy re-sends them automatically); for the rest, the client retries on this code.
- **`-32002`**: do not retry the request on the same session. Tear down and reconnect, which re-runs `initialize` against the new backend protocol version.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/lib/errors/core.ts` | `ErrorCodes.RATE_LIMITED = 'E429'` and the legacy error-code map |
| `mcp_server/handlers/memory-index.ts` | Raises `E429` with the computed wait time and `reason` (`lease_active` / `cooldown`) |
| `mcp_server/lib/response/envelope.ts` | Envelope helpers including the rate-limited (`E429`) response shape |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | `RETRYABLE_RECYCLE_ERROR` (-32001) and `PROTOCOL_MISMATCH_ERROR` (-32002) definitions and the fail-closed transition |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/recovery-hints.vitest.ts` | Automated test | Error-code recovery-hint mapping (incl. `E429`) |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Automated test | `E429` lease/cooldown rejection with wait time and reason |
| `mcp_server/tests/launcher-session-proxy.vitest.ts` | Automated test | `-32001` retryable recycle and `-32002` protocol fail-closed behavior |

---

## 4. SOURCE METADATA
- Group: Bug Fixes And Data Integrity
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `bug-fixes-and-data-integrity/error-code-reference.md`
Related references:
- [schema-version-history-v28-v30.md](schema-version-history-v28-v30.md) — Schema version history (v28 to v30)
- [../pipeline-architecture/mcp-launcher-front-proxy.md](../pipeline-architecture/mcp-launcher-front-proxy.md) — MCP launcher front-proxy
