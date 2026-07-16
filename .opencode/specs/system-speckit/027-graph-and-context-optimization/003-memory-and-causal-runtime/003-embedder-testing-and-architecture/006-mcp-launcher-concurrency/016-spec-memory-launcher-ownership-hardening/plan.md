---
title: "Implementation Plan: mk-spec-memory launcher-ownership hardening (O6)"
description: "Plan for porting code-index's owner-lease + heartbeat + reap discipline to mk-spec-memory-launcher.cjs."
trigger_phrases:
  - "spec-memory launcher ownership plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening"
    last_updated_at: "2026-06-05T08:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored alongside implementation"
    next_safe_action: "Activates on fresh session; commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
---
# Implementation Plan: mk-spec-memory launcher-ownership hardening (O6)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Port code-index's exclusive owner-lease (`.spec-memory-owner.json`) with stale classification, a periodic unref'd heartbeat refresh, fail-closed `launchServer()`, and reap-before-takeover into mk-spec-memory-launcher.cjs; emit a retryable JSON-RPC error on report paths. Implemented by a gpt-5.5 worker (two passes — the first missed the heartbeat refresh + hung secondary paths), corrected + verified by the orchestrator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- `launcher-lease.vitest.ts` all-green (11/11), incl. concurrent-cold-start single-owner, dead-socket reap, JSON-RPC report.
- `node --check` clean; comment hygiene clean.
- Heartbeat interval unref'd + cleared on shutdown; secondary/report paths exit (no hang).
- Single-session behavior unchanged.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The supervising launcher pid (not the daemon child) is the recorded owner because it owns the scheduled relaunch timers. Acquisition is an atomic `wx` create for the no-lease case + a last-writer-wins reclaim with re-read CAS for the stale case; `launchServer()` re-checks ownership so the acquire-race loser fails closed. A live owner keeps its lease fresh via an unref'd `setInterval` heartbeat and self-shuts-down if a refresh fails, so a stale-heartbeat reclaim only ever targets a genuinely-gone owner.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase A — owner-lease infra
Port readOwnerLeaseFile/writeOwnerLeaseFile(+Exclusive)/buildOwnerLease/classifyOwnerLease/acquireOwnerLeaseFile/ownsOwnerLeaseFile/clear* from code-index 216-386.
### Phase B — heartbeat + fail-closed + reap
refreshOwnerLeaseFile + unref'd heartbeat interval (self-shutdown on failure); launchServer() fail-closed; reapOwnerBeforeRespawn + re-acquire before takeover (mirror code-index 537-580).
### Phase C — report path
JSON-RPC retryable error before any raw bridge write (no plaintext LEASE_HELD_BY on the MCP stream).
### Phase D — tests + verify
launcher-lease regressions; iterate to 11/11; node --check; hygiene.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`launcher-lease.vitest.ts` spawns isolated launchers in per-test temp roots (own SPECKIT_IPC_SOCKET_DIR), never the live daemon — safe to run. Assert: exactly one owner under concurrent cold start; dead-socket takeover reaps the recorded owner; report paths emit JSON-RPC + the launcher exits.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- code-index's launcher (reference pattern).
- Activation depends on a fresh launcher/session (no live recycle).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git checkout` mk-spec-memory-launcher.cjs + launcher-lease.vitest.ts to restore prior behavior. Change is additive (new owner lease + heartbeat); not yet live (fresh-session activation), so rollback before a fresh session is risk-free.
<!-- /ANCHOR:rollback -->
