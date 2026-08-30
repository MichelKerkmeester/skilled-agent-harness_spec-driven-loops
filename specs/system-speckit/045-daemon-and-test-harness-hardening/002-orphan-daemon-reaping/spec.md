---
title: "Feature Specification: Phase 2: Orphan Daemon Reaping"
description: "The repository already classifies an orphaned spec-memory launcher correctly but has no way to act on it: the sweep never sends signals, nothing invokes it, and the launcher itself never notices it has been reparented to init."
trigger_phrases:
  - "orphan daemon reaping"
  - "process sweep apply path"
  - "launcher stdin close exit"
  - "respawn lock staleness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/045-daemon-and-test-harness-hardening/002-orphan-daemon-reaping"
    last_updated_at: "2026-08-30T09:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec from an observed 2d14h orphan and the unwired sweep"
    next_safe_action: "Answer the autonomous-vs-confirmed apply question, then plan"
    blockers: []
    key_files:
      - ".opencode/bin/system-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-orphan-daemon-reaping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Classification is not in scope; packet 035 settled it and it is already correct"
      - "Operator chose autonomous termination at session start over an operator-confirmed plan; this reverses the README's non-destructive framing deliberately"
      - "Session start is the trigger: it always runs, whereas a SIGKILLed session never reaches an end hook and that is exactly what produced the observed orphan"
      - "Scope amended after implementation evidence: OpenCode hooks are implemented in .opencode/plugins/ and surfaced in the hooks tree by symlink, so the trigger belongs in the existing session-cleanup plugin rather than a new hook adapter"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: Orphan Daemon Reaping

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-production-db-isolation |
| **Successor** | 003-test-hang-containment |
| **Handoff Criteria** | An orphaned launcher is terminated and its respawn lock reclaimed without operator action |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Daemon Lifecycle and Test-Harness Hardening specification.

**Scope Boundary**: Launcher self-exit, respawn-lock staleness, and the sweep's apply path and trigger. What the sweep classifies is out of scope and unchanged.

**Dependencies**:
- Phase 001 should land first so a reaping test cannot touch the production database.

**Deliverables**:
- A launcher that exits when its client goes away
- Respawn-lock staleness that accounts for an orphaned holder
- An apply path for the existing sweep, plus something that invokes it

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An orphaned `system-spec-memory-launcher.cjs` survived at `ppid 1` for 2 days 14 hours with dangling stdio pipes and no child server. It held `/tmp/system-hf-embed/hf-embed-respawn.lock` containing its own pid. Because `isRespawnLockStale()` tests pid liveness only, that lock stayed valid for as long as the useless process lived — so no other session could ever respawn the embedder.

Three separate mechanisms should have caught it and none could:

- `process-memory-harness.ts` has a `spec-memory-launcher` classification rule and a fixture modelling a `ppid 1` launcher, but `ops/README.md` records that `process-sweep.ts` "never sends signals" and that "no live apply command exists". Nothing under `.opencode/hooks/` or `.opencode/command/` invokes it.
- `shouldAbortRelaunchOnFire()` returns true for a process reparented to init, but is only consulted on the relaunch path — which a launcher whose child is already dead never reaches.
- The launcher passes `process.stdin` to its child but never watches it, so it ignores the stdio contract that a closed stdin means exit.

The launcher shut down cleanly on `SIGTERM` and unlinked its own socket and lock, so the teardown path is correct. Only the trigger is missing.

### Purpose

Make an orphaned launcher terminate itself, and give the sweep that already identifies one the ability to act when it does not.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Launcher exits on stdin close
- Launcher evaluates the existing orphan predicate periodically, not only at relaunch
- Respawn-lock staleness accounts for an orphaned holder
- A guarded apply path for `process-sweep.ts` and a lifecycle trigger that calls it

### Out of Scope
- What the sweep classifies — settled by packet `035` and already correct
- Non-repository orphans such as the Figma agent's defunct children
- The `git-live-follow.sh` follower, which is a healthy daemon and belongs to phase 004

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/system-spec-memory-launcher.cjs` | Modify | Exit on stdin close; evaluate the orphan predicate on the existing heartbeat timer |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | Make `isRespawnLockStale()` treat an orphaned holder as stale |
| `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` | Modify | Add the guarded apply path the README records as absent |
| `.opencode/plugins/session-cleanup.js` | Modify | Invoke the sweep at session start, behind the kill switch; it already runs bounded startup guards |
| `.opencode/hooks/<concern>/opencode/` symlink | Create | Surface the plugin in the concern index, following the existing hub pattern |
| `.opencode/skills/system-spec-kit/mcp-server/tests/` | Create | Live-parent safety test and kill-switch test |
| `.opencode/skills/system-spec-kit/scripts/ops/README.md` | Modify | Update the "no live apply command exists" statement once one exists |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A launcher whose stdio peer closes exits rather than persisting |
| REQ-002 | A launcher reparented to init terminates without waiting for a relaunch that never comes |
| REQ-003 | A respawn lock held by an orphaned process is reclaimable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The sweep terminates orphans autonomously at session start, and never signals anything it cannot prove is an orphan |
| REQ-005 | Something invokes the sweep on a defined lifecycle event |
| REQ-006 | `ops/README.md` no longer states that no apply command exists once one does |
| REQ-007 | The autonomous sweep has a documented kill switch, matching every other auto-behaviour in this repository |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An orphaned launcher is gone within one lifecycle interval, without operator action
- **SC-002**: Its respawn lock is released, so a fresh embedder can start
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An apply path terminates a live daemon that other sessions depend on | High | Require exact ownership evidence, exclude any process with a live parent or a connected socket peer, and dry-run before applying |
| Risk | A stdin-close handler fires in a context where stdin is legitimately closed | Med | Gate on the orphan predicate as well as stdin state, not stdin alone |
| Risk | Reversing the README's deliberate non-destructive framing | Med | Treat it as a recorded decision, not an implementation detail |
| Dependency | Phase 001 | Low | Land 001 first so reaping tests cannot reach the production database |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The periodic orphan check rides the existing heartbeat timer and adds no new interval
- **NFR-P02**: A sweep invocation completes fast enough to sit on a session lifecycle event without being felt

### Security
- **NFR-S01**: The apply path signals only processes it owns by exact evidence, never by name match alone
- **NFR-S02**: The apply path never escalates beyond the signals the existing teardown already handles

### Reliability
- **NFR-R01**: A clean shutdown remains clean: the launcher keeps unlinking its socket and lock on exit
- **NFR-R02**: A false positive must be impossible for a launcher with a live parent or a connected peer
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Lock file present but unparseable: treat as stale rather than as a valid claim
- Lock naming a pid that has been recycled by an unrelated process: require more than pid equality
- Socket file present with no listener: unlink before bind rather than failing to start

### Error Scenarios
- Sweep runs while a launcher is mid-startup: exclude processes younger than a grace window
- Two sessions sweep concurrently: the apply path must be idempotent
- Signal delivery denied: report rather than retry indefinitely

### State Transitions
- Launcher orphaned while its child is still alive: terminate the child first, then self
- Launcher orphaned during its own shutdown: do not double-signal
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four files plus a new hook; shipped daemon supervision |
| Risk | 20/25 | Signalling live processes; a false positive kills a working session's daemon |
| Research | 8/20 | Root cause is confirmed; the open question is policy, not investigation |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the same treatment extend to the other launchers (skill advisor, code mode), or stay scoped to spec-memory for now?
<!-- /ANCHOR:questions -->

---
