---
title: "013/003 Front-Proxy Reconnect Hardening: protocol-drift fail-closed (#1) + multi-client transparency (#2)"
description: "Two front-proxy follow-ups: a fail-closed protocol-version re-handshake guard and per-client createSessionProxy bridging so 2nd+ MCP sessions reconnect transparently across a daemon recycle. Launcher .cjs only; deployed via launcher restart."
trigger_phrases:
  - "front-proxy reconnect hardening changelog"
  - "protocol-drift fail-closed re-handshake"
  - "multi-client reconnect transparency"
  - "launcher session proxy bridge"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy` (Level 3, follow-ups)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation`

### Summary

Shipped and **deployed** the two reconnect-transparency follow-ups of the merged MCP front-proxy work, designed in a 5-iteration deep-research pass and adversarially reviewed (3-lens Opus, no P0/P1). **#1 protocol-drift**: the launcher's internal re-handshake matched only the initialize-reply id, so a mid-session backend build-swap could silently serve a different negotiated protocol version. **#2 multi-client**: only the lease-holder (primary) session reconnected transparently across a daemon recycle; 2nd+ sessions used the raw bridge and severed. These are launcher `.cjs` changes (loaded at launcher start, no dist build), deployed by restarting the launcher — verified live when a concurrent session's launcher reconnected through the new bridge.

### Added

- `bridgeStdioThroughSessionProxy` in `mk-spec-memory-launcher.cjs` — routes the secondary (non-lease-holder) launcher's client stdio through a per-client `createSessionProxy` (its own pendingRequests + cached-initialize state); injected only for `mk-spec-memory` (code-index and skill-advisor keep the raw bridge default).
- A terminal `CLOSED` state + `PROTOCOL_MISMATCH_ERROR` (`-32002`, non-retryable) in `launcher-session-proxy.cjs`; the negotiated `protocolVersion` is cached at first initialize and compared on every internal re-handshake.
- vitest: same-version re-handshake replays a pending request; different-version and missing-version re-handshakes fail closed (`-32002`, EOF); async-bridge-is-awaited; proxy-bridge factory wiring. 35/35 launcher suites.

### Changed

- `launcher-ipc-bridge.cjs`: `maybeBridgeLeaseHolder` now awaits the (possibly async) injected bridge before reporting the bridge decision; the raw bridge's fire-and-forget timing is preserved via `Promise.resolve`.
- `launcher-session-proxy.cjs`: `internalHandshake` returns `{residual, protocolVersion, handshakeObserved}`; `attachFreshSocket` fails closed and sets `CLOSED` on a version mismatch so the reattach loop cannot spin on a mismatched backend.

### Fixed

- **#1**: a backend build-swap mid-session now fails closed (non-retryable error + EOF) instead of silently serving a mismatched protocol; preserves prior behavior when no version was ever negotiated.
- **#2**: 2nd+ MCP sessions now reconnect transparently across a daemon recycle (previously severed). Combined with the already-live primary reconnect (E), a recycle no longer produces a visible MCP disconnect for any session.

### Verification

- 35/35 launcher vitest pass on the branch and re-confirmed on main; `node --check` clean on all three `.cjs`.
- Adversarial 3-lens Opus review (state-machine, regression, lifecycle): verdict SAFE, only 2 P2 observations (a documented versionless-handshake tradeoff and a rare just-died-daemon exit-code nuance).
- **Deployed**: merged to main (launcher `.cjs`, no dist build), launcher restarted; a concurrent session's launcher reconnected through the new multi-client bridge — live proof #2 works.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modify — protocol-version cache + fail-closed re-handshake + CLOSED terminal state (#1) |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify — await injected async bridge in maybeBridgeLeaseHolder (#2) |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify — bridgeStdioThroughSessionProxy factory, injected for mk-spec-memory (#2) |
| `mcp_server/tests/launcher-session-proxy.vitest.ts` (+ launcher-ipc-bridge-probe, launcher-watchdog) | Extend — +6 cases |

### Follow-Ups

- The daemon still RSS-recycles at ~1 GB (memory-pressure design, unchanged); recycles are now transparent rather than visible drops. The two P2 review observations (versionless-handshake enforcement, just-died-daemon exit-code parity) remain deferred and non-blocking.
