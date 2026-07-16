---
title: "Feature Specification: OpenCode Temp Worker Reaping and Vitest Runaway Prevention"
description: "51 orphaned context-server.js daemons accumulated from a launcher-lease vitest suite that released rather than killed its detached daemon child, plus a wedged embedder subsystem. This phase root-causes both, ships the two committed fixes, and stages the remaining activation and hardening work."
trigger_phrases:
  - "opencode temp worker reaping"
  - "session process cleanup"
  - "orphan worker reaping"
  - "vitest runaway prevention"
  - "mcp helper lifecycle"
  - "daemon reaper"
  - "orphan mcp sweeper"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/040-opencode-temp-worker-reaping"
    last_updated_at: "2026-07-11T09:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Rewrote packet to Level 2 In Progress; Layer 0 + Layer 1 shipped, rest staged"
    next_safe_action: "Await operator go-ahead on stop-hook/launchd activation, then build hardening"
    blockers:
      - "Operator approval needed for stop-hook live flip and launchd install"
      - "REQ-005 packet scoping decision (this packet vs a new one) pending"
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doc-update-030-daemon-reaper"
      parent_session_id: null
    completion_pct: 55
    open_questions:
      - "Ship REQ-005 (demand-listener re-arm) here or as a new packet?"
      - "Does launcher-ipc-bridge.vitest.ts share root cause A's risk? Unchecked."
    answered_questions:
      - "Reap owner: existing stop-hook (SPECKIT_STOP_HOOK_ORPHAN_SWEEP), not yet live"
      - "Runaway guard: superseded, fixed at test-lifecycle source instead"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 30: opencode-temp-worker-reaping

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-30 |
| **Branch** | `wt/0029-daemon-reaper` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 30 |
| **Predecessor** | ../039-substrate-sandbox-cleanup/spec.md |
| **Successor** | ../041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/spec.md |
| **Handoff Criteria** | Layer 0 + Layer 1 shipped and verified; activation, sweeper hardening, and the embedder demand-listener fix remain |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the OpenCode temp worker reaping and Vitest runaway prevention specification. Priority raised from P2 (scaffold) to P1 because investigation confirmed an active production incident: 51 live orphaned daemon processes and a wedged embedder subsystem, not a hypothetical risk.

**Scope Boundary**: Session-scoped process-tree cleanup for OpenCode parallel workers and MCP helpers, plus root-causing and fixing the specific test-suite lifecycle bug that was the actual source of daemon accumulation. No changes to the memory or code-graph subsystems' data or query behavior.

**Dependencies**:
- OpenCode session lifecycle hooks (stop-hook, session-cleanup.sh) - pre-existing, unchanged in this phase
- Existing orphan-sweep stop-hook mechanism (`SPECKIT_STOP_HOOK_ORPHAN_SWEEP`) - pre-existing, extended
- `.opencode/scripts/orphan-mcp-sweeper.sh` - pre-existing, extended with hf-model-server sidecar classification
- `mk-spec-memory-launcher.cjs` daemon re-election / adoption mechanism - pre-existing, test-harness default changed

**Deliverables (this pass)**:
- Layer 0: `launcher-lease.vitest.ts` test-lifecycle fix that stops the suite leaking detached daemon children (root cause A, the ~97% source).
- Layer 1: `orphan-mcp-sweeper.sh` classification of the `hf-model-server` embedder sidecar so a busy one is preserved and only genuinely orphaned ones are reaped (root cause B mitigation, partial).
- Operational: cleanup of 32 accumulated zombie daemons and a wedged-daemon restart + native module rebuild (not a code change, this session only).

**Deliverables (remaining, staged)**:
- Activation of the existing stop-hook and launchd cron reaping mechanisms (operator-gated).
- Sweeper hardening: maintenance-marker respect, an explicit singleton rule, and a pid-reuse re-check before the SIGKILL escalation.
- Embedder demand-listener re-arm fix so `memory_index_scan` stops hanging on a missing `hf-embed.sock` (root cause B, full fix) - recommended as a separate packet.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Investigation found chronic accumulation of orphaned `context-server.js` (spec-memory daemon) processes - 51 live at investigation time, start times spanning Jul 8-9 - plus a wedged embedder subsystem that makes `memory_index_scan` hang while pure SQLite reads stay healthy. Root cause A (the ~97% source): `launcher-lease.vitest.ts` spawns its launcher, which spawns its daemon detached and unref'd; under default-on daemon re-election, the launcher releases the daemon "for adoption (not killing)" on SIGTERM instead of killing it, so the test's `afterEach` reaped only the launchers, never the detached daemon child, then deleted the temp workspace - orphaning stub daemons to pid 1. Root cause B: the embedder runs in a separate `hf-model-server` sidecar spawned only by the owning launcher's demand listener; under re-election churn the owner dies minutes after arming the listener, daemon adoption transfers the daemon but not the demand-listener responsibility, so the sidecar is never respawned and every embedder op retries 45-150s before giving up.

