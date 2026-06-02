---
title: "Implementation Summary"
description: "MCP front-proxy shipped and deployed: the launcher stays alive as a frame-aware reconnecting proxy and recycles the daemon in place, so an RSS recycle mid-request no longer breaks the client. The reconnect-transparency follow-ups (#1 protocol-drift fail-closed, #2 multi-client) shipped after the base."
trigger_phrases:
  - "mcp front proxy implementation summary"
  - "mcp front proxy phase status"
  - "in-place recycle progress"
  - "transparent reconnect implementation state"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy"
    last_updated_at: "2026-06-02T10:03:31Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Front-proxy in-place recycle + #1/#2 reconnect hardening shipped and deployed to main"
    next_safe_action: "None binding; deployed to main, daemon RSS-recycle now transparent for all sessions"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - "mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-front-proxy-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mcp-front-proxy |
| **Completed** | 2026-06-02 - shipped and deployed to main |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The MCP front-proxy: the launcher stays alive as a frame-aware reconnecting proxy that owns the client MCP session, and recycles the daemon child in place rather than exiting. An RSS recycle mid-request no longer breaks the client — in-flight read and idempotent-write requests are replayed across the recycle, and an in-flight non-idempotent write gets a single retryable error instead of a double-apply or a dead pipe. The base (item "E", Phases 1-5) shipped first; the two reconnect-transparency follow-ups (#1 protocol-drift fail-closed, #2 multi-client) shipped after it.

### Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Packet setup (docs + metadata) | Done |
| Phase 1 | In-place daemon recycle (delete launcher self-exit) | Done (shipped) |
| Phase 2 | Launcher frame-proxy topology (own client stdio over the socket) | Done (shipped) |
| Phase 3 | Transparent reconnect engine (cached initialize, frame parse, replay) | Done (shipped) |
| Phase 4 | Idle-monitor fix + safety hardening (keepalive, classifier, crash-loop bound) | Done (shipped) |
| Phase 5 | Flip default + live RSS-recycle proof + gate | Done (shipped + deployed) |
| Follow-up #1 | Protocol-drift fail-closed re-handshake (-32002, CLOSED state) | Done (deployed) |
| Follow-up #2 | Multi-client transparency for 2nd+ sessions (bridgeStdioThroughSessionProxy) | Done (deployed) |

### In-place daemon recycle

`recycleViaGracefulSelfExit` was renamed to `recycleDaemonInPlace`; both `process.exit(0)` calls were deleted and the recycle path no longer sets `launcherShutdownInProgress`, so the existing child-exit supervisor respawns the daemon while the launcher and the client pipe stay up. A forced recycle keeps the launcher pid, respawns the daemon child, and re-binds the socket.

### Launcher frame-proxy topology

The daemon child stdio is off the MCP channel and its primary `StdioServerTransport` is gated behind `SPECKIT_BACKEND_ONLY`; the launcher runs a proxy on its own `stdin`/`stdout` that probes the daemon to readiness before flushing client frames. The MCP session flows through the launcher over the socket with no client config change.

### Transparent reconnect engine

`launcher-session-proxy.cjs` is the reconnect engine: a bidirectional newline-frame splitter, a `pendingRequests` map, a `cachedInitialize` captured by method, a `CONNECTED -> REATTACHING -> CONNECTED` state machine, a `probeDaemon` readiness gate, and replay. A recycle mid-request resolves a read-class request transparently or returns a single retryable error for an unsafe write.

### Idle-monitor fix + safety hardening

The backend keepalive, a `REATTACHING` grace in `getActiveClientCount`, the idempotency `classify` (default-deny), and a bounded reattach window all landed. Two P0s were caught and fixed before merge: a drain-flag bound to a discarded socket (reset in `detachSocket`) and a keepalive id-collision (reserved `__launcher_session_proxy_keepalive__` id prefix). The idle monitor cannot fire during a reconnect.

### Reconnect-transparency follow-ups (#1, #2)

#1 caches the negotiated `protocolVersion` at first initialize and fails closed (`-32002`, terminal `CLOSED`) if a mid-session backend build-swap negotiates a different version, instead of silently serving a mismatch. #2 routes 2nd+ (non-lease-holder) sessions through a per-client `createSessionProxy` (`bridgeStdioThroughSessionProxy`) so they reconnect transparently too. Combined with the primary reconnect, a recycle no longer produces a visible MCP disconnect for any session.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The base shipped as five gated phases run by cli-opencode (`openai/gpt-5.5-fast`) inside a git worktree, each gated by typecheck (0 new errors) + core tests (green) before the next, landing after `002-checkpoint-v2-file-snapshot` (both edit `context-server.ts`). A 5-iteration adversarial deep-research pass gated the merge and surfaced the keepalive id-collision P0 (fixed before merge). The proof was an isolated live single-recycle test on a throwaway launcher + daemon (DB and socket isolated to a worktree, never touching production): a read-class request transparently survived the recycle with the launcher pid unchanged and the daemon pid changed. The base merged to main; the daemon was rebuilt and restarted. The #1/#2 follow-ups are launcher `.cjs` changes (hot-loaded at launcher start, no dist build), designed in a 5-iteration deep-research pass, adversarially reviewed (3-lens Opus, no P0/P1), merged to main, and deployed by restarting the launcher — verified live when a concurrent session's launcher reconnected through the new multi-client bridge.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Launcher-as-proxy over standalone-proxy and bridge-reconnect | Moving the `command` to a standalone proxy orphans the launcher (nothing self-respawns an exited launcher); the launcher must stay the `command`, taking only the transparency engine from bridge-reconnect. |
| In-place daemon recycle over launcher self-exit | Deleting the two `process.exit(0)` calls lets the existing child-exit supervisor respawn the daemon while the launcher and client pipe stay up. |
| Frame-aware bidirectional parsing + idempotency classifier | Byte-level piping leaks truncated frames to the client, and replay-all double-applies non-idempotent writes; frame parsing plus default-deny replay is the load-bearing safety boundary. |
| Fail closed on protocol-version drift (#1) | A mid-session backend build-swap could negotiate a different protocol version; serving it silently is unsafe, so a mismatch returns a non-retryable `-32002` and a terminal `CLOSED` state rather than spinning the reattach loop. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS |
| `validate.sh --strict` on this packet | PASS |
| Base: launcher unit tests (`launcher-session-proxy.vitest.ts`) | 9/9 green |
| Base: 4-lens review + Opus re-review | No P0/P1 (2 P0s found and fixed pre-merge) |
| Base: isolated live single-recycle proof (throwaway launcher + daemon) | PASS - in-flight request survived transparently |
| Base: 5-iteration adversarial deep-research gate | PASS - surfaced keepalive-collision P0 (fixed) |
| #1/#2: launcher vitest suites | 35/35 green on branch and re-confirmed on main |
| #1/#2: adversarial 3-lens Opus review | SAFE - 2 P2 observations, no P0/P1 |
| Deployed to main | Base + #1/#2 merged; daemon rebuilt/restarted; launcher restarted; live multi-client reconnect confirmed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Daemon still RSS-recycles at ~1 GB.** This is the unchanged memory-pressure design; the change makes the recycle transparent rather than a visible drop.
2. **Versionless-handshake tradeoff (#1 P2).** When no protocol version was ever negotiated, the re-handshake preserves prior behavior rather than enforcing a version — a documented, deferred tradeoff.
3. **Just-died-daemon exit-code nuance (#2 P2).** A rare exit-code parity nuance when a daemon dies at the instant of reattach remains deferred and non-blocking.
<!-- /ANCHOR:limitations -->
