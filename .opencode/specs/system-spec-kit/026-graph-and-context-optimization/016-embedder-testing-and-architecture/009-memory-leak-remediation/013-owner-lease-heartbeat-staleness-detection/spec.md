---
title: "Spec: Owner-Lease Heartbeat-Staleness Detection"
description: "Phase 007's owner-lease classifies a live-PID owner as 'live-owner' even when its heartbeat is older than ttlMs * 2. This blocks MCP reconnect when an orphan launcher accumulates. This phase adds heartbeat-staleness as a reclaim condition."
trigger_phrases:
  - "owner-lease-heartbeat-staleness-detection"
  - "009 phase 013"
  - "phase 007 owner-lease gap"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection"
    last_updated_at: "2026-05-22T15:38:39Z"
    last_updated_by: "main_agent"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Owner-Lease Heartbeat-Staleness Detection

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 013 of 013 |
| **Predecessor** | (none — independent follow-on) |
| **Successor** | (none — independent follow-on) |
| **Handoff Criteria** | classifyOwner rejects live-PID owners whose heartbeat is older than ttlMs * 2; reclaim path tested; mk_code_index reconnect repeatedly succeeds after stale-heartbeat scenarios. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 013 of the memory-leak remediation arc. Gap discovered during arc 009 closure (commit `8b84612f12`) when mk_code_index MCP reconnect failed with `-32000`. Investigation:

- Existing launcher (PID 88931) + server (PID 89094) were alive but their parent (the previous Claude Code MCP client) had disconnected.
- `lastHeartbeatIso: 2026-05-22T14:10:47.910Z` against `ttlMs: 60000` = 22 minutes stale.
- Phase 007's `classifyOwner` returned `live-owner` because `processAlive(89094)` was still true; the heartbeat-staleness check was NOT part of the classification logic.
- Result: the new MCP client's launcher attempt was refused by the phase 007 lease gate, even though the existing owner was effectively dead from the IPC perspective.

The phase 004 `loop-lock.ts` `isStaleLoopLock` helper already includes heartbeat-staleness logic: `(now - lastHeartbeatIso) > ttlMs * 2 OR !processAlive(ownerPid)`. Phase 007 deliberately omitted heartbeat staleness (the phase 007 design notes that heartbeat refresh by the owner happens, but the classifier didn't gate on freshness).

**Scope Boundary**: extend `system-code-graph/mcp_server/lib/owner-lease.ts` `classifyOwner` (and its consumers) to treat a live-PID owner with stale heartbeat as `stale-heartbeat-reclaim` (a new classification value), and reclaim eligibility through the same atomic write-temp+rename path as `stale-pid`. Also confirm or extend the heartbeat-refresh side: the server child must `refreshOwnerLease` on a regular interval so a healthy owner is never misclassified.

**Dependencies**:
- Arc 009 phase 004 `loop-lock.ts` (heartbeat-staleness helper to mirror).
- Arc 009 phase 007 `owner-lease.ts` (extension target).

**Deliverables**:
- New `OwnerClassification` value: `stale-heartbeat-reclaim`.
- `classifyOwner` rule: live-PID + heartbeat older than `ttlMs * 2` → `stale-heartbeat-reclaim`.
- Reclaim path uses the same atomic write-temp+rename as `stale-pid`.
- Heartbeat refresh wired into the server's main loop (verify it exists; add if missing) so healthy owners are not misclassified.
- New vitest fixture: stale-heartbeat reclaim scenario.
- Verification: kill the previous server, start a new one, repeat — must succeed every time without manual intervention.

**Changelog**:
- When this phase closes, refresh the parent arc 009 status; also update phase 007's `implementation-summary.md` Limitations anchor to reflect the closed gap.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 007's `classifyOwner` returns `live-owner` for any owner whose PID is alive, regardless of heartbeat freshness. When a launcher + server pair survives past its parent client's disconnect (which on macOS happens whenever the parent process is `detached`), the lease ages indefinitely while still classifying as live. New MCP clients are blocked from spawning a fresh launcher because the gate refuses any non-stale-pid live owner.

### Purpose
Add heartbeat-staleness as a reclaim condition so orphan launchers stop blocking legitimate reconnects, while still refusing duplicate launches against a genuinely healthy owner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `stale-heartbeat-reclaim` to `OwnerClassification` union.
- Extend `classifyOwner` with the heartbeat-staleness rule (live PID + heartbeat older than `ttlMs * 2`).
- Reuse phase 007's existing reclaim path for the new classification value.
- Verify or add heartbeat refresh in the server's main loop so healthy owners are not misclassified.
- Add vitest coverage for the new classification + reclaim path.
- Update phase 007's `implementation-summary.md` Limitations anchor.

### Out of Scope
- Replacing the owner-lease design with a different concurrency primitive.
- Changing `ttlMs` defaults (60s remains the contract; double it for staleness threshold = 120s).
- Adding IPC-reachability probes (orthogonal — heartbeat staleness is the simpler fix).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` | Modify | Add `stale-heartbeat-reclaim` to classification + the rule. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Modify (only if heartbeat refresh is missing) | Add periodic `refreshOwnerLease` call. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Treat `stale-heartbeat-reclaim` the same as `stale-pid` (reclaim then proceed). |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts` | Modify | Add stale-heartbeat reclaim test. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md` | Modify | Update Limitations anchor to reflect the closed gap. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Owner-lease classifier rejects live-PID owners whose heartbeat is older than `ttlMs * 2`. | Tests pass with stale-heartbeat fixture; reclaim path operates atomically. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Healthy owners with regular heartbeat refresh are NEVER misclassified as stale. | Vitest fixture covering a server that refreshes; asserts `live-owner` over multiple TTL windows. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New `stale-heartbeat-reclaim` classification value + vitest covering the reclaim scenario.
- **SC-002**: Healthy heartbeat-refresh vitest covering a normal owner across `ttlMs * 2 + delta` to assert no misclassification.
- **SC-003**: mk_code_index MCP reconnect succeeds repeatedly after a parent disconnect (manual operator verification scripted into the phase summary).
- **SC-004**: Phase 007 `implementation-summary.md` Limitations anchor updated to reflect the gap being closed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Heartbeat refresh interval too long → false `stale-heartbeat-reclaim` on a healthy owner | Reclaims a live owner and forks a duplicate server. | Set refresh interval to `ttlMs / 3` (default 20s) so healthy owners always pass `ttlMs * 2` freshness. |
| Risk | Heartbeat refresh blocked by event-loop saturation under heavy load | False staleness during peak workload. | Refresh from a high-priority dedicated timer; document load-test result in `implementation-summary.md`. |
| Risk | Reclaiming an in-progress server's lease while it is writing to SQLite | DB corruption. | Reclaim path keeps the existing `closeDbWithAssertion` integration; reclaim only writes the new lease file (does not signal the existing owner). The existing owner will SIGTERM-out on its own when its stdio pipe is closed by the kernel. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; phase-specific questions must be recorded here before implementation begins.
<!-- /ANCHOR:questions -->
