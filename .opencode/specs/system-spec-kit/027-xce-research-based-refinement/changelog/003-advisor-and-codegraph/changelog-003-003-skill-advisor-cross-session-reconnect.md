---
title: "Skill-Advisor Cross-Session Reconnect: Owner-Lease and Reconnecting Proxy"
description: "The mk-skill-advisor launcher gained the owner-lease plus reconnecting session proxy that the spec-memory and code-index launchers already had, and now acts on a dead-socket respawn decision (reap and replace under a bootstrap lock) instead of only reporting it."
trigger_phrases:
  - "003/003 skill advisor cross session reconnect changelog"
  - "advisor owner lease reconnecting proxy"
  - "dead socket respawn adopt or reap"
  - "027 003/003 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The skill-advisor launcher was the odd one out of the three daemon launchers. The spec-memory and code-index launchers had reached a resilience bar in 026 and 027 — an owner lease and a reconnecting session proxy so a second session bridges the warm daemon instead of spawning a duplicate writer — but the advisor launcher's lease check only reported that a lease was held and did nothing about a dead socket. This phase brought it up to parity. A second session now bridges the live daemon through the session proxy, and a dead-socket respawn decision is acted on: the launcher reaps the dead owner and respawns a replacement under a bootstrap lock, rather than leaving the session stranded or starting a second writer.

### Added

- None. The resilience behavior is added to the existing launcher and shared bridge.

### Changed

- `bin/mk-skill-advisor-launcher.cjs` — owner-lease acquisition, reconnecting session proxy, and acting on the dead-socket respawn decision (reap dead owner, wait for exit, adopt-or-reap, respawn under a bootstrap lock)
- `bin/lib/launcher-session-proxy.cjs` — shared session-proxy bridge wired for the advisor launcher

### Fixed

- Deep-review remediation brought the advisor launcher to B-parity with the spec-memory launcher: dead-socket respawn plus adopt-or-reap, closing the gap where the prior code only reported a held lease.

### Verification

| Check | Result |
|-------|--------|
| Deep review | resolved after B-parity launcher-resilience remediation |
| Reconnect and respawn | PASS against sandboxed sockets with a short `SPECKIT_IPC_SOCKET_DIR`, never the host advisor daemon |
| Single-writer invariant | PASS: a second session bridges the live daemon, a dead owner is reaped and replaced under the bootstrap lock |
| Live adoption | DEFERRED: the running launchers hold the prior `.cjs` in memory, so the fix activates only on a fresh session |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modified |

### Follow-Ups

- Live adoption requires a fresh session (operator-gated), since the running launcher process keeps the pre-fix `.cjs` resident.
