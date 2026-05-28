---
title: "Feature Specification: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′ / RC-1/RC-2)"
description: "The mk-spec-memory launcher has no RSS ceiling and no supervised recovery: the embedding model's native RSS (in the forked sidecar under default auto) grows until the OS OOM-kills the process, and nothing restarts it. This phase samples the process-tree RSS and, on breach, does a graceful self-exit (NOT a transparent respawn) so the host relaunches cleanly; it adds a crash-loop-guarded supervisor and records the daemon child pid in the lease."
trigger_phrases:
  - "launcher RSS watchdog F1"
  - "graceful exit supervision daemon"
  - "process tree rss sidecar sampling"
  - "daemon child pid lease"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/006-graceful-exit-watchdog"
    last_updated_at: "2026-05-28T23:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + REQ-007 reap fix; 12/12 vitest; 2 reviews clean; self-exit default-off"
    next_safe_action: "Confirm REQ-008 host relaunch to enable self-exit default-on; run SC-001 live"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000611"
      session_id: "007-006-graceful-exit-watchdog-spec"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Transparent daemon respawn breaks the MCP initialize session; graceful-exit-then-relaunch is the correct recovery"
      - "RC-1 RSS is in the forked sidecar under auto, so the watchdog must sample the process tree, not just the daemon child"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′ / RC-1/RC-2)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (RSS self-exit default-off pending REQ-008; SC-001/SC-002 live deferred) |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-provider-dispose |
