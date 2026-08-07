---
title: "Front-Proxy Recycle Hardening"
description: "Landed three defensive fixes for mk-spec-memory launcher and daemon recycle behavior: bounded cold-start attempts, retryable JSON-RPC fail-fast on unbridgeable lease-held sessions and lazy-init throws instead of daemon-killing process exits."
trigger_phrases:
  - "front proxy recycle hardening"
  - "mcp connecting forever"
  - "cold start timeout proxy"
  - "lease held fail fast"
  - "lazy init process exit daemon"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/018-front-proxy-recycle-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

This packet hardened three launcher and daemon recycle failure paths that could leave new sessions stuck at `connecting...` or kill the shared daemon. The session proxy cold-start wait is now bounded to 30 attempts by default with an environment override. Unbridgeable lease-held secondary sessions now emit a retryable JSON-RPC error instead of only plaintext diagnostics. Daemon lazy-init failures now throw to the caller and keep the shared daemon alive for retry.

Implementation and tests are complete in the packet artifacts. Deploy and post-deploy connectivity verification are still recorded as pending.

### Added

- Cold-start resolution tests for default attempts, environment override and invalid fallback.
- `resolveColdStartAttempts()` and testing export for the proxy cold-start bound.
- Retryable `-32001` JSON-RPC fail-fast behavior for unbridgeable lease-held sessions.

### Changed

- Proxy cold-start attempts default from 120 to 30, reducing the silent wait from about 176 seconds to about 41 seconds.
- Launcher main now captures the bridge or report decision and reports a structured retryable error for the report path.
- Daemon embedder init and API-key hard failures throw instead of calling `process.exit(1)`.
- API-key hard failure is tagged so the transient-error catch rethrows it.

### Fixed

- Long silent `connecting...` windows while a daemon is dead or slow to boot.
- Secondary sessions hanging when the launcher could not bridge to the lease holder.
- A bad first lazy-init call taking down the shared daemon for every client.

### Verification

| Check | Result |
|-------|--------|
| `.cjs` syntax checks | PASS. Implementation summary records `node --check` on both changed `.cjs` files |
| Build | PASS. `npm run build` exit 0 |
| Launcher, proxy and IPC bridge suite | PASS. 54 tests passed with 16 skipped |
| Proxy test file | PASS. 18 passed including 3 new cold-start cases |
| Deploy | Pending. Packet tasks record commit and supervised deploy still open |
| Post-deploy connectivity | Pending. Socket initialize probe and `memory_health` not recorded as complete |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modified | Bounded cold-start attempts, added environment override and exposed test helper |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Captured bridge decision and emitted retryable JSON-RPC error for unbridgeable report path |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Replaced lazy-init process exits with throws and tagged API-key hard failures |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts` | Modified | Added cold-start default, override and invalid fallback tests |

### Follow-Ups

- Commit and deploy through the supervised launcher restart plus daemon recycle path.
- Verify a new session connects and `memory_health` returns after deployment.
- Defect (c), owner socket-path storage for rare worktree environment divergence, remains deferred because it touches lease schema.
