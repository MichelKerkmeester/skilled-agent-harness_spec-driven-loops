---
title: "Feature Specification: mk-spec-memory launcher-ownership hardening (O6)"
description: "Port code-index's exclusive owner-lease + heartbeat + reap-before-takeover discipline to mk-spec-memory-launcher.cjs, closing the O6 residual risks (duplicate owner on concurrent cold start, dead-socket respawn race, boot-gap plaintext stream corruption). Activates on a fresh session; no live recycle."
trigger_phrases:
  - "spec-memory launcher ownership hardening"
  - "o6 owner lease reap heartbeat"
  - "mk-spec-memory dual owner fix"
  - "launcher-lease regression"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening"
    last_updated_at: "2026-06-05T08:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Ported owner-lease + heartbeat + reap; launcher-lease 11/11 green"
    next_safe_action: "Activates on fresh session; commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
---
# Feature Specification: mk-spec-memory launcher-ownership hardening (O6)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Implements the O6 follow-up recommended in `015-socket-server-reconvergence-and-hardening/o6-spec-memory-ownership-findings.md`: mk-spec-memory had the canonical IPC bridge (015) + probe-marker (014) but lacked the exclusive owner-lease discipline code-index/advisor already have.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented + verified (11/11); activates on fresh session |
| **Created** | 2026-06-05 |
| **Branch** | `main` |
| **Parent Arc** | 006-mcp-launcher-concurrency |
| **Predecessor** | `015` (research O6); `014` (probe/bridge fix) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Under concurrent multi-session use mk-spec-memory could (O6-1) form a duplicate owner/daemon on concurrent cold start (lease checked before the bootstrap lock; a loser could skip the lock and both write a self-owned lease + launch); (O6-2) race a secondary's dead-socket respawn against the owner's scheduled relaunch (no reap of the recorded owner, no lease revalidation in launchServer()); and (O6-3) corrupt a client's MCP stream during the owner boot gap with a plaintext `LEASE_HELD_BY` line. code-index already solved all three with an exclusive owner lease + heartbeat + reap.

### Purpose
Port code-index's proven ownership discipline to mk-spec-memory-launcher.cjs so exactly one owner exists, takeover reaps the prior owner, and report paths emit a retryable JSON-RPC error (never raw plaintext) — without changing single-session behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Exclusive `.spec-memory-owner.json` owner lease: atomic `wx` create, stale classification (dead-pid / ppid-1-orphan / stale-heartbeat), acquire with re-read CAS.
- A periodic heartbeat refresh (`refreshOwnerLeaseFile` on an **unref'd** `setInterval`) so a live owner's lease never goes stale (prevents dual-daemon); the launcher self-shuts-down if a refresh fails.
- `launchServer()` fail-closed: launch only if this launcher still owns the lease.
- Dead-socket respawn: reap the recorded owner (SIGTERM→grace→SIGKILL) + re-acquire the owner lease exclusively before takeover.
- Report paths emit a retryable JSON-RPC error before any raw bridge path (no plaintext on the MCP stream).
- Regression tests in `launcher-lease.vitest.ts` (concurrent cold start → one owner; dead-socket takeover reaps the recorded owner; JSON-RPC from the legacy lease path).

### Out of Scope
- Switching the recorded owner to the daemon child (kept as the LAUNCHER pid, which owns the relaunch timers — deliberate port difference from code-index).
- Live deploy/recycle: a launcher `.cjs` change activates on a fresh session only.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | O6-1 single owner | concurrent cold start yields exactly one owner-lease holder; the other fails-closed at launchServer |
| REQ-002 | O6-1 no stale-reclaim of a live owner | a live owner refreshes its heartbeat (unref'd interval); classifyOwnerLease never reclaims a live, heart-beating owner |
| REQ-003 | O6-2 reap before takeover | dead-socket respawn reaps the recorded owner + re-acquires the lease exclusively before launching |
| REQ-004 | O6-3 no plaintext stream corruption | report paths emit a retryable JSON-RPC error before any raw bridge write |
| REQ-005 | Verified | `launcher-lease` suite all-green; `node --check` clean; comment hygiene clean; secondary/report paths exit (no hang) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `launcher-lease.vitest.ts` passes 11/11 (incl. concurrent-cold-start single-owner + dead-socket reap + JSON-RPC report).
- **SC-002**: `node --check` clean; heartbeat interval is unref'd + cleared on shutdown; no secondary/report path hangs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Launcher concurrency change wedges all sessions | High | Ported a proven pattern (code-index); 11/11 regression incl. the prior hang cases; fail-closed launchServer; activates on fresh session (reviewable before broad use) |
| Risk | Extreme simultaneous cold-start on a stale lease | Low | Both fail-closed at launchServer (only the file owner launches); self-heals on reconnect |
| Dependency | Activates only on a fresh launcher/session | Delayed effect | Documented; no live recycle performed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The extreme simultaneous-cold-start-on-stale-lease edge leaves the losing launcher to exit without bridging (fail-fast, self-heals on reconnect) rather than bridging to the winner; acceptable for now.
<!-- /ANCHOR:questions -->
