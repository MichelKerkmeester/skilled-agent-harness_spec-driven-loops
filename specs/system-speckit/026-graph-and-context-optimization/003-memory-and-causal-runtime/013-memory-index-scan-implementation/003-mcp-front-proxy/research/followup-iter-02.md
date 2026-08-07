# Follow-up Design Iteration 02: Multi-client Proxy Routing

## Current Gap

The primary launcher uses `createSessionProxy()` after it spawns the backend daemon (`mk-spec-memory-launcher.cjs:973-979`). Second and later launchers never reach that branch. They detect an active lease (`mk-spec-memory-launcher.cjs:933-938`), call `bridgeOrReportLeaseHeld()`, and then `maybeBridgeLeaseHolder()` starts the bridge after a successful deep probe (`launcher-ipc-bridge.cjs:337-356`).

The raw bridge (`launcher-ipc-bridge.cjs:79-121`) creates one socket and pipes stdin/stdout directly. It closes and exits on backend socket close or error. A daemon recycle therefore still severs the second client's MCP pipe.

## Options

| Option | Description | Pros | Cons |
|---|---|---|---|
| A. Change `bridgeStdioToSocket()` globally | Replace raw pipe behavior with reconnect-aware proxy behavior in `launcher-ipc-bridge.cjs`. | One shared behavior for all bridge users. | Changes code-index and skill-advisor bridge semantics without proving they have replay-safe tool classifiers. Too broad. |
| B. Add a proxy bridge injection in `mk-spec-memory-launcher.cjs` | Keep shared bridge helper raw by default, but pass a `bridge` override that starts `createSessionProxy()`. | Minimal and scoped to the server with the existing proxy classifier. Keeps other launchers stable. | Requires `maybeBridgeLeaseHolder()` to tolerate a bridge function that is not a `net.Socket` raw bridge. |
| C. Make the lease holder proxy all secondary clients centrally | Keep second launchers raw, but make the lease holder's IPC socket server reconnect-aware. | Secondary clients reconnect without extra launcher proxy state. | Wrong ownership: the lease holder only sees daemon-side IPC sockets, not client stdio lifecycle. It would still lose per-client cached initialize state on daemon recycle. |

## Recommended Approach

Use option B. Inject a reconnecting bridge only from `mk-spec-memory-launcher.cjs`.

Concrete changes:

| File | Change |
|---|---|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs:350-355` | Wrap bridge invocation with `await Promise.resolve(bridgeToSocket(socketPath, options))` because `maybeBridgeLeaseHolder()` is already async. Preserve existing behavior for raw synchronous `bridgeStdioToSocket()`. |
| `.opencode/bin/mk-spec-memory-launcher.cjs:407-414` | Pass a `bridge` override into `maybeBridgeLeaseHolder()` for `mk-spec-memory` only. The override creates `createSessionProxy({ socketPath, stdin: process.stdin, stdout: process.stdout, log })` and starts it. |
| `.opencode/bin/mk-spec-memory-launcher.cjs:407-419` | Keep respawn decision handling unchanged. If `maybeBridgeLeaseHolder()` returns `{ action: 'respawn' }`, continue to `respawnAfterDeadSocket()`. Only the action=`bridge` path changes. |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs:304-356` | Keep the liveness probe before bridge start. The proxy can probe again during `start()`, but the first probe preserves the existing dead-socket respawn decision. |

Proxy bridge sketch:

```js
function bridgeStdioThroughSessionProxy(socketPath, bridgeOptions = {}) {
  const proxy = createSessionProxy({
    socketPath,
    stdin: process.stdin,
    stdout: process.stdout,
    log,
  });
  return proxy.start().catch((error) => {
    bridgeOptions.onError?.(error);
    throw error;
  });
}
```

The design intentionally creates one proxy per bridged launcher process. `createSessionProxy()` owns a single `clientSplitter`, `backendSplitter`, `pendingRequests`, `queuedClientFrames`, and cached initialize frame (`launcher-session-proxy.cjs:271-313`). Those are per-client session state. Sharing them across multiple bridged clients would allow one client's JSON-RPC ID to clear another client's pending request.

## Lease And Handshake Interaction

The lease handshake is only a process ownership decision. It should not inject frames into the MCP stream except for legacy diagnostics when bridge mode is disabled or unavailable. On a healthy socket, `maybeBridgeLeaseHolder()` should continue to log to stderr and then hand stdin/stdout to the bridge.

The proxy's cached-initialize replay works for secondary clients because the daemon IPC server creates a distinct MCP server for every socket (`context-server.ts:2100-2106`, `socket-server.ts:157-160`). The second launcher proxy's first client initialize is forwarded normally. After a daemon recycle, `attachFreshSocket()` calls `internalHandshake()` with that cached initialize before replaying safe pending requests (`launcher-session-proxy.cjs:551-568`). That re-establishes the backend-side MCP session for that one client before its pending requests resume.

## Back-compat With Client Configs

No client config changes are needed. The command remains `.opencode/bin/mk-spec-memory-launcher.cjs`; stdin/stdout remain the client transport. This preserves OpenCode, Claude/Codex-style MCP, Gemini, and manual launcher invocations that already point at the launcher command. The implementation is an internal bridge routing change after the same lease check.

## Risks

| Risk | Mitigation |
|---|---|
| Bridge override starts asynchronously and `maybeBridgeLeaseHolder()` returns too early. | Await `Promise.resolve(bridgeToSocket(...))` in `maybeBridgeLeaseHolder()`. `createSessionProxy.start()` returns after initial attach, while stdin listeners/timers keep the process alive. |
| Diagnostics leak into stdout after the MCP stream begins. | Keep `onError` diagnostic only for startup failure before any client frames are processed. Prefer JSON-RPC error output from the proxy once the proxy owns stdout. |
| Secondary proxy cannot respawn a dead lease holder after it dies completely. | Accept this as unchanged ownership: second launchers should not become daemon owners mid-stream. The goal is transparent recycle while the lease holder respawns its backend child. |
| Other launchers accidentally inherit replay semantics. | Do not change shared default bridge behavior. Only `mk-spec-memory-launcher.cjs` passes the proxy bridge override. |

## Test Strategy

1. Add a unit test in `launcher-ipc-bridge-probe.vitest.ts` proving `maybeBridgeLeaseHolder()` awaits an async bridge override and returns `{ action: 'bridge' }` only after it is invoked.
2. Add a launcher-level unit test around `bridgeOrReportLeaseHeld()` with an injected fake `maybeBridgeLeaseHolder()` or fake bridge to prove `mk-spec-memory` passes the proxy bridge override.
3. Add a session-proxy behavior test in `launcher-session-proxy.vitest.ts`: second-client proxy receives initialize, backend socket closes, new socket replies to internal initialize, pending `memory_search` is replayed.
4. Keep existing raw bridge tests for `launcher-ipc-bridge.cjs:79-121` to prove code-index and skill-advisor default behavior remains unchanged.
