---
title: "Implementation Plan: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′)"
description: "Sample the daemon's process-tree RSS; on a sustained ceiling breach do a graceful self-exit (host relaunches); supervise unexpected child exits with a crash-loop guard; record the daemon child pid in the lease."
trigger_phrases:
  - "launcher watchdog plan F1"
  - "graceful exit supervision plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/006-graceful-exit-watchdog"
    last_updated_at: "2026-05-28T21:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored F1′ plan (process-tree RSS, graceful exit, childPid lease) verified by Opus pass"
    next_safe_action: "Confirm host relaunch contract; implement in a live-daemon session"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000612"
      session_id: "007-006-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` launcher (CommonJS) |
| **Framework** | mk-spec-memory MCP launcher + child daemon + forked sidecar |
| **Storage** | Filesystem lease JSON |
| **Testing** | vitest with an injectable ps/`/proc` runner |

### Overview
Add a periodic process-tree RSS sampler (daemon child + sidecar grandchildren) to the launcher. On a sustained `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` breach, SIGTERM the child (grace > 5s) then graceful self-exit so the host relaunches a fresh launcher (clean MCP re-initialize). Refactor the child-exit handler into a crash-loop-guarded supervisor, and add a `childPid` field to the lease. NO transparent in-place respawn (it cannot restore the MCP session).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (003 §6, iter-3 F1 verdict)

### Definition of Done
- [ ] Watchdog + supervisor land; child-pid lease shipped
- [ ] Host relaunch contract confirmed (REQ-008) before enabling breach-self-exit by default
- [ ] Process-tree-RSS + crash-loop tests pass (injectable ps)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Supervisor loop in the launcher (parent process) over a single daemon child + its sidecar grandchildren; recovery by clean exit + host relaunch (not in-place respawn).

### Key Components
- **`sampleProcessTreeRssMb(runner?)`**: rolls up RSS for the daemon child + sidecar pids; `runner` injectable for tests (defaults to `spawnSync('ps', ...)` / `/proc`).
- **Watchdog interval** (`.unref()`): N consecutive breaches → `recycleViaGracefulExit()`.
- **Supervisor**: child-exit handler split into intentional-exit vs crash; crash-loop guard + backoff; give-up = today's fail-loud + sidecar group-reap.
- **Lease**: `writeLeaseFile` JSON gains `childPid` (additive).

### Data Flow
spawn child → record `childPid` in lease → sampler polls tree RSS → breach: SIGTERM child (grace>5s) → SIGKILL if needed → launcher process.exit → host relaunch. Unexpected child exit → crash-loop guard → backoff respawn OR give-up.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-spec-memory-launcher.cjs` child-exit handler (352-361) | Clears lease + exits, no respawn | refactor to crash-loop-guarded supervisor; preserve signal-mirror | crash-loop test fails loud; single-death recovers |
| `mk-spec-memory-launcher.cjs` `writeLeaseFile` (189-194) | Writes `{pid,startedAt}` | add additive `childPid` field | bridge readers (pid/startedAt/ownerPid) unaffected |
| `mk-spec-memory-launcher.cjs` (new) RSS sampler | none | add tree sampler with injectable runner | synthetic tree test sums correctly |
| `execution-router.ts` shouldUseSidecar (80-91) / sidecar-client `getWorkerInfo` (517-529) | Sidecar lifecycle/pids | read sidecar pids for tree sampling | sampler includes sidecar RSS |
| `context-server.ts` SHUTDOWN_DEADLINE_MS=5000 (1414) / fatalShutdown (1539) | Daemon self-exit deadline | unchanged; escalation grace must exceed it | grace>5000 asserted |

Invariant: the RSS-breach path is a clean process.exit (no stdio re-pipe); the existing signal-mirror exit (launcher:356) stays untouched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm host relaunch-on-exit-0 contract (REQ-008); decide default-off vs ceiling default
- [ ] Add `childPid` to `writeLeaseFile`

### Phase 2: Core Implementation
- [ ] `sampleProcessTreeRssMb(runner?)` with injectable runner (REQ-002/006)
- [ ] Watchdog interval + breach→graceful-exit (grace>5000) (REQ-001/003)
- [ ] Crash-loop-guarded supervisor + backoff + give-up sidecar reap (REQ-004/007)

### Phase 3: Verification
- [ ] Synthetic process-tree RSS test (injectable ps); EPERM-as-unknown test
- [ ] Crash-loop give-up + single-death-recovery tests
- [ ] Live: ceiling breach recycles before OOM (if host relaunch confirmed)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | tree-RSS roll-up + EPERM handling | vitest + injectable ps runner |
| Unit | crash-loop guard / backoff / give-up | vitest |
| Manual | ceiling breach → recycle before OOM | live daemon + sidecar |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Host relaunch-on-exit-0 contract | External | Yellow (unconfirmed) | Blocks default-on RSS-breach self-exit (REQ-008) |
| Phase 005 dispose gate | Internal | Pending | SIGTERM recycle must not race a native run |
| Phase 007 consumes child-pid lease | Internal | Pending | This phase ships it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Recycle storms, false OOM recycles, or availability regression.
- **Procedure**: Set `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` unset (watchdog default-off → today's behavior) as the instant kill switch; if needed `git revert` the supervisor refactor (the `childPid` lease field is additive and harmless to leave).
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
