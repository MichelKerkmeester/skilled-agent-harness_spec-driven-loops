---
title: "Implementation Summary: Liveness-probe-before-bridge + reap-aware respawn (F3′)"
description: "Implemented. Application-level JSON-RPC initialize handshake probe before bridging, reap-before-respawn off the phase-006 childPid lease, and a cross-process wx single-winner respawn across both launchers + the socket-server. Headless-verified (node --check + tsc + probe 4/4) and twice adversarially reviewed; 3 review-found defects fixed. Live kill/wedge/reconnect deferred."
trigger_phrases:
  - "bridge liveness summary F3 implemented"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/007-bridge-liveness-reap"
    last_updated_at: "2026-05-28T23:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented probe+reap+single-winner; 3 review defects fixed; probe 4/4 green"
    next_safe_action: "Run live concurrent-launcher + kill/wedge/reconnect validation on a daemon"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000714"
      session_id: "007-007-impl-summary"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-bridge-liveness-reap |
| **Completed** | 2026-05-28 (implemented + headless-verified; live kill/wedge/reconnect + concurrent race deferred) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The forced-reconnect loop is ended: a reconnect after a daemon death or wedge now lands on a fresh, healthy daemon instead of bridging into a dead/wedged socket.

### Liveness-probe bridge + reap-aware respawn (implemented)

Before bridging, the launcher runs an **application-level** handshake — `probeDaemon` opens a throwaway connection and sends a newline-delimited JSON-RPC `initialize` request, resolving ALIVE on the first matching-id reply (result OR error) within ~2500ms and DEAD on timeout/connection-error/early-close. An OOM-wedged daemon that accepts at libuv but never services JSON-RPC is therefore classified dead, not bridged into. `maybeBridgeLeaseHolder` is now async and returns a `{bridge|respawn|report}` verdict. On a confirmed-dead socket the launcher reaps the recorded daemon childPid (phase-006 lease) — `processLiveness` gate, then SIGTERM the child + `reapProcessTreeGroups` for the sidecar, 7000ms grace (>5000 shutdown deadline), then SIGKILL — and respawns exactly one fresh daemon behind the bootstrap lock + an exclusive `wx` single-winner lock (with stale-lock reclaim). Both launchers await the async decision with a running-child duplicate-spawn guard; `tcp://` EADDRINUSE gets a bounded retry/fallback.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | `probeDaemon` JSON-RPC handshake; async verdict-based `maybeBridgeLeaseHolder` replacing the existsSync gate |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | dead-socket respawn (gated on childPid lease); reap-before-respawn; bootstrap + `wx` single-winner with stale-lock reclaim; running-child relaunch guard (`shouldSkipLaunch`) |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | await async bridge decision; reuse its existing `wx` owner-lease + post-lock recheck; `use strict` |
| `mcp_server/lib/ipc/socket-server.ts` | Modify | bounded `tcp://` EADDRINUSE retry/fallback (UNIX unlink-relisten path intact) |
| `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Create | 4 headless fake-socket probe tests (alive/wedged/connection-error/respawn-verdict) |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Modify | +2 regression tests (`shouldSkipLaunch`, `isRespawnLockStale`) for the review-found fixes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-opencode` dispatch (`openai/gpt-5.5 --variant high`, main-tree under an RM-8 L1 fence) once phase 006 shipped the childPid lease. The dispatch self-corrected one single-winner race (a queued launcher acting on a stale verdict → added a post-lock lease recheck). The orchestrator ran independent verification (node --check ×3, tsc build, probe 4/4, F1 regression intact) and a 6-lens adversarial review, which confirmed the happy-path bridge + probe are correct but found **3 real defects** in the new launcher code: (P0) a one-shot duplicate-spawn flag (`launchStarted`) that permanently disabled F1's crash-loop relaunch; (P1) a respawn `wx`-lock with no stale reclaim → a SIGKILL'd launcher would permanently wedge all future respawns; (P2) the bootstrap lockdir lacked the same reclaim. The orchestrator fixed all three (running-child relaunch guard; pid-liveness + age stale-lock reclaim mirroring mk-code-index's self-heal), added regression tests, and ran a focused re-review — 0 confirmed defects. Optional `socketReadyAt` (REQ-007) was skipped (the probe does not depend on it). Live kill/wedge/reconnect + concurrent-launcher race (SC-001/SC-002) need a running daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Application-level JSON-RPC handshake, not raw socket accept | libuv accepts connections even when the JS event loop is blocked in a native run (the OOM-wedge case), so accept-success ≠ alive |
| Reap-before-respawn + exclusive `wx` lock | Respawning over a wedged daemon doubles native RSS / splits the DB; the `wx` lock serializes two racing launcher processes (an in-process flag cannot) |
| Gate on phase 006 | The reap needs the daemon CHILD pid; today's lease records only the launcher pid |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` (bridge + both launchers) | PASS ×3 |
| `npm run build --workspace=@spec-kit/mcp-server` (tsc) | PASS |
| `vitest run launcher-ipc-bridge-probe` (alive/wedged/connection-error/respawn-verdict) | PASS (4/4) |
| `vitest run launcher-watchdog` (F1 regression + 2 new fix tests) | PASS (14/14) |
| 6-lens adversarial review (happy-path, probe, reap, single-winner, async-guard, socket-server) | PASS — happy-path/probe clean; 3 defects found (P0 relaunch regression, P1/P2 lock wedge) |
| Defect fixes + focused re-review | PASS — 0 confirmed defects (relaunch guard + stale-lock reclaim) |
| `validate.sh --strict` on this packet | PASS |
| SC-001/SC-002 live kill/wedge/reconnect + concurrent race + tcp respawn | DEFERRED — needs a running daemon |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live verification deferred** — kill/wedge/reconnect, concurrent-launcher race (REQ-003/004), and live `tcp://` respawn (REQ-005) need a running daemon; only headless fake-socket probe coverage + adversarial code review exist now (T011/T012).
2. **Optional `socketReadyAt` marker (REQ-007) not added** — the probe does not depend on it; a slow cold start is already mitigated by the probe's reply timeout (false-dead degrades to the next launcher re-probing).
3. **Respawn-lock pid-reuse residual** — the stale-lock reclaim uses pid-liveness + a 60s age backstop; a SIGKILL'd holder self-heals on the next launcher, but a reused pid within the window is theoretically possible (bounded by the bootstrap-lock serialization).
<!-- /ANCHOR:limitations -->