### Purpose
Eliminate the specific test-lifecycle leak that caused ~97% of the accumulation, extend the existing orphan sweeper so the embedder sidecar is a known, safely-classified process instead of an unknown one, and leave a clearly-scoped, evidence-backed path (activation + hardening + demand-listener fix) for closing out the remainder without inventing new mechanisms where existing ones (stop-hook, launchd cron) already cover the gap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-cause investigation of the daemon accumulation and embedder wedge (process census, code tracing).
- `launcher-lease.vitest.ts` test-harness lifecycle fix (default-off re-election + `afterEach` hard-kill) - **done**.
- `orphan-mcp-sweeper.sh` classification of the `hf-model-server` sidecar via the existing socket-FD busy-preserve rule, extended for `hf-embed.sock` - **done**.
- Operational cleanup this session: killing 32 zombie daemons, restarting and rebuilding the wedged daemon's native `better-sqlite3` module, verifying DB integrity - **done, not a repo change**.
- Activation of the existing stop-hook (`SPECKIT_STOP_HOOK_ORPHAN_SWEEP`) dry-run then live, and installing the existing launchd cron plist - **staged, operator-gated, remaining**.
- Sweeper hardening: maintenance-marker respect, singleton rule, pid-reuse re-check before SIGKILL - **remaining**.
- Embedder demand-listener re-arm on daemon adoption + `hf-local.ts` fail-fast when the socket is absent and there is no live owner lease - **remaining, recommended as a separate packet**.

### Out of Scope
- Changes to the memory or code-graph subsystems' data or query behavior - unaffected by this phase.
- Changes to the MCP transport or protocol layer - unaffected.
- Changes to how OpenCode spawns workers (only their cleanup and lifecycle) - unaffected.
- Building a generic Vitest concurrency-cap guard - superseded, the actual leak was one test suite's daemon-lifecycle contract, not general worker runaway (see Open Questions, answered).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Done - default `SPECKIT_DAEMON_REELECTION=0` in `spawnLauncher`, plus `afterEach` hard-kill of lease-recorded `childPid`/`modelServerPid` before temp-root removal (commit `90a2462721`) |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modified | Done - classify `hf-model-server` and extend the busy-preserve rule to count `hf-embed.sock` connections (commit `d4be07abbc`) |
| `.opencode/scripts/session-cleanup.sh` | Config only, no code change | Remaining - flip `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` from `off` to `dry-run` then `live` (line 30 gate) |
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | Install, no code change | Remaining - `launchctl load` (template exists, currently `--dry-run`, not installed) |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modify (follow-up) | Remaining - maintenance-marker respect, singleton rule, pid-reuse re-check before SIGKILL |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify (follow-up, separate packet recommended) | Remaining - re-arm the hf demand listener on daemon adoption |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modify (follow-up, separate packet recommended) | Remaining - fail-fast when the socket is absent and there is no live owner lease |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Eliminate the launcher-lease vitest suite's detached-daemon leak (root cause A) | Suite's `afterEach` leaves zero orphaned stub `context-server.js` processes after a run, verified non-regressing against a captured baseline. **DONE** - commit `90a2462721`, suite 6/11 -> 10/11, zero stub leaks confirmed. |
| REQ-002 | Classify and safely preserve the `hf-model-server` embedder sidecar in the orphan sweeper (root cause B mitigation) | Dry-run preserves an actively-connected sidecar (>1 unix-socket FD) and flags only genuinely orphaned idle ones. **DONE** - commit `d4be07abbc`, unit tests pass, live `--dry-run --verbose` verified against the real daemon. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Activate the existing stop-hook orphan sweep and install the existing launchd cron reaper | `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` moved `dry-run` -> `live` after log review; cron plist installed via `launchctl load`. **DEFERRED, operator-staged** - both changes are runtime/OS configuration, not code, and are gated behind operator review of dry-run logs. |
| REQ-004 | Harden the sweeper's process-killing logic | Maintenance-marker respect (don't reap a daemon holding a fresh maintenance marker mid-index), an explicit singleton rule (>1 daemon per canonical DB dir -> keep the listener-holder, reap the rest), and a pid re-classification check before the SIGKILL escalation (pid-reuse window). **DEFERRED, not yet built** - reviewed follow-up, delicate process-killer edit. |
| REQ-005 | Re-arm the embedder demand listener on daemon adoption | Adoption transfers demand-listener responsibility along with the daemon; `hf-local.ts` fails fast (instead of retrying 45-150s) when the socket is absent and there is no live owner lease. **DEFERRED, not yet built** - recommended as a separate, high-blast packet given it changes production daemon lifecycle behavior. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The launcher-lease vitest suite leaves no orphaned daemon or embedder-sidecar processes behind after a run. **MET** for the suite itself (10/11, zero leaks verified). The general "any OpenCode session exits ungracefully" case still depends on REQ-003 (stop-hook/cron activation), which is pending.
- **SC-002**: The orphan sweeper correctly distinguishes a busy embedder sidecar from a genuinely orphaned one. **MET** - live dry-run verified against the real daemon (pid 42293 preserved, only genuinely orphaned ~2.4h helpers flagged).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reaping a worker or sidecar that a sibling session is still bridged to | High | Both the daemon and the embedder sidecar are preserved via the existing >1-unix-socket-FD busy rule (sidecar rule extended this phase for `hf-embed.sock`); a pid-reuse re-check before SIGKILL is still pending (REQ-004) |
| Dependency | session-cleanup.sh and orphan-sweep stop-hook | Med | Tested together via unit vitests (`orphan-sweeper-ipc-preserve` 3/3, `launcher-stop-hook-orphan-sweep` 4/4); live activation still pending operator review |
| Risk | Embedder wedge causes `memory_index_scan` to hang (45-150s retries) until the demand-listener fix ships | High | Mitigated short-term this session via manual daemon restart + native module rebuild; root fix (REQ-005) not yet built, recommended as a separate packet given high blast radius |
| Risk | `launcher-ipc-bridge.vitest.ts` has its own independently-scoped `spawnLauncher` helper, not touched by this fix | Unknown | Not investigated this pass - flagged as an open question, not assumed safe or unsafe |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the embedder demand-listener re-arm fix (REQ-005) ship inside this packet or as a new, separately-scoped packet given its high-blast production-lifecycle risk?
- Does `launcher-ipc-bridge.vitest.ts`'s independently-scoped `spawnLauncher` helper share root cause A's leak risk profile? Not yet investigated.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `memory_index_scan` should not incur the 45-150s embedder retry-then-fail path once REQ-005 ships. Not yet measured post-fix (REQ-005 not built).
- **NFR-P02**: Orphan sweep dry-run scan should complete quickly enough for stop-hook use without noticeable session-exit latency. Not formally benchmarked this pass; live dry-run ran interactively without perceptible delay.