| **Successor** | 007-bridge-liveness-reap |
| **Handoff Criteria** | Watchdog + supervisor land with the daemon child pid recorded in the lease (precondition for phase 007's reap-aware bridge); RSS-breach path verified to recover via host relaunch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6 of 7**: the launcher memory-supervision fix (F1′ in `003-daemon-reliability-research`, addressing RC-1 OOM + RC-2 no-auto-restart).

**Scope Boundary**: Add an RSS-ceiling watchdog over the daemon's process tree and a crash-loop-guarded supervisor to `mk-spec-memory-launcher.cjs`; record the daemon child pid in the lease. Does NOT add transparent in-place respawn (rejected — breaks the MCP session) and does NOT add the bridge probe (phase 007).

**Dependencies**:
- Design + adversarial verdict: `../003-daemon-reliability-research/research/research.md` §6 + `research/iterations/iteration-003.md` (F1 verdict).
- Best paired with phase 005 (dispose gate) so a watchdog-triggered SIGTERM cannot race a native run.
- Emits the child-pid lease that phase 007 requires.

**Deliverables**:
- Process-tree RSS sampler (daemon child + sidecar grandchildren) with an injectable ps runner for tests.
- Graceful-self-exit on RSS breach (no transparent respawn) + crash-loop-guarded respawn on unexpected child exit.
- A net-new `childPid` field in the launcher's lease JSON.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mk-spec-memory-launcher.cjs` spawns the daemon and, on child exit, clears the lease and exits with **no respawn and no RSS sampling** (RC-2). The embedding model's native RSS grows unbounded (RC-1) until the OS OOM-kills the process — and under the default `auto` policy that RSS lives in a **forked sidecar grandchild**, not the daemon child, so sampling only the daemon child would miss it. Recovery today is a manual `/mcp` reconnect.

### Purpose
Bound memory and self-recover: sample the daemon's process-tree RSS and, on a sustained ceiling breach, gracefully exit so the host runtime relaunches a fresh launcher (clean MCP re-initialize); supervise unexpected child exits with crash-loop-guarded backoff; and record the daemon child pid in the lease so liveness can be keyed on the actual daemon (enabling phase 007).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Process-tree RSS sampler (injectable ps/`/proc` runner) over daemon child + sidecar grandchildren.
- RSS-ceiling breach → graceful self-exit (default-off via `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB`).
- Crash-loop guard + exponential backoff for unexpected child exits.
- Net-new `childPid` field in the launcher lease JSON.
- Reap the sidecar process-group only on crash-loop give-up.

### Out of Scope
- Transparent in-place daemon respawn under a live session - [rejected: re-piping stdio bytes cannot restore the per-Server MCP `initialize` session → hangs the client].
- The bridge liveness/reap fix (phase 007) - [separate channel; consumes this phase's child-pid lease].
- Wiring dispose into the 5s `fatalShutdown` critical path - [reserve dispose for the live swap (phase 005)].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | RSS sampler (injectable runner) + breach→graceful-exit; crash-loop-guarded supervisor; add `childPid` to `writeLeaseFile` JSON |
| `mcp_server/lib/embedders/execution-router.ts` | Read/Reference | Resolve sidecar client pids (`getWorkerInfo`) for process-tree sampling |
| `mcp_server/lib/embedders/sidecar-client.ts` | Read/Reference | `getWorkerInfo` pid; process-group reap helper for give-up |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | RSS-ceiling breach must do a GRACEFUL SELF-EXIT, never a transparent in-place respawn | On breach the launcher process.exit()s cleanly (no stdio re-pipe, no in-place replacement spawn); the existing signal-mirror path is untouched. (Gated on REQ-008 host-relaunch confirmation) |
| REQ-002 | The watchdog must sample the RSS of the actual ORT-holding process | Sampler rolls up the process tree (daemon child + sidecar grandchildren via `getWorkerInfo` pids); a synthetic parent→child→grandchild test sums correctly via an INJECTABLE ps runner |
| REQ-003 | SIGTERM→SIGKILL escalation grace must exceed the daemon's own `SHUTDOWN_DEADLINE_MS`=5000 | Escalation waits > 5000ms (a fixed floor, e.g. 7000ms; grace ≤ 5000 is rejected/clamped with a warning) so the daemon's graceful exit wins |
| REQ-004 | Crash-loop guard with exponential backoff for unexpected child exits | After N deaths in window W the launcher fails loud (clears lease + mirrors child exit, today's behavior); below threshold it backs off exponentially. Defaults env-overridable |
| REQ-005 | Record the daemon CHILD pid in the lease (net-new additive field, NOT a port of mk-code-index's owner-lease) | `writeLeaseFile` JSON gains a `childPid` field after spawn; no existing reader breaks (bridge reads only `pid`/`startedAt`/`ownerPid` today) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Reuse EPERM='treat as alive/unknown' handling for ps/kill in sandboxes | An EPERM ps/kill read does not trigger a recycle; it is treated as unknown (skip), matching launcher:160-161 |
| REQ-007 | Reap the sidecar process-group only on crash-loop give-up (avoid double-kill with the daemon's own shutdown reap) | On give-up the launcher group-kills the sidecar; on normal graceful SIGTERM it does NOT (the daemon's execution-router shutdown already reaps) |
| REQ-008 | Confirm the host-runtime relaunch-on-clean-exit contract before enabling REQ-001 | Documented: which runtimes relaunch the launcher on exit 0; if none, REQ-001 stays default-off and is gated behind explicit opt-in (else self-exit reduces availability) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Under a configured RSS ceiling, the daemon recycles via graceful exit + host relaunch before the OS OOM-kills it, with a clean MCP re-initialize.
- **SC-002**: A daemon that crash-loops on startup fails loud (no respawn storm); a daemon that dies once recovers via backoff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | If no host runtime relaunches on exit 0, graceful self-exit yields zero daemon until manual reconnect — worse than today | High | REQ-008: confirm the relaunch contract; keep REQ-001 default-off until confirmed |
| Risk | ps RSS overcounts shared/COW pages on macOS; OOM spike between samples | Med | Require N consecutive breaches; tune ceiling against measured RSS; default-off |
| Risk | Double-kill / pid-reuse race between launcher give-up reap and daemon's own shutdown reap | Med | REQ-007: launcher reap only on crash-loop give-up |
| Dependency | Phase 005 dispose gate | Med | A watchdog SIGTERM during a native run must not segfault — relies on 005's gate |
| Dependency | Phase 007 needs the child-pid lease (REQ-005) | — | This phase ships it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- REQ-008: does any supported host runtime relaunch the launcher on clean exit 0? (Blocks enabling the RSS-breach self-exit by default.)
- Default RSS ceiling value (default-off vs a conservative 1536MB) and the crash-loop window/threshold/backoff defaults — confirm against measured RSS.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
