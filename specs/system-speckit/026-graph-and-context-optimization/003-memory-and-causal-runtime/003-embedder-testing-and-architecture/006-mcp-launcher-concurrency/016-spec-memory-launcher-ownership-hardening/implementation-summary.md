---
title: "Implementation Summary: mk-spec-memory launcher-ownership hardening (O6)"
description: "Ported code-index's exclusive owner-lease + unref'd heartbeat refresh + reap-before-takeover + JSON-RPC report into mk-spec-memory-launcher.cjs (+312/-29). launcher-lease 11/11. Activates on a fresh session; no live recycle."
trigger_phrases:
  - "spec-memory launcher ownership implementation summary"
  - "o6 hardening done"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening"
    last_updated_at: "2026-06-05T08:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented + verified (11/11); heartbeat unref'd + clean lifecycle"
    next_safe_action: "Activates on fresh session; commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
---
# Implementation Summary: mk-spec-memory launcher-ownership hardening (O6)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Implemented + verified (11/11); activates on fresh session |
| **Date** | 2026-06-05 |
| **Built by** | gpt-5.5 worker (two passes) + orchestrator correction/verification |
| **Diff** | `mk-spec-memory-launcher.cjs` +312/-29; `launcher-lease.vitest.ts` regressions added |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
- Exclusive `.spec-memory-owner.json` owner lease: atomic `wx` create (no-lease), last-writer-wins reclaim with re-read CAS (stale), stale classification (dead-pid / ppid-1-orphan / stale-heartbeat>ttl*2), mirroring code-index 216-386.
- `refreshOwnerLeaseFile` + a periodic **unref'd** `setInterval` heartbeat for the live owner; the launcher self-shuts-down if a refresh fails (preserves single ownership). This closes the dual-daemon gap the first pass missed.
- `launchServer()` fail-closed: launches only if this launcher still owns the lease (catches the acquire-race loser).
- Dead-socket respawn: `reapOwnerBeforeRespawn` (SIGTERM→grace→SIGKILL) + exclusive owner-lease re-acquire before takeover (mirrors code-index 537-580).
- Report paths emit a retryable JSON-RPC error before any raw bridge write (no plaintext `LEASE_HELD_BY` on the MCP stream).
- `launcher-lease.vitest.ts` regressions: concurrent-cold-start single-owner; dead-socket takeover reaps the recorded owner; JSON-RPC from the legacy lease path.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
The user directed gpt-5.5 worker dispatch. A first pass added the owner-lease structure but missed the periodic heartbeat refresh (dual-daemon risk) and hung the secondary report paths (2 failing launcher-lease tests). The orchestrator caught both via diff review + an independent test run, re-dispatched a corrected pass scoped to exactly those two gaps, then verified launcher-lease 11/11, `node --check`, and the heartbeat lifecycle (unref'd interval + clearInterval on shutdown) first-hand. No live processes, sockets, or daemons were touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
### D-001: Owner = launcher pid (not daemon child)
Unlike code-index, the spec-memory launcher owns the scheduled relaunch timers, so the recorded owner is the launcher pid. Deliberate, clean port mapping.
### D-002: Unref'd heartbeat + self-shutdown
The heartbeat interval is `.unref()`-ed so it never keeps a secondary/report-path process alive (that was the first pass's hang). A live owner refreshes its lease; a failed refresh self-shuts-down the launcher so stale-heartbeat reclaim only ever targets a genuinely-gone owner.
### D-003: Two-pass correction
The first worker pass added the lease structure but missed the heartbeat refresh (dual-daemon risk) and hung secondary paths (2 failing tests). The orchestrator re-dispatched a corrected pass with those exact gaps; the result is 11/11.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
- `launcher-lease.vitest.ts`: **11/11 pass** (orchestrator-confirmed first-hand, not just worker-reported), incl. the two previously-hanging cases.
- `node --check .opencode/bin/mk-spec-memory-launcher.cjs`: clean.
- Heartbeat interval: declared, started for the owner, `clearInterval` on shutdown, `.unref?.()`.
- Comment hygiene clean; no live processes/sockets/daemons touched; no live recycle.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
- Activates on a fresh launcher/session only (a launcher `.cjs` change is not transparently hot-swappable); no live recycle was performed.
- Extreme simultaneous cold-start on a stale lease leaves the losing launcher to exit without bridging to the winner (fail-fast; self-heals on reconnect) rather than bridging — acceptable; far better than the prior dual-owner behavior.
<!-- /ANCHOR:limitations -->
