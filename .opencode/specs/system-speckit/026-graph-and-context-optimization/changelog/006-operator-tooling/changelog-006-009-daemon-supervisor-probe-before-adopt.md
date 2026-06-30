---
title: "Changelog: Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it [006-operator-tooling/009-daemon-supervisor-probe-before-adopt]"
description: "Chronological changelog for the Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/009-daemon-supervisor-probe-before-adopt` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

The spec-memory daemon supervisor used to decide a released daemon was healthy from two cheap checks — the pid is alive (process.kill(pid,0)) and a socket file exists on disk. A daemon whose event loop is wedged passes both: it is still "alive" and still owns its listening socket, but it never services a request. The launcher would adopt it "instead of reaping" and bridge every client into a dead end, so memory_* calls returned ECONNREFUSED with no path to recovery — exactly the failure that pinned a real daemon at 120% CPU for four hours while every call failed. The supervisor can now tell the difference.

### Added

- Deep JSON-RPC liveness probe gate on the stale-reclaim adopt path in `mk-spec-memory-launcher.cjs`, so a live-but-wedged daemon is reaped and respawned instead of bridging clients into a dead end.
- SIGSTOP'd-daemon regression case in the daemon-reelection-adoption-live vitest, confirming a frozen process is reaped and replaced with the single-writer invariant intact.
- Probe-throw-as-not-alive safety: a thrown probe-infrastructure error now falls through to reap rather than aborting startup.

### Changed

- Root cause confirmed three ways before implementation: gpt-5.5 council investigation, direct source read, and live index DB corroboration.
- Stale-reclaim path now re-reads the lease under the respawn lock before spawning, closing a race where two concurrent launchers could both reap the same orphan.
- Existing `probeLeaseHolderWithRetries` primitive reused for the adopt gate rather than inventing a new liveness check.

### Fixed

- Liveness predicate corrected: pid-alive + socket-exists no longer implies healthy; a daemon that never services a request is now detected and reaped.
- Concurrent-launcher race on stale-lease snapshot: post-lock lease revalidation defers if the recorded childPid no longer matches, mirroring the guard the dead-socket respawn path already has.

### Verification

- node --check on the edited launcher - PASS
- probeLeaseHolderWithRetries exported + required - PASS (typeof === 'function')
- Pre-fix baseline (durability suite, stashed change) - PASS — 3/3 cases, 14.37s
- Post-fix durability suite - PASS — 4/4 cases, 26.40s (delta: +1 new case, 0 regressions)
- New hung-daemon case: SIGSTOP'd daemon reaped+respawned, single writer - PASS
- Re-run after review hardening (revalidation + throw-safety) - PASS — 4/4, 26.35s
- Adversarial review of the diff (gpt-5.5 xhigh) - 2 P1 + 3 P2; P1-001 + P2-002 fixed, rest documented
- Comment hygiene (no spec-path/packet-id in code comments) - PASS — durable WHY only

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Gate stale-reclaim adoption on a deep JSON-RPC probe; fall through to reap+respawn on a failed probe; re-validate the lease under the respawn lock; treat a probe throw as not-alive |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modified | Add a SIGSTOP'd-daemon regression case; thread an env override into startSession |

### Follow-Ups

- None.
