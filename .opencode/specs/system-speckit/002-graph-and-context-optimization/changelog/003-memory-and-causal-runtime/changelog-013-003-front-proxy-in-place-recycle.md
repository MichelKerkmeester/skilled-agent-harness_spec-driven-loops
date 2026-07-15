---
title: "013/003 MCP Front-Proxy: launcher-as-reconnecting-frame-proxy + in-place daemon recycle"
description: "The MCP daemon RSS-recycled via process.exit(0), severing the client with no reconnect. This makes the launcher a frame-aware reconnecting proxy and recycles the daemon child in place, so an RSS recycle mid-request no longer breaks the client. In-flight read + idempotent-write requests are replayed transparently."
trigger_phrases:
  - "mcp front-proxy in-place recycle changelog"
  - "launcher reconnecting frame proxy"
  - "transparent reconnect rss recycle"
  - "createSessionProxy backend-only daemon"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy` (Level 3, base implementation)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation`

### Summary

Shipped and deployed the MCP front-proxy (item "E", Phases 1-5). The daemon RSS-recycled under load via `process.exit(0)`, which exited the launcher OpenCode spawned as the MCP command — severing the client stdio pipe with no transparent reconnect (observed live as `mk_*` servers dropping + launcher pid churn). This makes the launcher stay alive as a **frame-aware reconnecting proxy** that owns the client MCP session, and recycles the daemon **child in place**, so an RSS recycle mid-request no longer breaks the client. In-flight read and idempotent-write requests are replayed across the recycle; in-flight non-idempotent writes get a single retryable error instead of a double-apply or a dead pipe.

### Added

- `launcher-session-proxy.cjs` — the reconnect engine: frame splitter, `pendingRequests` tracking, cached-`initialize` replay on reattach, an idempotency classifier (default-deny for unsafe tools), ~10s keepalive, backpressure handling, bounded reattach, and an idle-monitor `REATTACHING` grace.
- `SPECKIT_BACKEND_ONLY=1` gate in `context-server.ts` that skips the stdio transport (the daemon serves only its IPC socket; the launcher owns client stdio and bridges to it).
- `launcher-session-proxy.vitest.ts` — 9 unit tests incl. recycle replay, backpressure, and a keepalive-collision regression.

### Changed

- `recycleViaGracefulSelfExit` → `recycleDaemonInPlace` in `mk-spec-memory-launcher.cjs` (both `process.exit(0)` calls deleted); the launcher spawns the daemon with `SPECKIT_BACKEND_ONLY=1` and runs `createSessionProxy` in `main()`.
- `lib/ipc/launcher-idle-timeout.ts`: a `REATTACHING` grace (require two zero-checks) so the idle monitor cannot evict a fresh daemon during a reconnect gap.

### Fixed

- **Drain-flag P0**: the backpressure `'drain'` wait was bound to a now-discarded socket and could never reset the flag, leaving the next socket's pump blocked forever — reset `socketDrainWaiting` (and drop the listener) in `detachSocket`.
- **Keepalive id-collision P0**: the private keepalive ping used a normal JSON-RPC id that could collide with a client id and swallow a real response — reserve the `__launcher_session_proxy_keepalive__` id prefix and reject client requests using it (`-32600`).

### Verification

- 9/9 unit tests; a 4-lens review + an Opus re-review.
- **Isolated live single-recycle proof**: daemon stays alive, launcher pid stable, one in-flight request survived a recycle transparently (DB + socket isolated to a worktree, never touching production).
- A 5-iteration adversarial deep-research pass gated the merge and surfaced the keepalive-collision P0 (fixed before merge).

### Files Changed

| File | Change |
|------|--------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Create — reconnect engine |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify — in-place recycle + SPECKIT_BACKEND_ONLY spawn + session proxy |
| `mcp_server/context-server.ts` | Modify — SPECKIT_BACKEND_ONLY stdio gate |
| `mcp_server/lib/ipc/launcher-idle-timeout.ts` | Modify — REATTACHING grace |
| `mcp_server/tests/launcher-session-proxy.vitest.ts` | Create — 9 unit tests |

### Follow-Ups

- The reconnect-transparency follow-ups (#1 protocol-drift fail-closed re-handshake, #2 multi-client transparency for 2nd+ sessions) shipped separately — see `changelog-013-003-front-proxy-reconnect-hardening.md`.
