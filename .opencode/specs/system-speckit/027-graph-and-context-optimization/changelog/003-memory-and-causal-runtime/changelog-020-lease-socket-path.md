---
title: "Lease Socket-Path Persistence"
description: "mk-spec-memory leases now record the daemon owner's actual IPC socket path and the shared launcher bridge prefers it over the env recompute, closing the worktree-env SPECKIT_IPC_SOCKET_DIR divergence deferred from packet 018. Additive and optional, so other launchers are unaffected."
trigger_phrases:
  - "lease socket path persistence"
  - "no-bridge-socket worktree divergence fix"
  - "prefer stored socket path bridge"
  - "ipc socket dir mismatch lease"
  - "020-lease-socket-path"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/020-lease-socket-path` (Level 2)

### Summary

A secondary `mk-spec-memory` launcher running under a different `SPECKIT_IPC_SOCKET_DIR` than the live daemon used to recompute a socket path the owner never opened, fail `fs.existsSync`, and report `no-bridge-socket`, even though the daemon was alive and reachable. This closed defect (c), deferred as a follow-up in packet 018 (front-proxy recycle hardening).

The lease now carries the owner's actual IPC socket path, and the shared launcher bridge prefers it, so a divergent-env secondary connects to the real daemon instead of giving up. The schema change is additive and optional. Leases that predate the field, and the skill-advisor and code-index leases that never carry it, fall back to the existing env recompute unchanged. Committed as `1f1e52ca8e`.

### Added

- `socketPath` field on `mk-spec-memory` leases, emitted by `buildLeaseObject` only when a non-empty string is supplied, the same additive guard style as the existing `childPid`/`modelServerPid` fields.
- 5 Vitest unit tests in `launcher-ipc-bridge-probe.vitest.ts` covering emit/omit, bridge prefer, recompute fallback, and the no-bridge-socket branch.

### Changed

- `buildLeaseObject` in `model-server-supervision.cjs` accepts and emits the optional additive `socketPath`.
- `mk-spec-memory-launcher.cjs` passes the owner's resolved `resolveSessionProxySocketPath()` into the lease, and `leaseHeldFromFile` surfaces `lease.socketPath` (normalized to `null` when absent) onto the lease-result object.
- `maybeBridgeLeaseHolder` in `launcher-ipc-bridge.cjs` now prefers `leaseResult.socketPath` when it is a non-empty string and either a `tcp://` endpoint or an on-disk UDS path, falling back to the original `getIpcSocketPath(...)` recompute otherwise.

### Fixed

- The `no-bridge-socket` false report when a divergent-env secondary launcher recomputed a socket path the owner was not listening on. The bridge now uses the owner's stored path, so the secondary reaches the live daemon.

### Verification

| Check | Result |
|-------|--------|
| `node --check` on all three `.cjs` files | PASS (all syntax OK) |
| `npm test` over launcher-lease through launcher-session-proxy suites | PASS (34 passed, 16 pre-existing flake skips) |
| New socketPath suite (5 tests) | PASS (emit/omit plus bridge prefer/fallback/no-bridge-socket) |
| skill-advisor and code-index unaffected | PASS (no-socketPath lease stays on recompute, their leases never carry the field) |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/bin/lib/model-server-supervision.cjs` | `buildLeaseObject` accepts and emits the optional additive `socketPath` |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Wrapper and `writeLeaseFile` store the owner's socket path, and `leaseHeldFromFile` surfaces it |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | `maybeBridgeLeaseHolder` prefers a usable stored path, falls back to recompute |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | 5 unit tests for emit/omit plus bridge prefer/fallback/no-bridge-socket |

### Follow-Ups

- Activation is lazy. The fix activates on the next `mk-spec-memory` launcher spawn (no daemon recycle required), so a fully-divergent already-running secondary does not benefit until it next writes or reads a lease.
- The stored path is point-in-time. If the owner relocates its socket after writing the lease without rewriting it, the path can go stale, and the `fs.existsSync` guard catches this and falls back to recompute.
- The recorded 34 passed and 16 skipped is the at-ship snapshot. Packet 024 later un-skipped the launcher-lease integration suite, so a current re-run of these named suites reports 43 passed and 8 skipped.
