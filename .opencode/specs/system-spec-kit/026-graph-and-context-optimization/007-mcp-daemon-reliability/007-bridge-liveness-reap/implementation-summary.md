---
title: "Implementation Summary: Liveness-probe-before-bridge + reap-aware respawn (F3′)"
description: "Implementation pending. This packet is the implementation-ready, Opus-verified spec for an application-level handshake probe before bridging plus a reap-before-respawn path; gated on phase 006's child-pid lease."
trigger_phrases:
  - "bridge liveness summary F3 pending"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/007-bridge-liveness-reap"
    last_updated_at: "2026-05-28T21:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Spec/plan/tasks authored + Opus-verified; deferred (gated on phase 006)"
    next_safe_action: "Implement after phase 006 child-pid lease; verify with kill/wedge/reconnect cycles"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000714"
      session_id: "007-007-impl-summary"
      parent_session_id: null
    completion_pct: 50
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
| **Completed** | Pending (spec ready; implementation deferred) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is specified and adversarially verified, not yet implemented. When built, it ends the forced-reconnect loop: a reconnect after a daemon death or wedge will land on a fresh, healthy daemon instead of bridging into a dead socket.

### Liveness-probe bridge + reap-aware respawn (planned)

Before bridging, the launcher will run an **application-level** handshake (a minimal JSON-RPC request on a throwaway connection, expecting a valid reply within a bound) — so an OOM-wedged daemon that still accepts at the socket layer but never services JSON-RPC is classified dead rather than bridged into. On a confirmed-dead socket it reaps the recorded daemon child pid (the lease field phase 006 adds), then respawns exactly one fresh daemon behind an exclusive `wx` single-winner lock so two racing launchers cannot both spawn. Both launchers' call sites await the now-async bridge decision with a duplicate-spawn guard, and `tcp://` EADDRINUSE is handled.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Pending | See spec.md §3 for the planned edit set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Deferred: this phase is gated on phase 006 (the reap needs the daemon child pid in the lease + a ported `processLiveness`), and verification needs live kill/wedge/reconnect cycles. The design was produced by an Opus pass (which stubbed this fix) and the gaps were caught by a second Opus adversarial pass — its verdict supplied the content now encoded here: the cross-process `wx` single-winner (an in-process flag is insufficient), the concrete application-level handshake (raw accept mis-classifies a wedged daemon), reap-before-respawn, and the phase-006 gate.
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
| Opus design + adversarial verification | PASS (design stubbed; verdict supplied the cross-process lock + handshake + reap content — now encoded) |
| Planned test commands (when implemented) | `vitest` dead-socket + OOM-wedged-daemon reconnect + concurrent-launcher race tests; `bash .../validate.sh --strict` on this packet |
| Implementation + tests | Pending (gated on phase 006; live-daemon verification) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented** — spec/plan/tasks only; gated on phase 006's child-pid lease.
2. **Verification needs a live daemon** (kill/wedge/reconnect + concurrent-launcher race) and cannot be confirmed headlessly.
<!-- /ANCHOR:limitations -->