### Security
- **NFR-S01**: The sweeper must never SIGKILL a process it cannot positively re-verify as the same daemon it identified (pid-reuse guard). Not yet implemented (REQ-004).
- **NFR-S02**: No credentials or secrets are touched by any change in this phase - confirmed, all changes are process-lifecycle and test-harness code.

### Reliability
- **NFR-R01**: The daemon's SQLite store must remain intact through any operational reap or restart. Verified this session: `PRAGMA integrity_check = ok`, 12,801 memories intact after the daemon restart and native-module rebuild.
- **NFR-R02**: A test failure in `launcher-lease.vitest.ts` must not itself leave leaked processes. Verified: `afterEach` hard-kill runs even when earlier assertions in a test fail (defense-in-depth, not test-status-conditional).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty workspace / no lease file recorded: `afterEach` hard-kill is a no-op (nothing to kill), does not error.
- Daemon already exited before `afterEach` runs: hard-kill targets a dead pid, kill is a no-op (verified no throw in the suite run).

### Error Scenarios
- Dead-socket adoption timeout: the one remaining pre-existing failure ("reaps the recorded owner before taking over a dead socket") is unrelated to this fix and reproduces identically with and without it.
- Sweeper misclassifying a busy sidecar as orphaned: mitigated by the >1-socket-FD rule; not yet covered by the pid-reuse re-check (REQ-004, pending).

### State Transitions
- Daemon re-election disabled by default in the test harness only (`SPECKIT_DAEMON_REELECTION=0` inside `spawnLauncher`'s test helper); production re-election default is unchanged by this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 2 files shipped this pass (test harness + shell script), 3 more files scoped for remaining work across 2 subsystems (launcher, embedder provider) |
| Risk | 18/25 | Process-lifecycle and SIGKILL-adjacent code; remaining embedder demand-listener fix touches production daemon lifecycle (high-blast, hence the separate-packet recommendation) |
| Research | 15/20 | Required tracing two independent root causes (test lifecycle release-vs-kill semantics; demand-listener ownership transfer gap) across launcher, sweeper, and embedder provider code |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum
- Root-cause mapped requirements, honest In Progress status
- Verification-focused documentation
-->
