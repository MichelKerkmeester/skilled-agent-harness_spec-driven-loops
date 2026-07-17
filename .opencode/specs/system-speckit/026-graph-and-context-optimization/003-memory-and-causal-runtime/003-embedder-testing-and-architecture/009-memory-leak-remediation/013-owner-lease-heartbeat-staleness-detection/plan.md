---
title: "Plan: Owner-Lease Heartbeat-Staleness Detection"
description: "Implementation plan for Owner-Lease Heartbeat-Staleness Detection."
trigger_phrases:
  - "owner-lease-heartbeat-staleness-detection"
  - "009 phase 013"
  - "phase 007 owner-lease gap"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection"
    last_updated_at: "2026-05-22T15:38:39Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-013-owner-lease-heartbeat-staleness"
    next_safe_action: "arc-009-complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a03030303030303030303030303030303030303030303030303030303030303"
      session_id: "009-memory-leak-remediation-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gap discovered during arc 009 closure when mk_code_index MCP reconnect failed with -32000 against a live orphan launcher whose heartbeat was 22 minutes stale against a 60-second TTL."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Owner-Lease Heartbeat-Staleness Detection

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js process ownership |
| **Framework** | system-code-graph MCP launcher and owner lease |
| **Storage** | Owner lease file and heartbeat metadata |
| **Testing** | Targeted owner-lease Vitest and reconnect verification |

### Overview
This phase extends owner-lease classification so a live-PID owner with a heartbeat older than `ttlMs * 2` is reclaimable. The reclaim uses the existing atomic write-temp-then-rename lease path and does not signal the old owner. The server child must keep refreshing the lease at `ttlMs / 3` so healthy owners remain classified as `live-owner` across multiple TTL windows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read the parent arc 009 spec.
- [x] Read this phase spec.
- [x] Read arc 009 phase 007 implementation summary.
- [x] Read `owner-lease.ts`, sibling lifecycle helpers, `index.ts`, launcher, owner-lease tests, launcher tests, and phase 004 loop-lock heartbeat pattern.

### Definition of Done
- [x] `OwnerClassification` includes `stale-heartbeat-reclaim`.
- [x] `classifyOwner` applies the required precedence: dead PID, EPERM, PPID-1 orphan, stale heartbeat, symlink alias, live owner.
- [x] `acquireOwnerLease` treats `stale-heartbeat-reclaim` identically to `stale-pid` by overwriting the lease atomically without signaling the old owner.
- [x] Server heartbeat refresh is present at `ttlMs / 3` with shutdown cleanup.
- [x] Launcher treats `stale-heartbeat-reclaim` as reclaim-eligible.
- [x] Targeted owner-lease, lifecycle, launcher tests and typecheck pass.
- [x] Phase 007 limitations and this phase implementation summary are updated.
- [x] Phase, parent arc, and touched phase 007 strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Owner Classification Extension
`OwnerClassification` will add a new value:

- `stale-heartbeat-reclaim`: owner PID is live and inspectable, but `Date.now() - Date.parse(lastHeartbeatIso) > ttlMs * 2`.

The classifier rule order is intentionally strict:

1. `!processAlive(ownerPid)` / liveness `dead` -> `stale-pid`
2. `EPERM` on process probe -> `unknown-eperm`
3. PPID mismatch and actual PPID is `1` -> `ppid-1-orphan`
4. `(now - lastHeartbeatIso) > ttlMs * 2` -> `stale-heartbeat-reclaim`
5. canonical DB dir matches through a different resolved candidate path -> `symlink-alias`
6. otherwise -> `live-owner`

### Reclaim Path
`acquireOwnerLease` already blocks only `live-owner`, `symlink-alias`, and `unknown-eperm`, then writes the new lease through `writeOwnerLeaseAtomic`. The new classification will stay outside the blocking set, matching `stale-pid` and `ppid-1-orphan`. No signal is sent to the old owner.

### Heartbeat Refresh Wiring
`mcp_server/index.ts` currently has no periodic `refreshOwnerLease` call. Add a timer after server startup using the code-graph DB dir and current process PID. The interval is `ttlMs / 3`; with the default 60s TTL this is 20s. The timer must be cleared on SIGINT, SIGTERM, uncaught exception, and unhandled rejection before DB close/exit. Because `system-code-graph/mcp_server/` has no local `timer-registry.ts`, use a module-level `setInterval` handle plus `clearInterval` in shutdown paths and document that deviation in the implementation summary.

