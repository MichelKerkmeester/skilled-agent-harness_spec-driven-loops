---
title: "Feature Specification: Phase 9: daemon-reclaim-hardening"
description: "Make the code-index launcher reclaim a PID-alive-but-socket-dead daemon (tridimensional liveness: PID + socket-serving + heartbeat) so an unclean crash can't wedge MCP reconnect at -32000; add startup WAL hygiene + self-heal + diagnostics."
trigger_phrases:
  - "code-index daemon reclaim hardening"
  - "wedged daemon dead socket reclaim"
  - "mk-code-index launcher -32000 prevent"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/009-daemon-reclaim-hardening"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/009-daemon-reclaim-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: daemon-reclaim-hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 (code-graph daemon reliability) |
| **Predecessor** | 008-doc-symbol-lane |
| **Successor** | None |
| **Handoff Criteria** | A simulated wedge (live PID, no socket) is reclaimed automatically; a still-starting daemon and a foreign-owned daemon are NOT killed; reconnect no longer returns -32000 after an unclean crash |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

On 2026-06-29 the `mk_code_index` MCP server failed to reconnect with `-32000`. Investigation found the daemon had crashed uncleanly, leaving two orphaned processes alive (0% CPU) that had never (re)created their IPC socket, a vanished lease file, and a 17 MB orphaned WAL. Manual recovery: kill the orphans + `wal_checkpoint(TRUNCATE)` + clean the socket dir. A 10-iteration GLM 5.2 (max thinking) deep research (see `research/research.md`) produced the hardening design, then a 5-iteration GPT-5.5 (xhigh) adversarial cross-check refined it (verdict: **sound-with-fixes**) — correcting the bridge path to `lib/`, requiring a compound socket-vetoed reclaim predicate (NOT a probe-failure count, which would false-kill a busy `code_graph_scan`), a conditional CAS, an async classify wrapper, and child-PID threading on respawn.

