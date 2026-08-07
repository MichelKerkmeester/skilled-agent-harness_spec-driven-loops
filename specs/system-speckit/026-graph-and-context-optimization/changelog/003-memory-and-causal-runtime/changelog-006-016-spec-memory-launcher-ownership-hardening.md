---
title: "Phase 016: Spec-memory launcher ownership hardening"
description: "Ported the code-index owner-lease pattern into mk-spec-memory: exclusive owner lease, unref'd heartbeat, fail-closed launch, reap-before-takeover and retryable JSON-RPC reporting. The launcher-lease suite passed 11 of 11."
trigger_phrases:
  - "spec-memory launcher ownership"
  - "spec memory owner lease heartbeat"
  - "mk-spec-memory dual owner fix"
  - "reap before takeover"
  - "launcher lease 11 of 11"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-05

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

This phase closes the residual mk-spec-memory ownership gap identified after phases 014 and 015. The launcher now uses an exclusive `.spec-memory-owner.json` owner lease, keeps live ownership fresh with an unref'd heartbeat, fails closed if it no longer owns the lease and reaps the recorded owner before dead-socket takeover. Report paths now emit retryable JSON-RPC instead of writing plaintext onto the MCP stream.

### Added

- Exclusive owner lease with atomic create, stale classification and re-read CAS for stale takeover.
- Periodic unref'd heartbeat refresh for the live launcher owner.
- `launchServer()` ownership recheck so an acquisition-race loser fails closed.
- Reap-before-takeover behavior for dead-socket respawn.
- Launcher-lease regressions for concurrent cold start, dead-socket reap and JSON-RPC report behavior.

### Changed

- mk-spec-memory now follows the owner-lease discipline already used by the code-index launcher.
- Report paths now send a retryable JSON-RPC error before any raw bridge output.
- Shutdown clears the heartbeat interval. The interval is unref'd so secondary/report processes do not hang.

### Fixed

- Concurrent cold starts no longer allow two mk-spec-memory launchers to both become owners and launch.
- Dead-socket takeover no longer races the recorded owner's scheduled relaunch without reaping it first.
- Boot-gap report paths no longer corrupt the MCP stream with plaintext `LEASE_HELD_BY` output.

### Verification

| Check | Result |
|-------|--------|
| `nested-changelog.js --json` draft | Ran and used as the starting draft |
| `launcher-lease.vitest.ts` | 11 of 11 passed, including the previously hanging cases |
| `node --check .opencode/bin/mk-spec-memory-launcher.cjs` | Clean |
| Heartbeat lifecycle inspection | Interval is started for the owner, unref'd and cleared on shutdown |
| Comment hygiene | Clean per packet artifacts |
| Live recycle | Not performed. Activation is on fresh launcher/session only |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Added owner lease, heartbeat refresh, fail-closed launch, reap-before-takeover and JSON-RPC report behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Added regressions for single-owner cold start, dead-socket owner reap and JSON-RPC reporting. |

### Follow-Ups

- Activate the launcher change on a fresh session or fresh launcher start.
- Accept the extreme simultaneous stale-start loser behavior as fail-fast for now. It self-heals on reconnect and avoids the prior dual-owner condition.
