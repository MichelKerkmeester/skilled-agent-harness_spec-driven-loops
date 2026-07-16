---
title: "Feature Specification: Live two-session daemon re-election adoption test"
description: "Prove daemon re-election end to end with two real launchers in an isolated root, and fix the fresh-session double-writer the live test uncovered so the single-writer invariant holds with re-election on by default."
trigger_phrases:
  - "live session reelection validation"
  - "daemon adoption live test"
  - "fresh session double writer fix"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation"
    last_updated_at: "2026-06-08T05:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Live two-session test built, double-writer found, reap-before-respawn fix shipped"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-028-live-session-reelection-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Live two-session daemon re-election adoption test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Daemon re-election was defaulted on for all users, but the changelog admitted the full multi-session behavior was only under live observation, not proven by a test, because a real launcher seemed impossible to spawn without touching the shared production lease and database. That left the safety claim unverified and a real defect undetected.

### Purpose
Prove re-election end to end with two real launchers in an isolated root, and fix whatever the live test exposes so the single-writer invariant holds with re-election on by default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A live durability test that runs two real mk-spec-memory launchers against an isolated fake-root, covering live-secondary survival, flag-off death, and fresh-session reaping.
- The reap-before-respawn fix in the launcher's stale-lease reclaim branch.
- Reconciling the v3.5.0.4 changelog, RELEASE_NOTES, and ENV_REFERENCE to the now-proven behavior.

### Out of Scope
- Option (b) true adoption, where a fresh session reuses the warm released daemon - a larger ownership-transfer change, deferred as a follow-up enhancement.
- Changing the idle-timeout bound or the orphan-sweep default - unrelated to the single-writer fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Reap the live released daemon on stale-lease reclaim before respawn |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Create | Live two-session adoption test, three cases |
| `.opencode/skills/system-spec-kit/changelog/v3.5.0.4.md` | Modify | Replace the observation hedge with the proven behavior and the fix |
| `.opencode/skills/system-spec-kit/changelog/RELEASE_NOTES.md` | Modify | Same reconciliation |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Re-election row reflects the live test and the reap |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Live two-session test exists and is isolated | Two real launchers run against a temp fake-root; production lease, DB, and socket are never touched |
| REQ-002 | Fresh-session single-writer invariant holds | After owner disposal a fresh session reaps the released daemon; exactly one daemon holds the DB open |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Live-secondary survival proven | With the flag on, a connected secondary keeps MCP transport through owner disposal; with the flag off it loses it |
| REQ-004 | Docs reconciled to proven behavior | Changelog, RELEASE_NOTES, and ENV_REFERENCE describe the live test and the reap, with no remaining observation hedge |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The durability suite passes with the new adoption test, including the fresh-session-after-disposal single-writer case.
- **SC-002**: The launcher-lease unit suite still passes, confirming the reclaim change did not regress lease handling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The reap signals a recycled childPid | Wrong process reaped | Same risk class as the existing dead-socket reap; reuses the same lease-freshness assumption and helper |
| Risk | Two fresh launchers race the reap | Double reap or double spawn | The owner-lease O_EXCL acquisition is the spawn mutex; only the winner reaches the reclaim branch |
| Dependency | `reapLeaseChildBeforeRespawn` helper | Reap path | Already present and unit-tested in the dead-socket branch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The reap adds latency only on a cold start that finds a live orphan; dead-orphan cold starts stay instant.
- **NFR-P02**: Reap latency is bounded by the SIGTERM grace plus a possible SIGKILL, the same bound as the dead-socket path.

### Security
- **NFR-S01**: No new surface; the reap signals only a pid recorded in the owner-held lease.
- **NFR-S02**: The test never touches the production lease, DB, or socket.

### Reliability
- **NFR-R01**: After the fix, exactly one daemon writes the database on a fresh cold start.
- **NFR-R02**: An EPERM-uncertain orphan aborts the spawn and reports the lease held, so a second writer is never created.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable; this is process lifecycle, not data input.
- Maximum length: not applicable.
- Invalid format: a missing or childPid-less lease skips the reap and spawns normally.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: the owner-lease O_EXCL mutex serializes the cold-start spawn so two fresh launchers cannot both reap and spawn.

### State Transitions
- Partial completion: an orphan that already idle-exited is detected dead and the reap is a no-op fast path.
- Session expiry: a fresh session after disposal reaps the released daemon and becomes the single owner and writer.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One launcher branch, one new test, doc reconciliation |
| Risk | 16/25 | Lifecycle change on a default-on path, bounded and reversible |
| Research | 14/20 | Isolated harness design, root-cause, four-perspective council |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding; option (b) true adoption is recorded as a deferred follow-up.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