**Scope Boundary**: Harden `.opencode/bin/mk-code-index-launcher.cjs` (+ its IPC bridge + the child's `initDb`) so the wedge self-heals. No change to the code-graph query/scan semantics.

**Dependencies**:
- The existing `launcher-ipc-bridge.cjs:probeDaemon({deepProbe:true})` socket probe (reused, not rebuilt).

**Deliverables**:
- Tridimensional liveness (PID + socket-serving + heartbeat) in the launcher's lease classification.
- Reclaim-on-dead-socket past a startup grace window; startup WAL hygiene; crash-surviving PID registry + self-heal; race/uid safety; one-line diagnostics.
- A deterministic wedge-simulation test suite.

**Changelog**:
- When this phase closes, add the matching file to the 002-code-graph changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The launcher decides daemon liveness from `process.kill(pid,0)` plus a launcher-written heartbeat — with **zero socket-health correlation**. A wedged daemon (PID alive, socket never created) classifies as a healthy held owner (`leaseHeldFromFile` returns `held:true` at the `process.kill` success path), and the no-bridge-socket branch reports inert instead of respawning. Combined with a vanished lease file and an oversized orphaned WAL, an unclean crash leaves the daemon un-reclaimable → reconnect `-32000`, requiring manual `ps`/`lsof`/`kill`/`sqlite3` forensics.

### Purpose
Make liveness **tridimensional** (PID-alive AND socket-serving AND heartbeat-fresh) and self-healing, so an unclean crash is reclaimed automatically on the next launch without operator intervention, while never killing a daemon that is merely still starting or owned by another user.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Socket-health gate in `classifyOwnerLease` + `leaseHeldFromFile` (new `live-but-dead-socket` reclaimable state) reusing `probeDaemon({deepProbe:true})`.
- No-bridge-socket branch → respawn (not report) for a socketless live owner.
- Startup grace window (`STARTUP_GRACE_MS`/`MAX_INIT_MS`, keyed on a new `childSpawnedAtIso`).
- Startup WAL hygiene (`wal_checkpoint(TRUNCATE)` over-threshold/post-reap; `wal_autocheckpoint` in `initDb`; checkpoint before migration copy).
- Crash-surviving `.code-graph-daemon-pid.json` registry + self-heal-on-acquire (discover→reap→checkpoint→spawn), one-shot guarded.
- Race/permission safety (PRIMARY-lease uid check, PID-identity verify before SIGKILL, re-stat-before-unlink).
- Socket-gated heartbeat; one-line `LAUNCHER_DIAGNOSTIC` per failure exit.
- A deterministic wedge-simulation test suite.

### Out of Scope
- Code-graph query/scan/ranking behavior.
- The spec-memory + skill-advisor daemons (separate launchers; this pattern may be ported later but is not in this phase).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Liveness classification, reclaim, grace window, self-heal, diagnostics |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | `probeExistingService` wrapper (normalize `probeDaemon`'s `{status,reason}`); no-bridge-socket → respawn with the child PID threaded |
| `system-code-graph/mcp_server/.../initDb` | Modify | `wal_autocheckpoint`; socket-gated heartbeat ownership |
| launcher test suite | Add | Deterministic wedge-simulation cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reclaim dead-socket daemon (safely) | Reclaim only on a COMPOUND predicate — dead socket AND aged heartbeat (past TTL) AND past `MAX_INIT_MS` — with a final deep-probe veto after acquiring the respawn lock (if the socket answers, abort the kill); never on probe-failure count alone, since a busy `code_graph_scan` is alive-but-slow |
| REQ-002 | Don't kill a starting daemon | An owner within `STARTUP_GRACE_MS` with no socket yet is NOT killed |
| REQ-003 | Startup WAL hygiene | An oversized/orphaned WAL is checkpoint-truncated before spawn; `wal_autocheckpoint` caps growth |
| REQ-004 | Diagnostic line | Every failure exit emits one `LAUNCHER_DIAGNOSTIC: reason=<token>` line |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Race/permission safety | Foreign-owned lease/socket never killed; PID-identity verified before SIGKILL; reclaim CAS re-stats before unlink |
| REQ-006 | Self-heal durability | Crash-surviving PID registry lets the orphan be found even when the lease file is gone; self-heal is one-shot guarded |
| REQ-007 | Socket-gated heartbeat | Heartbeat refresh stops when the socket can't serve, so a dead-socket daemon ages out |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deterministic wedge simulation (live PID, no socket) is auto-reclaimed; a still-starting and a foreign-owned daemon are not killed — all asserted by tests.
- **SC-002**: After an unclean daemon crash, a fresh launch/reconnect succeeds with no manual `kill`/`sqlite3` intervention and no `-32000`.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** a faked owner holding the lease + a live PID but no socket, **When** the launcher runs past the grace window, **Then** it reaps + respawns and logs `dead-socket-reclaimed`.
- **Given** an owner within the startup grace window, **When** the launcher runs, **Then** it does not kill the owner (`still-starting`).
- **Given** an 8 MB+ orphaned WAL with no holder, **When** the launcher starts, **Then** it checkpoint-truncates before spawn.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Killing a legitimately-starting daemon | Boot loop | Startup grace window keyed on `childSpawnedAtIso`; reclaim only past `MAX_INIT_MS` |
| Risk | PID reuse → kill an unrelated process | Wrong-process kill | Verify cmdline + start-time vs lease before SIGKILL; abort on mismatch |
| Risk | Double-writer corruption if reap fails | DB corruption | Reap (confirm dead) BEFORE checkpoint/spawn; hard-block spawn if a timeout-wedged holder can't be identified |
| Risk | Reclaim race between two launchers | Two daemons | Keep the atomic `unlink + O_EXCL` CAS; one-shot `.self-heal-attempted` marker |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Final values for `STARTUP_GRACE_MS` (research proposes 30 s) and `MAX_INIT_MS` (120 s) — confirm against observed cold-build + model-init latency on the slowest supported machine before locking the defaults.
<!-- /ANCHOR:questions -->
