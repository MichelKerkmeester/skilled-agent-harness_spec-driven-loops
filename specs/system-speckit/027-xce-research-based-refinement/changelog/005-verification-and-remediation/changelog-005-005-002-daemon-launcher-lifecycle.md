---
title: "Daemon Launcher and Lifecycle Remediation"
description: "All 15 daemon-launcher and lifecycle findings from the fresh-regression deep-review fixed across eight source files, including the Round-2-confirmed bootstrap-lock reclaim P1. Verified entirely in an isolated fake-root harness with no live daemon recycled."
trigger_phrases:
  - "005/005/002 daemon launcher remediation changelog"
  - "bootstrap lock pid reclaim fix"
  - "owner lease cas reclaim launchers"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-16

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/002-daemon-launcher-lifecycle` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation`

### Summary

This sub-phase fixed all 15 daemon-launcher and lifecycle findings across eight source files. Every finding was confirmed real on opening the cited code (none refuted) and each fix mirrors the named correct sibling pattern. Everything was verified via vitest in the isolated fake-root harness, with no live daemon recycled or killed.

### Added

- Six new and extended launcher suites: `launcher-code-index-lifecycle`, `launcher-spec-memory-lifecycle`, `launcher-code-index-signal-mirror`, `model-server-respawn-lock-atomic`, `orphan-sweeper-ipc-preserve` (spec-kit) and `launcher-reap-pid-reuse` (skill-advisor).
- A replica-isolation case in `fanout-run.vitest.ts` and a probe-at-cap case in `ipc-client-cap-fanout-stress.vitest.ts`.
- Testability exports (`configureLauncherPathsForTesting` plus the bootstrap-lock, owner-lease and reap helpers) and a sourcing guard on the orphan sweeper so its predicate can be unit-tested with a stubbed lsof.

### Changed

- Owner-lease stale reclaim now uses an atomic compare-and-swap (unlink then exclusive create) across all three launchers, so an EEXIST loser returns acquired false and can never delete the winner's lease.
- Reap safety gates: a heartbeat-fresh live owner is no longer reaped on a socket-probe-only verdict, the live pid's executable basename is checked against the lease before SIGKILL, and the reclaimed orphan daemon is reaped under the bootstrap lock before a successor spawns.
- Signal and escalation correctness: a launcher removes its own handler before re-raising so catchable signals mirror as 128+n, and heartbeat self-shutdown escalates SIGTERM then wait then SIGKILL.

### Fixed

- Dead-socket respawn wedge: bootstrap lock now stamps `owner.pid` at mkdir and reclaims the instant the owner is dead, closing the TTL(300s) over deadline(120s) gap that blocked respawn (Round-2 confirmed P1, spec-memory and code-index).
- Socket-server now answers liveness probes at the client cap without occupying a durable slot.
- Orphan sweeper preserves a live re-elected daemon that holds more than one daemon-ipc.sock FD.
- Fanout-run comment corrected so `SPECKIT_*_STATE_DIR` reads as detection-only, with replica isolation coming from the unique lineage label.

### Verification

| Check | Result |
|-------|--------|
| Launcher gate after change | 154 pass / 0 fail / 8 skipped (20 files) |
| skill-advisor deterministic subset | 27 pass |
| fanout-run / ipc cap-stress | 19 pass (+1 replica isolation) / 3 pass (+1 probe at cap) |
| Per-file syntax | `node --check` green on all four .cjs; `tsc -p` exit 0 (socket-server.ts); `bash -n` green on the sweeper |
| Live daemon | None recycled or killed (fake-root harness only) |
| Pre-existing flaky live-spawn suites | Unchanged at baseline (launcher-lease, orphan-reaping race) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Bootstrap-lock reclaim, owner-lease CAS, reap and retry gates |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Bootstrap-lock reclaim, orphan reap before respawn, signal mirror |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Owner-lease CAS, pid-reuse reap guard, heartbeat escalation |
| `lib/model-server-supervision.cjs` | Modified | Atomic rename-claim on respawn lock reclaim |
| `shared/ipc/socket-server.ts` | Modified | Answer liveness probes at the client cap |
| `scripts/orphan-mcp-sweeper.sh` | Modified | Preserve a live multi-FD daemon; add sourcing guard |
| `deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Detection-only comment fix plus replica-isolation test |

### Follow-Ups

- The optional owner-lease helper hoist to `.opencode/bin/lib` was deferred as an anti-drift follow-up (the CAS block is an identical short patch in three files today).
- Two pre-existing flaky live-spawn suites remain flaky and are orthogonal to this work.