### Launcher Integration
`mk-code-index-launcher.cjs` has a mirrored CommonJS owner-lease classifier. Add the same stale-heartbeat rule there and allow `acquireOwnerLeaseFile` to reclaim it just like `stale-pid`. Rejection output will still include the classification when a non-reclaimable owner blocks startup.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` | Owner classification and lease state | Add stale-heartbeat reclaim classification and rule | Targeted owner-lease Vitest |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Server child lifecycle | Add heartbeat refresh timer and cleanup if missing | Typecheck and targeted launcher/lifecycle tests |
| `.opencode/bin/mk-code-index-launcher.cjs` | Launcher lease consumer | Mirror stale-heartbeat classification and reclaim eligibility | Launcher lease Vitest |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts` | Lease unit coverage | Add stale-heartbeat reclaim and healthy refresh fixtures | Targeted Vitest |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Launcher integration coverage | Add stale-heartbeat reclaim fixture if cleanly modelable | Targeted Vitest |
| `009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md` | Predecessor limitations | Add cross-link note that this gap is closed | Strict validation |
| `implementation-summary.md` | Phase evidence ledger | Record decisions, tests, SC-003 operator script, limitations, and commit handoff | Strict validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read required specs, predecessor summary, owner-lease code, sibling helpers, server entry, launcher, tests, and loop-lock heartbeat pattern.
- [x] Replace scaffold placeholders with this concrete execution plan.
- [x] Validate the phase folder after plan and tasks are authored.

### Phase 2: Implementation
- [x] Add `stale-heartbeat-reclaim` classification and heartbeat-staleness helper in `owner-lease.ts`.
- [x] Apply the required `classifyOwner` precedence order.
- [x] Confirm `acquireOwnerLease` reclaims the new classification through the existing atomic path.
- [x] Add server heartbeat refresh timer at `ttlMs / 3` and clear it on shutdown/error exits.
- [x] Mirror stale-heartbeat reclaim in the CommonJS launcher.
- [x] Add stale-heartbeat, healthy-short-heartbeat, healthy-refresh-across-windows, and end-to-end reclaim tests.

### Phase 3: Verification
- [x] Run targeted owner-lease and launcher Vitest.
- [x] Run owner-lease plus canonical DB dir, close DB, and launcher regression Vitest.
- [x] Run `npm run typecheck` and `npm run build` if available.
- [x] Update phase 007 limitations.
- [x] Fill this phase's implementation summary with verification evidence and SC-003 operator script.
- [x] Strict-validate this phase, parent arc, and phase 007.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Stale heartbeat classification with live PID and heartbeat at `now - ttlMs * 3` | `owner-lease.vitest.ts` |
| Unit | Healthy short heartbeat remains `live-owner` | `owner-lease.vitest.ts` |
| Unit | Healthy refresh across multiple TTL windows remains `live-owner` | `owner-lease.vitest.ts` |
| Unit | End-to-end stale-heartbeat acquire overwrites the lease and returns `{ acquired: true }` | `owner-lease.vitest.ts` |
| Integration | Launcher stale-heartbeat owner is reclaimed when modeled cleanly | `launcher-lease.vitest.ts` |
| Regression | Owner-lease, canonical DB dir, close DB, and launcher lifecycle tests stay green | Targeted Vitest command |
| Type/build | TypeScript compile and package build where available | `npm run typecheck`, optional `npm run build` |
| Documentation | Phase, parent arc, and predecessor phase validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 009 phase 007 implementation summary | Source evidence | Available | Required to recover the reconnect gap and owner-lease baseline. |
| Existing owner-lease classifier | Implementation target | Read | Required for stale-heartbeat classification. |
| Heartbeat refresh path | Runtime behavior | Missing in server entry; add in this phase | Required to avoid false reclaim of healthy owners. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Healthy owners are reclaimed incorrectly, reconnect remains blocked, heartbeat refresh causes process shutdown regressions, or targeted owner-lease/launcher tests regress.
- **Procedure**: Revert only this phase's owner-lease, server-entry heartbeat timer, launcher, test, and documentation changes. Preserve failing evidence in `handover.md` if recovery cannot finish in-session, then replan the classifier rule or refresh wiring.
<!-- /ANCHOR:rollback -->
